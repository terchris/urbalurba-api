import { gql } from '@apollo/client';

const NETWORKUPDATE_MUTATION = gql`  

mutation updateNetwork(
  $id: ID!
  $idName: String!
  $displayName: String!
  $slogan: String!
  $summary: String!
  $description: String!
  $url: String
  $phone: String
  $email: String
  $location: editComponentEntityLocationInput
  $internalImage: editComponentEntityInternalImageInput
  $brreg: editComponentEntityBrregInput
  $domains: [editComponentEntityDomainInput]
  $socialLinks: editComponentEntitySocialLinkInput
) {
  updateNetwork(
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
        location: $location
        internalImage: $internalImage
        brreg: $brreg
        domains: $domains
        socialLinks: $socialLinks
      }
    }
  ) {
    network {
      id
      idName
    }
  }
}



`;

export default NETWORKUPDATE_MUTATION;

/* test data 
let record =
{
  "id": "5f3258bf203f6aa1903202e6",
  "idName": "smartebyernorge",
  "displayName": "Smarte Byer Norge",
  "slogan": "Smartbynettverk for alle",
  "summary": "Vi driver frem bærekraftig smartbyutvikling og innovasjon ved å koble  smartby-entusiaster på tvers av fag, bransjer, organisasjoner og næringsliv. Dette gjør vi ved å tilby arenaer for samskaping. ",
  "description": "Smarte Byer Norge nettverket er nordens største smartbynettverk der alle aktører som er interessert i smartbyutvikling møtes for å  diskutere, dele erfaringer og bistå hverandre. Smarte byer er ikke en sektor eller bransje der de fleste vet om hverandre og hvem som gjør hva. Vi ser på det som et tverrfaglig område der stat og kommune, store og små bedrifter, samt FoU-aktører og organisasjoner i sivilsamfunnet må samhandle om vi skal gjøre samfunnet smartere.",
  "url": "http://www.smartebyernorge.no",
  "phone": "90056958",
  "location": {
    "visitingAddress": {
      "street": "vestengkleiva 3",
      "city": "Asker",
      "postcode": "1385",
      "country": "Norway"
    }
  },
  "internalImage": {
    "icon": {
      "url": "http://bucket.urbalurba.com/net/sbn/sbn-icon.png",
      "caption": ""
    },
    "cover": {
      "url": "http://bucket.urbalurba.com/net/sbn/arendalsuka-alle.jpg",
      "caption": ""
    },
    "profile": {
      "url": "http://bucket.urbalurba.com/net/sbn/sbn-profile.jpg",
      "caption": ""
    }
  },
  "domains": [
    {
      "domainName": "smartebyernorge.no",
      "domainName": "smartcitiesnorway.com"
    }
  ],
  "socialLinks": {
    "facebook": "https://www.facebook.com/smartebyernorge"
  }
}

*/

