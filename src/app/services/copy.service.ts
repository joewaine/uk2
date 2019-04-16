import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import { Capabilities } from '../objects/Capabilities';
import * as Copy from '../../data/copy.json';
import * as WelcomeCopy from '../../data/Welcome.json';
import * as DeviceData from '../../data/devices.json';
//const Copy = '../../data/copy.json';

@Injectable()

export class CopyService {
    public Copy: any;
    public WelcomeCopy: any;
    public DeviceCopy: any;

    private getDeviceUrl = 'https://uk-devmobilitymaturitydash.azurewebsites.net/api/Device/'; //Dev
    //'https://ukqamobilitymaturitywebapp20190405090128.azurewebsites.net'// QA;

    constructor(private http: Http) {
        this.Copy = Copy;
        this.WelcomeCopy = WelcomeCopy;
    }

    public getDevices(): any {
        return DeviceData;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
