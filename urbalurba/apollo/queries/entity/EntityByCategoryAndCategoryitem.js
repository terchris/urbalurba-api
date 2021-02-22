import { gql } from '@apollo/client';

const ENTITYBYCATEGORYANDCATEGORYITEM_QUERY = gql`  

query EntityByCategoryAndCategoryitem(
  $networkIdName: String!
  $categoryIdName: String!
  $categoryitemIdName: String!
  $blockSize: Int!
  $cursor: Int!
) {
  entities(
    limit: $blockSize
    start: $cursor
    where: {
      entity_categories: {
        entity_category_answers: {
          categoryitem: { idName: $categoryitemIdName }
        }
        category: { idName: $categoryIdName }
      }
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

export default ENTITYBYCATEGORYANDCATEGORYITEM_QUERY;

/* test data

{
  "networkIdName": "smartebyernorge",
  "categoryIdName":  "sdg",  
  "categoryitemIdName":  "1",
  "blockSize": 10,
  "cursor": 0  
}
*/