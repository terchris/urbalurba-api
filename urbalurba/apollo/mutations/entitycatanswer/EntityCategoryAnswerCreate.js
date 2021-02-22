import { gql } from '@apollo/client';

const ENTITYCATEGORYANSWERCREATE_MUTATION = gql`  

mutation EntityCategoryAnswerCreate(
  $entityCategoryID: ID!
  $categoryitemID: ID!
  $answerText: String
  $text: String
) {
  createEntityCategoryAnswer(
    input: {
      data: {
        answerText: $answerText
        text: $text
        categoryitem: $categoryitemID
        entity_category: $entityCategoryID
      }
    }
  ) {
    entityCategoryAnswer {
      id
      text
    }
  }
}





`;

export default ENTITYCATEGORYANSWERCREATE_MUTATION;


/* test data
 
{
  "entityCategoryID": "5f325947203f6aa190320336",
  "categoryitemID": "5f325899203f6aa1903201ec",
  "text": "manual by tec"  
}
*/
