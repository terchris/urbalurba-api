import { gql } from '@apollo/client';

const ENTITYCATEGORYDELETE_MUTATION = gql`  

mutation EntityCategoryDelete($entityCategoryID: ID!) {
  deleteEntityCategory(
    input: { where: { id: $entityCategoryID } }
  ) {
    entityCategory {
      id
    }
  }
}





`;

export default ENTITYCATEGORYDELETE_MUTATION;


/* test data
 
{
"entityCategoryID": "5f7743c9abcf1dcb0f8a7a7f"
}

*/
