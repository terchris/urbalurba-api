import { gql } from '@apollo/client';

const NETWORKBYIDNAME_QUERY = gql`  

query NetworkByIdName($idName: String!) {
  networks(where: { idName: $idName }) {
    id
    idName
    displayName
    slogan
    summary
    url
    description
    phone
    email
    image {
      icon {
        url
      }
      profile {
        url
      }
      cover {
        url
      }
      square {
        url
      }
    }
    internalImage {
      icon {
        url
      }
      profile {
        url
      }
      cover {
        url
      }
      square {
        url
      }
    }
    color {
      background
      text
    }
    socialLinks {
      facebook
      linkedin
      twitter
      otherURL
      instagram
      youtube
    }
    externalLinks {
      link {
        displayName
        slogan
        summary
        url
      }
    }
    domains {
      domainName
    }
    location {
      visitingAddress {
        street
        city
        postcode
        country
      }
      adminLocation {
        municipalityId
        municipalityName
        countyId
        countyName
      }
      latLng {
        lat
        lng
      }
    }
    brreg {
      employees
      foundedDate
      endDate
      orgType
      organizationNumber
    }
    textBlock {
      idName
      summary
      displayName
      description
    }
  }
}


`;

export default NETWORKBYIDNAME_QUERY;

/* test data
{
  "idName": "smartebyernorge"
}

*/