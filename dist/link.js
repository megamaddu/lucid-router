"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require("react");
var lucid_router_1 = require("lucid-router");
var assign = require("object-assign");
function isLeftClickEvent(e) {
    return e.button === 0;
}
function isModifiedEvent(e) {
    return Boolean(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
var Link = (function (_super) {
    __extends(Link, _super);
    function Link(props) {
        _super.call(this, props);
        this._onClick = this._onClick.bind(this);
    }
    Link.prototype._onClick = function (e) {
        var _a = this.props, onClick = _a.onClick, target = _a.target;
        var allowTransition = true;
        if (onClick instanceof Function)
            onClick(e);
        if (isModifiedEvent(e) || !isLeftClickEvent(e))
            return;
        if (e.defaultPrevented === true)
            allowTransition = false;
        if (target) {
            if (!allowTransition)
                e.preventDefault();
            return;
        }
        e.preventDefault();
        if (allowTransition) {
            var _b = this.props, to = _b.to, params = _b.params, href = _b.href;
            if (to)
                lucid_router_1.navigateToRoute(to, params, e);
            else
                lucid_router_1.navigate(href, e);
        }
    };
    Link.prototype.render = function () {
        var _a = this.props, to = _a.to, params = _a.params, href = _a.href, children = _a.children;
        var linkTo = to ? lucid_router_1.pathFor(to, params) : href;
        return react_1["default"].createComponent('a', assign({}, props, { href: linkTo, onClick: this._onClick }), children);
    };
    return Link;
}(react_1["default"].Component));
exports.__esModule = true;
exports["default"] = Link;
//# sourceMappingURL=link.js.map