import { gql } from '@apollo/client';

const CATEGORYANSWERSENTITYANSWER_QUERY = gql`  



query CategoryAnswersEntityAnswer(
  $categoryIdName: String!
  $entityIdName: String!
) {
  categories(where: { idName: $categoryIdName }) {
    id
    idName
    displayName
    summary
    description
    categoryType
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
    categoryitems {
      id
      idName
      displayName
      summary
      description
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
  entityCategoryAnswers(
    where: {
      entity_category: {
        category: { idName: $categoryIdName }
        entity: { idName: $entityIdName }
      }
    }
  ) {
    id
    text
    answerText
    categoryitem {
      id
      idName
    }
    entity_category {
      id
    }
  }
}





`;

export default CATEGORYANSWERSENTITYANSWER_QUERY;

