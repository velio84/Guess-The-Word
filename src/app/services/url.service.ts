import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {

  constructor() { }

  getUrl() {
    let url = window.location.hash;
    //url.replace('#', '');

    return url;
  }

  setUrl(link) {
    let url = window.location.origin + '#' + link;

    window.location.replace(url);
  }
}
