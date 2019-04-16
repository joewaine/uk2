import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import AzureToken from '../objects/AzureToken';

@Injectable()
export class AzureService {
    public isLoggedIn: boolean = false;

    private key: string = 'azure-token';
    private token: AzureToken = null;
    private urlBase: string = '';

    constructor(private http: Http) {
        // Check if location is local
        if (window.location.host.indexOf('localhost') > -1) {
            this.urlBase = 'http://localhost:9000/api/Azure';
        } else {
            this.urlBase = 'https://uk-devmobilitymaturitydash.azurewebsites.net/api/Azure';
        }
        this.loadFromStorage();
    }

    public async getToken(code: string): Promise<void> {
        const response: Response = await this.http.put(this.urlBase + '?code=' + code, null).toPromise();
        if (response.ok) {
            this.token = response.json();
            this.isLoggedIn = true;
            localStorage.setItem(this.key, JSON.stringify(this.token));
        } else {
            this.error(response);
        }
    }

    public async login(): Promise<void> {
        if (!this.isLoggedIn) {
            const response: Response = await this.http.get(this.urlBase).toPromise();
            if (response.ok) {
                const url: string = response.json();
                window.location.replace(url);
            } else {
                this.error(response);
            }
        }
    }

    public async logout(): Promise<void> {
        if (this.isLoggedIn) {
            const response: Response = await this.http.delete(this.urlBase).toPromise();
            if (response.ok) {
                const url: string = response.json();
                localStorage.removeItem(this.key);
                window.location.replace(url);
            } else {
                this.error(response);
            }
        }
    }

    private error(response: Response): void {
        // TODO: error handling
    }

    private loadFromStorage(): void {
        const token: AzureToken = JSON.parse(localStorage.getItem(this.key));
        if (token) {
            this.isLoggedIn = true;
            this.token = token;
        }
    }
}
