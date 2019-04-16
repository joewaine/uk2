import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HeaderService } from './header.service';
import { Results } from '../objects/Results';
//import 'rxjs/Rx';
//import {Observable} from 'rxjs';
import { Marketo } from '../objects/Marketo';
//import * as PersonasCopy from '../../data/personas.json';

//Initiate Munchcin
//Munchkin.init($scope.Results._mkt_trk_preprod);


@Injectable()
export class MarketoService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private finalObj: any;
    private bool: Boolean;
    private Results;
    private aadAuth = 'https://uk-devmobilitymaturitydash.azurewebsites.net/api/Marketo/';
    private marketoURL = 'https://cneentityingestionserviceppe.azurewebsites.net/api/lead';

    constructor(
        private http: Http,
        private headerService: HeaderService
    ) { }

    public async PostMarketo(finalObj: any): Promise<Results> {
        this.bool = true;

        console.log(this.headers);
        let headers = new Headers({ 'Content-Type': 'text/text' });
        let options = new RequestOptions({ headers: headers });

        console.log(this.headers);

        return this.http.post(this.aadAuth, JSON.stringify(finalObj), { headers: this.headers })
            .toPromise()
            .then(response => {
                this.Results = response.json() as Results;
                return this.Results;
            })
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body || {};
    }

    private handleError(error: Response): Promise<any> {
        console.error(error); // for demo purposes only
        return Promise.reject(error);
    }

}