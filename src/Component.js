import Reconciler from "./Reconciler";
import HostComponent from "./HostComponent";
import UpdateQueue from "./UpdateQueue";
import shouldUpdateComponent from "./shouldUpdateComponent";

export function instantiateComponent(element) {
  let wrapperInstance;
  if (typeof element.type === "string") {
    wrapperInstance = HostComponent.construct(element);
  } else if (typeof element.type === "function") {
    wrapperInstance = new element.type(element.props);
    wrapperInstance._construct(element);
  } else if (typeof element === "string" || typeof element === "number") {
    wrapperInstance = HostComponent.constructTextComponent(element);
  }

  return wrapperInstance;
}

export class Component {
  constructor(props) {
    this.props = props;
    this._currentElement = null;
    this._pendingState = null;
    this._renderedComponent = null;
  }

  setState(partialState) {
    this._pendingState = partialState;
    UpdateQueue.enqueueSetState(this, partialState);
  }

  _construct(element) {
    this._currentElement = element;
  }

  mountComponent() {
    const renderedElement = this.render();
    const renderedComponent = instantiateComponent(renderedElement);
    this._renderedComponent = renderedComponent;
    return Reconciler.mountComponent(renderedComponent);
  }

  updateComponent(nextElement) {

    this._currentElement = nextElement;
    this.props = nextElement.props;
    this.state = this._pendingState;
    this._pendingState = null;


    let prevRenderedElement = this._renderedComponent._currentElement;
    let nextRenderedElement = this.render();
    if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
      Reconciler.receiveComponent(this._renderedComponent, nextRenderedElement);
    } else {
      Reconciler.unmountComponent(this._renderedComponent);
      let nextRenderedComponent = instantiateComponent(nextRenderedElement);
      let nextMarkup = Reconciler.mountComponent(nextRenderedComponent);
      DOM.replaceNode(this._renderedComponent._domNode, nextMarkup);
      this._renderedComponent = nextRenderedComponent;
    }
  }

  performUpdateIfNecessary() {
    this.updateComponent(this._currentElement);
  }
}
