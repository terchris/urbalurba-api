import { gql } from '@apollo/client';

const ENTITYNETWORKMEMBERSHIPBYENTITYIDNAMEANDNETWORKIDNAME_QUERY = gql`  



query EntityNetworkMembershipByEntityIdNameandNetworkIdName(
  $entityIdName: String!
  $networkIdName: String!
) {
  entityNetworkMemberships(
    where: {
      entity: { idName: $entityIdName }
      network: { idName: $networkIdName }
    }
  ) {
    id
    text
    displayName
    summary
  }
}


`;

export default ENTITYNETWORKMEMBERSHIPBYENTITYIDNAMEANDNETWORKIDNAME_QUERY;




/* test data


{
  "entityIdName": "sintef.no",
  "networkIdName": "smartebyernorge.no"
}


*/