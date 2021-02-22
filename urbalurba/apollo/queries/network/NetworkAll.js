import { gql } from '@apollo/client';

const NETWORKALL_QUERY = gql`  

query NetworkAll {
  networks (
    sort: "idName:asc"
  ){
    id
    idName
    displayName
    slogan
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

export default NETWORKALL_QUERY;

