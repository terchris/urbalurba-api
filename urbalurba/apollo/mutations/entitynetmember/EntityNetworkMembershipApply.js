import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPAPPLY_MUTATION = gql`  

mutation EntityNetworkMembershipApply(
  $entityNetworkMembershipID: ID!
  $text: String
  $appliedDate: Date
  $appliedBy: String
) {
  updateEntityNetworkMembership(
    input: {
      where: { id: $entityNetworkMembershipID }
      data: {
        text: $text
        status: Applied
        appliedDate: $appliedDate
        appliedBy: $appliedBy
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

export default ENTITYNETWORKMEMBERSHIPAPPLY_MUTATION;


/* test data

{
    "text": "vil med dere",
    "appliedDate": "2016-09-23",
    "appliedBy": "ter",
    "entityNetworkMembershipID": "5f3259cc203f6aa1903203ae"
}


*/
