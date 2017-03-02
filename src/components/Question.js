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
      <section
        className={cx(
          'Question__explanation',
          {'Question__explanation--hidden': !this.state.showingResult}
        )}
      >
        <h3>Explicación</h3>
        <article dangerouslySetInnerHTML={{__html: this.props.explicacion}}/>
      </section>
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
        <h3 className="Question__title">La afirmación:</h3>
        <div className="clearfix">
          <blockquote className="Question__quote">{this.props.quote}</blockquote>
          <svg className="Question__logo" width="164px" height="177px" viewBox="0 0 164 177" version="1.1">
            <polygon className="Question__silla"
                     points="70 80.9275139 70.5154619 136.081934 74.6391568 136.597396 75.1546187 85.5666708 117.422492 96.3913701 118.453416 149.483943 123.092573 149.483943 123.608035 95.8759082 157.628518 84.535747 158.14398 128.350006 162.267675 128.350006 163.814061 8.76285183 117.937954 0 118.453416 66.4945815"></polygon>
            <polygon className="Question__silla"
                     points="98.4532176 105.174904 97.9377557 162.906634 93.8140607 163.422095 93.2985989 109.298599 47.4224922 121.154222 46.3915685 176.824104 41.7524116 176.824104 40.7214879 120.63876 6.70100434 108.783137 6.18554247 160.844786 1.54638562 159.813862 0 16 48.453416 27.8556231 47.9379541 90.2265096"></polygon>

          </svg>
        </div>
        <VoteArea
          callback={this.handleSelection}
          score={this.props.score}
          showResult={showResult}
          result={this.state.result}/>
        {this.props.children}
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
