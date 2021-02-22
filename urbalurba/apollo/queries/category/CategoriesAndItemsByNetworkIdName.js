import gql from "graphql-tag";

const CATEGORIESANDITEMSBYNETWORKIDNAME_QUERY = gql`  

query CategoriesAndItemsByNetworkIdName(
  $networkIdName: String!
  $blockSize: Int!
  $cursor: Int!
) {
  categories(
    limit: $blockSize
    start: $cursor
    where: {
      network_entitytype_categories: {
        network_entitytype: { network: { idName: $networkIdName } }
      }
    }
  ) {
    id
    idName
    categoryitems {
      id
      idName
    }
  }
}




`;

export default CATEGORIESANDITEMSBYNETWORKIDNAME_QUERY;

/* test data

{
     "blockSize": 4,
    "cursor": 0,
    "networkIdName": "smartebyernorge" 
}
*/


