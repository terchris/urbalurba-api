import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPBYENTITYIDANDNETWORKID_QUERY = gql`  

query EntityNetworkMembershipByEntityIDandNetworkID(
  $entityID: ID!
  $networkID: ID!
) {
  entityNetworkMemberships(where: { entity: $entityID, network: $networkID }) {
    id
    text
  }
}



`;

export default ENTITYNETWORKMEMBERSHIPBYENTITYIDANDNETWORKID_QUERY;




/* test data


{
  "entityID": "5f3259cb203f6aa190320399",
  "networkID": "5f3258bf203f6aa1903202e6"
}


*/