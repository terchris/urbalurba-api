import { gql } from '@apollo/client';

const ENTITYTYPEBYIDNAME_QUERY = gql`  

query EntitytypeByIdName($idName: String!) {
  entitytypes(where: { idName: $idName }) {
    id
    idName
    displayName
    summary
    internalImage {
      profile {
        url
      }
    }
  }
}
`;

export default ENTITYTYPEBYIDNAME_QUERY;

/* test data
{
  "idName": "solution"
}

*/