import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import * as Copy from '../../data/copy.json';

@Injectable()

export class HeaderService {
    public navLinks: any;

    private copyUrl: string = '/src/data/Copy.json';

    constructor(
        private http: Http,
        private router: Router
    ) {
        this.navLinks = Copy['NavLinks'];
    }

    public clearVisit(pageName: string): void {
        let isPrecedingPage: boolean = true;
        for (let i: number = 0; i < this.navLinks.length; ++i) {
            this.navLinks[i].visited = isPrecedingPage;
            if (isPrecedingPage && this.navLinks[i].url === pageName) {
                isPrecedingPage = false;
            }
        }
    }

    public routePage(url: string, visited: boolean): void {
        if (visited) {
            for (let i = 0; i < this.navLinks.length; ++i) {
                this.navLinks[i].active = this.navLinks[i].url === url;
            }
            this.router.navigate(['/assessment', url]);
        }
    }

    public updatePage(page: string): void {
        for (let i = 0; i < this.navLinks.length; ++i) {
            this.navLinks[i].active = this.navLinks[i].url === page;
            this.navLinks[i].visited = this.navLinks[i].visited || this.navLinks[i].active;
        }
    }

    prevPage(url) {
        for (let i = 0; i < this.navLinks.length; ++i) {
            this.navLinks[i].active = false;
            if (this.navLinks[i].url === url) {
                this.navLinks[i].active = true;
            }
        }
        this.router.navigate(['/assessment', url]);
    }

    nextPage(url, skip) {
        for (let i = 0; i < this.navLinks.length; ++i) {
            this.navLinks[i].active = false;
            if (this.navLinks[i].url === url) {
                if (skip) {
                    if (this.navLinks[(i - 2)]) {
                        this.navLinks[(i - 2)].visited = true;
                    }
                } else if (this.navLinks[(i - 1)]) {
                    this.navLinks[(i - 1)].visited = true;
                }
                this.navLinks[i].active = true;
            }
        }
        this.router.navigate(['/assessment', url]);
    }
}
