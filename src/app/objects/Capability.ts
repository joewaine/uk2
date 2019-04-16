import { Level } from './Level';

export class Capability {
    public CapabilityName: string;
    public Description: string;
    public Levels: Level[];
    public Selected: boolean;
    public Recommended: boolean;
    public LevelSelected: any;
}
