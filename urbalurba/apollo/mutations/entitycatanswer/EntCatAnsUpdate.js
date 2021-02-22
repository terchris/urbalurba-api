import { gql } from '@apollo/client';

const ENTITYCATEGORYANSWERUPDATE_MUTATION = gql`  

mutation EntityCategoryAnswerUpdate(
  $entityCategoryAnswerID: ID!
  $answerText: String,
  $text: String
) {
  updateEntityCategoryAnswer(
    input: {
      where: { id: $entityCategoryAnswerID }
      data: {
        answerText: $answerText
        text: $text
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

export default ENTITYCATEGORYANSWERUPDATE_MUTATION;


/* test data
 
{
"entityCategoryAnswerID": "5f74d466abcf1dcb0f8a7a4d",
  "text": "manual by tec"  
}
*/
