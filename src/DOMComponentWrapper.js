import DOM from "./DOM";
import MultiChild from "./MultiChild";

class DOMComponentWrapper extends MultiChild {
  constructor(element) {
    super();
    this._currentElement = element;
    this._domNode = null;
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement);
  }

  updateComponent(prevElement, nextElement) {
    this._currentElement = nextElement;
    this._updateDOMChildren(prevElement.props, nextElement.props);
  }

  _updateDOMChildren(prevProps, nextProps) {
    let prevType = typeof prevProps.children;
    let nextType = typeof nextProps.children;
    if (prevType !== nextType) {
      throw new Error('switching between different children is not supported');
    }

    if (nextType === 'undefined') {
      return;
    }
    
    if (nextType === 'string' || nextType === 'number') {
      this._domNode.textContent = nextProps.children;
    }
  }

  mountComponent() {
    let el = document.createElement(this._currentElement.type);
    this._domNode = el;
    this._createInitialDOMChildren(this._currentElement.props);
    return el;
  }

  _createInitialDOMChildren(props) {
    if (typeof props.children === "string" || typeof props.children === "number") {
      this._domNode.textContent = props.children;
    } else if (Array.isArray(props.children)) {
      let mountImages = this.mountChildren(props.children);
      DOM.appendChildren(this._domNode, mountImages);
    }
  }
}

export default DOMComponentWrapper;
