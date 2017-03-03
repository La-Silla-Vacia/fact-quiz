'use strict';

import React from 'react';

require('styles/ReportCard.scss');

class ReportCardComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      userResult: {}
    };

    this.getTableRows = this.getTableRows.bind(this);
  }

  getTableRows() {
    return this.props.data.map((result, index) => {
      let score = 10 / 8;
      let resultScore = ((10 - (result.result)) - 2) * score;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{resultScore}</td>
        </tr>
      )
    });
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
    this.props.data.map((result, index) => {
      let score = 10 / 8;
      let resultScore = ((10 - (result.result)) - 2) * score;
      totalUserResult += resultScore;

      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{resultScore}</td>
        </tr>
      )
    });

    let scoreName = '';
    if (totalUserResult >= maxResult) {
      scoreName = 'Total wonder';
    } else if (totalUserResult >= goodResult) {
      scoreName = 'You\'re good';
    } else if (totalUserResult >= averageResult) {
      scoreName = 'You\'re OK';
    } else if (totalUserResult >= notSoGoodResult) {
      scoreName = 'I would not trust you';
    } else {
      scoreName = 'Terrible.';
    }

    const point = totalUserResult / numberOfResults;
    const userResult = {
      name: scoreName,
      point: Math.round(point * 10) / 10
    };
    this.setState({userResult});
  }

  render() {
    return (
      <div className="ReportCard">
        <h2>Your reportcard</h2>
        <span>You've got a {this.state.userResult.point}. This means you're <strong>{this.state.userResult.name}</strong></span>
      </div>
    );
  }
}

ReportCardComponent.displayName = 'ReportCardComponent';

// Uncomment properties you need
// ReportCardComponent.propTypes = {};
// ReportCardComponent.defaultProps = {};

export default ReportCardComponent;
