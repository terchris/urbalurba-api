import { gql } from '@apollo/client';

const PERSONNETWORKMEMBERSHIPROLEBYPERSONIDANDENTITYNETWORKMEMBERSHIPID_QUERY = gql`  


query PersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID(
  $personID: ID!
  $entityNetworkMembershipID: ID!
) {
  personNetworkMembershipRoles(
    where: {
      person: $personID
      entity_network_membership: $entityNetworkMembershipID
    }
  ) {
    id
    text
    roleName
  }
}



`;

export default PERSONNETWORKMEMBERSHIPROLEBYPERSONIDANDENTITYNETWORKMEMBERSHIPID_QUERY;




/* test data


{
  "personID": "1",
  "entityNetworkMembershipID": "101"
}


*/