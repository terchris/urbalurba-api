import { gql } from '@apollo/client';

const NETWORKENTITYTYPEUPDATE_MUTATION = gql`  



mutation NetworkEntitytypeUpdate(
  $networkEntitytypeID: ID!
  $networkEntitytypeText: String
  $networkEntitytypeDisplayName: String
  $networkEntitytypeSummary: String
) {
  updateNetworkEntitytype(
    input: {
      where: { id: $networkEntitytypeID }
      data: {
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

export default NETWORKENTITYTYPEUPDATE_MUTATION;

/* test data

{
    "networkEntitytypeID": "1",
    "networkEntitytypeText": "manually updated",
    "networkEntitytypeDisplayName": "manually updated",
    "networkEntitytypeSummary": "some text summary"
}

*/