import gql from "graphql-tag";

const ENTITYPEBYNETWORKSLUG_QUERY = gql`  

query EntityByNetworkSlug(
  $networkIdName: String!
  $blockSize: Int!
  $cursor: Int!
) {
  entities(
    limit: $blockSize
    start: $cursor
    where: {
      entity_network_memberships: { network: { idName: $networkIdName } }
    }
  ) {
    id
    idName
  }
}




`;

export default ENTITYPEBYNETWORKSLUG_QUERY;

/* test data
{
     "blockSize": 10,
    "cursor": 9,
    "networkIdName": "smartebyernorge" 
}
*/