import { gql } from '@apollo/client';

const ENTITYBYIDNAMEALLFIELDS_QUERY = gql`  


query EntityByIdNameAllFields($idName: String!) {
  entities(where: { idName: $idName }) {
    id
    idName
    displayName
    slogan
    summary
    description
    url
    phone
    email
    status {
      displayName
      summary
    }

    brreg {
      organizationNumber
      employees
      foundedDate
      endDate
      orgType
    }

    image {
      profile {
        url
      }
      cover {
        url
      }
      square {
        url
      }
      icon {
        url
      }      
    }
    internalImage {
      icon {
        url
        caption
      }
      profile {
        url
        caption
      }
      cover {
        url
        caption
      }
      square {
        url
        caption
      }
      
    }

    location {
      visitingAddress {
        street
        postcode
        city
        country
      }
      latLng {
        lat
        lng
      }
      adminLocation {
        municipalityId
        municipalityName
        countyId
        countyName
      }
    }

    entitytype {
      idName
      displayName
      summary
      internalImage {
        icon {
          url
        }
      }
      image {
        icon {
          url
        }
      }
    }

    entity_network_memberships {
      network {
        idName
        displayName
        image {
          profile {
            url
          }
          cover {
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

    entity_categories {
      category {
        idName
        displayName
        summary
        categoryType
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
        }
        internalImage {
          icon {
            url
          }
          profile {
            url
          }
        }
        color {
          text
          background
        }
      }
      entity_category_answers {
        text
        categoryitem {
          idName
          displayName
          summary
          description
          sortOrder
          color {
            text
            background
          }
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
          }
          internalImage {
            icon {
              url
            }
            profile {
              url
            }
          }
        }
      }
    }

    person_entity_roles {
      roleName
      text
      person {
        idName
        firstName
        lastName
        title
        internalImage {
          profile {
            url
          }
        }
        socialLinks {
          twitter
          linkedin
          facebook
          otherURL
        }
      }
    }

    entity_parents {
      text
      displayName
      entity_parent {
        idName
        displayName
        internalImage {
          profile {
            url
          }
        }
        image {
          profile {
            url
          }
        }
        entitytype {
          idName
          displayName
          internalImage {
            icon {
              url
            }
          }
          image {
            icon {
              url
            }
          }
        }
      }
    }

    entity_children {
      text
      displayName

      entity_child {
        idName
        displayName
        internalImage {
          profile {
            url
          }
        }
        image {
          profile {
            url
          }
        }
        entitytype {
          idName
          displayName
          internalImage {
            icon {
              url
            }
          }
          image {
            icon {
              url
            }
          }
        }
      }
    }
  }
}



`;

export default ENTITYBYIDNAMEALLFIELDS_QUERY;

