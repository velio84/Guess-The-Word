import { Component, Input } from '@angular/core';

@Component({
  selector: 'guess',
  template: require('raw!./guess.component.html'),
  styles: [require('raw!./guess.component.css')],
  directives: [],
  providers: []
})

export class GuessComponent {
  @Input()
  selectedWord: string;

  @Input()
  word: Array<any>;

  @Input()
  guess: Array<any>;

  @Input()
  wordService;

  @Input()
  localStorageService;


  constructor() {}


  //Handles the clicks on the guess word and removes the lastly selected word
  handleGuessClick(g) {
    let reversedGuess = this.guess.reverse();

    for(let i = 0; i < reversedGuess.length; i++) {
      if(reversedGuess[i].isUsed) {

        if(reversedGuess[i].isHint) {
          reversedGuess[i].isHint = false;
          this.wordService.toggleHintButton('enable');
        }

        reversedGuess[i].isUsed = false;
        reversedGuess[i].display = false;

        this.word.forEach(w => {
          if(w.index === reversedGuess[i].index) {
            if(w.isHint) {
              w.isHint = false;
            }

            w.isUsed = false;
            w.display = false;
          }
        });

        break;
      }
    }

    this.guess = reversedGuess.reverse();

    this.localStorageService.saveToStorage(this.selectedWord, this.word, this.guess);
  }
}
