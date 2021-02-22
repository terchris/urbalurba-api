import { gql } from '@apollo/client';

const CATEGORYCREATE_MUTATION = gql`  

mutation createCategory(
  $idName: String!
  $displayName: String!
  $summary: String!
  $description: String!
  $categoryType: ENUM_CATEGORY_CATEGORYTYPE!
  $color: ComponentEntityColorInput
  $internalImage: ComponentEntityInternalImageInput
) {
  createCategory(
    input: {
      data: {
        idName: $idName
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
    }
  }
}

`;

export default CATEGORYCREATE_MUTATION;


/* test data
 
    {
        "idName": "slett",
        "displayName": "Organisasjonstype",
        "summary": "Types of organizations",
        "description": "Virksomhets typer her",
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
