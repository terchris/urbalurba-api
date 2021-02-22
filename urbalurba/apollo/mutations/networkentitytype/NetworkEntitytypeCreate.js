import { gql } from '@apollo/client';

const NETWORKENTITYTYPECREATE_MUTATION = gql`  



mutation NetworkEntitytypeCreate(
  $entitytypeID: ID!
  $networkID: ID!
  $networkEntitytypeCategoryTxt: String
) {
  createNetworkEntitytype(
    input:  {
      data: {
        entitytype: $entitytypeID
        network: $networkID
        text: $networkEntitytypeCategoryTxt
      }
    }
  ) {
    networkEntitytype {
      id
      text
    }
  }
}



`;

export default NETWORKENTITYTYPECREATE_MUTATION;

/* test data

 {
    "entitytypeID": entitytypeID,
    "networkID": networkID,
    "networkEntitytypeCategoryTxt": networkEntitytypeCategoryTxt
  }

*/