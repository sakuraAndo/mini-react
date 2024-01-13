import React from "./React.js";

const ReactDom = {
  createRoot(el) {
    return {
      render(App) {
        React.render(App, el);
      },
    };
  },
};

export default ReactDom;