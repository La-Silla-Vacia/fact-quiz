'use strict';
import React from 'react';
import firebase from 'firebase';

require('styles/ReportCard.scss');

const config = {
  apiKey: 'AIzaSyBl-pcS2XqyKb-79QuQvsIwsWJ1Zx693i4',
  authDomain: 'detector-de-mentiras-69bb7.firebaseapp.com',
  databaseURL: 'https://detector-de-mentiras-69bb7.firebaseio.com',
  storageBucket: 'detector-de-mentiras-69bb7.appspot.com',
  messagingSenderId: '433947191175'
};
let firebaseDone = false;
class ReportCardComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      userResult: {},
      allScores: [],
      username: '',
      openRow: 999,
      finalScore: 0,
      leaderScore: '...',
      submitted: false
    };

    this.openRow = this.openRow.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.submitToLeaderBoard = this.submitToLeaderBoard.bind(this);
    this.handleFacebookShare = this.handleFacebookShare.bind(this);
    this.handleTwitterShare = this.handleTwitterShare.bind(this);
  }

  componentWillMount() {
    this.getUserScore();
  }

  componentDidMount() {
    this.setupFirebase();
  }

  setupFirebase() {
    if (!firebaseDone) {
      firebase.initializeApp(config);
      firebaseDone = true;
    }
    this.getLeaderBoard();
  }

  componentWillReceiveProps() {
    this.getUserScore();
    this.getLeaderBoard();
  }

  getAllQuestions() {
    return this.props.questions.map((question, index) => {
      let open = false;
      if (this.state.openRow === index) {
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
    this.setState({ openRow: newRow });
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

    // We want the point to be between 1 and 7
    let scaledUserResult = Math.round((totalUserResult / 10 * 6) + 1);
    if (scaledUserResult < 1) scaledUserResult = 1;
    this.setState({ finalScore: scaledUserResult });


    let scoreName = '', shortName = '';
    if (totalUserResult >= maxResult) {
      scoreName = 'Eres un detector excepcional';
      shortName = 'excepcional';
    } else if (totalUserResult >= goodResult) {
      scoreName = 'Eres un detector superior a lo esperado';
      shortName = 'superior';
    } else if (totalUserResult >= averageResult) {
      scoreName = 'Tu resultado podría ser mejor';
      shortName = 'sermejor';
    } else if (totalUserResult >= notSoGoodResult) {
      scoreName = 'Eres un detector inferior a lo esperado';
      shortName = 'inferior';
    } else {
      scoreName = 'Lo sentimos, tu resultado no fue el mejor';
      shortName = 'nofuemejor';
    }

    const point = Math.round((totalUserResult / numberOfResults * 10));
    const userResult = {
      name: scoreName.replace('%s', point),
      shortName: shortName,
      point: point
    };
    this.setState({ userResult });

    if (userResult.point) {
      const messageListRef = firebase.database().ref('scores');
      const newMessageRef = messageListRef.push();
      newMessageRef.set({
        'timestamp': Math.floor(Date.now() / 1000),
        'result': userResult,
        'perQuestion': this.props.data
      });
    }
  }

  getForm() {
    if (this.state.submitted) {
      return (
        <p>Tu nombre ha sido registrado</p>
      )
    } else {
      return (
        <form onSubmit={this.submitToLeaderBoard}>
          <p>Registrate en nuestro top</p>
          <div className="ReportCard__form__group">
            <input type="text" value={this.state.username} onChange={this.handleNameChange} placeholder="Tu nombre" />
            <input type="submit" value="Enviar" />
          </div>
        </form>
      );
    }
  }

  getLeaders() {
    const scores = this.state.allScores;

    if (!scores.length) {
      return (
        <tr>
          <td width="100%">Resultado es cargando</td>
        </tr>
      )
    }

    return scores.map((score, index) => {
      return (
        <tr key={index}>
          <td width="75%">{score.name}</td>
          <td width="25%">{score.result}</td>
        </tr>
      )
    });
  }

  render() {

    const form = this.getForm();
    const leaderboard = this.getLeaders();

    let score = this.state.userResult.point;
    if (score < 0) score = 0;

    return (
      <div className="ReportCard">
        <h3 className="Question__title">Resultado</h3>
        <span><strong>{this.state.userResult.name}</strong></span>
        <p>Tu resultado es {score}/100</p>

        <div className="ReportCard__social row">
            <div className="col-sm-6">
            <h5>¿Quién es el mejor detector de mentiras?</h5>

            <div className="ReportCard__form">
              {form}
            </div>

            <h5>Nosotros top 25</h5>
            <div className="ReportCard__table">
              <table className="table leaderboard-table">
                <thead>
                <tr>
                  <th width="75%">Nombre</th>
                  <th width="25%">Score</th>
                </tr>
                </thead>
              </table>
              <div className="ReportCard__table--scroll">
                <table className="table leaderboard-table">
                  <tbody>
                  {leaderboard}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <h5>Comparte tu resultado en:</h5>
            <div className="row">
              <img
                width="300"
                src={`https://github.com/La-Silla-Vacia/fact-quiz/raw/master/src/images/resultados/${this.state.userResult.shortName}.png`}
                alt={this.state.userResult.name}
                className="col-xs-12"
              />
            </div>
            <footer className="ReportCard__footer">
              <button className="ReportCard__social-btn ReportCard__social-btn--facebook"
                      onClick={this.handleFacebookShare}>Facebook
              </button>
              <button className="ReportCard__social-btn ReportCard__social-btn--twitter"
                      onClick={this.handleTwitterShare}>Twitter
              </button>
            </footer>
          </div>
        </div>

        {this.props.children}
      </div>
    );
  }

  handleNameChange(event) {
    this.setState({ username: event.target.value });
  }

  submitToLeaderBoard(e) {
    e.preventDefault();
    if (!this.state.username) return;
    const messageListRef = firebase.database().ref('leaderboard');
    const newMessageRef = messageListRef.push();
    newMessageRef.set({
      'timestamp': Math.floor(Date.now() / 1000),
      'result': this.state.userResult.point,
      'name': this.state.username
    });

    this.setState({ submitted: true })
  }

  getLeaderBoard() {
    const allScores = [];
    const scoresRef = firebase.database().ref('leaderboard');
    scoresRef.orderByChild('result').limitToLast(25).on('child_added', (snapshot) => {
      allScores.push(snapshot.val());
    });
    this.setState({ allScores: allScores.sort(dynamicSort('result')).reverse() });
  }

  handleTwitterShare(event) {
    event.preventDefault();

    window.open('https://twitter.com/intent/tweet?text=' + this.state.userResult.name + ' en La Silla Vacía! ¿Y Usted?&url=http://lasillavacia.com/detector-de-mentiras',
      '_blank',
      'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450');
  }

  handleFacebookShare(event) {
    event.preventDefault();

    FB.init({
      appId: '707991449304858',
      status: true,
      xfbml: true,
      version: 'v2.4' // or v2.0, v2.1, v2.2, v2.3
    });

    FB.ui({
        // ID de la cuenta de Jerrejerre, cambiar por la de LSV
        //app_id: "866382070105753",
        app_id: '707991449304858',
        method: 'feed',
        link: 'http://lasillavacia.com/detector-de-mentiras',
        picture: `https://github.com/La-Silla-Vacia/fact-quiz/raw/master/src/images/resultados/${this.state.userResult.shortName}.png`,
        name: 'Detector de mentiras - La Silla Vacía'
      },
      function () {
        /*if (response && response.post_id) {
         alert('Post was published.');
         } else {
         alert('Post was not published.');
         }*/
      });
  }
}

function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

ReportCardComponent.displayName = 'ReportCardComponent';
export default ReportCardComponent;
