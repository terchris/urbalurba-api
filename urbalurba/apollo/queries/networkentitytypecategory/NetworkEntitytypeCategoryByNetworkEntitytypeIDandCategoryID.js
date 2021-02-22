import { gql } from '@apollo/client';

const NETWORKENTITYTYPECATEGORYBYNETWORKENTITYTYPEIDANDCATEGORYID_QUERY = gql`  



query NetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID(
  $networkEntitytypeID: ID!
  $categoryID: ID!
) {
  networkEntitytypeCategories(
    where: {
      category: { id: $categoryID }
      network_entitytype: { id: $networkEntitytypeID }
    }
  ) {
    id
    text
  }
}


`;

export default NETWORKENTITYTYPECATEGORYBYNETWORKENTITYTYPEIDANDCATEGORYID_QUERY;

/* test data


{
    "networkEntitytypeID": "5fb6be415e65cf0017954d64",
    "categoryID": "5f7dd423a93182adba959131"
}



*/