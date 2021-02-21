function empty(node) {
  [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function appendChildren(node, children) {
  if (Array.isArray(children)) {
    children.forEach((child) => appendChild(node, child));
  } else {
    appendChild(node, children);
  }
}

export default {
  empty,
  appendChild,
  appendChildren
};
