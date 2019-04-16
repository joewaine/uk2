import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';

@Injectable()
export class AppInsightsService {
    constructor() {
        //AppInsights.downloadAndSetup({
        //    instrumentationKey: '849996b9-bb5d-4a6e-aaee-2334bab69086'
        //});
    }

    public trackButtonClick(buttonName: string): void {
        //AppInsights.trackEvent('button-click', {
        //    buttonName,
        //});
    }

    public trackPageSelections(pageName: string, selections: any): void {
        //AppInsights.trackEvent('page-selections', {
        //    pageName,
        //    ...selections
        //});
    }

    public trackVisitPage(pageName: string): void {
        //AppInsights.trackEvent('page-visit', {
        //    pageName
        //});
    }
}
