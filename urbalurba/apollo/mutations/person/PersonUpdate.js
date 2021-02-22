import { gql } from '@apollo/client';

const PERSONUPDATE_MUTATION = gql`  

mutation PersonUpdate(
  $id: ID!
  $idName: String!
  $firstName: String
  $lastName: String
  $title: String
  $internalImage: editComponentEntityInternalImageInput
  $socialLinks: editComponentEntitySocialLinkInput
  $foreignKeys: editComponentEntityForeignKeyInput
) {
  updatePerson(
    input: {
      where: { id: $id }
      data: {
        idName: $idName
        firstName: $firstName
        lastName: $lastName
        title: $title
        internalImage: $internalImage
        socialLinks: $socialLinks
        foreignKeys: $foreignKeys
      }
    }
  ) {
    person {
      id
      idName
    }
  }
}



`;

export default PERSONUPDATE_MUTATION;

/* test data

{
  "id": "5fa53d5b12980f0469316cda",
  "idName": "jalla-jalla",
  "firstName": "UPDATEDBirger",
  "lastName": "Lie",
  "title": "Founder & CEO",
  "internalImage": {
    "profile": {
      "url": "https://s3.amazonaws.com/insightly.userfiles/720224/SJLDPG/ed232826-5b1f-4e6c-b573-acfdf65d58e6.jpeg?AWSAccessKeyId=AKIAJRNAGB7KJX37RU4Q&Expires=1604663005&Signature=WG1XnMIa4SxH%2B1fljL4gnC53t%2FA%3D"
    }
  },
  "socialLinks": {
    "linkedin": "https://www.linkedin.com/in/birgerlie",
    "facebook": "https://www.facebook.com/birger.lie.9",
    "twitter": "https://twitter.com/birgerlie"
  },
  "foreignKeys": {
    "sbn_insightly": "188856907"
  }
}






*/