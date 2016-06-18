import { Component, OnInit } from '@angular/core';

import { WordComponent } from './components/word-component/word.component';
import { GuessComponent } from './components/guess-component/guess.component';

import { WordService } from './services/word.service';
import { LocalStorageService } from './services/local-storage.service';
import { UrlService } from './services/url.service';


@Component({
  selector: 'app',
  providers: [WordService, UrlService, LocalStorageService],
  pipes: [],
  directives: [WordComponent, GuessComponent],
  template: require('raw!./main.component.html'),
  styles: [require('raw!./main.component.css')]
})

export class MainComponent implements OnInit {

  // The word that the user clicked on
  selectedWord: string;

  // Same word as above but into array and each letter as object with properties
  word: Array<any> = [];

  // Selected word array with shuffled letters
  randomizedWord: Array<any> = [];

  // Letters that the user chooses in order to guess the word
  guessWord: Array<any> = [];

  // The message that will show the guess percentage
  sysMessage: string = '';


  constructor(
    private wordService: WordService,
    private urlService: UrlService,
    private localStorageService: LocalStorageService
  ) {}



  //Handles the clicks on a word from the paragraph and sets that word as a word to guess
  handleSelectWord(e, word) {
    let regex = /_/;
    let el = document.getElementById('text');
    let paragraph = document.getElementById('text').innerText;

    if(word) {
      //Get from LocalStorage
      let storageWord = this.localStorageService.getFromStorage(word);

      this.selectedWord = word;
      this.randomizedWord = JSON.parse(JSON.stringify(storageWord.randomizedWord));
      this.guessWord = JSON.parse(JSON.stringify(storageWord.guessWord));


      // Gets a snapshot of the paragraph with the correct ____ word from the LocalStorage
      let snapShot = this.localStorageService.getFromStorage('text');
      el.innerHTML = snapShot;


      // When there is a word in the URL, checks if a Hint is used and disables the button
      this.guessWord.forEach(g => {
        if(g.isHint) {
          setTimeout(() => {
              this.wordService.toggleHintButton('disable');
          }, 200);
        }
      });

    } else {

      if(e.target.nodeName !== 'SPAN') {
        return false;
      }

      this.selectedWord = e.target.innerText.trim();

      if ( !regex.test(this.selectedWord) && !regex.test(paragraph) ) {

        this.urlService.setUrl(this.selectedWord);

        e.target.innerText = this.wordService.replaceWordWithDashes(this.selectedWord);

        // Creates a snapshot of the paragraph with the guess word as ____
        let snapShot = document.getElementById('text').innerHTML;
        this.localStorageService.saveTextToStorage(snapShot);

        this.word = this.wordService.generateLetterObjectsArray(this.selectedWord);
        this.randomizedWord = this.wordService.randomizeArray(this.word);

        this.guessWord = JSON.parse(JSON.stringify(this.word));


        // Save to LocalStorage
        this.localStorageService.saveToStorage(this.selectedWord, this.randomizedWord, this.guessWord);
      }
    }
  }


  // Handles the click of the 'Hint' button (it can be refactored quite a bit :))
  handleHintBtn() {

    // Gets the number of unused letter that can be used as a Hint
    let unusedLetters = [];
    this.randomizedWord.map(w => {
      if(!w.isUsed) {
        unusedLetters.push(w);
      };
    });

    if(unusedLetters.length === 0) {
      return false;
    }

    // Randomly chooses one of the available letters as a hint
    let randomIndex = Math.floor((Math.random() * unusedLetters.length));
    let hintLetter = unusedLetters[randomIndex];

    // Some magic
    if(this.guessWord[hintLetter.index].isUsed) {
      this.guessWord[hintLetter.index].isUsed = false;
      this.guessWord[hintLetter.index].display = false;

      this.randomizedWord.forEach(w => {
        if(w.index === this.guessWord[hintLetter.index].index) {
          w.isUsed = false;
        }
      });
    }

    this.guessWord[hintLetter.index] = JSON.parse(JSON.stringify(hintLetter));
    this.guessWord[hintLetter.index].display = true;
    this.guessWord[hintLetter.index].isHint = true;
    this.guessWord[hintLetter.index].isUsed = true;


    this.randomizedWord.forEach(w => {
      if(w.index === hintLetter.index) {
        w.isUsed = true;
        w.isHint = true;
      }
    });

    this.wordService.toggleHintButton('disable');

    this.localStorageService.saveToStorage(this.selectedWord, this.randomizedWord, this.guessWord);
  }


  // Handles the click of the 'Check' button
  handleCheckBtn() {

    let word = this.wordService.trimWord(this.selectedWord);
    let guess = this.wordService.arrayToString(this.guessWord);

    let totalLetters = word.length;
    let matches = 0;

    // Success
    if(word === guess) {
      this.sysMessage = 'You are 100% correct!'

      this.localStorageService.clearStorage();

      setTimeout(() => {
        this.sysMessage = '';
        window.location.href = window.location.origin;
      }, 3000);

      return;
    }

    // Calculate percents
    word.split('').forEach( (l, i) => {
      if (l === guess[i]) {
        matches++;
      }
    });

    let percents = (matches / totalLetters * 100).toFixed(0);

    this.sysMessage = `You are ${percents}% correct!`;

    setTimeout(() => {
      this.sysMessage = '';
    }, 2000);
  }


  ngOnInit() {
    let hash = this.urlService.getUrl();

    if(hash === '') {
      return;
    }

    hash = hash.replace('#', '');
    if( this.localStorageService.checkStorage(hash) ) {
      this.handleSelectWord(null, hash);
    }
  }

}
