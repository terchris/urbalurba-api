import { gql } from '@apollo/client';

const ENTITYCREATE_MUTATION = gql`  


mutation EntityCreate(
  $idName: String!
  $displayName: String!
  $slogan: String!
  $summary: String!
  $description: String
  $url: String
  $phone: String
  $email: String
  $entitytype: ID!
  $visitingAddress: ComponentEntityVisitingAddressInput
  $adminLocation: ComponentEntityAdminLocationInput
  $latLng: ComponentEntityLatlngInput
  $brreg: ComponentEntityBrregInput
  $foreignKeys: ComponentEntityForeignKeyInput
  $domains: [ComponentEntityDomainInput]
  $internalImage: ComponentEntityInternalImageInput
  $socialLinks: ComponentEntitySocialLinkInput
  $status: ComponentEntityStatusInput
) {
  createEntity(
    input: {
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

export default ENTITYCREATE_MUTATION;

/* test data

{
  "idName": "bronnoysundregistrene",
  "displayName": "Brønnøysundregistrene",
  "slogan": "Register og forenklingsetat",
  "summary": "Brønnøysundregistrene utvikler og driver digitale tjenester som effektiviserer, samordner og forenkler dialogen med det offentlige for personer og virksomheter. Vi driver mange av landets viktigste registre.",
  "description": "Registeretat med 18 offentlige register, hovedsakelig næringsregister. Forvalter av Altinn-løsningen og nasjonale datakataloger.",
  "url": "https://www.brreg.no/",
  "phone": "99210226",
  "visitingAddress": {
    "street": "Havnegata 48",
    "city": "Brønnøysund",
    "postcode": "8900",
    "country": "Norway"
  },
  "foreignKeys": {
    "organisasjonsnummer": "974760673",
    "sbn_insightly": "90622163"
  },
  "domains": [
    {
      "domainName": "brreg.no"
    }
  ],
  "internalImage": {
    "profile": {
      "url": "http://bucket.urbalurba.com/logo/brreg.jpg"
    }
  },
  "entitytype": "5fa3d73fe003336c0f81149e",
  "socialLinks": {
    "facebook": "https://www.facebook.com/brreg"
  }
}


*/