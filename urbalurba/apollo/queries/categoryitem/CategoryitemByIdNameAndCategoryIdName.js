import { gql } from '@apollo/client';

const CATEGORYITEMBYIDNAMEANDCATEGORYIDNAME_QUERY = gql`  

query CategoryitemByIdNameAndCategoryIdName(
  $catItemIdName: String!
  $catIdName: String!
) {
  categoryitems(
    where: { idName: $catItemIdName, category: { idName: $catIdName } }
  ) {
    id
    idName
    displayName
  }
}

`;

export default CATEGORYITEMBYIDNAMEANDCATEGORYIDNAME_QUERY;


/* test data

{
  "catItemIdName": "1",
  "catIdName": "sdg"
}

*/