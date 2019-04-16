import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CopyService } from '../../services/copy.service';
import { PersonasService } from '../../services/persona.service';
import { AssessmentService } from '../../services/assessment.service';
import { HeaderService } from '../../services/header.service';
import { Persona } from '../../objects/Persona';
import { Assessment } from '../../objects/Assessment';
import { AssertionError } from 'assert';
import { AssessmentComponent } from '../assessment.component';

import { AppInsightsService } from '../../services/app-insights.service';
//import { AzureService } from '../../services/azure.service';

@Component({
    selector: 'assess-employees',
    templateUrl: './employees.html'
})
export class EmployeesComponent implements OnInit {
    public Assessment: Assessment;
    public copy: any;
    public personas: Persona[];
    public isDataAvailable = false;

    private selectedEmployee: {};

    constructor(
        //public azure: AzureService,
        private appInsights: AppInsightsService,
        private assessmentService: AssessmentService,
        private copyService: CopyService,
        private personasService: PersonasService,
        private router: Router,
        private headerService: HeaderService,
        private route: ActivatedRoute
    ) { }

    public async ngOnInit(): Promise<void> {
        

        this.assessmentService.setPage('employees');
        this.copy = this.copyService.Copy.Employee;
        this.personas = this.personasService.Personas;
        //this.route.params.subscribe((params) => {
        //    if (params['GuId']) {
        //        console.log('from admin');
        //        this.assessmentService.fromAdmin = true;
        //        this.assessmentService.getAssessmentById(params['GuId'])
        //            .then((assessment) => {
        //                this.isDataAvailable = true;
        //                console.log(assessment);
        //                this.Assessment = assessment;
        //            })
        //            .catch(this.handleError);
        //    } else {
        //        //this.assessmentService.clearStorage();
        //       
        //    }
        //});
        this.isDataAvailable = true;
        this.checkStorage();

        //await this.azure.login();
    }

    private handleError(error: Response): Promise<any> {
        console.error(error); // for demo purposes only
        return Promise.reject(error);
    }

    public checkStorage(): void {
        let data: Assessment = this.assessmentService.getStorage(false);
        if (this.assessmentService.Assessment !== undefined) {
            this.Assessment = this.assessmentService.Assessment;
        } else if (data) {
            this.Assessment = data;
        } else {
            this.Assessment = new Assessment();
        }
        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();
    }

    public selectEmployee(employee: Persona): void {
        const isDifferentEmployee: boolean = this.Assessment.Persona &&
            employee.PersonaName !== this.Assessment.Persona.PersonaName;

        this.Assessment.Persona = employee;
        this.assessmentService.Assessment = this.Assessment;

        if (isDifferentEmployee) {
            this.assessmentService.pickNewPersona();
        }

        //this.assessmentService.PostAssessment(this.Assessment);
        //this.assessmentService.setStorage();
        //this.headerService.nextPage('scenario', false);
    }

    showMore(persona) {
        persona.ShowMore = !persona.ShowMore;
    }

    public next(): void {
        this.appInsights.trackPageSelections('employees', {
            personaName: this.Assessment.Persona.PersonaName
        });

        this.assessmentService.setStorage();
        this.assessmentService.Assessment = this.Assessment;
        //this.assessmentService.PostAssessment(this.Assessment);
        this.headerService.nextPage('scenario', false);
    }
}
