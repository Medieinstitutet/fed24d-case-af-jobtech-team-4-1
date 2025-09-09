export interface IAds {
    hits: IAd[];
}

export interface IAd {
  id: string;
  headline: string;
  application_deadline: string;
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
}
