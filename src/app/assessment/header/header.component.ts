import { Component } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
    selector: 'assessment-header',
    templateUrl: './assessment-header.html'
})

export class AssessmentHeaderComponent {
    public navLinks: any;
    constructor(private headerService: HeaderService) { }

    ngOnInit() {
        this.navLinks = this.headerService.navLinks;
    }

    public changePage(url: string, visited: boolean): void {
        this.headerService.routePage(url, visited);
    }
}
