import { instantiateComponent } from "./Component";
import Reconciler from "./Reconciler";
import DOM from "./DOM";

const ROOT_KEY = "root";
let instancesByRootID = {};
let rootID = 1;

function isRoot(node) {
  return node.dataset[ROOT_KEY];
}

function mount(element, node) {
  node.dataset[ROOT_KEY] = rootID;
  const component = instantiateComponent(element);
  console.log("App instance", component);
  instancesByRootID[rootID] = component;
  const renderedNode = Reconciler.mountComponent(component, node);
  console.log("this.render content as DOM element", renderedNode);
  DOM.empty(node);
  DOM.appendChild(node, renderedNode);
  rootID++;
}

function render(element, node) {
  if (isRoot(node)) {
    // here we perform update
  } else {
    mount(element, node);
  }
}

export default {
  render
};
