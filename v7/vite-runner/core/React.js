// delete dom
function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };

  root = nextWorkOfUnit;
}

let root = null;
let currentRoot = null;
let nextWorkOfUnit = null;
let wipFiber = null;
let deletions = [];
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    if (root?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined
    }

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitDeletion(fiber) {
  // fiber.parent.dom.remove(fiber.dom);
  if (fiber.dom) {
    //方法1 因为可能是函数式组件内部的 dom，其 parent 不存在，因此需要递归向上寻找
    // let fiberParent = fiber.parent
    // // 如果父级没有 dom 函数值组件
    // while (!fiberParent.dom) {
    //   fiberParent = fiberParent.parent
    // }
    // fiberParent.dom.removeChild(fiber.dom)
    // 方法2 调用 dom.remove 方法 将节点从其所属 DOM 树中删除
    fiber.dom.remove();
  } else {
    // 没有 dom 元素即函数式组件，则处理其 child
    commitDeletion(fiber.child);
  }
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(root.child);
  currentRoot = root;
  root = null;
  deletions = [];
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate.props);
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
}

function updateProps(dom, nextProps, preProps) {
  // 1. 旧的有，新的无
  Object.keys(preProps).forEach((key) => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  // 2. 旧的dom无，新的有
  // 3. 旧的dom有，新的有
  Object.keys(nextProps).forEach((key) => {
    if (key !== 'children') {
      if (nextProps[key] !== preProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLocaleLowerCase();
          dom.removeEventListener(eventType, preProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function initChildren(fiber, children) {
  let OldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = OldFiber && child.type === OldFiber.type;
    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: OldFiber.dom,
        alternate: OldFiber,
        effectTag: 'update',
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement',
        };
      }
      if (OldFiber) {
        deletions.push(OldFiber);
      }
    }

    if (OldFiber) {
      OldFiber = OldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    if (newFiber) {
      prevChild = newFiber;
    }
  });

  while (OldFiber) {
    deletions.push(OldFiber);

    OldFiber = OldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];

  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

function update() {
  const currentFiber = wipFiber;
  return () => {
    console.log(currentFiber);
    nextWorkOfUnit = {
      ...currentFiber,
      alternate: currentFiber,
    };
    root = nextWorkOfUnit;
  };
}

requestIdleCallback(workLoop);

const React = {
  render,
  update,
  createElement,
};

export default React;
