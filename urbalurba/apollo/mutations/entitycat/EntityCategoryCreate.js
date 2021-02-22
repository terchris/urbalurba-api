import { gql } from '@apollo/client';

const ENTITYCATEGORYCREATE_MUTATION = gql`  

mutation EntityCategoryCreate(
  $entityID: ID!
  $categoryID: ID!
  $text: String
) {
  createEntityCategory(
    input: {
      data: {
        text: $text
        category: $categoryID
        entity: $entityID
      }
    }
  ) {
    entityCategory {
      id
      text
    }
  }
}





`;

export default ENTITYCATEGORYCREATE_MUTATION;


/* test data
 
{
  "entityID": "5f338505203f6aa1903223d9",
  "categoryID": "5f325893203f6aa19031ff42",
  "text": "manually adding tac category to ferge"  
}

*/
