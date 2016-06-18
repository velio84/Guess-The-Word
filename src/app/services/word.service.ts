import { Injectable } from '@angular/core';

@Injectable()
export class WordService {

  // Helper functions

  trimWord(word) {
    const regex: RegExp = /[A-z]\w+/;

    return regex.exec( word.trim() )[0].toUpperCase();
  }

  replaceWordWithDashes(str) {
    const regex = /[A-z]/g;

    return str.replace(regex, '_');
  }

  // Takes a word, transforms each letter as an object with properties
  // Returns an array with each letter as an object
  generateLetterObjectsArray(word) {
    let arr = [];

    this.trimWord(word).split('').map( (c, index) => {
      let obj = {};
      obj['char'] = c;
      obj['index'] = index;
      obj['isUsed'] = false;
      obj['isHint'] = false;
      obj['display'] = false;

      arr.push(obj);
    });

    return arr;
  }

  // Takes an array and shuffles it's content
  randomizeArray(arr) {
    let currentIndex = arr.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }

    return arr;
  }

  // Takes an array as the ones above and returns a string
  arrayToString(arr) {
    let str = arr.map(g => {
      if(g.isUsed) {
        return g.char;
      }
    }).join('').trim();

    return str;
  }

  // Enables and disables the 'Hint' button
  toggleHintButton(state) {
    if(state === 'disable') {
      document.getElementById('hint-button').setAttribute('disabled', 'disabled');
      return;
    }

    document.getElementById('hint-button').removeAttribute('disabled');
  }
}
