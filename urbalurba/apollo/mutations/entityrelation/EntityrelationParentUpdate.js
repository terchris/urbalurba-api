import { gql } from '@apollo/client';

const ENTITYRELATIONPARENTUPDATE_MUTATION = gql`  

mutation EntityrelationParentUpdate(
  $entityrelationID: ID!
  $displayName: String!
  $text: String!
) {
  updateEntityrelation(
    input: {
      where: { id: $entityrelationID }
      data: { displayName: $displayName, text: $text }
    }
  ) {
    entityrelation {
      id
      text
      displayName
    }
  }
}




`;

export default ENTITYRELATIONPARENTUPDATE_MUTATION;


/* test data




*/
