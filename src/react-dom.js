import { instantiateComponent } from "./Component";

const ROOT_KEY = "root";

let rootID = 1;

function isRoot(node) {
  return node.dataset[ROOT_KEY];
}

function mount(element, node) {
  node.dataset[ROOT_KEY] = rootID;
  const component = instantiateComponent(element);
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
