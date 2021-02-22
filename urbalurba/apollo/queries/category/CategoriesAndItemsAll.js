import { gql } from '@apollo/client';

const CATEGORIESANDITEMSALL_QUERY = gql`  

query CategoriesAndItemsAll {
  categories {
    ...categoryData
    categoryitems ( sort:"sortOrder:asc") {
      ...categoryAnswerData
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

fragment categoryAnswerData on Categoryitem {
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

export default CATEGORIESANDITEMSALL_QUERY;
