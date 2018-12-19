import _ from 'lodash';

const uuid = require('uuid').v4;

export class Directive {
  constructor({ namespace, name, payload }) {
    this.header = {
      messageId: uuid(),
      namespace,
      name,
    };
    this.payload = payload;
  }
}

export function audioDirective(url) {
  const episodeId = Math.floor(Math.random() * 1000);
  return new Directive({
    namespace: 'AudioPlayer',
    name: 'Play',
    payload: {
      audioItem: {
        audioItemId: uuid(),
        stream: {
          beginAtInMilliseconds: 0,
          playType: 'NONE',
          token: uuid(),
          url,
          urlPlayable: true,
        },
        type: 'custom',
      },
      playBehavior: 'REPLACE_ALL',
      source: {
        logoUrl: '',
        name: '소리 시리즈',
      },
    },
  });
}

export class CEKResponse {
  constructor() {
    console.log('CEKResponse constructor');
    this.response = {
      directives: [],
      shouldEndSession: true,
      outputSpeech: {},
      card: {},
    };
    this.version = '0.1.0';
    this.sessionAttributes = {};
  }

  addDirective(directive) {
    this.response.directives.push(directive);
    return this;
  }

  setMultiturn(sessionAttributes) {
    this.response.shouldEndSession = false;
    this.sessionAttributes = _.assign(
      this.sessionAttributes,
      sessionAttributes,
    );
    return this;
  }

  clearMultiturn() {
    this.response.shouldEndSession = true;
    this.sessionAttributes = {};
    return this;
  }

  setSimpleSpeechText(outputText) {
    this.response.outputSpeech = {
      type: 'SimpleSpeech',
      values: {
        type: 'PlainText',
        lang: 'ko',
        value: outputText,
      },
    };
    return this;
  }

  appendSpeechText(outputText) {
    const { outputSpeech } = this.response;
    if (outputSpeech.type !== 'SpeechList') {
      outputSpeech.type = 'SpeechList';
      outputSpeech.values = [];
    }
    if (typeof outputText === 'string') {
      outputSpeech.values.push({
        type: 'PlainText',
        lang: 'ko',
        value: outputText,
      });
    } else {
      outputSpeech.values.push(outputText);
    }
    return this;
  }
}
