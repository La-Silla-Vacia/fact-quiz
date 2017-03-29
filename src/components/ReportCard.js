'use strict';

import React from 'react';
import cx from 'classnames';

require('styles/ReportCard.scss');

class ReportCardComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      userResult: {},
      openRow: 999
    };

    this.openRow = this.openRow.bind(this);
  }

  componentWillMount() {
    this.getUserScore();
  }

  componentWillReceiveProps() {
    this.getUserScore();
  }

  getAllQuestions() {
    return this.props.questions.map((question, index) => {
      let open = false;
      if (this.state.openRow == index) {
        open = true;
      }

      return (
        <QuoteRow
          key={index}
          index={index + 1}
          quote={question.quote}
          answer={question.explicacion}
          result={Math.round(this.props.data[index].result)}
          callback={this.openRow}
          open={open}
        />
      )
    });
  }

  openRow(e) {
    let newRow = 999;
    if (this.state.openRow !== e) {
      newRow = e;
    }
    this.setState({openRow: newRow});
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
    const questions = this.getAllQuestions();

    return (
      <div className="ReportCard">
        <h2>Sus resultados</h2>
        <h3>¿Eres un verdadero detector de mentiras?</h3>
        <span><strong>{this.state.userResult.name}</strong></span>
        <table className="table table-hover ReportCard__results">
          <thead>
          <tr>
            <th>#</th>
            <th>Quote</th>
          </tr>
          </thead>
          <tbody>
          {questions}
          </tbody>
        </table>
      </div>
    );
  }
}

ReportCardComponent.displayName = 'ReportCardComponent';

class QuoteRow extends React.Component {
  constructor() {
    super();

    this.setOpen = this.setOpen.bind(this);
  }

  setOpen() {
    this.props.callback(this.props.index - 1);
  }

  render() {
    let answerStyle = {display: 'none'};
    if (this.props.open) {
      answerStyle = {display: 'block'};
    }

    return (
      <tr onClick={this.setOpen}>
        <td className={cx(`VoteArea--score-${this.props.result}`)}>
          <strong>{this.props.index}</strong>
        </td>
        <td>
          <h4 title="Clic para ver la explicación">{this.props.quote}</h4>
          <div style={answerStyle}>

          <div dangerouslySetInnerHTML={{__html: this.props.answer }} />
          </div>
        </td>
      </tr>
    );
  }
}

export default ReportCardComponent;
