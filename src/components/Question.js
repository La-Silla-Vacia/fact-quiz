'use strict';

import React from 'react';
import cx from 'classnames';
import VoteArea from './VoteArea';

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
      alreadyAnswered: false
    };

    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(id) {
    this.setState({
      current: id,
      answered: true
    });

    if (this.props.score == id) {
      this.setState({result: true});
    } else {
      this.setState({result: false});
    }

    this.submitResult(id);
  }

  submitResult(id) {

    let difference = 8;
    if (id < 8) {
      difference = QuestionComponent.getDifference(id, this.props.score)
    }


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
        this.setState({showingResult: true})
      }, 1000);
    }

    return (
      <article
        className={cx(
          'Question__explanation',
          {'Question__explanation--hidden': !this.state.showingResult}
        )}
        dangerouslySetInnerHTML={{__html: this.props.explicacion}}
      />
    );
  }

  componentWillReceiveProps(newprops) {
    if (newprops.id == this.props.id) return;
    let current = false,
        result = false;
    if (newprops.answered) {
      current = newprops.answered.answer;
      if (newprops.answered.result == 0) {
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
      alreadyAnswered: newprops.answered
    });

    if (newprops.id) {
      location.hash = '#' + (newprops.id + 1);
    }
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
        {'Question--already-answered': this.state.alreadyAnswered}
      )}>
        <h3 className="Question__title">La declaración:</h3>
        <blockquote className="Question__quote">{this.props.quote}</blockquote>
        <VoteArea
          callback={this.handleSelection}
          score={this.props.score}
          showResult={showResult}
          result={this.state.result}/>
        {result}
      </div>
    );
  }
}

QuestionComponent.displayName = 'Question';

// Uncomment properties you need
// QuestionComponent.propTypes = {};
// QuestionComponent.defaultProps = {};

export default QuestionComponent;
