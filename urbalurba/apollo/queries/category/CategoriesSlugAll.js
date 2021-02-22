import { gql } from '@apollo/client';

//TODO: delete -not needed

const CATEGORIESSLUGALL_QUERY = gql`  

query CategoriesSlugAll($blockSize: Int!,$cursor: Int! ) {
  categories(limit:$blockSize, start: $cursor) {
    id
    idName
  }
}




`;

export default CATEGORIESSLUGALL_QUERY;

