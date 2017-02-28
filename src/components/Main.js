/*global sillaInteractiveData */

require('styles/App.scss');

import React from 'react';
import Question from './Question';

class AppComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      currentQuestionIndex: 0,
      error: false,
      questions: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    let dataExists = true;
    try {
      if (sillaInteractiveData)
        dataExists = true;
    } catch(e) {
      dataExists = false;
    }
    if (!dataExists) {
      this.setState({error: 'Error: No se pudieron encontrar los datos de la pregunta.'});
      return;
    }

    this.setState({questions: sillaInteractiveData.data});
  }

  render() {

    let error = '';
    if (this.state.error) {
      error = (<h3>{this.state.error}</h3>)
    }

    const question = this.state.questions[this.state.currentQuestionIndex];
    return (
      <div className="index">
        <h2 className="index__title">La Silla's Fact Quiz</h2>
        {error}
        <Question {...question} />
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
