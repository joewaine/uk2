import { DeviceScore } from './DeviceScore';

export class Results {
    public DeviceScores: DeviceScore[];
    public Percentage: number;
    public Level: number;
    public WinningDevice: string;
    public WinningDeviceScore: number;
    public MaxScore: number;

    constructor(){
        this.DeviceScores = [];
    }
}