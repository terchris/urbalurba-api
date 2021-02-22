import { gql } from '@apollo/client';

const CATEGORYANDITEMSBYIDNAME_QUERY = gql`  

query CategoryAndItemsByIdName($idName: String!) {
  categories(where: { idName: $idName }) {
    ...categoryData
    categoryitems ( sort:"sortOrder:asc") {
      ...categoryitemsData
    }    
  }
}



fragment categoryData on Category {
        id
        idName
        displayName
        summary
        categoryType
        image {
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
        internalImage {
          icon {
            url
          }
          profile {
            url
          }
        }
        color {
          text
          background
        }

}

fragment categoryitemsData on Categoryitem {
          id
          idName
          displayName
          summary
          description
          sortOrder
          color {
            text
            background
          }
          image {
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
          internalImage {
            icon {
              url
            }
            profile {
              url
            }
          }

}



`;

export default CATEGORYANDITEMSBYIDNAME_QUERY;
