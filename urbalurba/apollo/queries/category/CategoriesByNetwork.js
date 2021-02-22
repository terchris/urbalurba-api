import gql from "graphql-tag";

const CATEGORIESBYNETWORK_QUERY = gql`  

query CategoriesByNetwork(
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
    displayName
    summary

    image {
      profile {
        url
      }
      cover {
        url
      }
    }
    internalImage {
      icon {
        url
      }
      profile {
        url
      }
      cover {
        url
      }
    }
  }
}




`;

export default CATEGORIESBYNETWORK_QUERY;

/* test data

{
     "blockSize": 4,
    "cursor": 0,
    "networkIdName": "smartebyernorge" 
}
*/


