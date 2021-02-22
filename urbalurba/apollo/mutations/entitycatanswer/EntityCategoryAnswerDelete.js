import { gql } from '@apollo/client';

const ENTITYCATEGORYANSWERDELETE_MUTATION = gql`  

mutation EntityCategoryAnswerDelete($entityCategoryAnswerID: ID!) {
  deleteEntityCategoryAnswer(
    input: { where: { id: $entityCategoryAnswerID } }
  ) {
    entityCategoryAnswer {
      id
    }
  }
}





`;

export default ENTITYCATEGORYANSWERDELETE_MUTATION;


/* test data
 
{
"entityCategoryAnswerID": "5f74d466abcf1dcb0f8a7a4d"
}
*/
