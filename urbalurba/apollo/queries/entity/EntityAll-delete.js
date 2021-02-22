import { gql } from '@apollo/client';

const ENTITYALL_QUERY = gql`  

query EntityAll($blockSize: Int!, $cursor: Int!) {
  entities(limit: $blockSize, start: $cursor) {
    id
    idName
    displayName
    slogan
    url
    phone
    email
    internalImage {
      profile {
        url
      }
    }

    entitytype {
      idName
      displayName
    }
  }
}



`;

export default ENTITYALL_QUERY;

/* test data
{
     "blockSize": 10,
    "cursor": 9
}
*/