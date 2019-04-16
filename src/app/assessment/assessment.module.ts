import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

import { ProfileComponent } from './profile/profile.component';
import { EmployeesComponent } from './employees/employees.component';
import { MaturityComponent } from './maturity/maturity.component';
import { CapabilitiesComponent } from './capabilities/capabilities.component';
import { ResultsComponent } from './results/results.component';
import { RadarComponent } from './results/radar.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { CapabilitiesService } from '../services/capabilities.service';
import { PersonasService } from '../services/persona.service';
import { HeaderService } from '../services/header.service';
import { AssessmentService } from '../services/assessment.service';


@NgModule({
    declarations: [
        ProfileComponent,
        EmployeesComponent,
        MaturityComponent,
        CapabilitiesComponent,
        ResultsComponent,
        ScenarioComponent,
        RadarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ChartsModule,
        NgxCarouselModule
    ],
    providers: [
        CapabilitiesService,
        PersonasService,
        AssessmentService,
        HeaderService
    ]
})

export class AssessmentModule {

}
