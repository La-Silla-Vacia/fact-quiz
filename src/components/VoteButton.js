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

  handleClick(e) {
    if (e.target.classList.contains('VoteButton__showDescription')) return;
    this.props.callback(this.props.value);
  }

  handleDescriptionClick() {

  }

  render() {
    return (
      <button
        className={cx(
          'VoteButton',
          { 'VoteButton--selected': this.props.active },
          { 'VoteButton--this-is-it': this.props.thisIsIt == 1 }
        )}
        onClick={this.handleClick}
      >
        <div className="VoteButton__content">
          {this.props.name}
          <div onClick={this.handleDescriptionClick} className="VoteButton__showDescription">?</div>
          <div className="VoteButton__description">{this.props.name}: {this.props.meaning}</div>
        </div>
      </button>
    );
  }
}

ButtonComponent.displayName = 'VoteButton';

// Uncomment properties you need
// ButtonComponent.propTypes = {};
// ButtonComponent.defaultProps = {};

export default ButtonComponent;
