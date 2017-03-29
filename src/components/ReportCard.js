'use strict';

import React from 'react';

require('styles/ReportCard.scss');

const resultImages = [
  require('../images/resultados/1.png'),
  require('../images/resultados/2.png'),
  require('../images/resultados/3.png'),
  require('../images/resultados/4.png'),
  require('../images/resultados/5.png'),
  require('../images/resultados/6.png'),
  require('../images/resultados/7.png')
];

class ReportCardComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      userResult: {},
      openRow: 999,
      finalScore: 0
    };

    this.openRow = this.openRow.bind(this);
    this.handleFacebookshare = this.handleFacebookshare.bind(this);
  }

  componentWillMount() {
    this.getUserScore();
  }

  componentWillReceiveProps() {
    this.getUserScore();
  }

  getAllQuestions() {
    return this.props.questions.map((question, index) => {
      let open = false;
      if (this.state.openRow == index) {
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


    let scoreName = '';
    if (totalUserResult >= maxResult) {
      scoreName = 'Eres un detector excepcional';
    } else if (totalUserResult >= goodResult) {
      scoreName = 'Eres un detector superior a lo esperado';
    } else if (totalUserResult >= averageResult) {
      scoreName = 'Tu resultado podría ser mejor';
    } else if (totalUserResult >= notSoGoodResult) {
      scoreName = 'Eres un detector inferior a lo esperado';
    } else {
      scoreName = 'Lo sentimos, tu resultado no fue el mejor';
    }

    const point = Math.round((totalUserResult / numberOfResults * 10));
    const userResult = {
      name: scoreName.replace('%s', point),
      point: point
    };
    this.setState({ userResult });
  }

  render() {
    return (
      <div className="ReportCard">
        <h3 className="Question__title">Resultado</h3>
        <span><strong>{this.state.userResult.name}</strong></span>

        {/*<img src={} alt={this.state.userResult.name} />*/}
        <h5>Comparte tu resultado</h5>
        <button onClick={this.handleFacebookshare}>Facebook</button>
      </div>
    );
  }

  handleFacebookshare(event) {
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
        app_id: "707991449304858",
        method: 'feed',
        link: 'http://lasillavacia.com/detector-de-mentiras',
        picture: '',
        name: 'Detector de mentiras - La Silla Vacia'
      },
      function (response) {
        /*if (response && response.post_id) {
         alert('Post was published.');
         } else {
         alert('Post was not published.');
         }*/
      });
  }
}

ReportCardComponent.displayName = 'ReportCardComponent';
export default ReportCardComponent;
