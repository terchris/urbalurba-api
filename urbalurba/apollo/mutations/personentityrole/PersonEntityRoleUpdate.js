import { gql } from '@apollo/client';

const PERSONENTITYROLEUPDATE_MUTATION = gql`  

mutation PersonEntityRoleUpdate(
  $personEntityRoleID: ID!
  $text: String
  $roleName: String
) {
  updatePersonEntityRole(
    input: {
      where: { id: $personEntityRoleID }
      data: { text: $text, roleName: $roleName }
    }
  ) {
    personEntityRole {
      id
      text
    }
  }
}



`;

export default PERSONENTITYROLEUPDATE_MUTATION;

/* test data

{
  "personEntityRoleID":  "5f32708b203f6aa190321ea6",
  "text": "jalla",
  "roleName": "boss"
}

*/