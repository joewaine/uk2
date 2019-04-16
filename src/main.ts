import './css/scss/main.scss';
import { enableProdMode } from '@angular/core';
//import { environment } from './environments/environment';

//DEV
//enableProdMode();
/*

*/
//PROD
//console.log(process.env.NODE_ENV);

enableProdMode();

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule);
