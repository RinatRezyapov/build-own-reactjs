function mountComponent(component) {
  return component.mountComponent();
}

function performUpdateIfNecessary(component) {
  component.performUpdateIfNecessary();
}

function receiveComponent(component, element) {
  component.receiveComponent(element);
}

export default {
  mountComponent,
  performUpdateIfNecessary,
  receiveComponent
};
