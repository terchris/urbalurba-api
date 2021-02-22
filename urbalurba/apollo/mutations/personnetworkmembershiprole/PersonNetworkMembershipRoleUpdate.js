import { gql } from '@apollo/client';

const PERSONNETWORKMEMBERSHIPROLEUPDATE_MUTATION = gql`  

mutation PersonNetworkMembershipRoleUpdate(
  $personNetworkMembershipRoleID: ID!
  $text: String
  $roleName: String
) {
  updatePersonNetworkMembershipRole(
    input: {
      where: { id: $personNetworkMembershipRoleID }
      data: { text: $text, roleName: $roleName }
    }
  ) {
    personNetworkMembershipRole {
      id
      text
    }
  }
}


`;

export default PERSONNETWORKMEMBERSHIPROLEUPDATE_MUTATION;

/* test data

{
  "personNetworkMembershipRoleID":  "2",
  "text": "jalla-update",
  "roleName": "boss-update"
}

*/