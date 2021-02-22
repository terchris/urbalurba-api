import { gql } from '@apollo/client';

const ENTITYANSWERSANDPOSSIBLEANSWERSBYIDNAMEANDCATEGORYIDNAME_QUERY = gql`  

query EntityAnswersAndPossibleAnswersByIdNameAndCategoryIdName($entityIdName: String!, $categoryIdName: String!) {
  entities(where: { idName: $entityIdName }) {
    id
    idName
    entity_categories(where: { category: { idName: $categoryIdName } }) {
      id
      text
      category {
        id
        idName
      }
      entity_category_answers {
        id
        text
        categoryitem {
          id
          idName
        }
      }
    }
  }

  categories(where: { idName: $categoryIdName }) {
    ...categoryData
    categoryitems {
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

export default ENTITYANSWERSANDPOSSIBLEANSWERSBYIDNAMEANDCATEGORYIDNAME_QUERY;


/* test data

{
  "entityIdName": "bronnoysundregistrene",
  "categoryIdName": "sdg"
}


*/