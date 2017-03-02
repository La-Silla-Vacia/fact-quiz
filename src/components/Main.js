/*global sillaInteractiveData */
require('styles/App.scss');

import React from 'react';
import Question from './Question';
import PrevNext from './PrevNext';

class AppComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      currentQuestionIndex: 0,
      error: false,
      questions: [],
      results: []
    };

    this.prevNext = this.prevNext.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    this.getData();

    // const hash = Number(window.location.hash.replace('#', ''));
    // if (hash) this.setState({currentQuestionIndex: hash - 1});
  }

  getData() {
    let dataExists = true;
    try {
      if (sillaInteractiveData)
        dataExists = true;
    } catch (e) {
      dataExists = false;
    }
    if (!dataExists) {
      this.setState({error: 'Error: No se pudieron encontrar los datos de la pregunta.'});
      return;
    }

    this.setState({questions: sillaInteractiveData.data});
  }

  prevNext(e) {
    const currentQuestion = this.state.currentQuestionIndex;

    let nextQuestion = currentQuestion + 1;
    if (e == 'prev') {
      nextQuestion = currentQuestion - 1;
    }
    this.setState({currentQuestionIndex: nextQuestion});
  }

  nextQuestion() {
    this.prevNext('next')
  }

  prevQuestion() {
    this.prevNext('prev');
  }

  saveData(data) {
    const results = this.state.results;
    results[data.question] = {
      answer: data.answer,
      result: data.difference
    };
    this.setState({results});
  }

  render() {

    let error = '';
    if (this.state.error) {
      error = (<h3>{this.state.error}</h3>)
    }

    let buttonsToShow = {prev: true, next: true};
    if (this.state.currentQuestionIndex == 0) {
      buttonsToShow.prev = false;
    }
    if (this.state.currentQuestionIndex >= this.state.questions.length - 1) {
      buttonsToShow.next = false;
    }

    const question = this.state.questions[this.state.currentQuestionIndex];
    let answered = this.state.results[this.state.currentQuestionIndex];

    return (
      <div className="index">
        <h2 className="index__title">La Silla's Fact Quiz</h2>
        {error}
        <div className="index__question-counter">
          {this.state.currentQuestionIndex + 1}/{this.state.questions.length}
          <PrevNext
            callback={this.prevNext}
            show={buttonsToShow}
            type="compact"
          />
        </div>
        <Question
          {...question}
          callback={this.saveData}
          answered={answered}
        />
        <PrevNext
          callback={this.prevNext}
          show={buttonsToShow}
        />
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
