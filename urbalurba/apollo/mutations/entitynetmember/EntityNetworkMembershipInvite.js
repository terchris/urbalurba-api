import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPINVITE_MUTATION = gql`  

mutation EntityNetworkMembershipInvite(
  $entityNetworkMembershipID: ID!
  $text: String
  $invitedDate: Date
  $invitedBy: String
) {
  updateEntityNetworkMembership(
    input: {
      where: { id: $entityNetworkMembershipID }
      data: {
        text: $text
        status: Invited
        invitedDate: $invitedDate
        invitedBy: $invitedBy
      }
    }
  ) {
    entityNetworkMembership {
      id
      text
    }
  }
}





`;

export default ENTITYNETWORKMEMBERSHIPINVITE_MUTATION;


/* test data

{
    "text": "vil med dere",
    "invitedDate": "2016-09-23",
    "invitedBy": "ter",
    "entityNetworkMembershipID": "5f3259cc203f6aa1903203ae"
}


*/
