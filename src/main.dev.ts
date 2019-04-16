import './css/scss/main.scss';
import { enableProdMode } from '@angular/core';

console.log(process.env.NODE_ENV);

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
//import * as Bluebird from 'bluebird';
//Bluebird.config({
//    warnings: {
//        wForgottenReturn: false
//    }
//});

platformBrowserDynamic().bootstrapModule(AppModule);
