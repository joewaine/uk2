import { Component } from '@angular/core';

import { CopyService } from '../services/copy.service';

@Component({
    selector: 'assessment',
    templateUrl: 'assessment.html'
})
export class AssessmentComponent {
    constructor(private copyService: CopyService) { }
}
