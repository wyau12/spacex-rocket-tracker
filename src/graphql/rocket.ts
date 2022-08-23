import { gql } from "@apollo/client";

export const GET_ROCKETS = gql`
  query GetRockets {
    rockets {
      id
      name
      type
      engines {
        type
      }
      description
      company
      country
      boosters
      stages
      firstFlightDate: first_flight
      costPerLaunch: cost_per_launch
      successRatePercent: success_rate_pct
      wikipedia
      active
    }
  }
`;
