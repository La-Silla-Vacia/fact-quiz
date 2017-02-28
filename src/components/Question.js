'use strict';

import React from 'react';
import VoteArea from './VoteArea/VoteArea';

require('styles/Question.scss');

class QuestionComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      current: false,
      answered: false
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
    return (
      <div>
        <div className="Question__score">
          <span className="Question__score__content">CIERTO</span>
        </div>
        <article className="Question__explanation" dangerouslySetInnerHTML={{__html: this.props.explicacion}}/>
      </div>
    );
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
        <VoteArea callback={this.handleSelection} score={this.props.score} showResult={showResult} />
        {result}
      </div>
    );
  }
}

QuestionComponent.displayName = 'QuestionComponent';

// Uncomment properties you need
// QuestionComponent.propTypes = {};
// QuestionComponent.defaultProps = {};

export default QuestionComponent;
