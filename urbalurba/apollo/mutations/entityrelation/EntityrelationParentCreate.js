import { gql } from '@apollo/client';

const ENTITYRELATIONPARENTCREATE_MUTATION = gql`  

mutation EntityrelationParentCreate(

  $childEntityID: ID!
  $entityTypeID: ID!
  $parentEntityID: ID!
  $displayName: String!
  $text: String!
) {
  createEntityrelation(
    input: {
      data: {
        entity_child: $childEntityID
        entitytype: $entityTypeID
        entity_parent: $parentEntityID
        displayName: $displayName
        text: $text
      }
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

export default ENTITYRELATIONPARENTCREATE_MUTATION;


/* test data




*/
