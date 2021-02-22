import gql from "graphql-tag";

const ENTITYBYNETWORKIDNAMEANDENTITYTYPEIDNAME_QUERY = gql`  


query EntityByNetworkIdNameAndEntitytypeIdName(
  $networkIdName: String!
  $entitytypeIdName: String!
  $blockSize: Int!
  $cursor: Int!
) {
  entities(
    limit: $blockSize
    start: $cursor
    where: {
      entity_network_memberships: { network: { idName: $networkIdName } }
      entitytype: { idName: $entitytypeIdName }
    }
  ) {
    id
    idName
    displayName
    slogan
    summary
    image {
      profile {
        url
      }
    }
    internalImage {
      profile {
        url
      }
    }

    entitytype {
      idName
      displayName
      internalImage {
        icon {
          url
        }
      }
      image {
        icon {
          url
        }
      }
    }
  }
}





`;

export default ENTITYBYNETWORKIDNAMEANDENTITYTYPEIDNAME_QUERY;

/* test data
{
  "networkIdName": "smartebyernorge",
  "entitytypeIdName": "solution",   
  "blockSize": 10,
  "cursor": 0
}

//TODO: check that status for the membership is there - now we just test for a relation

*/