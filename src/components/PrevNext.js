'use strict';

import React from 'react';

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
      prevButton = (
        <button className="PrevNext__button PrevNext__button--prev" onClick={this.prev}>
          &lt; Anterior
        </button>
      );
    }

    if (this.props.show.next) {
      nextButton = (
        <button className="PrevNext__button PrevNext__button--next" onClick={this.next}>
          Siguiente &gt;
        </button>
      )
    }

    return (
      <div className="PrevNext">
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
