import { gql } from '@apollo/client';

const CATEGORYITEMCREATE_MUTATION = gql`  

mutation CategoryitemCreate(
  $idName: String!
  $displayName: String!
  $summary: String!
  $description: String!
  $sortOrder: Int
  $color: ComponentEntityColorInput
  $internalImage: ComponentEntityInternalImageInput
  $parentCategoryID: ID!
) {
  createCategoryitem(
    input: {
      data: {
        idName: $idName
        displayName: $displayName
        summary: $summary
        description: $description
        sortOrder: $sortOrder
        color: $color
        internalImage: $internalImage
        category: $parentCategoryID
      }
    }
  ) {
    categoryitem {
      id
      idName
    }
  }
}





`;

export default CATEGORYITEMCREATE_MUTATION;


/* test data
 
 {
        "idName": "jalla",
  			"parentCategoryID": "5f325890203f6aa19031fe0e",
        "displayName": "2Private bedrifter",
        "summary": "2Private bedrifter",
        "description": "2Private bedrifter..",
        "sortOrder": 100,
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
