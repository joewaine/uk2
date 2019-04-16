import { Component, OnInit } from '@angular/core';

import { CopyService } from '../../services/copy.service';
import { Capability } from '../../objects/Capability';
import { Assessment } from '../../objects/Assessment';
import { HeaderService } from '../../services/header.service';
import { AssessmentService } from '../../services/assessment.service';
import { Results } from '../../objects/Results'

import { AppInsightsService } from '../../services/app-insights.service';
import { skip } from "rxjs/operator/skip";
//import { AzureService } from '../../services/azure.service';

@Component({
    selector: 'assess-maturity',
    templateUrl: './maturity.html'
})
export class MaturityComponent implements OnInit {
    public copy: any;
    public Assessment: Assessment;
    public levelsSelected: number = 0;

    private Results: Results;

    constructor(
        //public azure: AzureService,
        private appInsights: AppInsightsService,
        private assessmentService: AssessmentService,
        private copyService: CopyService,
        private headerService: HeaderService
    ) { }

    public async ngOnInit(): Promise<void> {

        this.copy = this.copyService.Copy.Maturity;
        this.Assessment = this.assessmentService.Assessment;

        if (this.Assessment === undefined) {
            console.log('refresh maturity page');
            this.Assessment = this.assessmentService.getStorage(true);
        }

        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();
        this.assessmentService.setPage('maturity');
        this.updateLevelSelected();

        //await this.azure.login();
    }

    public selectLevel(capability: any, level: any): void {
        // reset header navigation when user changes selection
        this.headerService.clearVisit('maturity');
        capability.LevelSelected = level;
        this.updateLevelSelected();
    }

    public prev(): void {
        this.headerService.nextPage('capabilities', false);
    }

    public next(): void {

        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();
        let results = this.assessmentService.PostResults(this.Assessment);
        this.assessmentService.Results = results;
        this.Assessment.Results = results;
        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();
       // this.assessmentService.PostAssessment(this.Assessment);
        this.headerService.nextPage('results', true);
    }

    private updateLevelSelected(): void {
        this.levelsSelected = (this.Assessment.Capabilities.filter(
            (capability) => {
                return !!capability.LevelSelected;
             })).length;
    }
}
