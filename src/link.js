import React from 'react';
import {pathFor,navigate,navigateToRoute} from 'lucid-router';

export default class Link extends React.Component {
  onClick(e) {
    const {to,params,href} = this.props;
    if (to) {
      navigateToRoute(to, params, e);
    } else {
      navigate(href, e);
    }
  }

  render() {
    const {to,params,href,children,...props} = this.props;
    const linkTo = to ? pathFor(to, params) : href;
    return <a href={linkTo} onClick={::this.onClick} {...props}>children</a>;
  }
}
