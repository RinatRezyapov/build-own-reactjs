import traverseAllChildren from "./traverseAllChildren";
import { instantiateComponent } from "./Component";

export function instantiateChild(childInstances, child, name) {
  let isUnique = childInstances[name] === undefined;

  if (isUnique) {
    childInstances[name] = instantiateComponent(child);
  }
}

function instantiateChildren(children) {
  let childInstances = {};

  traverseAllChildren(children, instantiateChild, childInstances);

  return childInstances;
}

export default {
  instantiateChildren
};
