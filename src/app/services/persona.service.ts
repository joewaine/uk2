import {Injectable} from '@angular/core';
//import {Http, Response, Headers} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs';
import { Persona } from '../objects/Persona';
import * as PersonasCopy from '../../data/personas.json';



@Injectable()
export class PersonasService {
  public Personas: Persona[];

  constructor() {
    let persona: string = JSON.stringify(PersonasCopy);
    this.Personas = JSON.parse(persona);
  }
}
