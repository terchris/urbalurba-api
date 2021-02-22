import gql from "graphql-tag";

const PERSONENTITYROLEIDBYENTITYIDANDPERSONID_QUERY = gql`  


query PersonEntityRoleIDByEntityIDandPersonID($entityID: ID!, $personID: ID!) {
  personEntityRoles(where: { person: $personID, entity: $entityID }) {
    id
    text
  }
}


`;

export default PERSONENTITYROLEIDBYENTITYIDANDPERSONID_QUERY;

/* test data
{
    "entityID": "5f3259cc203f6aa1903203af",
    "personID": "5f32708b203f6aa190321ea1"
}
*/