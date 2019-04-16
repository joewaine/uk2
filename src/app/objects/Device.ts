import { DeviceCapabilityScoring } from './DeviceCapabilityScoring';

export class Device {
    public DeviceName: string;
    public borderColor: string;
    public backgroundColor: string;
    public MarketingLink: string;
    public DevicesCapabilityScoring: DeviceCapabilityScoring[];
    public WeightMappings: any;

    constructor(){
        this.DevicesCapabilityScoring = [];
    }

}
