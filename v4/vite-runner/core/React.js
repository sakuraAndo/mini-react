function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === 'string') {
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
}

let nextUnitOfWork = null;

function workLoop(IdleDeadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

function performUnitOfWork(work) {
  if (!work.dom) {
    const dom = (work.dom =
      work.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(work.type));

    work.parent.dom.append(dom);

    Object.keys(work.props).forEach((key) => {
      if (key !== 'children') {
        dom[key] = work.props[key];
      }
    });
  }
  let preChild = null;
  work.props.children.forEach((child, index) => {
    let newWork = {
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
      preChild.sibling = newWork;
    }
    preChild = newWork;
  });
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent.sibling;
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  createTextNode,
  render,
};

export default React;
