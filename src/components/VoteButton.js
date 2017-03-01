'use strict';

import React from 'react';
import cx from 'classnames';

require('styles/VoteButton.scss');

class ButtonComponent extends React.Component {

  static defaultProps = {
    active: false
  };

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.value);
  }

  render() {
    return (
      <button
        className={cx(
          'VoteButton',
          {'VoteButton--selected': this.props.active},
          {'VoteButton--this-is-it': this.props.thisIsIt == 1}
        )}
        onClick={this.handleClick}
      >
            <span className="VoteButton__content">
              {this.props.name}
            </span>
      </button>
    );
  }
}

ButtonComponent.displayName = 'VoteButton';

// Uncomment properties you need
// ButtonComponent.propTypes = {};
// ButtonComponent.defaultProps = {};

export default ButtonComponent;
