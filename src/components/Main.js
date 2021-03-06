/*global sillaInteractiveData */
require('styles/App.scss');

import React from 'react';
import * as firebase from 'firebase';
import 'whatwg-fetch';

import Question from './Question';
import PrevNext from './PrevNext';
import ReportCard from './ReportCard';
import SingleCheck from './SingleCheck';

import buttons from '../sources/buttons';

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
      title: false,
      showAll: false,
      loading: true,
      showDefinitions: false
    };

    this.prevNext = this.prevNext.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleShowAll = this.handleShowAll.bind(this);
    this.handleShowDefinitions = this.handleShowDefinitions.bind(this);
  }

  componentWillMount() {
    this.setShortLink();
  }

  componentDidMount() {
    this.getData();
    // this.setupFirebase();
    // const hash = Number(window.location.hash.replace('#', ''));
    // if (hash) this.setState({currentQuestionIndex: hash - 1});
  }

  setShortLink() {
    console.log('Getting content id');
    const head = document.head || document.getElementsByTagName('head')[0];
    const links = head.getElementsByTagName('link');
    for (let link in links) {
      if (links.hasOwnProperty(link)) {
        const l = links[link];
        console.log('Looking for shortlink');
        if (l.rel === 'shortlink') {
          const url = l.href.split('/');
          const contentId = url[url.length - 1];
          console.log('Saving content id');
          window.lsviContentId = contentId;
        }
      }
    }
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

    if (sillaInteractiveData.type === "list") {
      this.setState({ showAll: true });
    }

    if (sillaInteractiveData.data) {
      this.setState({ questions: sillaInteractiveData.data, introText, title, loading: false });
    } else if (sillaInteractiveData.dataUrl) {
      this.setState({ introText, title });
      this.fetchData(sillaInteractiveData.dataUrl);
    }
  }

  fetchData(dataUrl) {
    fetch(dataUrl)
      .then((response) => {
        return response.json()
      }).then((json) => {
      const questions = [];
      json.map((question, index) => {
        const thisQ = {
          id: index,
          quote: question.afirmacion,
          explicacion: question.explicacion,
          score: question.score
        };
        questions.push(thisQ);
      });
      this.setState({ questions, loading: false });
    }).catch((ex) => {
      this.setState({ error: 'Error: No se pudieron encontrar los datos de la pregunta.' });
      console.log('parsing failed', ex);
    })
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
    let question = data.question;
    if (!question) question = '0';
    results[question] = {
      answer: data.answer,
      result: data.difference
    };
    this.setState({ results });
  }

  getEverything() {
    return this.state.questions.map((question, index) => {
      return (
        <SingleCheck key={index} {...question} />
      )
    });
  }

  handleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

  handleShowDefinitions() {
    this.setState({ showDefinitions: !this.state.showDefinitions });
  }

  render() {
    const { showDefinitions } = this.state;
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

    if (currentIndex >= totalQuestions && !this.state.loading) {
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

    const everyting = this.getEverything();
    const definitionTable = (
      <table className="table index__defination-table">
        <tbody>
        <tr>
          <td>{buttons[0].name}</td>
          <td>{buttons[0].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[1].name}</td>
          <td>{buttons[1].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[2].name}</td>
          <td>{buttons[2].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[3].name}</td>
          <td>{buttons[3].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[4].name}</td>
          <td>{buttons[4].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[5].name}</td>
          <td>{buttons[5].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[6].name}</td>
          <td>{buttons[6].meaning}</td>
        </tr>
        <tr>
          <td>{buttons[7].name}</td>
          <td>{buttons[7].meaning}</td>
        </tr>
        </tbody>
      </table>
    );
    let introPiece = (
      <div className="title col-sm-12 col-md-4 index__introtext">
        <span />
        <h2><a href="#">{ this.state.introText.title }</a></h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.introText.content }} />

        <button onClick={this.handleShowDefinitions} className="index__showAll index__showDefinitions">
          Qué es cada calificación
        </button>
        {(showDefinitions) ? definitionTable : false}
      </div>
    );

    let dataContent = (
      <div className="index__inner col-sm-12 col-md-8">
        {error}
        {indexCounter}
        {reportCard}
        {questionObj}

        <button onClick={this.handleShowAll} className="index__showAll">No me haga trabajar, muéstreme todo</button>
      </div>
    );
    if (this.state.showAll) {
      introPiece = '';
      dataContent = (
        <div className="index__inner col-sm-12 col-md-10">
          {everyting}
          <button onClick={this.handleShowAll} className="index__showAll">Quiero ver el cuestionario</button>
        </div>
      )
    }


    return (
      <div className="index">
        <div className="row" style={{ margin: 0 }}>
          {introPiece}
          {title}
          {dataContent}
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
