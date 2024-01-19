function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return createTextNode(child);
        }
        return child;
      }),
    },
  };
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextUnitOfWork;
}

let root = null;
let nextUnitOfWork = null;
function workLoop(IdleDeadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performWorkUnit(nextUnitOfWork);
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(work) {
  if (!work) return;
  let preParent = work.parent;
  while (!preParent.dom) {
    preParent = preParent.parent;
  }
  if (work.dom) {
    preParent.dom.append(work.dom);
  }
  commitWork(work.child);
  commitWork(work.sibling);
}

function getDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });
}

function initChild(work, children) {
  let preDom = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      work.child = newWork;
    } else {
      preDom.sibling = newWork;
    }
    preDom = newWork;
  });
}

function performWorkUnit(work) {
  const isFunctionWork = typeof work.type === 'function';
  if (!work.dom && !isFunctionWork) {
    const dom = (work.dom = getDom(work.type));

    // work.parent.dom.append(dom);

    updateProps(dom, work.props);
  }

  const children = isFunctionWork ? [work.type(work.props)] : work.props.children;


  initChild(work, children);

  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  
  let nextWork = work;
  while (nextWork) {
    if (nextWork.sibling) return nextWork.sibling;
    nextWork = nextWork.parent;
  }
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  createTextNode,
  render,
};

export default React;

// function createTextNode(text) {
//   return {
//     type: "TEXT_ELEMENT",
//     props: {
//       nodeValue: text,
//       children: [],
//     },
//   };
// }

// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map((child) => {
//         const isTextNode =
//           typeof child === "string" || typeof child === "number";
//         return isTextNode ? createTextNode(child) : child;
//       }),
//     },
//   };
// }

// function render(el, container) {
//   nextWorkOfUnit = {
//     dom: container,
//     props: {
//       children: [el],
//     },
//   };

//   root = nextWorkOfUnit;
// }

// let root = null;
// let nextWorkOfUnit = null;
// function workLoop(deadline) {
//   let shouldYield = false;
//   while (!shouldYield && nextWorkOfUnit) {
//     nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

//     shouldYield = deadline.timeRemaining() < 1;
//   }

//   if (!nextWorkOfUnit && root) {
//     commitRoot();
//   }

//   requestIdleCallback(workLoop);
// }

// function commitRoot() {
//   commitWork(root.child);
//   root = null;
// }

// function commitWork(fiber) {
//   if (!fiber) return;

//   let fiberParent = fiber.parent;
//   while (!fiberParent.dom) {
//     fiberParent = fiberParent.parent;
//   }

//   if (fiber.dom) {
//     fiberParent.dom.append(fiber.dom);
//   }
//   commitWork(fiber.child);
//   commitWork(fiber.sibling);
// }

// function createDom(type) {
//   return type === "TEXT_ELEMENT"
//     ? document.createTextNode("")
//     : document.createElement(type);
// }

// function updateProps(dom, props) {
//   console.log(dom, props);
//   Object.keys(props).forEach((key) => {
//     if (key !== "children") {
//       dom[key] = props[key];
//     }
//   });
// }

// function initChildren(fiber, children) {
//   let prevChild = null;
//   children.forEach((child, index) => {
//     const newFiber = {
//       type: child.type,
//       props: child.props,
//       child: null,
//       parent: fiber,
//       sibling: null,
//       dom: null,
//     };

//     if (index === 0) {
//       fiber.child = newFiber;
//     } else {
//       prevChild.sibling = newFiber;
//     }
//     prevChild = newFiber;
//   });
// }

// function updateFunctionComponent(fiber) {
//   const children = [fiber.type(fiber.props)];

//   initChildren(fiber, children);
// }

// function updateHostComponent(fiber) {
//   if (!fiber.dom) {
//     const dom = (fiber.dom = createDom(fiber.type));

//     updateProps(dom, fiber.props);
//   }

//   const children = fiber.props.children;
//   initChildren(fiber, children);
// }

// function performWorkOfUnit(fiber) {
//   const isFunctionComponent = typeof fiber.type === "function";
//   console.log(isFunctionComponent, fiber);

//   if(isFunctionComponent){
//     updateFunctionComponent(fiber)
//   }else{
//     updateHostComponent(fiber)
//   }

//   // 4. 返回下一个要执行的任务
//   if (fiber.child) {
//     return fiber.child;
//   }

//   let nextFiber = fiber;
//   while (nextFiber) {
//     if (nextFiber.sibling) return nextFiber.sibling;
//     nextFiber = nextFiber.parent;
//   }
// }

// requestIdleCallback(workLoop);

// const React = {
//   render,
//   createElement,
// };

// export default React;
