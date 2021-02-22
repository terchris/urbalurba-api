import { gql } from '@apollo/client';

const ENTITYDESCRIPTIONUPDATE_MUTATION = gql`  


mutation EntityDescriptionUpdate(
  $id: ID!
  $description: String!

) {
  updateEntity(
    input: {
      where: { id: $id }
      data: {
        description: $description
      }
    }
  ) {
    entity {
      id
    }
  }
}





`;

export default ENTITYDESCRIPTIONUPDATE_MUTATION;

