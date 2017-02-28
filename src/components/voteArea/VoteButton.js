'use strict';

import React from 'react';
import cx from 'classnames';

require('styles/voteArea/VoteButton.scss');

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
      <li
        className={cx(
          'Vote-button__list-item',
          {'Vote-button__list-item--hidden': this.props.thisIsIt == 2}
        )}
      >
        <button
          className={cx(
            'Vote-button',
            {'Vote-button--selected': this.props.active},
            {'Vote-button--this-is-it': this.props.thisIsIt},
            {'Vote-button--this-is-wrong': this.props.thisIsIt == 2}
            )}
          onClick={this.handleClick}
        >
            <span className="Vote-button__content">
              {this.props.name}
            </span>
        </button>
      </li>
    );
  }
}

ButtonComponent.displayName = 'VoteAreaButtonComponent';

// Uncomment properties you need
// ButtonComponent.propTypes = {};
// ButtonComponent.defaultProps = {};

export default ButtonComponent;
