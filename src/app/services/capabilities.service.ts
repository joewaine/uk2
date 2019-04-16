import {Injectable} from '@angular/core';
//import {Http, Response, Headers} from '@angular/http';
import 'rxjs/Rx';
import { Capability } from '../objects/Capability';
import * as CapabilitiesCopy from '../../data/capabilities.json';


@Injectable()

export class CapabilitiesService {
  public Capabilities: Capability[];

  constructor() {
      let capabilities: string = JSON.stringify(CapabilitiesCopy);
      this.Capabilities = JSON.parse(capabilities);// CapabilitiesCopy;
  }

  //private getCapabilitiesUrl = '/src/data/Capabilities.json';  // URL to web api

}
