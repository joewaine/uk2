import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {EmployeesComponent} from './employees/employees.component';
import {ScenarioComponent} from './scenario/scenario.component';
import {CapabilitiesComponent} from './capabilities/capabilities.component';
import {MaturityComponent} from './maturity/maturity.component';
import {ResultsComponent} from './results/results.component';


export const AssessmentRouting : Routes = [
    { path: '', redirectTo: 'employees', pathMatch: 'full' },
    { path: 'employees', component: EmployeesComponent },
    { path: 'employees/:GuId', component: EmployeesComponent },
    { path: 'scenario', component: ScenarioComponent },
    { path: 'capabilities', component: CapabilitiesComponent },
    { path: 'maturity', component: MaturityComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'results/:id', component: ResultsComponent }
];
