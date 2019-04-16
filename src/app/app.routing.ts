import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentRouting } from './assessment/assessment.routing';
import { RedirectComponent } from './redirect/redirect.component';

const APP_ROUTES: Routes = [
    {
        path: '',
        component: WelcomeComponent
    },
    {
        path: 'assessment',
        component: AssessmentComponent,
        children: AssessmentRouting
    },
    {
        path: 'redirect',
        component: RedirectComponent
    }
];

export const AppRouting = RouterModule.forRoot(APP_ROUTES);
