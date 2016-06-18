import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private storage: any;

  constructor() {
    this.storage = localStorage;
  }



  saveToStorage(key, word, guess) {
    this.storage[key] = JSON.stringify({
      randomizedWord: word,
      guessWord: guess
    });
  }

  saveTextToStorage(text) {
    this.storage.text = JSON.stringify(text);
  }

  getFromStorage(key) {
    return JSON.parse(this.storage[key]);
  }

  checkStorage(key) {
    if (!this.storage[key]) {
      return false;
    }

    return true;
  }

  clearStorage() {
    this.storage.clear();
  }
}
