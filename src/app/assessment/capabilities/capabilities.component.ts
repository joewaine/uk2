import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CopyService } from '../../services/copy.service';
import { CapabilitiesService } from '../../services/capabilities.service';
import { PersonasService } from '../../services/persona.service';
import { AssessmentService } from '../../services/assessment.service';
import { HeaderService } from '../../services/header.service';
import { Capability } from '../../objects/Capability';
import { Assessment } from '../../objects/Assessment';

import { AppInsightsService } from '../../services/app-insights.service';
//import { AzureService } from '../../services/azure.service';

@Component({
    selector: 'assess-capabilities',
    templateUrl: './capabilities.html'
})
export class CapabilitiesComponent {
    public copy: any;
    public capabilities: Capability[];
    public Assessment: Assessment;
    public showError = false;

    constructor(
        //public azure: AzureService,
        private appInsights: AppInsightsService,
        private assessmentService: AssessmentService,
        private copyService: CopyService,
        private capabilitiesService: CapabilitiesService,
        private personasService: PersonasService,
        private headerService: HeaderService,
        private router: Router
    ) { }

    public async ngOnInit(): Promise<void> {

        this.copy = this.copyService.Copy.Capabilities;
        this.Assessment = this.assessmentService.Assessment;

        if (this.Assessment === undefined) {
            console.log('refresh cap page');
            this.Assessment = this.assessmentService.getStorage(true);
        }

        this.assessmentService.Assessment = this.Assessment;
        this.assessmentService.setStorage();

        this.capabilities = this.capabilitiesService.Capabilities;
        this.getCapabilities();
        this.assessmentService.setPage('capabilities');

        //await this.azure.login();
    }

    getCapabilities() {
        this.getRecommendedCapabilities();
        this.getSelectedCapabilities();
    }

    getSelectedCapabilities() {
        const prevSelectedCapabilities = this.Assessment.Capabilities;
        if (prevSelectedCapabilities.length > 0) {
            for (let capability in this.capabilities) {
                for (let i = 0; i < prevSelectedCapabilities.length; ++i) {
                    if (this.capabilities[capability].CapabilityName === prevSelectedCapabilities[i].CapabilityName) {
                        this.capabilities[capability].Selected = true;
                    }
                }
            }
        } else {
            //clear selected caps from previous assessments that user could have taken without refreshing
            for (let i = 0; i < this.capabilities.length; i++) {
                this.capabilities[i].Selected = false;
            }
        }
    }

    getRecommendedCapabilities() {
        //clear recommened caps from previous assessments that user could have taken without refreshing
        for (let i = 0; i < this.capabilities.length; ++i) {
            this.capabilities[i].Recommended = false;
        }
        const personaCapabilities = this.Assessment.Persona.PersonaCapabilityMappings;
        for (let capability in this.capabilities) {
            for (let i = 0; i < personaCapabilities.length; ++i) {
                if (this.capabilities[capability].CapabilityName === personaCapabilities[i].Capability) {
                    this.capabilities[capability].Recommended = true;
                }
            }
        }
    }

    public selectCapability(capability: Capability): void {
        let clearVisitRequired: boolean = this.Assessment.Capabilities.length === 5;

        let found = false;
        let capabilityIndex = -1;
        for (let i = 0; i < this.Assessment.Capabilities.length; ++i) {
            if (this.Assessment.Capabilities[i].CapabilityName === capability.CapabilityName) {
                found = true;
                capabilityIndex = i;
            }
        }
        if (!found) {
            if (this.Assessment.Capabilities.length < 5) {
                this.Assessment.Capabilities.push(capability);
                capability.Selected = true;
            } else {
                this.showError = true;
                console.log('Max of 5 capabilities selected');
            }
        } else {
            capability.Selected = false;
            this.showError = false;
            this.Assessment.Capabilities.splice(capabilityIndex, 1);
        }

        if (clearVisitRequired) {
            this.headerService.clearVisit('capabilities');
        }
    }

    public prev(): void {
        this.headerService.nextPage('scenario', false);
    }

    public next(): void {
        this.appInsights.trackPageSelections('capabilities', {
            capabilities: this.Assessment.Capabilities.map((capability: Capability) => {
                return capability.CapabilityName;
            })
        });

        this.assessmentService.setStorage();
        this.assessmentService.Assessment = this.Assessment;
        //this.assessmentService.PostAssessment(this.Assessment);
        this.headerService.nextPage('maturity', false);
    }
}
