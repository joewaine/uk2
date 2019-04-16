import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
//import jQuery from 'jquery';
//import MarketoLoader from '../profile/mkto_loaderv2.js';

import { HeaderService } from '../../services/header.service';
import { AssessmentService } from '../../services/assessment.service';
import { MarketoService } from '../../services/marketo.service';
import { CopyService } from '../../services/copy.service';
import { Assessment } from '../../objects/Assessment';
import { Profile } from '../../objects/Profile';
import { Marketo } from '../../objects/Marketo';
import { Countries } from '../../objects/Countries';

import { AppInsightsService } from '../../services/app-insights.service';
//import { AzureService } from '../../services/azure.service';

import * as CountryData from '../../../data/countries.json';
import * as Industries from '../../../data/Industries.json';
import * as CompanySize from '../../../data/company-size.json';
import * as CompanyType from '../../../data/company-type.json';
import * as MarketoData from '../../../data/marketo.json';
import { MarketoUpdated } from '../../../data/marketo-updated';
import { Country } from '../../objects/Country';
import {Capability} from "../../objects/Capability";

declare var Munchkin: any;

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    providers: [MarketoService]
})
export class ProfileComponent implements OnInit {
    public copy: any;
    public Assessment: Assessment;
    public industries: any;
    public companySize: any;
    public companyType: any;
    public showChecks: boolean;
    public countries: any;
    public countriesMarketo: Country[] = MarketoUpdated.countries;

    private marketoData: any;
    //private marketo: Marketo;
    private profile: Profile;

    constructor(
        //public azure: AzureService,
        private appInsights: AppInsightsService,
        private assessmentService: AssessmentService,
        private marketoService: MarketoService,
        private copyService: CopyService,
        private headerService: HeaderService
    ) {
        this.industries = Industries;
        this.companySize = CompanySize;
        this.companyType = CompanyType;
        this.countries = CountryData;
        this.marketoData = MarketoData;
        this.marketoService = marketoService;
        //console.log(jQuery('body'));
    }

    public async ngOnInit(): Promise<void> {
        
        this.Assessment = this.assessmentService.Assessment;

        if (this.Assessment === undefined) {
            this.Assessment = this.assessmentService.getStorage(true);
        }

        if (this.Assessment.Profile === undefined) {
            this.Assessment.Profile = new Profile();
        }

        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();

        this.copy = this.copyService.Copy.Profile;
        this.Assessment.Profile.CompanySize = this.Assessment.Profile.CompanySize || undefined;
        this.Assessment.Profile.CompanyType = this.Assessment.Profile.CompanyType || undefined;

        if (this.Assessment.Profile.Country) {
            for (const country of this.countriesMarketo) {
                if (country.CountryName === this.Assessment.Profile.Country.CountryName) {
                    this.Assessment.Profile.Country = country;
                    break;
                }
            }
        } else {
            this.Assessment.Profile.Country = undefined;
        }

        this.Assessment.Profile.Industry = this.Assessment.Profile.Industry || undefined;
        this.assessmentService.setPage('profile');
        //this.countries.selectedOption = this.countries.availableOptions[0];
        //this.chkEmailOpt = this.countries.selectedOption.LegalOptions.EmailSelectValue === 2;
        //this.chkPhoneOpt = this.countries.selectedOption.LegalOptions.PhoneSelectValue === 2;
        //this.showChecks =  this.countries.selectedOption.LegalOptions.PrivacyRequired;
        //Munchkin.init(this.marketoData.Marketo._mkt_trk);

        //await this.azure.login();
    }

    public prev(): void {
        this.headerService.nextPage('maturity', false);
    }

    public next() {
        this.assessmentService.setStorage();
        this.assessmentService.Assessment = this.Assessment;
        //this.assessmentService.PostAssessment(this.Assessment);
        this.headerService.nextPage('results', false);
    }

    public onSubmit(): void {
        this.appInsights.trackPageSelections('profile', {
            country: JSON.stringify(this.Assessment.Profile.Country),
            companySize: this.Assessment.Profile.CompanySize,
            companyType: this.Assessment.Profile.CompanyType,
            industry: this.Assessment.Profile.Industry,
            jobTitle: this.Assessment.Profile.Title
        });

        //onSubmit(f: NgForm){
        //var _mkt_trk = (<HTMLInputElement>document.getElementById('_mkt_trk')).value;
        //console.log(_mkt_trk);
        let marketo = new Marketo();
        //marketo._mkt_trk = _mkt_trk;
        //this.countries.selectedOption.LegalOptions.EmailSelectValue = 0;
        //this.countries.selectedOption.LegalOptions.EmailSelectValue === 1;
        //if (this.chkEmailOpt){
        //    this.countries.selectedOption.LegalOptions.EmailSelectValue === 2;
        //}
        //this.countries.selectedOption.LegalOptions.PhoneSelectValue === 1;
        //if (this.chkPhoneOpt){
        //    this.countries.selectedOption.LegalOptions.PhoneSelectValue === 2;
        //}

            //public firstName: string;
            //public lastName: string;
            //public title: string;
            //public company: string;
            //public country: string;
            //public phone: string;
            //public email: string;
            //public industry: string;
            //public numberOfEmployees: string;
            //public ce_leadsourcedetail: string;
            //public ce_microsoftpromotionalphonepreference: boolean;
            //public ce_sqlemailpreferencepremiumcontent: boolean;
            //public comments: string;

        marketo.firstName = this.Assessment.Profile.FirstName;
        marketo.lastName = this.Assessment.Profile.LastName;
        marketo.title = this.Assessment.Profile.Title;
        marketo.company = this.Assessment.Profile.CompanyName;
        marketo.country = this.Assessment.Profile.Country.CountryName;
        marketo.phone = this.Assessment.Profile.PhoneNumber;
        marketo.email = this.Assessment.Profile.Email;
        marketo.industry = "n/a";
        marketo.employeeRange = this.Assessment.Profile.CompanySize;
        marketo.ce_LeadSourceDetail = "SurfaceMobileDeviceAssessment";
        marketo.originSystemName = "SurfaceMobileDeviceAssesmentSite";
        marketo.sourceSystemName = "SurfaceMobileDeviceAssesmentSite";

        if (this.Assessment.Profile.Country.LegalOptions.PrivacyRequired === true) {
            if (this.Assessment.Profile.Country.LegalOptions.isChecked === true) {
                marketo.web2Marketo = "SRFC=OKC";
            } else {
                marketo.web2Marketo = "SRFC=";
            }
        } else {
            marketo.web2Marketo = "SRFC=OKC";
        } 
        

        let guid1 = (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) +
            "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
        let guid2 = (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) +
            "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();

        marketo.batchRequestId = guid1;
        marketo.requestItemId = guid2;
        marketo.isAckRequired = false;
        

        console.log(JSON.stringify(marketo))

        this.marketoService.PostMarketo(marketo).then(response => {
            console.log(response);
            this.headerService.nextPage('results', false);
        });
        //marketo.DoLogging = false;
        //marketo.
    }

    public S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    public numbersOnly($event) {
        if (!/[0-9]/.test($event.key)) {
            $event.preventDefault();
        }
    }
}
