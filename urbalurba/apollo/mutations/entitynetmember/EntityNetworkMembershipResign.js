import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPRESIGN_MUTATION = gql`  

mutation EntityNetworkMembershipResign(
  $entityNetworkMembershipID: ID!
  $text: String
  $resignedDate: Date
  $resignedBy: String
) {
  updateEntityNetworkMembership(
    input: {
      where: { id: $entityNetworkMembershipID }
      data: {
        text: $text
        status: Resigned
        resignedDate: $resignedDate
        resignedBy: $resignedBy
      }
    }
  ) {
    entityNetworkMembership {
      id
      text
    }
  }
}


`;

export default ENTITYNETWORKMEMBERSHIPRESIGN_MUTATION;

//why cant build on vercel find this file ?

/* test data

{
    "text": "slutter",
    "resignedDate": "2016-09-23",
    "resignedBy": "ter",
    "entityNetworkMembershipID": "5f3259cc203f6aa1903203ae"
}


*/
