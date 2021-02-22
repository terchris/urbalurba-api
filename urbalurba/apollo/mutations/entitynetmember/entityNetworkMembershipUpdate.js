import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPUPDATE_MUTATION = gql`  

mutation entityNetworkMembershipUpdate(
  $entityNetworkMembershipID: ID!
  $entityID: ID!
  $networkID: ID!
  $text: String
  $status: ENUM_ENTITYNETWORKMEMBERSHIP_STATUS
  $approvedDate: Date
  $approvedBy: String
  $appliedDate: Date
  $appliedBy: String
  $resignedDate: Date
  $resignedBy: String
  $invitedDate: Date
  $invitedBy: String
) {
  updateEntityNetworkMembership(
    input: {
      where: { id: $entityNetworkMembershipID }
      data: {
        entity: $entityID
        network: $networkID
        text: $text
        status: $status
        approvedDate: $approvedDate
        approvedBy: $approvedBy
        appliedDate: $appliedDate
        appliedBy: $appliedBy
        resignedDate: $resignedDate
        resignedBy: $resignedBy
        invitedDate: $invitedDate
        invitedBy: $invitedBy
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

export default ENTITYNETWORKMEMBERSHIPUPDATE_MUTATION;


/* test data
 
{
    "text": "vil med",
    "status": "Applied",
    "approvedDate": "",
    "approvedBy": "",
    "appliedDate": "2020-10-05",
    "appliedBy": "logged in user",
    "resignedDate": "",
    "resignedBy": "",
    "invitedDate": "",
    "invitedBy": "",
    "networkID": "5f3258bf203f6aa1903202f3",
    "entityID": "5f325922203f6aa190320327"
  }
*/
