import { Component, Input } from '@angular/core';

@Component({
  selector: 'word',
  template: require('raw!./word.component.html'),
  styles: [require('raw!./word.component.css')],
  directives: [],
  providers: []
})

export class WordComponent {
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
  

  //Handles the clicks on a letter from the shuffled letters that the user can choose from
  handleLetterClick(l) {
    l.isUsed = true;

    let el = this.guess;

    for(let i = 0; i < this.guess.length; i++) {
      if(!el[i].isUsed) {
        if(el[i].isHint) {
          el[i].isHint = false;
        }

        el[i] = JSON.parse(JSON.stringify(l));
        el[i].isUsed = true;
        el[i].display = true;

        break;
      }
    }

    this.localStorageService.saveToStorage(this.selectedWord, this.word, this.guess);
  }

}
