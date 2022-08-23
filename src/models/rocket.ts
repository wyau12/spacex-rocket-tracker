export interface Rocket {
  id: string;
  name: string;
  type: string;
  engines: {
    type: string;
  };
  description: string;
  company: string;
  country: string;
  boosters: number;
  stages: number;
  firstFlightDate: string;
  costPerLaunch: number;
  successRatePercent: number;
  wikipedia: string;
  active: boolean;
};
