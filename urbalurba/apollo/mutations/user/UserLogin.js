import { gql } from '@apollo/client';

const USERLOGIN_MUTATION = gql`  

mutation UserLogin($identifier: String!, $password: String!) {
  login(input: { identifier: $identifier, password: $password }) {
    user {
      id
      username
      email
      role {
        name
        type
        description
      }
    }
    jwt
  }
}

`;

export default USERLOGIN_MUTATION;

/* test data
{
    "identifier": "urbalurba@urbalurba.no",
    "password": "jalla" 
}
*/