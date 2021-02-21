import DOMComponentWrapper from "./DOMComponentWrapper";

function construct(element) {
  return new DOMComponentWrapper(element);
}

function constructTextComponent(element) {
  return construct({
    type: "span",
    props: {
      children: element
    }
  });
}

export default {
  construct,
  constructTextComponent
};
