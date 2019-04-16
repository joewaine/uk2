import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderService } from '../../services/header.service';
import { Assessment } from '../../objects/Assessment';
import { ChartsModule } from 'ng2-charts';
import { NgxCarousel } from 'ngx-carousel';
import { Results } from '../../objects/Results';

import { AppInsightsService } from '../../services/app-insights.service';
import { AssessmentService } from '../../services/assessment.service';
import { CopyService } from '../../services/copy.service';

@Component({
    selector: 'assess-results',
    templateUrl: './results.html'
})
export class ResultsComponent implements OnInit {
    public Assessment: Assessment;
    public copy: any;
    public currentLevel: string;
    public selectedDevice: string;
    public selectedDeviceCopy: any;
    public percentage: number;
    public selectedDeviceImgs: string[] = [];
    public carousel: NgxCarousel;

    private assessId: number;
    private devices: any;
    private Results: Results;

    constructor(
        private headerService: HeaderService,
        private appInsights: AppInsightsService,
        private assessmentService: AssessmentService,
        private copyService: CopyService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    public isDataAvailable = false;

    ngOnInit() {
       

        this.assessmentService.setPage('results');
        //this.route.params.subscribe((params) => {
        //    if (params['id']) {
        //        this.assessmentService.getAssessmentById(params['id'])
        //            .then((assessment) => {
        //                //console.log(assessment);
        //                this.Assessment = assessment;
        //                this.Results = this.Assessment.Results;
        //                this.isDataAvailable = true;
        //                this.assessmentService.setPage('results');
        //                this.assessmentService.sortNav();
        //                this.getPageData();
        //            });
        //    } else {
               
        //    }
        //});
        this.Assessment = this.assessmentService.Assessment;

        if (this.Assessment === undefined) {
            this.Assessment = this.assessmentService.getStorage(true);
        }

        this.Results = this.Assessment.Results;
        this.isDataAvailable = true;
        this.getPageData();
        this.carousel = {
            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
            slide: 1,
            speed: 400,
            point: {
                visible: true,
                pointStyles: `
                  .ngxcarouselPoint {
                    list-style-type: none;
                    text-align: center;
                    padding: 5%;
                    margin: 0;
                    white-space: nowrap;
                    overflow: auto;
                    position: absolute;
                    width: 100%;
                    top: 75%;
                    left: 0;
                    box-sizing: border-box;
                  }
                  .ngxcarouselPoint li {
                    display: inline-block;
                    border-radius: 999px;
                    background: #fff;
                    padding: 4px;
                    margin: 0 5px;
                    transition: .4s ease all;
                    cursor: pointer;
                  }
                  .ngxcarouselPoint li.active {
                      background: #0078d4;
                  }
                `
            },
            load: 2,
            touch: true,
            loop: false,
            custom: 'banner'
        }
    }

    getPageData() {
        this.copy = this.copyService.Copy.Results;
        this.getDevices();
        this.selectedDevice = this.Results.WinningDevice;
        this.percentage = Math.ceil(this.Results.Percentage);
        this.translateLevel(this.percentage);
        this.selectedDeviceImgs = this.copy.deviceImgs[this.selectedDevice];
        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();
    }

    translateLevel(percent) {
        let floored: number = Math.floor((percent / 10));
        switch (floored) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.currentLevel = 'Lagging';
                break;
            case 6:
                this.currentLevel = 'Following';
                break;
            case 7:
            case 8:
                this.currentLevel = 'Adopting';
                break;
            case 9:
                this.currentLevel = 'Exceeding';
                break;
            case 10:
                this.currentLevel = 'Leading';
                break;
        }
    }

    getDevices() {
        this.devices = this.copyService.getDevices();
        for (let i = 0; i < this.devices.length; ++i) {
            if (this.selectedDevice === this.devices[i].DeviceName) {
                this.selectedDeviceCopy = this.devices[i];
            }
        }
    }

    animate(element, style, unit, from, to, time, prop) {
        if (!element) {
            return;
        }
        var start = new Date().getTime(),
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    element[style] = (from + step * (to - from)) + unit;
                } else {
                    element.style[style] = (from + step * (to - from)) + unit;
                }
                if (step === 1) {
                    clearInterval(timer);
                }
            }, 25);
        element[style] = from + unit;
    }

    scrollTo(id, time) {
        var target = document.getElementById(id);
        this.animate(document.scrollingElement || document.documentElement,
            "scrollTop", "", 0, target.offsetTop, (time * 500), true);
    }

    public prev(): void {
        this.headerService.nextPage('maturity', false);
    }

    public nextLink(path: string): void {
        this.appInsights.trackButtonClick(path);
        if (path === 'new') {
            //this.assessmentService.resetAssessment();
            //this.router.navigate(['/assessment', 'employees']);
            window.open(window.location.origin);
        } else if (path === 'share') {
            location.href = "mailto:?subject=Share%20your%20Modern%20Device%20Assessment%20results%20with%20your%20team%20using%20the%20message%20below&body=Check%20out%20our%20personalized%20results%20from%20the%20Modern%20Device%20Assessment%20here%3A%20See%20our%20score%3A%20https%3A//moderndeviceassessment.azurewebsites.net/assessment/results/" + this.Assessment.GuidId + ".%20%0AThis%20web%20page%20shows%20our%20device%20maturity%20score%20as%20well%20as%20recommendations%20for%20the%20Surface%20device%20that%20best%20meets%20our%20needs.%0A%0AWe%20can%20also%20try%20out%20other%20scenarios%20here%3A%20https%3A//moderndeviceassessment.azurewebsites.net.%0A";
        } else {
            //location.href = "https://support.microsoft.com/en-us/contactus/";
            window.open('https://info.microsoft.com/surface-contactme-en-us', '_blank');
        }
    }
}
