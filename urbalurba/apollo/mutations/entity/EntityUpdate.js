import { gql } from '@apollo/client';

const ENTITYUPDATE_MUTATION = gql`  


mutation EntityUpdate(
  $id: ID!
  $idName: String!
  $displayName: String!
  $slogan: String!
  $summary: String!
  $description: String
  $url: String
  $phone: String
  $email: String
  $entitytype: ID!
  $visitingAddress: editComponentEntityVisitingAddressInput
  $adminLocation: editComponentEntityAdminLocationInput
  $latLng: editComponentEntityLatlngInput
  $brreg: editComponentEntityBrregInput
  $foreignKeys: editComponentEntityForeignKeyInput
  $domains: [editComponentEntityDomainInput]
  $internalImage: editComponentEntityInternalImageInput
  $socialLinks: editComponentEntitySocialLinkInput
  $status: editComponentEntityStatusInput
) {
  updateEntity(
    input: {
      where: { id: $id }
      data: {
        idName: $idName
        displayName: $displayName
        slogan: $slogan
        summary: $summary
        description: $description
        url: $url
        phone: $phone
        email: $email
        location: { 
          visitingAddress: $visitingAddress
          adminLocation: $adminLocation
          latLng: $latLng 
          }
        brreg: $brreg  
        foreignKeys: $foreignKeys
        domains: $domains
        internalImage: $internalImage
        entitytype: $entitytype
        socialLinks: $socialLinks
        status: $status
      }
    }
  ) {
    entity {
      id
      idName
    }
  }
}




`;

export default ENTITYUPDATE_MUTATION;

/* test data
    {
        "id": "1",
        "idName": "brreg.no",
        "displayName": "Brønnøysundregistrene",
        "slogan": "Register og forenklingsetat",
        "summary": "Brønnøysundregistrene utvikler og driver digitale tjenester som effektiviserer, samordner og forenkler dialogen med det offentlige for personer og virksomheter. Vi driver mange av landets viktigste registre.",
        "description": "Registeretat med 18 offentlige register, hovedsakelig næringsregister. Forvalter av Altinn-løsningen og nasjonale datakataloger.",
        "url": "https://www.brreg.no/",
        "phone": "+4775007500",
        "status": null,
        "location": {
          "visitingAddress": {
            "street": "Havnegata 48",
            "postcode": "8900",
            "city": "BRØNNØYSUND",
            "country": "Norway"
          },
          "latLng": {
            "lat": "65.4763697206934",
            "lng": "12.2124852228775"
          },
          "adminLocation": {
            "municipalityId": "1813",
            "municipalityName": "BRØNNØY",
            "countyId": "18",
            "countyName": "Nordland"
          }
        },
        "brreg": {
          "organizationNumber": 123456789,
          "employees": 100,
          "foundedDate": "2021-01-01",
          "endDate": null,
          "orgType": "manuell"
        },

        "foreignKeys": {
          "organisasjonsnummer": "974760673",
          "sbn_insightly": "90622163",
          "key": null
        },
        
        "domains": [
          {
            "domainName": "brreg.no"
          }
        ],

        "internalImage": {
          "icon": null,
          "profile": {
            "url": "https://storage.googleapis.com/bucket.urbalurba.com/logo/brreg.jpg",
            "caption": null
          },
          "cover": null,
          "square": null
        }
      }

*/        