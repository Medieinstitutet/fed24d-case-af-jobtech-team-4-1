export interface IAds {
  hits: IAd[];
  total?: {
    value: number;
  };
}

export interface IAd {
  id: string;
  headline: string;
  application_deadline: string;
  description: {
    text: string;
  };
  employer: {
    name: string;
    workplace: string;
  };
  workplace_address: {
    municipality: string;
    region: string;
    country: string;
    coordinates: [];
  };
  working_hours_type: {
    label: string;
  };
  occupation: {
    label: string;
  };
}
