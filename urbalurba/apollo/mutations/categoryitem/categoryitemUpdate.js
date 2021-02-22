import { gql } from '@apollo/client';

const CATEGORYITEMUPDATE_MUTATION = gql`  

mutation CategoryitemUpdate(
  $id: ID!
  $displayName: String!
  $summary: String!
  $description: String!
  $sortOrder: Int
  $color: editComponentEntityColorInput
  $internalImage: editComponentEntityInternalImageInput
) {
  updateCategoryitem(
    input: {
      where: { id: $id }
      data: {
        displayName: $displayName
        summary: $summary
        description: $description
        sortOrder: $sortOrder
        color: $color
        internalImage: $internalImage
      }
    }
  ) {
    categoryitem {
      id
    }
  }
}





`;

export default CATEGORYITEMUPDATE_MUTATION;


/* test data
 
 {
        "id": "5f325890203f6aa19031fe19",
        "displayName": "Private bedrifter",
        "summary": "Private bedrifter",
        "description": "Private bedrifter..",
        "sortOrder": 1,
        "color": {
          "background": "#4B5731",
          "text": "#ffffff"
        },
        "internalImage": {
          "icon": {
            "url": "http://bucket.urbalurba.com/cat/orgtype/orgtype-priv-small.jpg",
            "caption": null
          },
          "profile": {
            "url": "http://bucket.urbalurba.com/cat/orgtype/orgtype-priv-medium.png",
            "caption": null
          },
          "cover": {
            "url": "http://bucket.urbalurba.com/cat/orgtype/orgtype-priv-large.png",
            "caption": null
          }
        }
      }
  
*/
