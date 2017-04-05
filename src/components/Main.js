/*global sillaInteractiveData */
require('styles/App.scss');

import React from 'react';
import * as firebase from 'firebase';

import Question from './Question';
import PrevNext from './PrevNext';
import ReportCard from './ReportCard';

const config = {
  apiKey: 'AIzaSyBl-pcS2XqyKb-79QuQvsIwsWJ1Zx693i4',
  authDomain: 'detector-de-mentiras-69bb7.firebaseapp.com',
  databaseURL: 'https://detector-de-mentiras-69bb7.firebaseio.com',
  storageBucket: 'detector-de-mentiras-69bb7.appspot.com',
  messagingSenderId: '433947191175'
};
let firebaseDone = false;
if (!firebaseDone) {
  firebase.initializeApp(config);
  firebaseDone = true;
}

class AppComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      currentQuestionIndex: 0,
      error: false,
      questions: [],
      results: [],
      introText: false,
      title: false
    };

    this.prevNext = this.prevNext.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    this.getData();
    // this.setupFirebase();
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
      this.setState({ error: 'Error: No se pudieron encontrar los datos de la pregunta.' });
      return;
    }
    let introText = {
      title: 'Chequealo tu mismo',
      content: '<p>Le aplicamos nuestro detector de mentiras al volante oficial del Centro Democrático para la marcha de este sábado</p><p>De las seis afirmaciones sobre los acuerdos entre el Gobierno y las Farc tres son apresuradas, dos son falsas y una es engañosa. </p>'
    };

    if (sillaInteractiveData.intro) {
      introText = {
        title: sillaInteractiveData.intro.title,
        content: sillaInteractiveData.intro.content
      }
    }

    let title = false;
    if (sillaInteractiveData.title) title = sillaInteractiveData.title;

    this.setState({ questions: sillaInteractiveData.data, introText, title });
  }

  prevNext(e) {
    const currentQuestion = this.state.currentQuestionIndex;

    let nextQuestion = currentQuestion + 1;
    if (e == 'prev') {
      nextQuestion = currentQuestion - 1;
    }
    this.setState({ currentQuestionIndex: nextQuestion });
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
    this.setState({ results });
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
    const buttonsToShow = { prev: true, next: true };
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
          questions={this.state.questions}
        >
          <PrevNext
            callback={this.prevNext}
            show={buttonsToShow}
            type="overlay"
          />
        </ReportCard>
      )
    } else {
      questionObj = (
        <Question
          {...question}
          callback={this.saveData}
          switchQuestion={this.prevNext}
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

    let indexCounter;
    if (currentIndex + 1 <= totalQuestions)
      indexCounter = (
        <div className="index__question-counter">
          {currentIndex + 1}/{totalQuestions}
        </div>
      );

    let title;
    if (this.state.title) {
      title = (
        <div className="col-sm-8 index__title"><h2>{this.state.title}</h2></div>
      );
    }

    return (
      <div className="index">
        <div className="row" style={{ margin: 0 }}>
          <div className="title col-sm-12 col-md-4 index__introtext">
            <span />
            <h2><a href="#">{ this.state.introText.title }</a></h2>
            <div dangerouslySetInnerHTML={{__html: this.state.introText.content}}/>
          </div>

          {title}


          <div className="index__inner col-sm-12 col-md-8">
            {error}
            {indexCounter}
            {reportCard}
            {questionObj}
          </div>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
