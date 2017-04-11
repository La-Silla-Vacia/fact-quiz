import React from 'react';

export default class SingleCheck extends React.Component {
  constructor() {
    super();
  }

  render() {
    const {explicacion, quote, score} = this.props;

    const results = [
      {
        'name': 'Cierto',
        'value': 1
      },
      {
        'name': 'Cierto pero',
        'value': 2
      },
      {
        'name': 'Apresurado',
        'value': 3
      },
      {
        'name': 'Debatible',
        'value': 4
      },
      {
        'name': 'Exagerado',
        'value': 5
      },
      {
        'name': 'Engañoso',
        'value': 6
      },
      {
        'name': 'Falso',
        'value': 7
      },
      {
        'name': 'Inchequeable',
        'value': 8
      },
      {
        'name': 'Inchequeable',
        'value': 9
      }
    ];

    // console.log(results);
    // console.log(score);

    const formattedResult = results[score - 1];
    let formattedScore;
    if (formattedResult) {
      formattedScore = formattedResult.name;
    }

    return(
      <div className="article-checked">
        <div className="checked">
          <div className="left-container col-sm-5">
            <p>{quote}</p>
          </div>

          <div className="right-container col-sm-7">
            <div className="check">{formattedScore}</div>

            <div className="clearfix">&nbsp;</div>

            <div dangerouslySetInnerHTML={{__html: explicacion}} />
          </div>
        </div>

        <div className="clearfix">&nbsp;</div>
      </div>
    );
  }
}
