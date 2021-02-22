import { gql } from '@apollo/client';

const ENTITYIMAGEUPDATE_MUTATION = gql`  

mutation EntityImageUpdate(
  $id: ID!
  $internalImage: editComponentEntityInternalImageInput
) {
  updateEntity(
    input: { where: { id: $id }, data: { internalImage: $internalImage } }
  ) {
    entity {
      id
    }
  }
}





`;

export default ENTITYIMAGEUPDATE_MUTATION;





  

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
