import Reconciler from "./Reconciler";

function enqueueSetState(instance, partialState) {
  instance._pendingState = Object.assign(
    {}, 
    instance.state, 
    partialState
  );
  Reconciler.performUpdateIfNecessary(instance);
}

module.exports = {
    enqueueSetState,
}