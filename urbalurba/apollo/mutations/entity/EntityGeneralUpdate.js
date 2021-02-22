import { gql } from '@apollo/client';

const ENTITYGENERALUPDATE_MUTATION = gql`  


mutation EntityGeneralUpdate(
  $id: ID!
  $idName: String!
  $displayName: String!
  $slogan: String!
  $summary: String!
  $url: String
  $phone: String
  $email: String
) {
  updateEntity(
    input: {
      where: { id: $id }
      data: {
        idName: $idName
        displayName: $displayName
        slogan: $slogan
        summary: $summary
        url: $url
        phone: $phone
        email: $email
      }
    }
  ) {
    entity {
      id
    }
  }
}





`;

export default ENTITYGENERALUPDATE_MUTATION;

