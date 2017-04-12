import React from 'react';
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

// Remember old renderer, if overriden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

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

    let formattedExplicacion = explicacion;
    // if (typeof explicacion === 'string') {
    if (explicacion) {
      if (!formattedExplicacion.includes('Explicacion:') && !formattedExplicacion.includes('<p>')) {
        formattedExplicacion = '**Explicacion:** ' + formattedExplicacion;
      }
    }
    if (typeof explicacion === 'string' && !formattedExplicacion.includes('<p>')) {
      formattedExplicacion = md.render(formattedExplicacion);
    }

    return(
      <div className="article-checked">
        <div className="checked">
          <div className="left-container col-sm-5" dangerouslySetInnerHTML={{__html: md.render(quote)}} />

          <div className="right-container col-sm-7">
            <div className="check">{formattedScore}</div>

            <div className="clearfix">&nbsp;</div>

            <div dangerouslySetInnerHTML={{__html: formattedExplicacion}} style={{fontSize: '14px'}} />
          </div>
        </div>

        <div className="clearfix">&nbsp;</div>
      </div>
    );
  }
}
