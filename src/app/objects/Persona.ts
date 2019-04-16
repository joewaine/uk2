import { PersonaCapabilityMapping } from './PersonaCapabilityMapping'

export class Persona {
    public PersonaName: string;
    public Description: string;
    public Roles: string[];
    public PersonaCapabilityMappings: PersonaCapabilityMapping[];
}