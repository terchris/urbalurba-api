import { gql } from '@apollo/client';

const CATEGORIESFORNETWORKANDENTITYBYENTITYID_QUERY = gql`  

query CategoriesForNetworkAndEntityByEntityID($entityID: String!) {
  networkCategories: categories(
    where: {
      network_entitytype_categories: {
        network_entitytype: {
          network: { entity_network_memberships: { entity: { id: $entityID } } }
        }
      }
    }
  ) {
    ...categoryData
  }

  entityCategories(
    where: {  entity: { id: $entityID }  }
  ) {
    id
    text
    category {
      id
      idName
    }
  }
}

fragment categoryData on Category {
  id
  idName
  displayName
  summary
  description
  image {
    cover {
      url
    }    
    profile {
      url
    }
    icon {
      url
    }
  }
  internalImage {
    cover {
      url
    }    
    profile {
      url
    }
    icon {
      url
    }

  }
}






`;

export default CATEGORIESFORNETWORKANDENTITYBYENTITYID_QUERY;


/* safe delete ?
query CategoriesForNetworkAndEntityByEntityID($entityID: String!) {
  networkCategories: categories(
    where: {
      network_entitytype_categories: {
        network_entitytype: {
          network: { entity_network_memberships: { entity: { id: $entityID } } }
        }
      }
    }
  ) {
    ...categoryData
  }

  entityCategories: categories(
    where: { entity_categories: { entity: { id: $entityID } } }
  ) {
    ...categoryData
  }
}

fragment categoryData on Category {
  idName
  displayName
  summary
  description
  image {
    profile {
      url
    }
  }
  internalImage {
    profile {
      url
    }
  }
}





`;
*/