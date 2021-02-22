import { gql } from '@apollo/client';

const PERSONNETWORKMEMBERSHIPROLECREATE_MUTATION = gql`  



mutation PersonNetworkMembershipRoleCreate(
  $personID: ID!
  $entityNetworkMembershipID: ID!
  $text: String
  $roleName: String
) {
  createPersonNetworkMembershipRole(
    input: {
      data: {
        text: $text
        roleName: $roleName
        person: $personID
        entity_network_membership: $entityNetworkMembershipID
      }
    }
  ) {
    personNetworkMembershipRole {
      id
      text
    }
  }
}



`;

export default PERSONNETWORKMEMBERSHIPROLECREATE_MUTATION;

/* test data

{
        "text": "jalla",
        "roleName": "boss",
  "personID": "4"
  "entityNetworkMembershipID": "18"
}


*/