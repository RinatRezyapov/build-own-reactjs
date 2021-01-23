class DOMComponentWrapper {
  constructor(element) {
    this._currentElement = element;
    this._domNode = null;
  }

  mountComponent() {
    let el = document.createElement(this._currentElement.type);
    this._domNode = el;
    this._createInitialDOMChildren(this._currentElement.props);
    return el;
  }

  _createInitialDOMChildren(props) {
    if (typeof props.children === "string") {
      this._domNode.textContent = props.children;
    }
  }
}

export default DOMComponentWrapper;
