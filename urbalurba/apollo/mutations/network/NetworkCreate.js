import { gql } from '@apollo/client';

const NETWORKCREATE_MUTATION = gql`  

mutation createNetwork(
  $idName: String!
  $displayName: String!
  $slogan: String!
  $summary: String!
  $description: String!
  $url: String
  $phone: String
  $email: String
  $location: ComponentEntityLocationInput
  $internalImage: ComponentEntityInternalImageInput
  $brreg: ComponentEntityBrregInput
  $domains: [ComponentEntityDomainInput]
  $socialLinks: ComponentEntitySocialLinkInput
) {
  createNetwork(
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

export default NETWORKCREATE_MUTATION;

/* test data
 
    {
        "idName": "2sbn",
        "displayName": "2Smarte Byer Norge",
        "slogan": "2Smartbynettverk for alle",
        "summary": "2Vi driver frem bærekraftig smartbyutvikling og innovasjon ved å koble  smartby-entusiaster på tvers av fag, bransjer, organisasjoner og næringsliv. Dette gjør vi ved å tilby arenaer for samskaping. ",
        "description": "2Smarte Byer Norge nettverket er nordens største smartbynettverk der alle aktører som er interessert i smartbyutvikling møtes for å  diskutere, dele erfaringer og bistå hverandre. Smarte byer er ikke en sektor eller bransje der de fleste vet om hverandre og hvem som gjør hva. Vi ser på det som et tverrfaglig område der stat og kommune, store og små bedrifter, samt FoU-aktører og organisasjoner i sivilsamfunnet må samhandle om vi skal gjøre samfunnet smartere.",
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
        }        
    }



*/