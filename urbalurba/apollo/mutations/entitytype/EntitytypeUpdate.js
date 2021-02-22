import { gql } from '@apollo/client';

const ENTITYTYPEUPDATE_MUTATION = gql`  

mutation EntitytypeUpdate(
  $id: ID!
  $idName: String!
  $displayName: String!
  $summary: String!
  $internalImage: editComponentEntityInternalImageInput
) {
  updateEntitytype(
    input: {
      where: { id: $id }
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

export default ENTITYTYPEUPDATE_MUTATION;

/* test data
 
 {
        "id": "5f3258ac203f6aa1903202b0",
        "idName": "solution",
        "displayName": "Solution",
        "summary": "Solutions er løsninger",
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