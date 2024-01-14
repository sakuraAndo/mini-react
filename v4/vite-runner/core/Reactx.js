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
    nextUnitOfWork = performWorkUnit(nextUnitOfWork);
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

function getDom(type) {
  type === 'TEXT_ELEMENT'
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

function initChild(work) {
  let preDom = null;
  work.props.children.forEach((child, index) => {
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
  if (!work.dom) {
    const dom = (work.dom = getDom(work.type));

    work.parent.dom.append(dom);

    updateProps(dom, work.props);
  }

  initChild(work);
  
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
