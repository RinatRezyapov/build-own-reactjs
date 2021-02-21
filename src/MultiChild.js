import Reconciler from "./Reconciler";
import ChildReconciler from "./ChildReconciler";

class MultiChild {
  mountChildren(children) {
    const renderedChildren = ChildReconciler.instantiateChildren(children);
    this._renderedChildren = renderedChildren;

    return Object.keys(renderedChildren).map((childKey, i) => {
      let child = renderedChildren[childKey];
      child._mountIndex = i;

      return Reconciler.mountComponent(child);
    });
  }
}

export default MultiChild;
