import { gql } from '@apollo/client';

const NETWORKENTITYTYPECATEGORYCREATE_MUTATION = gql`  



mutation NetworkEntitytypeCategoryCreate(
  $networkEntitytypeID: ID!
  $categoryID: ID!
  $networkEntitytypeCategoryTxt: String
) {
  createNetworkEntitytypeCategory(
    input: {
      data: {
        network_entitytype: $networkEntitytypeID
        category: $categoryID
        text: $networkEntitytypeCategoryTxt
      }
    }
  ) {
    networkEntitytypeCategory {
      id
      text
    }
  }
}



`;

export default NETWORKENTITYTYPECATEGORYCREATE_MUTATION;

/* test data
    "networkEntitytypeID": networkEntitytypeID,
    "categoryID": categoryID,
    "networkEntitytypeCategoryTxt": networkEntitytypeCategoryTxt
  };
*/