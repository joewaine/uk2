import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AzureService } from './services/azure.service';

const logo = require('../assets/ms-logo.svg');

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    public name: string = 'Angular';
    public logoPath: any = logo;

    constructor(
        public azure: AzureService,
        private router: Router
    ) { }

    public ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd)) {
                return
            }
            window.scrollTo(0, 0);
        });
    }
}
