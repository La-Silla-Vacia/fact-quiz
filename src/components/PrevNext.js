'use strict';

import React from 'react';

require('styles/PrevNext.css');

class PrevNextComponent extends React.Component {

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
        <button onClick={this.prev}>
          Anterior
        </button>
      );
    }

    if (this.props.show.next) {
      nextButton = (
        <button onClick={this.next}>
          Siguiente
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
