import { gql } from '@apollo/client';

const ENTITYTYPECREATE_MUTATION = gql`  


mutation EntitytypeCreate(
  $idName: String!
  $displayName: String!
  $summary: String!
  $internalImage: ComponentEntityInternalImageInput
) {
  createEntitytype(
    input: {
      data: {
        idName: $idName
        displayName: $displayName
        summary: $summary
        internalImage: $internalImage
      }
    }
  ) {
    entitytype {
      id
      idName
    }
  }
}



`;

export default ENTITYTYPECREATE_MUTATION;

/* test data
 
  {
        "idName": "jalla",
        "displayName": "jallaSolution",
        "summary": "jallaSolutions er løsninger",
        "internalImage": {
          "icon": {
            "url": "http://bucket.urbalurba.com/cat/entitytype/sol-icon.png",
            "caption": null
          },
          "profile": {
            "url": "http://bucket.urbalurba.com/cat/entitytype/sol-profile.jpg",
            "caption": null
          },
          "cover": {
            "url": "http://bucket.urbalurba.com/cat/entitytype/sol-cover.jpg",
            "caption": null
          }
        }
      }

*/