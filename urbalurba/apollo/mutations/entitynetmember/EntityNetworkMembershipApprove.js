import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPAPPROVE_MUTATION = gql`  

mutation EntityNetworkMembershipApprove(
  $entityNetworkMembershipID: ID!
  $text: String
  $approvedDate: Date
  $approvedBy: String
) {
  updateEntityNetworkMembership(
    input: {
      where: { id: $entityNetworkMembershipID }
      data: {
        text: $text
        status: Approved
        approvedDate: $approvedDate
        approvedBy: $approvedBy
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

export default ENTITYNETWORKMEMBERSHIPAPPROVE_MUTATION;


/* test data

{
    "text": "vil med",
    "approvedDate": "2016-09-23",
    "approvedBy": "ter",
    "entityNetworkMembershipID": "5f3259cc203f6aa1903203ae"
}


*/
