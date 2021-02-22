import { gql } from '@apollo/client';

const ENTITYCATEGORYUPDATE_MUTATION = gql`  

mutation EntityCategoryUpdate(
  $categoryID: ID!
  $text: String
) {
  updateEntityCategory(
    input: {
      where: { id: $categoryID }
      data: {
        text: $text
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

export default ENTITYCATEGORYUPDATE_MUTATION;


/* test data

{
  "categoryID": "5f76f1e0abcf1dcb0f8a7a77",
  "text": "manual update ferge orgtype"  
}


*/
