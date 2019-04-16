import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { AzureService } from '../services/azure.service';

@Component({
    selector: 'redirect',
    templateUrl: './redirect.html'
})
export class RedirectComponent implements OnInit {
    constructor(
        //private azure: AzureService,
        private router: Router
    ) { }

    public async ngOnInit(): Promise<void> {
        const code: string = this.getParameterByName('code');
        if (code) {
            //await this.azure.getToken(code);
            this.router.navigate(['/assessment', 'employees']);
        } else {
            this.router.navigate(['']);
        }
    }

    private getParameterByName(name: string, url: string = undefined): string {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}
