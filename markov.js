/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== '');
    this.makeChains();
    this.sentenceStarters = words
      .map(function(word, i, arr) {
        if (i === 0 || (i > 0 && words[i - 1].endsWith('.'))) {
          return word + ' ' + arr[i + 1];
        }
      })
      .filter(word => word);
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "hat": [null]} */

  makeChains() {
    let chains = {};
    for (let i = 0; i < this.words.length; i++) {
      let currentBigram = this.words[i] + ' ' + this.words[i + 1];
      if (chains[currentBigram]) {
        chains[currentBigram].push(this.words[i + 2]);
      } else {
        chains[currentBigram] = [this.words[i + 2]];
      }
    }
    return chains;
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    let chains = this.makeChains();
    let txt = '';
    let max = this.sentenceStarters.length;
    let startWord = this.sentenceStarters[Math.floor(Math.random() * max)];
    txt += startWord;
    var currentWord = startWord;
    for (let i = 0; i < numWords; i++) {
      if (currentWord) {
        let wordListLen = chains[currentWord].length;
        let nextWord =
          chains[currentWord][Math.floor(Math.random() * wordListLen)];
        if (nextWord === undefined) {
          break;
        }
        txt += ' ';
        txt += nextWord;
        let bigram = currentWord.split(' ')[1] + ' ' + nextWord;
        currentWord = bigram;
      }
    }
    let endIndex;
    for (let i = txt.length; i > 0; i--) {
      if (txt[i] === '.') {
        endIndex = i + 1;
        break;
      }
    }
    return txt.slice(0, endIndex);
  }
}

// let x = new MarkovMachine('The cat in the hat is awesome! So give me a cat');
// console.log(x.makeText());

module.exports = {
  MarkovMachine
};
