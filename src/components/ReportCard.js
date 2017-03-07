'use strict';

import React from 'react';

require('styles/ReportCard.scss');

class ReportCardComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      userResult: {}
    };
  }

  componentWillMount() {
    this.getUserScore();
  }

  componentWillReceiveProps() {
    this.getUserScore();
  }

  getUserScore() {
    const numberOfResults = this.props.data.length;
    const maxResult = numberOfResults * 10;
    const goodResult = numberOfResults * 7.5;
    const averageResult = numberOfResults * 6;
    const notSoGoodResult = numberOfResults * 3;

    let totalUserResult = 0;
    this.props.data.map((result) => {
      let score = 10 / 8;
      let resultScore = ((10 - (result.result)) - 2) * score;
      totalUserResult += resultScore;
    });

    let scoreName = '';
    if (totalUserResult >= maxResult) {
      scoreName = 'You\'re a total wonder. You have a %s% score, amazing.';
    } else if (totalUserResult >= goodResult) {
      scoreName = 'You\'re good. You have %s% right';
    } else if (totalUserResult >= averageResult) {
      scoreName = 'You\'re OK. You have %s% right';
    } else if (totalUserResult >= notSoGoodResult) {
      scoreName = 'I would not trust you. You have %s% right';
    } else {
      scoreName = 'Terrible. You have %s% right';
    }

    const point = Math.round((totalUserResult / numberOfResults * 10));
    const userResult = {
      name: scoreName.replace('%s', point),
      point: point
    };
    this.setState({userResult});
  }

  render() {
    return (
      <div className="ReportCard">
        <h2>Sus resultados</h2>
        <h3>¿Eres un verdadero detector de mentiras?</h3>
        <span><strong>{this.state.userResult.name}</strong></span>
      </div>
    );
  }
}

ReportCardComponent.displayName = 'ReportCardComponent';

// Uncomment properties you need
// ReportCardComponent.propTypes = {};
// ReportCardComponent.defaultProps = {};

export default ReportCardComponent;
