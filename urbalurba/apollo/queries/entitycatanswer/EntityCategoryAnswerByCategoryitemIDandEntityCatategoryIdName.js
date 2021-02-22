import { gql } from '@apollo/client';

const ENTITYCATEGORYANSWERBYCATEGORYITEMIDANDENTTITYCATEGORYIDNAME_QUERY = gql`  

query EntityCategoryAnswerByCategoryitemIDandEntityCatategoryIdName(
  $entityCategoryID: ID!
  $categoryitemIdName: String!
) {
  entityCategoryAnswers(
    where: {
      entity_category: { id: $entityCategoryID }
      categoryitem: { idName: $categoryitemIdName }
    }
  ) {
    id
    text
    answerText
  }
}


`;

export default ENTITYCATEGORYANSWERBYCATEGORYITEMIDANDENTTITYCATEGORYIDNAME_QUERY;

/* test data


{
  "entityCategoryID": "5f32597d203f6aa190320352",
  "categoryitemIdName": "11"
}


*/