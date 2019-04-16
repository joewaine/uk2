import { Component, OnInit, Renderer, TrackByFunction } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CopyService } from '../../services/copy.service';
import { HeaderService } from '../../services/header.service';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../objects/Assessment';
import { Scenario } from '../../objects/Scenario';

import { AppInsightsService } from '../../services/app-insights.service';
import {Capability} from "../../objects/Capability";
//import { AzureService } from '../../services/azure.service';

@Component({
    selector: 'assess-scenario',
    templateUrl: './scenario.html'
})
export class ScenarioComponent implements OnInit {
    public copy: any;
    public Assessment: Assessment;
    public scenario: Scenario;

    constructor(
        //public azure: AzureService,
        private appInsights: AppInsightsService,
        private assessmentService: AssessmentService,
        private copyService: CopyService,
        private renderer: Renderer,
        private headerService: HeaderService,
        private router: Router
    ){}

    public async ngOnInit(): Promise<void> {
        

        this.Assessment = this.assessmentService.Assessment;

        if (this.Assessment === undefined) {
            this.Assessment = this.assessmentService.getStorage(true);
        }

        this.copy = this.copyService.Copy.Scenario;
        this.checkStorage();
        this.assessmentService.setPage('scenario');

        //await this.azure.login();
    }

    public checkStorage(): void {
        if(this.Assessment === undefined){
            console.log('refresh scenario page');
            this.Assessment = this.assessmentService.getStorage(true);
            this.scenario = this.Assessment.Scenario;
        }else if(this.Assessment.Scenario.hasOwnProperty('MobileDevice')){
            this.scenario = this.Assessment.Scenario;
        }else{
            this.scenario = new Scenario();
        }
        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();
    }

    selectValue(question, answer){
        // reset header navigation when user changes selection
        this.headerService.clearVisit('scenario');
        this.scenario[question.id] = answer;
    }

    public onSubmit(): void {
        this.appInsights.trackPageSelections('scenario', {
            scenario: JSON.stringify(this.Assessment.Scenario)
        });

        this.Assessment.Scenario = this.scenario;
        this.assessmentService.Assessment = this.Assessment;
        //this.assessmentService.PostAssessment(this.Assessment);
        this.assessmentService.setStorage();
        this.headerService.nextPage('capabilities', false);
    }

    public prev(): void {
        this.headerService.nextPage('employees', false);
    }

    public next() {
        this.assessmentService.setStorage();
        this.assessmentService.Assessment = this.Assessment;
        //this.assessmentService.PostAssessment(this.Assessment);
        this.headerService.nextPage('capabilities', false);
    }
}
