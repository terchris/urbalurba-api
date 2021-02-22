import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPSANDNETWORKSBYENTITYID_QUERY = gql`  

query EntityNetworkMembershipsAndNetworksByEntityID($entityID: ID!) {
  entityNetworkMemberships(where: { entity: { id: $entityID } }) {
    id
    status
    approvedDate
    approvedBy
    appliedDate
    appliedBy
    text
    resignedDate
    resignedBy
    network {
      id
      idName
    }
  }

  networks {
    id
    idName
    displayName
    slogan
    summary
    url
    image {
      icon {
        url
      }
    }
    internalImage {
      icon {
        url
      }
    }
  }
}



`;

export default ENTITYNETWORKMEMBERSHIPSANDNETWORKSBYENTITYID_QUERY;

/* test data
{
  "entityID": "5f338505203f6aa1903223d9"
}
*/