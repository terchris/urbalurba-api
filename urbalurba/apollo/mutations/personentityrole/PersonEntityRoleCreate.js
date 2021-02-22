import { gql } from '@apollo/client';

const PERSONENTITYROLECREATE_MUTATION = gql`  

mutation PersonEntityRoleCreate(
  $entityID: ID!
  $personID: ID!
  $text: String
  $roleName: String
) {
  createPersonEntityRole(
    input: {
      data: {
        text: $text
        roleName: $roleName
        person: $personID
        entity: $entityID
      }
    }
  ) {
    personEntityRole {
      id
      text
    }
  }
}



`;

export default PERSONENTITYROLECREATE_MUTATION;

/* test data

{
        "text": "jalla",
        "roleName": "boss",
        "personID": "5f31644f81995e94d12312db",
        "entityID": "5f3259cb203f6aa190320399"
}


*/