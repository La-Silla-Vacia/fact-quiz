'use strict';
import React from 'react';
import cx from 'classnames';

import VoteArea from './VoteArea';

const results = [
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
    'name': 'Engañoso',
    'value': 6
  },
  {
    'name': 'Falso',
    'value': 7
  },
  {
    'name': 'Inchequable',
    'value': 8
  },
  {
    'name': 'No lo se',
    'value': 9
  }];

require('styles/Question.scss');

class QuestionComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      currentQuestion: false,
      current: false,
      answered: false,
      showingResult: false,
      showingResultTimer: false,
      result: false,
      alreadyAnswered: false,
      questionScore: false,
      allScores: [],
      totalAnswers: false,
      otherAnswersOpen: false
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.toggleOtherAnswers = this.toggleOtherAnswers.bind(this);
  }

  componentDidMount() {
    this.watchKeys();

    this.checkComponent(this.props);

    this.getScores();
  }

  getScores() {
    let url = 'https://detector-de-mentiras-69bb7.firebaseio.com/scores.json';
    if (typeof lsviContentId !== 'undefined') {
      url = `https://detector-de-mentiras-69bb7.firebaseio.com/scores/${lsviContentId}.json`;
    }

    fetch(url)
      .then((result) => {
        return result.json();
      }).then((result) => {

      const questions = [];
      let i = 0;
      for (let [key, val] of Object.entries(result)) {
        if (!val.perQuestion) continue;
        let index = 0;
        for (let key of val.perQuestion) {
          if (key) {
            const score = key.answer;
            if (score) {
              if (!questions[index]) questions[index] = {};
              if (questions[index][score]) {
                questions[index][score]++;
              } else {
                questions[index][score] = 1;
              }
              index++;
            }
          }
        }
        i++;
      }

      console.log(`Total answers: ${i}`);

      this.setState({ allScores: questions, totalAnswers: i });
    });
  }

  watchKeys() {
    document.addEventListener('keydown', (event) => {
      let key = false;
      switch (event.keyCode) {
        case 49:
          key = 1;
          break;
        case 50:
          key = 2;
          break;
        case 51:
          key = 3;
          break;
        case 52:
          key = 4;
          break;
        case 53:
          key = 5;
          break;
        case 54:
          key = 6;
          break;
        case 55:
          key = 7;
          break;
        case 56:
          key = 8;
          break;
        case 57:
          key = 9;
          break;
        case 13:
          key = 'enter';
          break;
      }

      if (this.state.showingResult) {
        if (key === 'enter') {
          event.preventDefault();
          this.props.switchQuestion('next');
        }
      } else if (key >= 1 && key <= 9) {
        this.handleSelection(key);
      }

    });
  }

  handleSelection(id) {
    this.setState({
      current: id,
      answered: true
    });

    if (this.props.score === id) {
      this.setState({ result: true });
    } else {
      this.setState({ result: false });
    }

    this.submitResult(id);
  }

  submitResult(id) {
    let difference = 9;
    if (id < 9) {
      difference = QuestionComponent.getDifference(id, this.props.score) * 1.75
    }

    this.setState({ questionScore: difference });

    this.props.callback({
      question: this.props.id,
      answer: id,
      difference
    });
  }

  static getDifference(num1, num2) {
    if (num1 > num2)
      return num1 - num2;
    else
      return num2 - num1;
  }

  getResult() {
    if (!this.state.showingResult && !this.state.showingResultTimer && this.state.answered) {
      setTimeout(() => {
        this.setState({ showingResult: true })
      }, 1000);
    }

    let otherAnswers = this.getOtherAnswers();

    return (
      <section
        className={cx(
          'Question__explanation',
          { 'Question__explanation--hidden': !this.state.showingResult }
        )}
      >
        <article dangerouslySetInnerHTML={{ __html: this.props.explicacion }} />
        {otherAnswers}
      </section>
    );
  }

  componentWillReceiveProps(newprops) {
    if (newprops.id === this.props.id) return;
    let current = false,
      result = false,
      questionScore = false;
    if (newprops.answered) {
      current = newprops.answered.answer;
      questionScore = newprops.answered.result;
      if (newprops.answered.result === 0) {
        result = true;
      }
    }

    this.setState({
      currentQuestion: newprops.id,
      answered: newprops.answered,
      current: current,
      result: result,
      showingResult: newprops.answered,
      showingResultTimer: false,
      alreadyAnswered: newprops.answered,
      questionScore: questionScore
    });

    if (newprops.id) {
      location.hash = '#' + (newprops.id + 1);
    }
  }

  checkComponent(newprops) {
    let current = false,
      result = false,
      questionScore = false;
    if (newprops.answered) {
      current = newprops.answered.answer;
      questionScore = newprops.answered.result;
      if (newprops.answered.result === 0) {
        result = true;
      }
    }

    this.setState({
      currentQuestion: newprops.id,
      answered: newprops.answered,
      current: current,
      result: result,
      showingResult: newprops.answered,
      showingResultTimer: false,
      alreadyAnswered: newprops.answered,
      questionScore: questionScore
    });

    if (newprops.id) {
      location.hash = '#' + (newprops.id + 1);
    }
  }

  getOtherAnswers() {
    if (this.state.allScores.length) {
      const currentQuestionAnswers = this.state.allScores[this.state.currentQuestion];

      const questionAnswersSorted = [];
      for (let question in currentQuestionAnswers) {
        questionAnswersSorted.push([question, currentQuestionAnswers[question]]);
      }

      questionAnswersSorted.sort(function (a, b) {
        return a[1] - b[1];
      }).reverse();

      const tableRows = () => {
        return questionAnswersSorted.map((value, index) => {
          const scoreName = results[value[0] - 1].name;

          const percentage = Math.round(value[1] / this.state.totalAnswers * 1000) / 10;

          return (
            <tr key={index}
                className={cx({ 'Question--is-the-answer': (this.props.score === index + 1) })}>
              <td>{ scoreName }</td>
              <td>{ percentage }%</td>
            </tr>
          )
        });
      };

      let table;
      if (this.state.otherAnswersOpen) {
        table = (
          <div>
            <table className="table">
              <thead>
              <tr>
                <th>Respuesta</th>
                <th>%</th>
              </tr>
              </thead>
              <tbody>
              {tableRows()}
              </tbody>
            </table>
          </div>
        );
      }

      return (
        <div className="Question__other-answers">
          <button onClick={this.toggleOtherAnswers}>Vea acá los otros resultados de esta afirmación</button>
          {table}
        </div>
      )
    } else {
      return (
        <div>...</div>
      )
    }
  }

  toggleOtherAnswers() {
    this.setState({ otherAnswersOpen: !this.state.otherAnswersOpen })
  }

  render() {

    let result,
      showResult = false;

    if (this.state.answered) {
      showResult = true;
    }
    result = this.getResult();

    return (
      <div className={cx(
        'Question',
        { 'Question--already-answered': this.state.alreadyAnswered }
      )}>
        <h3 className="Question__title">La afirmación:</h3>
        <div className="clearfix">
          <blockquote className="Question__quote">{this.props.quote}</blockquote>
          <svg className="Question__logo" width="164px" height="177px" viewBox="0 0 164 177" version="1.1">
            <polygon className="Question__silla"
                     points="70 80.9275139 70.5154619 136.081934 74.6391568 136.597396 75.1546187 85.5666708 117.422492 96.3913701 118.453416 149.483943 123.092573 149.483943 123.608035 95.8759082 157.628518 84.535747 158.14398 128.350006 162.267675 128.350006 163.814061 8.76285183 117.937954 0 118.453416 66.4945815" />
            <polygon className="Question__silla"
                     points="98.4532176 105.174904 97.9377557 162.906634 93.8140607 163.422095 93.2985989 109.298599 47.4224922 121.154222 46.3915685 176.824104 41.7524116 176.824104 40.7214879 120.63876 6.70100434 108.783137 6.18554247 160.844786 1.54638562 159.813862 0 16 48.453416 27.8556231 47.9379541 90.2265096" />
          </svg>
        </div>
        <VoteArea
          callback={this.handleSelection}
          score={this.props.score}
          showResult={showResult}
          result={this.state.result}
          questionScore={this.state.questionScore}
          selected={this.state.current} />
        {this.props.children}
        {result}
      </div>
    );
  }
}

QuestionComponent.displayName = 'Question';

export default QuestionComponent;
