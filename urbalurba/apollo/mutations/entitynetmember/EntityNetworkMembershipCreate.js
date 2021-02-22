import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPCREATE_MUTATION = gql`  

mutation EntityNetworkMembershipCreate(
  $entityID: ID!
  $networkID: ID!
  $text: String
) {
  createEntityNetworkMembership(
    input: {
      data: {
        entity: $entityID
        network: $networkID
        text: $text
        status: Pending
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

export default ENTITYNETWORKMEMBERSHIPCREATE_MUTATION;


/* test data
 
{
    "text": "vil med",
    "networkID": "5f3258bf203f6aa1903202f3",
    "entityID": "5f325922203f6aa190320327"
  }
*/
