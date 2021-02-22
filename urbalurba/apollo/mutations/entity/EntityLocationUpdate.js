import { gql } from '@apollo/client';

const ENTITYLOCATIONUPDATE_MUTATION = gql`  


mutation EntityLocationAdminUpdate(
  $id: ID!
  $location: editComponentEntityLocationInput
) {
  updateEntity(input: { where: { id: $id }, data: { location: $location } }) {
    entity {
      id
    }
  }
}





`;

export default ENTITYLOCATIONUPDATE_MUTATION;





  

/* test data
 {
        "id": "5f338505203f6aa1903223d9",
  			"location": {
              "visitingAddress": {
                "street": "my street",
                "city": "asker",
                "postcode": "1385",
                "country": "Norway"
            	},
            	"adminLocation": {
								"municipalityId": "0301",
        				"municipalityName": "Oslo",
        				"countyId": "O3",
        				"countyName": "Oslo"            
            	},
            	"latLng": {
								"lat": "59.8062345",
        				"lng": "10.3968137"
            	}
				}
}

*/
