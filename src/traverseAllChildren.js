const SEPARATOR = ".";
const SUBSEPARATOR = ":";

function getComponentKey(component, index) {
  return index.toString(36);
}

function traverseAllChildren(children, callback, traverseContext) {
  return traverseAllChildrenImpl(children, "", callback, traverseContext);
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {
  if (!Array.isArray(children)) {
    callback(
      traverseContext,
      children,
      nameSoFar + SEPARATOR + getComponentKey(children, 0)
    );
    return 1;
  }

  let subTreeCount = 0;
  let nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  children.forEach((child, i) => {
    let nextName = nextNamePrefix + getComponentKey(child, i);
    subTreeCount += traverseAllChildrenImpl(
      child,
      nextName,
      callback,
      traverseContext
    );
  });

  return subTreeCount;
}

export default traverseAllChildren;