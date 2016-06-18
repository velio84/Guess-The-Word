// Polyfills
// These modules are what's in angular 2 bundle polyfills so don't include them
// import 'es6-shim';
// import 'es6-promise';
// import 'reflect-metadata';

// CoreJS has all the polyfills you need

import 'core-js';
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');






// Vendors

// Angular 2
import '@angular/platform-browser-dynamic';
import '@angular/platform-browser';
import '@angular/core';
import '@angular/http';
import '@angular/router-deprecated';


// RxJS 5
// import 'rxjs/Rx';


// For vendors for example jQuery, Lodash, angular2-jwt import them here
// Also see src/typings.d.ts as you also need to run `typings install x` where `x` is your module





// App
import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';

import {MainComponent} from './app/main.component';


// enableProdMode()

bootstrap(MainComponent, [
    HTTP_PROVIDERS
])
.catch(err => console.error(err));
