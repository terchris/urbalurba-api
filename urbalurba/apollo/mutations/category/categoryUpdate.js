import { gql } from '@apollo/client';

const CATEGORYUPDATE_MUTATION = gql`  

mutation updateCategory(
  $id: ID!
  $displayName: String!
  $summary: String!
  $description: String!
  $categoryType: ENUM_CATEGORY_CATEGORYTYPE
  $color: editComponentEntityColorInput
  $internalImage: editComponentEntityInternalImageInput
) {
  updateCategory(
    input: {
      where: { id: $id }
      data: {
        displayName: $displayName
        summary: $summary
        description: $description
        categoryType: $categoryType
        color: $color
        internalImage: $internalImage
      }
    }
  ) {
    category {
      id
      idName
      displayName
    }
  }
}



`;

export default CATEGORYUPDATE_MUTATION;


/* test data
 
  {
        "id": "5f325890203f6aa19031fe0e",
        "displayName": "Organisasjonstype",
        "summary": "Types of organizations",
        "description": "Virksomhets typer",
        "categoryType": "single",
        "color": {
          "background": "#4B5731",
          "text": "#ffffff"
        },
        "internalImage": {
          "icon": {
            "url": "http://bucket.urbalurba.com/cat/orgtype/orgtype-logo-small.jpg",
            "caption": null
          },
          "profile": {
            "url": "http://bucket.urbalurba.com/cat/orgtype/orgtype-logo-medium.png",
            "caption": null
          },
          "cover": {
            "url": "http://bucket.urbalurba.com/cat/orgtype/orgtype-logo-large.png",
            "caption": null
          }
        }
      }


*/
