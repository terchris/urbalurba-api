import { gql } from '@apollo/client';

const CATEGORYITEMBYIDNAMEANDCATEGORYID_QUERY = gql`  


query CategoryitemByIdNameAndCategoryID(
  $categoryitemIdName: String!
  $categoryID: String!
) {
  categoryitems(
    where: { idName: $categoryitemIdName, category: { id: $categoryID } }
  ) {
    id
    idName
  }
}

`;

export default CATEGORYITEMBYIDNAMEANDCATEGORYID_QUERY;


/* test data

{
  "categoryitemIdName": "government",
  "categoryID": "5f325890203f6aa19031fe0e"
}

*/