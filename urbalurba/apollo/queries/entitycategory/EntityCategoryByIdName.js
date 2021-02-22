import { gql } from '@apollo/client';

const ENTITYCATEGORYBYIDNAME_QUERY = gql`  

query EntityCategoryByIdName($categoryIdName: String!, $entityIdName: String!) {
  entityCategories(
    where: {
      entity: { idName: $entityIdName }
      category: { idName: $categoryIdName }
    }
  ) {
    id
    text
  }
}



`;

export default ENTITYCATEGORYBYIDNAME_QUERY;

/* test data

{
  "categoryIdName": "sdg",
  "entityIdName": "abax"
}

*/