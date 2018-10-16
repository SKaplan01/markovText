/** Command-line tool to generate Markov text. */

const { MarkovMachine } = require('./markov.js');
const fs = require('fs');
const process = require('process');
const axios = require('axios');

async function makeTextFromFile(path, maxWords) {
  try {
    let text = await fs.promises.readFile(path, 'utf-8');
    let markov = new MarkovMachine(text);
    return console.log(markov.makeText(maxWords));
  } catch (err) {
    console.log(err);
    process.exit(3);
  }
}

function makeTextFromUrl(url, maxWords) {
  axios
    .get(url)
    .then(function(resp) {
      let markov = new MarkovMachine(resp.data);
      return console.log(markov.makeText(maxWords));
    })
    .catch(function(e) {
      if (e) {
        console.log(e);
        process.exit(3);
      }
    });
}

let source = process.argv[3];

if (process.argv[2] === 'file') {
  makeTextFromFile(source, 200);
} else {
  makeTextFromUrl(source, 200);
}
