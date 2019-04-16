import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/Rx';

import { Assessment } from '../objects/Assessment';
import { CapabilitiesService } from './capabilities.service';
import { HeaderService } from './header.service';
import { Results } from '../objects/Results';
import { Scenario } from '../objects/Scenario';
import { Device } from '../objects/Device';
import { DeviceScore } from '../objects/DeviceScore';
import { Capability } from '../objects/Capability';
//import { Observable } from 'rxjs';
import * as moment from 'moment/min/moment.min';
import * as DeviceData from '../../data/devices.json';

@Injectable()

export class AssessmentService {
    public Assessment: Assessment;
    public Results: Results;
    public fromAdmin = false;

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private navLinks = this.headerService.navLinks;

    constructor(
        private capabilitiesService: CapabilitiesService,
        private http: Http,
        private headerService: HeaderService
    ) { }

    //post assessment to api to generate results
    public PostResults(assessment: Assessment): Results {
        let currentLevels = [];
        let DeviceScores = {};
        let maxScores = [];
        this.Results = new Results();
        for (let device in DeviceData)
        {
            let currentDevice: Device = DeviceData[device];
            let deviceScore: DeviceScore = new DeviceScore();
            deviceScore.label = currentDevice.DeviceName;
            deviceScore.data = [];
            for(let capability in assessment.Capabilities)
            {
                let currentCapability: Capability = assessment.Capabilities[capability];
                let level = currentCapability.LevelSelected.Level;
                let weight = currentDevice.WeightMappings[currentCapability.CapabilityName];

                let score = 3 * (4 - level) * weight;
                deviceScore.data.push(score);
                
            }

            deviceScore.BorderColor = currentDevice.borderColor;
            deviceScore.BackgroundColor = currentDevice.backgroundColor;
            deviceScore.TotalScore = deviceScore.data.reduce((sum, current) => sum + current);
            maxScores.push(Math.max(...deviceScore.data));
            this.Results.DeviceScores.push(deviceScore);
        }

        //loop capabilities to get levels
        for(let capability in assessment.Capabilities)
        {
            let level = assessment.Capabilities[capability].LevelSelected.Level;
            currentLevels.push(level);
        }

        //calculate percentage

        let avgLevel = Math.floor(currentLevels.reduce((sum, current) => sum + current) / currentLevels.length);
        let percentage = (avgLevel / 3) * 100;
        this.Results.Percentage = percentage;
        let FinalLevel = 0;
        if (percentage >= 60) {
            FinalLevel++;
            for (let count = 70; count <= 100; count = count + 10)
            {
                if (percentage >= count) {
                    FinalLevel++;
                }
            }
        }

        this.Results.Level = FinalLevel;
        //scale score to max 100

        //Winning device
        let winningDeviceScore: DeviceScore;
        if (assessment.Scenario.OnTheGo === 'Yes') {
            winningDeviceScore = this.Results.DeviceScores
                .filter(d => d.label === 'Surface Go LTE for Business' || d.label === 'Surface Pro 5 for Business')
                .sort((leftscore, rightscore) => rightscore.TotalScore - leftscore.TotalScore)[0];
        }
        else {
            let highestScore = Math.max(...this.Results.DeviceScores.map((deviceScore) => deviceScore.TotalScore));
            winningDeviceScore = this.Results.DeviceScores.filter((score) => score.TotalScore === highestScore)[0];

            if (winningDeviceScore && winningDeviceScore.label === 'Surface Pro 5 for Business') {
                let secondScore = this.Results.DeviceScores.sort((leftscore, rightscore) => rightscore.TotalScore - leftscore.TotalScore)[1];
                if (secondScore && secondScore.label === 'Surface Pro 6 for Business') {
                    winningDeviceScore = secondScore;
                }
            }

            if (winningDeviceScore && winningDeviceScore.label === 'Surface Go LTE for Business') {
                let secondScore = this.Results.DeviceScores.sort((leftscore, rightscore) => rightscore.TotalScore - leftscore.TotalScore)[1];
                if (secondScore && secondScore.label === 'Surface Go for Business') {
                    winningDeviceScore = secondScore;
                }
            }
        }

        this.Results.WinningDevice = winningDeviceScore.label;
        this.Results.WinningDeviceScore = winningDeviceScore.TotalScore;
        this.Results.MaxScore = Math.max(...maxScores);

        return this.Results;
        //return this.http.post(this.resultsApiUrl, JSON.stringify(assessment), { headers: this.headers })
        //    .toPromise()
        //    .then((response) => {
        //        this.Results = response.json() as Results;
        //        return this.Results;
        //    })
        //    .catch(this.handleError);
    }

    //public PostAssessment(assessment: Assessment): Promise<number> {
    //    if (assessment.CreatedDate === undefined) {
    //        assessment.CreatedDate = moment.utc().toDate();
    //    }
    //    assessment.ModifiedDate = moment.utc().toDate();
    //    this.Assessment.CreatedDate = assessment.CreatedDate;
    //    this.Assessment.ModifiedDate = assessment.ModifiedDate;

    //    return this.http.put(this.assessmentApiUrl, JSON.stringify(assessment), { headers: this.headers })
    //        .toPromise()
    //        .then((response) => {
    //            this.Assessment.GuidId = response.json() as string;
    //            //return this.Results;
    //        })
    //        .catch(this.handleError);
    //}

    //public getAssessmentById(id) {
    //    const getUrl = this.assessmentApiUrl + id;
    //    return this.http.get(getUrl)
    //        .toPromise()
    //        .then((response: Response) => {
    //            const assessment = response.json();
    //            return (assessment);
    //        })
    //        .catch(this.handleError);
    //}

    public setStorage() {
        sessionStorage.setItem('Assessment', JSON.stringify(this.Assessment));
    }

    public getStorage(nav) {
        if (nav) { //pass in boolean to reset the navigation. On employees page, no need to reset naviagtion since they are starting at 0
            this.sortNav();
        }
        let storedAssessment: Assessment = JSON.parse(sessionStorage.getItem('Assessment'));
        return storedAssessment;
    }

    public setPage(page: string) {
        sessionStorage.setItem('CurrentPage', page);
        this.headerService.updatePage(page);
    }

    public sortNav() {
        const currentPage = sessionStorage.getItem('CurrentPage');
        let links = this.headerService.navLinks;
        for (let i = 0; i < links.length; ++i) {
            links[i].active = false;
            links[i].visited = true;
            if (links[i].url === currentPage) {
                links[i].active = true;
                break;
            }
        }
    }

    public clearStorage() {
        sessionStorage.removeItem('CurrentPage');
        sessionStorage.removeItem('Assessment');
        sessionStorage.clear();
    }

    public pickNewPersona(): void {
        if (this.Assessment) {
            this.Assessment.Capabilities = [];
            this.Assessment.Results = new Results();
            this.Assessment.Scenario = new Scenario();
        } else {
            this.Assessment = new Assessment();
        }

        for (let i = 1; i < this.headerService.navLinks.length; ++i) {
            this.headerService.navLinks[i].active = false;
            this.headerService.navLinks[i].visited = false;
        }

        for (const capability of this.capabilitiesService.Capabilities) {
            capability.LevelSelected = 0;
        }
        this.headerService.navLinks[0].active = true;
        sessionStorage.removeItem('CurrentPage');
        sessionStorage.removeItem('Assessment');
    }

    public resetAssessment() {
        this.Assessment = new Assessment();
        this.fromAdmin = false;
        let links = this.headerService.navLinks;
        for (let i = 0; i < links.length; ++i) {
            links[i].active = false;
            links[i].visited = false;
        }
        for (const capability of this.capabilitiesService.Capabilities) {
            capability.LevelSelected = 0;
        }
        links[0].active = true;
        sessionStorage.removeItem('CurrentPage');
        sessionStorage.removeItem('Assessment');
    }

    private handleError(error: Response): Promise<any> {
        //console.error(error); // for demo purposes only
        return Promise.reject(error);
    }
}
