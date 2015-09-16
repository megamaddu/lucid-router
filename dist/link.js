'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lucidRouter = require('lucid-router');

var Link = (function (_React$Component) {
  _inherits(Link, _React$Component);

  function Link() {
    _classCallCheck(this, Link);

    _get(Object.getPrototypeOf(Link.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Link, [{
    key: 'onClick',
    value: function onClick(e) {
      var _props = this.props;
      var to = _props.to;
      var params = _props.params;
      var href = _props.href;

      if (to) {
        (0, _lucidRouter.navigateToRoute)(to, params, e);
      } else {
        (0, _lucidRouter.navigate)(href, e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var to = _props2.to;
      var params = _props2.params;
      var href = _props2.href;
      var children = _props2.children;

      var props = _objectWithoutProperties(_props2, ['to', 'params', 'href', 'children']);

      var linkTo = to ? (0, _lucidRouter.pathFor)(to, params) : href;
      return _react2['default'].createElement(
        'a',
        _extends({ href: linkTo, onClick: this.onClick.bind(this) }, props),
        'children'
      );
    }
  }]);

  return Link;
})(_react2['default'].Component);

exports['default'] = Link;
module.exports = exports['default'];
