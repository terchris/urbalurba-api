import { gql } from '@apollo/client';

const NETWORKENTITYTYPECREATE_MUTATION = gql`  



mutation NetworkEntitytypeCreate(
  $entitytypeID: ID!
  $networkID: ID!
  $networkEntitytypeText: String
  $networkEntitytypeDisplayName: String
  $networkEntitytypeSummary: String
) {
  createNetworkEntitytype(
    input:  {
      data: {
        entitytype: $entitytypeID
        network: $networkID
        displayName: $networkEntitytypeDisplayName
        summary: $networkEntitytypeSummary
        text: $networkEntitytypeText
      }
    }
  ) {
    networkEntitytype {
      id
      text
      summary
      displayName      
    }
  }
}



`;

export default NETWORKENTITYTYPECREATE_MUTATION;

/* test data

{
    "entitytypeID": entitytypeID,
    "networkID": networkID,
    "networkEntitytypeText": "manually updated",
    "networkEntitytypeDisplayName": "manually updated",
    "networkEntitytypeSummary": "some text summary"
}

*/