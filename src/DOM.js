function empty(node) {
  [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

function appendChild(node, child) {
  node.appendChild(child);
}

export default {
  empty,
  appendChild
};
