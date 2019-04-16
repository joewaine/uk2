import * as Chart from 'chart.js/dist/Chart.bundle.min';

import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {Assessment} from '../../objects/Assessment';
import {CopyService} from '../../services/copy.service';
import {ChartsModule} from 'ng2-charts';
import {NgxCarousel} from 'ngx-carousel';
import {Results} from '../../objects/Results';

@Component({
    selector: 'radar-graph',
    templateUrl: './radar-graph.html'
})

export class RadarComponent implements OnInit {
    constructor(
        private copyService: CopyService
    ) {
    }

    @Input() Assessment: any;
    public Results: Results;
    public copy: any;
    public adjustedRadarData = [];
    public selectedDevice: string;
    public radarChartType: string = 'radar';
    public radarChartLabels: string[][] = [];
    public chartColors = [
        'rgba(0,120,212,0.4)',
        'rgba(234,50,121,0.4)',
        'rgba(102,45,142,0.4)',
        'rgba(8,105,155,0.4)',
        'rgba(244,144,30,0.4)',
        'rgba(34,178,115,0.4)',
        'rgba(234,50,121,0.4)',
        'rgba(34,178,115,0.4)',
        'rgba(8,105,155,0.4)'
    ];
    public radarChartData: any;
    public radarChartOptions = {
        aspectRatio: 1.35, // See: https://github.com/chartjs/Chart.js/issues/5237#issuecomment-363203390
        scale: {
            ticks: {
                display: false,
                beginAtZero: true,
                min: 0,
                max: 100,
                stepSize: 100
            },
            pointLabels: {
                fontSize: 12
            }
        },
        legend: {
            display: false
        }
    };

    ngOnInit() {
        this.Results = this.Assessment.Results;
        this.copy = this.copyService.Copy.Results;
        this.selectedDevice = this.Results.WinningDevice;
        this.getRadarLabels();
        this.adjustRadar();
    }

    adjustRadar() { //take returned graph data and empty arrays of all but selected device for toggling on click
        this.adjustedRadarData = this.radarChartData.map(
            (current) => {
                if (current.label !== this.selectedDevice) {
                    return Object.assign({}, current, {
                        data: []
                    });
                } else {
                    return Object.assign({}, current);
                }
            });
        this.adjustedRadarData.sort((a, b) => { //sort data by descending TotalScore
            return b.TotalScore - a.TotalScore;
        });

        if (this.Assessment && this.Assessment.Scenario && this.Assessment.Scenario.OnTheGo === 'Yes') {
            let surfaceLteIndex: number = -1;
            for (let i: number = 0; i < this.adjustedRadarData.length; ++i) {
                const surface: any = this.adjustedRadarData[i];
                //might have to change this, not sure if it's what we want for this section
                if (surface.label === 'Surface Pro 5 for Business' ||
                    surface.label === 'Surface Go LTE for Business') {
                    surfaceLteIndex = i;
                    break;
                }
            }
            if (surfaceLteIndex > -1) {
                const surfaceLte: any[] = this.adjustedRadarData.splice(surfaceLteIndex, 1);
                this.adjustedRadarData = surfaceLte.concat(this.adjustedRadarData);
            }
        } else if (this.adjustedRadarData[0].label === 'Surface Go LTE for Business' &&
            this.adjustedRadarData[1].label === 'Surface Go for Business') {
            const surfaceLte: any = Object.assign({}, this.adjustedRadarData[0]);
            this.adjustedRadarData[0] = this.adjustedRadarData[1];
            this.adjustedRadarData[1] = surfaceLte;
        } else if (this.adjustedRadarData[0].label === 'Surface Pro 5 for Business' &&
            this.adjustedRadarData[1].label === 'Surface Pro 6 for Business') {
            const surfaceLte: any = Object.assign({}, this.adjustedRadarData[0]);
            this.adjustedRadarData[0] = this.adjustedRadarData[1];
            this.adjustedRadarData[1] = surfaceLte;
        }
    }

    toggleDeviceData(newDevice, index) { //click event that finds the device passed in and adds the data points to the radar graph array
        if (index === 0) {
            return;
        }

        newDevice.active = !newDevice.active;

        let data = this.findData(newDevice.label);
        for (let i = 0; i < this.adjustedRadarData.length; ++i) {
            if (this.adjustedRadarData[i].label === newDevice.label) {
                if (this.adjustedRadarData[i].data.length === 0) {
                    this.adjustedRadarData[i].data = data;
                } else {
                    this.adjustedRadarData[i].data = [];
                }

            }
        }
        this.adjustedRadarData = this.adjustedRadarData.slice();
    }

    findData(newDevice) { //search through original array and returns data values to be added
        for (let i = 0; i < this.radarChartData.length; ++i) {
            if (this.radarChartData[i].label === newDevice) {
                return this.radarChartData[i].data;
            }
        }
    }

    getRadarLabels() { //get all radar data from service
        this.radarChartData = this.Assessment.Results.DeviceScores;
        this.radarChartOptions.scale.ticks.max = this.Assessment.Results.MaxScore;
        for (let i = 0; i < this.Assessment.Capabilities.length; i++) {
            const name = this.Assessment.Capabilities[i].CapabilityName;
            const multiline = name.replace(/( &)? /g, '$1|').split('|');
            console.log(multiline);
            this.radarChartLabels.push(multiline);
        }
    }

}
