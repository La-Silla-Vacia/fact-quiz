require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import VoteButton from './VoteButtonComponent';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <h2>La Silla Vacías Fact Quiz</h2>
        <VoteButton/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
