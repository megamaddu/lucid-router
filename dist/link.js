'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lucidRouter = require('lucid-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isLeftClickEvent(e) {
  return e.button === 0;
}

function isModifiedEvent(e) {
  return Boolean(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

var Link = function (_React$Component) {
  _inherits(Link, _React$Component);

  function Link() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Link);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Link)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.onClick = function (e) {
      var _this$props = _this.props;
      var onClick = _this$props.onClick;
      var target = _this$props.target;

      var allowTransition = true;

      if (onClick instanceof Function) onClick(e);

      if (isModifiedEvent(e) || !isLeftClickEvent(e)) return;

      if (e.defaultPrevented === true) allowTransition = false;

      if (target) {
        if (!allowTransition) e.preventDefault();

        return;
      }

      if (allowTransition) {
        var _this$props2 = _this.props;
        var to = _this$props2.to;
        var params = _this$props2.params;
        var href = _this$props2.href;

        if (to) (0, _lucidRouter.navigateToRoute)(to, params, e);else if (href != null) (0, _lucidRouter.navigate)(href, e);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Link, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var to = _props.to;
      var params = _props.params;
      var href = _props.href;
      var children = _props.children;

      var props = _objectWithoutProperties(_props, ['to', 'params', 'href', 'children']);

      var linkTo = to ? (0, _lucidRouter.pathFor)(to, params) : href;
      return _react2.default.createElement(
        'a',
        _extends({}, props, { href: linkTo, onClick: this.onClick }),
        children
      );
    }
  }]);

  return Link;
}(_react2.default.Component);

exports.default = Link;
