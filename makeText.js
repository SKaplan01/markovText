/** Command-line tool to generate Markov text. */

const { MarkovMachine } = require('./markov.js');
const fs = require('fs');
const process = require('process');
const axios = require('axios');

async function makeTextFromFile(paths, maxWords) {
  try {
    let text = '';
    for (let i = 0; i < paths.length; i++) {
      text += await fs.promises.readFile(paths[i], 'utf-8');
    }

    //OLD WAY
    // let text = await fs.promises.readFile(path, 'utf-8');

    let markov = new MarkovMachine(text);
    return console.log(markov.makeText(maxWords));
  } catch (err) {
    console.log(err);
    process.exit(3);
  }
}

function makeTextFromUrl(urls, maxWords) {
  let promises = [];
  let text = '';
  for (let i = 0; i < urls.length; i++) {
    promises.push(axios.get(urls[i]));
  }
  Promise.all(promises)
    .then(function(resp) {
      for (let j = 0; j < resp.length; j++) {
        text += resp[j].data;
      }
      let markov = new MarkovMachine(text);
      return console.log(markov.makeText(maxWords));
    })
    .catch(function(e) {
      if (e) {
        console.log(e);
        process.exit(3);
      }
    });
}

if (process.argv[2] === 'file') {
  let args = [];
  for (let i = 3; i < process.argv.length; i++) {
    args.push(process.argv[i]);
  }
  makeTextFromFile(args, 200);
} else {
  let args = [];
  for (let i = 3; i < process.argv.length; i++) {
    args.push(process.argv[i]);
  }
  makeTextFromUrl(args, 200);
}
