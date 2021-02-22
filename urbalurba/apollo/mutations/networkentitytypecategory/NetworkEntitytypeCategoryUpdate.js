import { gql } from '@apollo/client';

const NETWORKENTITYTYPECATEGORYUPDATE_MUTATION = gql`  



mutation NetworkEntitytypeCategoryUpdate(
  $networkEntitytypeCategoryID: ID!
  $networkEntitytypeCategoryTxt: String
) {
  updateNetworkEntitytypeCategory(
    input: {
      where: { id: $networkEntitytypeCategoryID }
      data: { text: $networkEntitytypeCategoryTxt }
    }
  ) {
    networkEntitytypeCategory {
      id
      text
    }
  }
}



`;

export default NETWORKENTITYTYPECATEGORYUPDATE_MUTATION;

/* test data
{
"networkEntitytypeCategoryID": networkEntitytypeCategoryID,
    "networkEntitytypeCategoryTxt": networkEntitytypeCategoryTxt
  };

*/