declare module '@jsonresume/schema' {
  interface Location {
    city?: string;
    region?: string;
    country?: string;
    address?: string;
    postalCode?: string;
  }

  interface Profile {
    network?: string;
    username?: string;
    url?: string;
  }

  interface Basics {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: Location;
    profiles?: Profile[];
  }

  interface Work {
    name?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }

  interface Education {
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }

  interface Skill {
    name?: string;
    keywords?: string[];
    level?: string;
  }

  interface Language {
    language?: string;
    fluency?: string;
  }

  interface Project {
    name?: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
    roles?: string[];
    entity?: string;
    type?: string;
  }

  interface Publication {
    name?: string;
    publisher?: string;
    releaseDate?: string;
    url?: string;
    summary?: string;
  }

  interface Certificate {
    name?: string;
    date?: string;
    issuer?: string;
    url?: string;
  }

  interface Award {
    title?: string;
    date?: string;
    awarder?: string;
    summary?: string;
  }

  interface Reference {
    name?: string;
    reference?: string;
  }

  interface Meta {
    version?: string;
    canonical?: string;
  }

  interface JobLocation {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  }

  interface JobSkill {
    name?: string;
    level?: string;
    keywords?: string[];
  }

  interface JobMeta {
    canonical?: string;
    version?: string;
    lastModified?: string;
  }

  interface JobSchema {
    title?: string;
    company?: string;
    type?: string;
    date?: string;
    description?: string;
    location?: JobLocation;
    remote?: 'Full' | 'Hybrid' | 'None';
    salary?: string;
    experience?: string;
    responsibilities?: string[];
    qualifications?: string[];
    skills?: JobSkill[];
    meta?: JobMeta;
  }

  interface Resume {
    $schema?: string;
    basics?: Basics;
    work?: Work[];
    volunteer?: Work[];
    education?: Education[];
    awards?: Award[];
    certificates?: Certificate[];
    publications?: Publication[];
    skills?: Skill[];
    languages?: Language[];
    interests?: { name?: string; keywords?: string[] }[];
    references?: Reference[];
    projects?: Project[];
    meta?: Meta;
  }

  interface ValidationResult {
    valid: boolean;
    errors: any[];
  }

  function validate(resumeJson: Resume, callback: (errors: any[] | null, valid: boolean) => void): void;

  const schema: Resume;
  const jobSchema: JobSchema;
  export { validate, schema, jobSchema };
  export default { schema, validate, jobSchema };
} 