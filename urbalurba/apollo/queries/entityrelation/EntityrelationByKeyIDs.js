import { gql } from '@apollo/client';

const ENTITYRELATIONBYKEYIDS_QUERY = gql`  



query EntityrelationByKeyIDs(
  $childEntityID: ID!
  $entityTypeID: ID!
  $parentEntityID: ID!
) {
  entityrelations(
    where: {
      entity_child: $childEntityID
      entitytype: $entityTypeID
      entity_parent: $parentEntityID
    }
  ) {
    id
    text
    displayName
  }
}


`;

export default ENTITYRELATIONBYKEYIDS_QUERY;




/* test data





*/