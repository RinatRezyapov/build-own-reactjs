// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/Reconciler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function mountComponent(component) {
  return component.mountComponent();
}

function performUpdateIfNecessary(component) {
  component.performUpdateIfNecessary();
}

function receiveComponent(component, element) {
  component.receiveComponent(element);
}

var _default = {
  mountComponent: mountComponent,
  performUpdateIfNecessary: performUpdateIfNecessary,
  receiveComponent: receiveComponent
};
exports.default = _default;
},{}],"src/DOM.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function empty(node) {
  [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function appendChildren(node, children) {
  if (Array.isArray(children)) {
    children.forEach(function (child) {
      return appendChild(node, child);
    });
  } else {
    appendChild(node, children);
  }
}

var _default = {
  empty: empty,
  appendChild: appendChild,
  appendChildren: appendChildren
};
exports.default = _default;
},{}],"src/traverseAllChildren.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var SEPARATOR = ".";
var SUBSEPARATOR = ":";

function getComponentKey(component, index) {
  return index.toString(36);
}

function traverseAllChildren(children, callback, traverseContext) {
  return traverseAllChildrenImpl(children, "", callback, traverseContext);
}

function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  if (!Array.isArray(children)) {
    callback(traverseContext, children, nameSoFar + SEPARATOR + getComponentKey(children, 0));
    return 1;
  }

  var subTreeCount = 0;
  var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
  children.forEach(function (child, i) {
    var nextName = nextNamePrefix + getComponentKey(child, i);
    subTreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
  });
  return subTreeCount;
}

var _default = traverseAllChildren;
exports.default = _default;
},{}],"src/ChildReconciler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instantiateChild = instantiateChild;
exports.default = void 0;

var _traverseAllChildren = _interopRequireDefault(require("./traverseAllChildren"));

var _Component = require("./Component");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function instantiateChild(childInstances, child, name) {
  var isUnique = childInstances[name] === undefined;

  if (isUnique) {
    childInstances[name] = (0, _Component.instantiateComponent)(child);
  }
}

function instantiateChildren(children) {
  var childInstances = {};
  (0, _traverseAllChildren.default)(children, instantiateChild, childInstances);
  return childInstances;
}

var _default = {
  instantiateChildren: instantiateChildren
};
exports.default = _default;
},{"./traverseAllChildren":"src/traverseAllChildren.js","./Component":"src/Component.js"}],"src/MultiChild.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Reconciler = _interopRequireDefault(require("./Reconciler"));

var _ChildReconciler = _interopRequireDefault(require("./ChildReconciler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MultiChild = /*#__PURE__*/function () {
  function MultiChild() {
    _classCallCheck(this, MultiChild);
  }

  _createClass(MultiChild, [{
    key: "mountChildren",
    value: function mountChildren(children) {
      var renderedChildren = _ChildReconciler.default.instantiateChildren(children);

      this._renderedChildren = renderedChildren;
      return Object.keys(renderedChildren).map(function (childKey, i) {
        var child = renderedChildren[childKey];
        child._mountIndex = i;
        return _Reconciler.default.mountComponent(child);
      });
    }
  }]);

  return MultiChild;
}();

var _default = MultiChild;
exports.default = _default;
},{"./Reconciler":"src/Reconciler.js","./ChildReconciler":"src/ChildReconciler.js"}],"src/DOMComponentWrapper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DOM = _interopRequireDefault(require("./DOM"));

var _MultiChild2 = _interopRequireDefault(require("./MultiChild"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DOMComponentWrapper = /*#__PURE__*/function (_MultiChild) {
  _inherits(DOMComponentWrapper, _MultiChild);

  var _super = _createSuper(DOMComponentWrapper);

  function DOMComponentWrapper(element) {
    var _this;

    _classCallCheck(this, DOMComponentWrapper);

    _this = _super.call(this);
    _this._currentElement = element;
    _this._domNode = null;
    return _this;
  }

  _createClass(DOMComponentWrapper, [{
    key: "receiveComponent",
    value: function receiveComponent(nextElement) {
      this.updateComponent(this._currentElement, nextElement);
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(prevElement, nextElement) {
      this._currentElement = nextElement;

      this._updateDOMChildren(prevElement.props, nextElement.props);
    }
  }, {
    key: "_updateDOMChildren",
    value: function _updateDOMChildren(prevProps, nextProps) {
      var prevType = _typeof(prevProps.children);

      var nextType = _typeof(nextProps.children);

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
  }, {
    key: "mountComponent",
    value: function mountComponent() {
      var el = document.createElement(this._currentElement.type);
      this._domNode = el;

      this._createInitialDOMChildren(this._currentElement.props);

      return el;
    }
  }, {
    key: "_createInitialDOMChildren",
    value: function _createInitialDOMChildren(props) {
      if (typeof props.children === "string" || typeof props.children === "number") {
        this._domNode.textContent = props.children;
      } else if (Array.isArray(props.children)) {
        var mountImages = this.mountChildren(props.children);

        _DOM.default.appendChildren(this._domNode, mountImages);
      }
    }
  }]);

  return DOMComponentWrapper;
}(_MultiChild2.default);

var _default = DOMComponentWrapper;
exports.default = _default;
},{"./DOM":"src/DOM.js","./MultiChild":"src/MultiChild.js"}],"src/HostComponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DOMComponentWrapper = _interopRequireDefault(require("./DOMComponentWrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function construct(element) {
  return new _DOMComponentWrapper.default(element);
}

function constructTextComponent(element) {
  return construct({
    type: "span",
    props: {
      children: element
    }
  });
}

var _default = {
  construct: construct,
  constructTextComponent: constructTextComponent
};
exports.default = _default;
},{"./DOMComponentWrapper":"src/DOMComponentWrapper.js"}],"src/UpdateQueue.js":[function(require,module,exports) {
"use strict";

var _Reconciler = _interopRequireDefault(require("./Reconciler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function enqueueSetState(instance, partialState) {
  instance._pendingState = Object.assign({}, instance.state, partialState);

  _Reconciler.default.performUpdateIfNecessary(instance);
}

module.exports = {
  enqueueSetState: enqueueSetState
};
},{"./Reconciler":"src/Reconciler.js"}],"src/shouldUpdateComponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUpdateComponent;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function shouldUpdateComponent(prevElement, nextElement) {
  var prevType = _typeof(prevElement);

  var nextType = _typeof(nextElement);

  if (prevType === 'string') {
    return nextType === 'string';
  }

  return prevElement.type === nextElement.type;
}
},{}],"src/Component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instantiateComponent = instantiateComponent;
exports.Component = void 0;

var _Reconciler = _interopRequireDefault(require("./Reconciler"));

var _HostComponent = _interopRequireDefault(require("./HostComponent"));

var _UpdateQueue = _interopRequireDefault(require("./UpdateQueue"));

var _shouldUpdateComponent = _interopRequireDefault(require("./shouldUpdateComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function instantiateComponent(element) {
  var wrapperInstance;

  if (typeof element.type === "string") {
    wrapperInstance = _HostComponent.default.construct(element);
  } else if (typeof element.type === "function") {
    wrapperInstance = new element.type(element.props);

    wrapperInstance._construct(element);
  } else if (typeof element === "string" || typeof element === "number") {
    wrapperInstance = _HostComponent.default.constructTextComponent(element);
  }

  return wrapperInstance;
}

var Component = /*#__PURE__*/function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
    this._currentElement = null;
    this._pendingState = null;
    this._renderedComponent = null;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(partialState) {
      this._pendingState = partialState;

      _UpdateQueue.default.enqueueSetState(this, partialState);
    }
  }, {
    key: "_construct",
    value: function _construct(element) {
      this._currentElement = element;
    }
  }, {
    key: "mountComponent",
    value: function mountComponent() {
      var renderedElement = this.render();
      var renderedComponent = instantiateComponent(renderedElement);
      this._renderedComponent = renderedComponent;
      return _Reconciler.default.mountComponent(renderedComponent);
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(nextElement) {
      this._currentElement = nextElement;
      this.props = nextElement.props;
      this.state = this._pendingState;
      this._pendingState = null;
      var prevRenderedElement = this._renderedComponent._currentElement;
      var nextRenderedElement = this.render();

      if ((0, _shouldUpdateComponent.default)(prevRenderedElement, nextRenderedElement)) {
        _Reconciler.default.receiveComponent(this._renderedComponent, nextRenderedElement);
      } else {
        _Reconciler.default.unmountComponent(this._renderedComponent);

        var nextRenderedComponent = instantiateComponent(nextRenderedElement);

        var nextMarkup = _Reconciler.default.mountComponent(nextRenderedComponent);

        DOM.replaceNode(this._renderedComponent._domNode, nextMarkup);
        this._renderedComponent = nextRenderedComponent;
      }
    }
  }, {
    key: "performUpdateIfNecessary",
    value: function performUpdateIfNecessary() {
      this.updateComponent(this._currentElement);
    }
  }]);

  return Component;
}();

exports.Component = Component;
},{"./Reconciler":"src/Reconciler.js","./HostComponent":"src/HostComponent.js","./UpdateQueue":"src/UpdateQueue.js","./shouldUpdateComponent":"src/shouldUpdateComponent.js"}],"src/react-dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component = require("./Component");

var _Reconciler = _interopRequireDefault(require("./Reconciler"));

var _DOM = _interopRequireDefault(require("./DOM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ROOT_KEY = "root";
var instancesByRootID = {};
var rootID = 1;

function isRoot(node) {
  return node.dataset[ROOT_KEY];
}

function mount(element, node) {
  node.dataset[ROOT_KEY] = rootID;
  var component = (0, _Component.instantiateComponent)(element);
  console.log("App instance", component);
  instancesByRootID[rootID] = component;

  var renderedNode = _Reconciler.default.mountComponent(component, node);

  console.log("this.render content as DOM element", renderedNode);

  _DOM.default.empty(node);

  _DOM.default.appendChild(node, renderedNode);

  rootID++;
}

function render(element, node) {
  if (isRoot(node)) {// here we perform update
  } else {
    mount(element, node);
  }
}

var _default = {
  render: render
};
exports.default = _default;
},{"./Component":"src/Component.js","./Reconciler":"src/Reconciler.js","./DOM":"src/DOM.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _reactDom = _interopRequireDefault(require("./react-dom"));

var _Component2 = require("./Component");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var App = /*#__PURE__*/function (_Component) {
  _inherits(App, _Component);

  var _super = _createSuper(App);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _super.call(this, props);
    _this.state = {
      clickCount: 0
    };
    window.addEventListener('click', function () {
      _this.setState({
        clickCount: _this.state.clickCount + 1
      });
    });
    return _this;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return {
        type: "div",
        props: {
          children: this.state.clickCount
        }
      };
    }
  }]);

  return App;
}(_Component2.Component);

_reactDom.default.render({
  type: App,
  props: {
    title: "React.js"
  }
}, document.getElementById("root"));
},{"./react-dom":"src/react-dom.js","./Component":"src/Component.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49983" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map