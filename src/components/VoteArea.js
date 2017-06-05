'use strict';
import React from 'react';
import cx from 'classnames';
import Button from './VoteButton';

import buttons from '../sources/buttons';

require('styles/VoteArea.scss');

class VoteButtonComponent extends React.Component {

  static defaultProps = {
    buttons
  };

  constructor() {
    super();

    this.state = {
      selected: false,
      showConventions: false
    };

    this.setInchequable = this.setInchequable.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  setInchequable() {
    this.handleSelection(9);
  }

  handleSelection(id) {
    this.setState({ selected: id });
    this.props.callback(id);
  }

  getButtons() {
    // console.log(this.props);
    return this.props.buttons.map((button, index) => {
      let active = false,
        thisIsIt = false;
      if (this.props.selected === button.value && this.props.showResult) {
        active = true;
      }

      if (this.props.showResult) {
        // console.log(this.props.score, button.value);
        if (Number(button.value) === Number(this.props.score)) {
          // console.log('this');
          thisIsIt = true;
        } else {
          thisIsIt = 2;
        }
      }

      return (
        <li
          className={cx(
            'VoteArea__list-item',
            { 'VoteArea__list-item--hidden': thisIsIt === 2 }
          )}
          key={index}
        >
          <Button
            active={active}
            thisIsIt={thisIsIt}
            callback={this.handleSelection}
            {...button}
          />
        </li>
      )
    });
  }

  render() {
    const buttons = this.getButtons();
    let inchequableActive = false;
    if (this.props.selected === 8) inchequableActive = true;

    return (
      <div className={cx(
        'VoteArea'
      )}>
        <h4 className="VoteArea__title">¿Verdad?</h4>

        <div className={cx(
          'VoteArea__form-container',
          { 'VoteArea--show-result': this.props.showResult },
          { [`VoteArea--score-${Math.round(this.props.questionScore)}`]: this.props.showResult }
        )}>
          <div className={cx(
            'VoteArea__slide',
            { 'VoteArea__slide--small': this.props.showResult }
          )} />
          <ul className={cx(
            'VoteArea__button-list',
            { 'VoteArea__button-list--small': this.props.showResult }
          )}>
            {buttons}
          </ul>
        </div>
        <div className={cx(
          'VoteArea__footer',
          { 'VoteArea__footer--hidden': this.props.showResult },
        )}>
          <button onClick={this.setInchequable}
                  className={cx(
                    'VoteArea__button',
                    { 'VoteArea__button--selected': inchequableActive && this.props.showResult },
                  )}>
            No lo sé
          </button>
        </div>
      </div>
    );
  }
}

VoteButtonComponent.displayName = 'VoteButton';

// Uncomment properties you need
// VoteButtonComponent.propTypes = {};

export default VoteButtonComponent;
