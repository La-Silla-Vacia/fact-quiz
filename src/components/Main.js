/*global sillaInteractiveData */
require('styles/App.scss');

import React from 'react';
import Question from './Question';
import PrevNext from './PrevNext';
import ReportCard from './ReportCard';

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
    const currentIndex = this.state.currentQuestionIndex;
    const totalQuestions = this.state.questions.length;
    const errorMessage = this.state.error;
    const question = this.state.questions[currentIndex];
    const answered = this.state.results[currentIndex];

    let error = '',
      reportCard = '',
      questionObj = '';
    const buttonsToShow = {prev: true, next: true};
    if (errorMessage) error = (<h3>{errorMessage}</h3>);

    if (currentIndex == 0) {
      buttonsToShow.prev = false;
    }

    if (currentIndex >= totalQuestions ||
      this.state.results.length <= currentIndex) {
      buttonsToShow.next = false;
    }

    if (currentIndex >= totalQuestions) {
      reportCard = (
        <ReportCard
          data={this.state.results}
        />
      )
    } else {
      questionObj = (
        <Question
          {...question}
          callback={this.saveData}
          answered={answered}
        >
          <PrevNext
            callback={this.prevNext}
            show={buttonsToShow}
            type="overlay"
          />
        </Question>
      )
    }

    return (
      <div className="index">
        <div className="index__inner">
          <h2 className="index__title">
            La Silla's Fact Quiz
          </h2>
          {error}
          <div className="index__question-counter">
            {currentIndex + 1}/{totalQuestions}
            <PrevNext
              callback={this.prevNext}
              show={buttonsToShow}
              type="compact"
            />
          </div>
          {reportCard}
          {questionObj}
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
