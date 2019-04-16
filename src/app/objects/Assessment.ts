import { Profile } from './Profile';
import { Level } from './Level';
import { Persona } from './Persona';
import { Capability } from './Capability';
import { Scenario } from './Scenario';
import { Results } from './Results';

export class Assessment {
    public SavedAssessmentId: number;
    public GuidId: string;
    public Profile: Profile;
    public Persona: Persona;
    public Capabilities: Capability[];
    public Scenario: Scenario;
    public Results: Results;
    public Alias: string;
    public CreatedDate: Date;
    public ModifiedDate: Date;

    constructor(){
        this.Persona = new Persona();
        this.Profile = new Profile();
        this.Capabilities = [];
        this.Scenario = new Scenario();
        this.Results = new Results();
    }
}
