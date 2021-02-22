import gql from "graphql-tag";

const ENTITYALLINSIGHTLYFOREIGNKEY_QUERY = gql`  


query EntityAllInsightlyForeignKey($blockSize: Int!, $cursor: Int!) {
  entities(limit: $blockSize, start: $cursor) {
    id
    idName
    updated_at
    created_at   
    foreignKeys {
      sbn_insightly
    }
  }
}



`;

export default ENTITYALLINSIGHTLYFOREIGNKEY_QUERY;

/* test data
{
     "blockSize": 10,
    "cursor": 9
}
*/