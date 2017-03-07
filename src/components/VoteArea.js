'use strict';
import React from 'react';
import cx from 'classnames';
import Button from './VoteButton';

require('styles/VoteArea.scss');

class VoteButtonComponent extends React.Component {

  static defaultProps = {
    buttons: [
      {
        'name': 'Cierto',
        'value': 1
      },
      {
        'name': 'Cierto pero',
        'value': 2
      },
      {
        'name': 'Apresurado',
        'value': 3
      },
      {
        'name': 'Debatible',
        'value': 4
      },
      {
        'name': 'Exagerado',
        'value': 5
      },
      {
        'name': 'Falso',
        'value': 6
      },
      {
        'name': 'Inchequable',
        'value': 7
      }
    ]
  };

  constructor() {
    super();

    this.state = {
      selected: false
    };

    this.setInchequable = this.setInchequable.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  setInchequable() {
    this.handleSelection(8);
  }

  handleSelection(id) {
    this.setState({selected: id});
    this.props.callback(id);
  }

  getButtons() {
    return this.props.buttons.map((button, index) => {
      let active = false,
        thisIsIt = false;
      if (this.props.selected == button.value && this.props.showResult) {
        active = true;
      }

      if (this.props.showResult) {
        if (button.value == this.props.score) {
          thisIsIt = true;
        } else {
          thisIsIt = 2;
        }
      }

      return (
        <li
          className={cx(
            'VoteArea__list-item',
            {'VoteArea__list-item--hidden': thisIsIt == 2}
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
    if (this.props.selected === 7) inchequableActive = true;

    return (
      <div className={cx(
        'VoteArea',
        {'VoteArea--show-result': this.props.showResult},
        {[`VoteArea--score-${Math.round(this.props.questionScore)}`]: this.props.showResult}

      )}>
        <h4 className="VoteArea__title">¿Verdad?</h4>
        <div className="VoteArea__form-container">
          <div className={cx(
            'VoteArea__slide',
            {'VoteArea__slide--small': this.props.showResult}
          )}></div>
          <ul className={cx(
            'VoteArea__button-list',
            {'VoteArea__button-list--small': this.props.showResult}
          )}>
            {buttons}
          </ul>
          <div className={cx(
            'VoteArea__footer',
            {'VoteArea__footer--hidden': this.props.showResult},
          )}>
            {/*<small>- O -</small>*/}
            <button onClick={this.setInchequable}
                    className={cx(
                      'VoteArea__button',
                      {'VoteArea__button--selected': inchequableActive && this.props.showResult},
                      )}>
              No lo sé
            </button>
          </div>
        </div>
      </div>
    );
  }
}

VoteButtonComponent.displayName = 'VoteButton';

// Uncomment properties you need
// VoteButtonComponent.propTypes = {};

export default VoteButtonComponent;
