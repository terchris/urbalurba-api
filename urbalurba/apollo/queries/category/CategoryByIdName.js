import { gql } from '@apollo/client';

const CATEGORYBYIDNAME_QUERY = gql`  


query CategoryByIdName($idName: String!) {
  categories(where: { idName: $idName }) {
    id
    idName
    displayName
    summary
    description
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
}





`;

export default CATEGORYBYIDNAME_QUERY;

/* test data
{
  "idName": "sdg"
}

*/