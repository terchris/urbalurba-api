import { gql } from '@apollo/client';

const NETWORKENTITYTYPEBYENTITYTYPEIDANDNETWORKID_QUERY = gql`  

query NetworkEntitytypeByEntitytypeIDandNetworkID(
  $entitytypeID: ID!
  $networkID: ID!
) {
  networkEntitytypes(
    where: {
      entitytype: { id: $entitytypeID }
      network: { id: $networkID }
    }
  ) {
    id
    text
  }
}


`;

export default NETWORKENTITYTYPEBYENTITYTYPEIDANDNETWORKID_QUERY;

/* test data


{
  "entitytypeID": "5f3258ac203f6aa1903202a7",
  "networkID": "5f3258bf203f6aa1903202e6"
}


*/