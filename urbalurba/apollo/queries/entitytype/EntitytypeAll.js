import { gql } from '@apollo/client';

const ENTITYTYPEALL_QUERY = gql`  

query EntitytypeAll {
  entitytypes {
    id
    idName
    displayName
    summary

    image {
      profile {
        url
      }
    }
    internalImage {
      profile {
        url
      }
    }
  }
}



`;

export default ENTITYTYPEALL_QUERY;

