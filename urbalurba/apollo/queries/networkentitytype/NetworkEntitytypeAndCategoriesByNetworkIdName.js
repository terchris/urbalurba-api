import { gql } from '@apollo/client';

const NETWORKENTITYTYPEANDCATEGORIESBYNETWORKIDNAME_QUERY = gql`  

query NetworkEntitytypeAndCategoriesByNetworkIdName($networkIdName: String!) {
  networkEntitytypes(where: { network: { idName: $networkIdName } }) {
    id
    text
    displayName
    summary
    entitytype {
      id
      idName
      displayName
      summary
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
        square {
          url
        }
      }
    }
    network_entitytype_categories {
      id
      text
      category {
        id
        idName
        displayName
        summary
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
          square {
            url
          }
        }
      }
    }
  }
}


`;

export default NETWORKENTITYTYPEANDCATEGORIESBYNETWORKIDNAME_QUERY;

/* test data


{
  "networkIdName": "smartebyernorge.no"
}

*/