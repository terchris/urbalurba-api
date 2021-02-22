import { gql } from '@apollo/client';

const NETWORKENTITYTYPEUPDATE_MUTATION = gql`  



mutation NetworkEntitytypeUpdate(
  $networkEntitytypeID: ID!
  $networkEntitytypeText: String
) {
  updateNetworkEntitytype(
    input: {
      where: { id: $networkEntitytypeID }
      data: { text: $networkEntitytypeText }
    }
  ) {
    networkEntitytype {
      id
      text
    }
  }
}



`;

export default NETWORKENTITYTYPEUPDATE_MUTATION;

/* test data

{

    "networkEntitytypeID": networkEntitytypeID,
    "networkEntitytypeText": "manually updated"

}

*/