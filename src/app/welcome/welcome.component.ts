import { Component, OnInit } from '@angular/core';
import { CopyService } from '../services/copy.service';
import { Router} from '@angular/router';

import { AssessmentService } from '../services/assessment.service';
import { AppInsightsService } from '../services/app-insights.service';

const welcomeBanner = require( '../../assets/welcome/welcome-banner.jpg');
const bannerMiddle = require( '../../assets/welcome/welcome-banner-middle.jpg');
const assessImg = require( '../../assets/welcome/assess-summary.jpg');
const resultsImg = require( '../../assets/welcome/screenshot.jpg');

@Component({
    selector: 'welcome',
    templateUrl: './welcome.html'
})
export class WelcomeComponent implements OnInit{
    public banner: any;
    public welcomeGrid: string[];
    public mobilitySummary: any;
    public assessmentSummary: any;
    public resultsSummary: any;

    constructor(
        private copyService: CopyService,
        private assessmentService: AssessmentService,
        private router: Router,
        private appInsights: AppInsightsService
    ) { }

    public ngOnInit(): void {

        this.welcomeGrid = this.copyService.WelcomeCopy.WelcomeGrid;
        this.banner = this.copyService.WelcomeCopy.Banner;
        this.mobilitySummary = this.copyService.WelcomeCopy.MobilitySummary;
        this.assessmentSummary = this.copyService.WelcomeCopy.AssessmentSummary;
        this.resultsSummary = this.copyService.WelcomeCopy.ResultsSummary;
    }

    newAssessment() {
        this.assessmentService.resetAssessment();
        this.router.navigate(['/assessment', 'employees']);
    }

    bannerPath = welcomeBanner;
    middleBannerPath = bannerMiddle;
    assessImgPath = assessImg;
    resultsImgPath = resultsImg;
}
