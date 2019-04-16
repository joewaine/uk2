import { NgModule, Directive } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
//import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { AssessmentModule } from './assessment/assessment.module';

import { AssessmentComponent } from './assessment/assessment.component';
import { CopyService } from './services/copy.service';
import { AssessmentHeaderComponent } from './assessment/header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RedirectComponent } from './redirect/redirect.component';

import { AppInsightsService } from './services/app-insights.service';
import { AzureService } from './services/azure.service';

@NgModule({
    declarations: [
        AppComponent,
        AssessmentComponent,
        AssessmentHeaderComponent,
        RedirectComponent,
        WelcomeComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        AppRouting,
        AssessmentModule
    ],
    providers: [
        CopyService,
        AppInsightsService,
        AzureService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
