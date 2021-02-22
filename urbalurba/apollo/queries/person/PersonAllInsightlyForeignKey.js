import gql from "graphql-tag";

const PERSONALLINSIGHTLYFOREIGNKEY_QUERY = gql`  


query PersonAllInsightlyForeignKey($blockSize: Int!, $cursor: Int!) {
  people(limit: $blockSize, start: $cursor) {
    id
    idName
    updated_at
    created_at
    foreignKeys {
      sbn_insightly
    }
    person_entity_roles {
      id
      text
      updated_at
      created_at
      entity {
        id
        idName
      }
    }
  }
}




`;

export default PERSONALLINSIGHTLYFOREIGNKEY_QUERY;

/* test data
{
     "blockSize": 10,
    "cursor": 9
}
*/