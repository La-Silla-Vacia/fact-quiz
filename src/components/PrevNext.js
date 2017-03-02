'use strict';

import React from 'react';
import cx from 'classnames';

require('styles/PrevNext.scss');

class PrevNextComponent extends React.Component {

  static defaultProps = {
    show: {
      prev: true,
      next: true
    }
  };

  constructor() {
    super();

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  prev() {
    this.props.callback('prev');
  }

  next() {
    this.props.callback('next');
  }

  render() {

    let prevButton,
      nextButton;
    if (this.props.show.prev) {
      if (this.props.type == 'compact') {
        prevButton = (
          <button onClick={this.prev} className="PrevNext__button">&lt;</button>
        )
      } else {
        prevButton = (
          <button className="PrevNext__button PrevNext__button--prev" onClick={this.prev}>
            &lt; Anterior
          </button>
        );
      }
    }

    if (this.props.show.next) {
      if (this.props.type == 'compact') {
        nextButton = (
          <button onClick={this.next} className="PrevNext__button">&gt;</button>
        );
      } else {
        nextButton = (
          <button className="PrevNext__button PrevNext__button--next" onClick={this.next}>
            Siguiente &gt;
          </button>
        )
      }
    }

    return (
      <div className={cx(
        'PrevNext',
        {'PrevNext--compact': this.props.type == 'compact'}
      )}>
        {prevButton}
        {nextButton}
      </div>
    );
  }
}

PrevNextComponent.displayName = 'PrevNext';

// Uncomment properties you need
// PrevNextComponent.propTypes = {};
// PrevNextComponent.defaultProps = {};

export default PrevNextComponent;
