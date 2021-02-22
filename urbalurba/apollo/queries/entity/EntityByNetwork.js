import gql from "graphql-tag";

const ENTITYPEBYNETWORK_QUERY = gql`  

query EntityByNetwork(
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

export default ENTITYPEBYNETWORK_QUERY;

/* test data
{ "entitytypeIdName": "organization", "networkIdName": "smartebyernorge" }

*/


/* deleted 

    entity_network_memberships {
      network {
        idName
        displayName
      }
    }
*/