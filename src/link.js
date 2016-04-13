import React from 'react';
import {pathFor,navigate,navigateToRoute} from 'lucid-router';

function isLeftClickEvent(e) {
  return e.button === 0;
}

function isModifiedEvent(e) {
  return Boolean(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

export default class Link extends React.Component {
  onClick = (e) => {
    const {onClick, target} = this.props;
    let allowTransition = true;

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
      const {to, params, href} = this.props;
      if (to)
        navigateToRoute(to, params, e);
      else
        navigate(href, e);
    }
  }

  render () {
    const {to, params, href, children, ...props} = this.props;
    const linkTo = to ? pathFor(to, params) : href;
    return <a {...props} href={linkTo} onClick={this.onClick}>{children}</a>;
  }
}
