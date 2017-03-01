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
      showingResultTimer: false
    };

    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(id) {
    this.setState({
      current: id,
      answered: true
    });

    // if (this.props.score == id) alert('good job!');
  }

  getResult() {

    if (!this.state.showingResult && !this.state.showingResultTimer) {
      setTimeout(() => {
        console.log('asdf');
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

  componentWillReceiveProps() {
    this.setState({
      currentQuestion: this.props.id,
      answered: false,
      current: false,
      showingResult: false,
      showingResultTimer: false
    });
  }

  render() {

    let result,
      showResult = false;

    if (this.state.answered) {
      result = this.getResult();
      showResult = true;
    }

    return (
      <div className="Question">
        <h3 className="Question__title">La declaración:</h3>
        <blockquote className="Question__quote">{this.props.quote}</blockquote>
        <VoteArea
          callback={this.handleSelection}
          score={this.props.score}
          showResult={showResult}/>
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
