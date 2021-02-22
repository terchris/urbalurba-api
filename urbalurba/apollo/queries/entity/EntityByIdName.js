import { gql } from '@apollo/client';

const ENTITYBYIDNAME_QUERY = gql`  


query EntityByIdName($idName: String!) {
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
      id
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
        id
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
        id
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
        answerText
        categoryitem {
          id
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
        }
      }
    }

    person_entity_roles {
      roleName
      text
      person {
        id
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
        id
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
          id
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
        id
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
          id
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

export default ENTITYBYIDNAME_QUERY;

/* test data

{
"idName": "elektrisk-passasjerferge"
}

*/