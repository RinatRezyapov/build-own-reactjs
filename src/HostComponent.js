import DOMComponentWrapper from "./DOMComponentWrapper";

function construct(element) {
  return new DOMComponentWrapper(element);
}

export default {
  construct
};
