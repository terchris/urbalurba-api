// library functions for accessing the strapi backend
// name: strapidatalib

import dotenv from 'dotenv'
dotenv.config()

//export const NETWORKIDNAME = `${process.env.NETWORKIDNAME}` || "smartebyernorge.no";
//export const STRAPIURI = `${process.env.NEXT_PUBLIC_STRAPIURI}` || "https://strapi.urbalurba.no/graphql";

export const NETWORKIDNAME = process.env.NETWORKIDNAME || "smartebyernorge.no";
export const STRAPIURI = process.env.NEXT_PUBLIC_STRAPIURI || "https://strapi.urbalurba.no/graphql";


import { initializeApollo } from '../apollo/apolloClient.js'
import slugify from "slugify"

import {
  getIconImage, getProfileImage, getCoverImage, getSquareImage, getNested,
  URL_SEPARATOR, ORGANIZATION_ENTITYTYPE, DEFAULT_PARENT_IDNAME
} from "./urbalurbalib2.js";



const apolloClient = initializeApollo();//For all functions 



//entity
import ENTITYPEBYNETWORKSLUG_QUERY from "../apollo/queries/entity/EntityByNetworkSlug.js";
import ENTITYBYIDNAME_QUERY from "../apollo/queries/entity/EntityByIdName.js";
import ENTITYPEBYNETWORK_QUERY from "../apollo/queries/entity/EntityByNetwork.js";
import ENTITYBYCATEGORYANDCATEGORYITEM_QUERY from "../apollo/queries/entity/EntityByCategoryAndCategoryitem.js";
import ENTITYALLINSIGHTLYFOREIGNKEY_QUERY from "../apollo/queries/entity/EntityAllInsightlyForeignKey.js";
import ENTITYALL_QUERY from "../apollo/queries/entity/EntityAll.js";
import ENTITYBYNETWORKIDNAMEANDENTITYTYPEIDNAME_QUERY from "../apollo/queries/entity/EntityByNetworkIdNameAndEntitytypeIdName.js";
import ENTITYUPDATE_MUTATION from "../apollo/mutations/entity/EntityUpdate.js";
import ENTITYCREATE_MUTATION from "../apollo/mutations/entity/EntityCreate.js";


//category 
import CATEGORIESBYNETWORK_QUERY from "../apollo/queries/category/CategoriesByNetwork.js";
import CATEGORYANDITEMSBYIDNAME_QUERY from "../apollo/queries/category/CategoryAndItemsByIdName.js";
import CATEGORIESANDITEMSBYNETWORKIDNAME_QUERY from "../apollo/queries/category/CategoriesAndItemsByNetworkIdName.js";
import CATEGORYBYIDNAME_QUERY from "../apollo/queries/category/CategoryByIdName.js";

import CATEGORYUPDATE_MUTATION from "../apollo/mutations/category/categoryUpdate.js";
import CATEGORYCREATE_MUTATION from "../apollo/mutations/category/categoryCreate.js";

//entityCategory
import ENTITYCATEGORYBYIDNAME_QUERY from "../apollo/queries/entitycategory/EntityCategoryByIdName.js";
import ENTITYCATEGORYCREATE_MUTATION from "../apollo/mutations/entitycat/EntityCategoryCreate.js";

//categoryitem
import CATEGORYITEMBYIDNAMEANDCATEGORYIDNAME_QUERY from "../apollo/queries/categoryitem/CategoryitemByIdNameAndCategoryIdName.js";
import CATEGORYITEMBYIDNAMEANDCATEGORYID_QUERY from "../apollo/queries/categoryitem/CategoryitemByIdNameAndCategoryID.js";
import CATEGORYITEMUPDATE_MUTATION from "../apollo/mutations/categoryitem/categoryitemUpdate.js";
import CATEGORYITEMCREATE_MUTATION from "../apollo/mutations/categoryitem/categoryitemCreate.js";


//network
import NETWORKALL_QUERY from "../apollo/queries/network/NetworkAll.js";
import NETWORKBYIDNAME_QUERY from "../apollo/queries/network/NetworkByIdName.js";
import NETWORKUPDATE_MUTATION from "../apollo/mutations/network/NetworkUpdate.js";
import NETWORKCREATE_MUTATION from "../apollo/mutations/network/NetworkCreate.js";


//entitytype
import ENTITYTYPEALL_QUERY from "../apollo/queries/entitytype/EntitytypeAll.js";
import ENTITYTYPEBYIDNAME_QUERY from "../apollo/queries/entitytype/EntitytypeByIdName.js";
import ENTITYTYPEUPDATE_MUTATION from "../apollo/mutations/entitytype/EntitytypeUpdate.js";
import ENTITYTYPECREATE_MUTATION from "../apollo/mutations/entitytype/EntitytypeCreate.js";


//entityCategoryAnswer
import ENTITYCATEGORYANSWERBYCATEGORYITEMIDANDENTTITYCATEGORYIDNAME_QUERY from "../apollo/queries/entitycatanswer/EntityCategoryAnswerByCategoryitemIDandEntityCatategoryIdName.js";
import ENTITYCATEGORYANSWERCREATE_MUTATION from "../apollo/mutations/entitycatanswer/EntityCategoryAnswerCreate.js";
import ENTITYCATEGORYANSWERUPDATE_MUTATION from "../apollo/mutations/entitycatanswer/EntCatAnsUpdate.js";

//entityNetworkMembership
import ENTITYNETWORKMEMBERSHIPBYENTITYIDANDNETWORKID_QUERY from "../apollo/queries/entitynetmember/EntityNetworkMembershipByEntityIDandNetworkID.js";
import ENTITYNETWORKMEMBERSHIPBYENTITYIDNAMEANDNETWORKIDNAME_QUERY from "../apollo/queries/entitynetmember/EntityNetworkMembershipByEntityIdNameandNetworkIdName.js";
import ENTITYNETWORKMEMBERSHIPCREATE_MUTATION from "../apollo/mutations/entitynetmember/EntityNetworkMembershipCreate.js";
import ENTITYNETWORKMEMBERSHIPAPPROVE_MUTATION from "../apollo/mutations/entitynetmember/EntityNetworkMembershipApprove.js";
import ENTITYNETWORKMEMBERSHIPAPPLY_MUTATION from "../apollo/mutations/entitynetmember/EntityNetworkMembershipApply.js";
import ENTITYNETWORKMEMBERSHIPINVITE_MUTATION from "../apollo/mutations/entitynetmember/EntityNetworkMembershipInvite.js";
import ENTITYNETWORKMEMBERSHIPRESIGN_MUTATION from "../apollo/mutations/entitynetmember/EntityNetworkMembershipResign.js";

//entityrelation
import ENTITYRELATIONBYKEYIDS_QUERY from "../apollo/queries/entityrelation/EntityrelationByKeyIDs.js";
import ENTITYRELATIONPARENTUPDATE_MUTATION from "../apollo/mutations/entityrelation/EntityrelationParentUpdate.js";
import ENTITYRELATIONPARENTCREATE_MUTATION from "../apollo/mutations/entityrelation/EntityrelationParentCreate.js";



//person
import PERSONALLINSIGHTLYFOREIGNKEY_QUERY from "../apollo/queries/person/PersonAllInsightlyForeignKey.js";
import PERSONCREATE_MUTATION from "../apollo/mutations/person/PersonCreate.js";
import PERSONUPDATE_MUTATION from "../apollo/mutations/person/PersonUpdate.js";


//personEntityRole
import PERSONENTITYROLEIDBYENTITYIDANDPERSONID_QUERY from "../apollo/queries/personentityrole/PersonEntityRoleByEntityIDandPersonID.js";
import PERSONENTITYROLECREATE_MUTATION from "../apollo/mutations/personentityrole/PersonEntityRoleCreate.js";
import PERSONENTITYROLEUPDATE_MUTATION from "../apollo/mutations/personentityrole/PersonEntityRoleUpdate.js";


//networkEntitytype
import NETWORKENTITYTYPEBYENTITYTYPEIDANDNETWORKID_QUERY from "../apollo/queries/networkentitytype/NetworkEntitytypeByEntitytypeIDandNetworkID.js";
import NETWORKENTITYTYPEUPDATE_MUTATION from "../apollo/mutations/networkentitytype/NetworkEntitytypeUpdate.js";
import NETWORKENTITYTYPECREATE_MUTATION from "../apollo/mutations/networkentitytype/NetworkEntitytypeCreate.js";

import NETWORKENTITYTYPEANDCATEGORIESBYNETWORKIDNAME_QUERY from "../apollo/queries/networkentitytype/NetworkEntitytypeAndCategoriesByNetworkIdName.js";


//networkEntitytypeCategory
import NETWORKENTITYTYPECATEGORYBYNETWORKENTITYTYPEIDANDCATEGORYID_QUERY from "../apollo/queries/networkentitytypecategory/NetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID.js";
import NETWORKENTITYTYPECATEGORYUPDATE_MUTATION from "../apollo/mutations/networkentitytypecategory/NetworkEntitytypeCategoryUpdate.js";
import NETWORKENTITYTYPECATEGORYCREATE_MUTATION from "../apollo/mutations/networkentitytypecategory/NetworkEntitytypeCategoryCreate.js";

// personNetworkMembershipRole
import PERSONNETWORKMEMBERSHIPROLEBYPERSONIDANDENTITYNETWORKMEMBERSHIPID_QUERY from "../apollo/queries/personnetworkmembershiprole/PersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID.js";
import PERSONNETWORKMEMBERSHIPROLEUPDATE_MUTATION from "../apollo/mutations/personnetworkmembershiprole/PersonNetworkMembershipRoleUpdate.js";
import PERSONNETWORKMEMBERSHIPROLECREATE_MUTATION from "../apollo/mutations/personnetworkmembershiprole/PersonNetworkMembershipRoleCreate.js";



export async function getAllEntitiesSlug() {
  //console.log("1 getAllEntityIdNames")
  let paramArray = [];
  let paramRecord = {};

  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
    "networkIdName": NETWORKIDNAME
  };





  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYPEBYNETWORKSLUG_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllEntityIdNames catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }


  dataArray.map(item => {

    paramRecord = {
      params: {
        idName: item.idName
      }
    }
    paramArray.push(paramRecord);

  });


  //console.log("2 getAllEntityIdNames total :=" + paramArray.length + "=")
  return paramArray;
}


export async function getAllEntitiesNetworkList() {
  //console.log("1 getAllEntitiesList")

  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
    "networkIdName": NETWORKIDNAME
  };





  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYPEBYNETWORK_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
            //console.log("1 getAllEntityIdNames Reading:", blockData.length);
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllEntitiesNetworkList catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }




  return dataArray;
}


export async function getAllEntitiesList() {


  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor
  };


  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYALL_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
            //console.log("1 getAllEntityIdNames Reading:", blockData.length);
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllEntitiesList catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }



  //console.log("2 getAllEntitiesList total :=" + dataArray.length + "=")
  return dataArray;
}





/** getEntityByIdName
 * get the whole entity by the idName
 * if not found it returns an empty object
 */
export async function getEntityByIdName(idName) {


  let entity = {};
  let response;
  const myVariables = {
    idName: idName
  };

  try {


    response = await apolloClient.query({
      query: ENTITYBYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.entities)) { // there is a result set
      if (response.data.entities.length > 0) {
        entity = response.data.entities[0];
      }
    } else { // error - entity not there
      console.info("getEntityByIdName idName does not exist =" + idName + "=");

      //TODO: in case category is not there - what do we do ?      
    }

  }
  catch (e) {
    console.error("1.9 getEntityByIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }


  return entity;

}


/** getEntityIDByIdName
 * get the entity ID  by the idName
 * if not found it returns "none"
 */
export async function getEntityIDByIdName(idName) {

  let returnEntityID = "";
  let entity = {};

  entity = await getEntityByIdName(idName);

  if (entity.id) {
    returnEntityID = entity.id;
  } else {
    returnEntityID = "none";
  }
  return returnEntityID;

}

export async function getNetworkCategoriesList(networkIdName) {
// renamed from getAllCategoriesList to getNetworkCategoriesList

  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
    "networkIdName": networkIdName
  };





  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: CATEGORIESBYNETWORK_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.categories)) { // there is a result set
        if (response.data.categories.length > 0) {
          blockData = response.data.categories;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getNetworkCategoriesList catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }


  return dataArray;
}


/** getAllCategoriesSlug
 * gets all idNames for categories and returns them so that the result can be used in getStaticPaths 
 */
export async function getAllCategoriesSlug(networkIdName) {

  let paramArray = [];
  let paramRecord = {};

  let dataArray = await getNetworkCategoriesList(networkIdName); //using the same

  dataArray.map(item => {

    paramRecord = {
      params: {
        category: item.idName
      }
    }
    paramArray.push(paramRecord);

  });

  return paramArray;
}

/** getAllNetworksSlug
 * gets all idNames for the networks 
 */
export async function getAllNetworksSlug() {

  let paramArray = [];
  let paramRecord = {};

  let dataArray = await getAllNetworksList(); //using the same

  dataArray.map(item => {

    paramRecord = {
      params: {
        network: item.idName
      }
    }
    paramArray.push(paramRecord);

  });

  return paramArray;
}




/** getAllNetworkEntitytypesSlug
 * gets all idNames for networkEntitytype and returns them so that the result can be used in getStaticPaths 
 */
export async function getAllNetworkEntitytypesSlug(networkIdName) {

  let paramArray = [];
  let paramRecord = {};

  let dataArray = await getNetworkEntitytypeAndCategoriesByNetworkIdName(networkIdName); //reusing can be optimized

  if (Array.isArray(dataArray)) { //  it is an array
    if (dataArray.length > 0) {
      dataArray.map(item => {

        paramRecord = {
          params: {
            entitytype: item.entitytype.idName
          }
        }
        paramArray.push(paramRecord);

      });

    } else { // no entitypes rettuned - must be some sort of error
      console.error("getAllNetworkEntitytypesSlug: networkIdName=" + networkIdName + "= has no entitype's");
      debugger
    }
  } else { //no array returned - that is some wired error
    console.error("getAllNetworkEntitytypesSlug: networkIdName=" + networkIdName + "= has no entitype's. what was returned is not an array");
    debugger
  }


  return paramArray;
}







export async function getCategoryAndItems(idName) {

  let category = {};
  let response;
  const myVariables = {
    idName: idName
  };

  try {


    response = await apolloClient.query({
      query: CATEGORYANDITEMSBYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.categories)) { // there is a result set
      if (response.data.categories.length > 0) {
        category = response.data.categories[0];
      }
    } else { // error - entity not there
      console.error("1.9 getCategory idName does not exist =" + idName + "=");
      debugger;
      //TODO: in case category is not there - what do we do ?      
    }

  }
  catch (e) {
    console.error("1.9 getCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }


  return category;

}




export async function getAllCategoryitemsSlug() {
  //console.log("1 getAllCategoryitemsSlug")
  let paramArray = [];
  let paramRecord = {};

  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
    "networkIdName": NETWORKIDNAME
  };



  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: CATEGORIESANDITEMSBYNETWORKIDNAME_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.categories)) { // there is a result set
        if (response.data.categories.length > 0) {
          blockData = response.data.categories;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
            //console.log("1 getAllEntityIdNames Reading:", blockData.length);
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllCategoryitemsSlug catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }



  dataArray.map(category => {

    category.categoryitems.map(categoryitem => {
      paramRecord = {
        params: {
          categoryitem: [
            category.idName,
            categoryitem.idName
          ]
        }
      };
      //console.error("1.5 getAllCategoryitemsSlug category.idName=" + category.idName + "= categoryitem.idName="+ categoryitem.idName +"=");
      paramArray.push(paramRecord);
    });



  });


  //console.log("2 getAllEntityIdNames total :=" + paramArray.length + "=")
  return paramArray;
}





export async function getEntitiesByCategoryAndCategoryitem(categoryIdName, categoryitemIdName) {
  //console.log("1 getEntitiesByCategoryAndCategoryitem categoryIdName=" +categoryIdName + "=  categoryitemIdName="+ categoryitemIdName +"=");      


  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
    "networkIdName": NETWORKIDNAME,
    "categoryIdName": categoryIdName,
    "categoryitemIdName": categoryitemIdName
  };



  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYBYCATEGORYANDCATEGORYITEM_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getEntitiesByCategoryAndCategoryitem catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }


  //console.log("2 getEntitiesByCategoryAndCategoryitem total :=" + dataArray.length + "=");

  return dataArray;

}


/** getAllNetworksList
 * returns an array of networks in strapi.
 * If there are none then a empty array is returned
 */

export async function getAllNetworksList() {


  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
  };




  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: NETWORKALL_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.networks)) { // there is a result set
        if (response.data.networks.length > 0) {
          blockData = response.data.networks;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllNetworksList catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }

  return dataArray;
}

/* getNetworkByIdName 
Gets the network by the idName - returns the network record or an empty object if not found
*/
export async function getNetworkByIdName(idName) {

  let ReturnRecord = {};
  let response;
  const myVariables = {
    idName: idName
  };

  try {


    response = await apolloClient.query({
      query: NETWORKBYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.networks)) { // there is a result set
      if (response.data.networks.length > 0) {
        ReturnRecord = response.data.networks[0];
      }
    } else { // error - network not there
      console.error("1.9 getNetwork idName does not exist =" + idName + "=");
      debugger;
      //TODO: in case its not there - what do we do ?      
    }

  }
  catch (e) {
    console.error("1.9 getNetwork catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }


  return ReturnRecord;

}




/** getNetworkIDByIdName
 * checks if a network with idName  exists - if it rexist it returns the ID it gets from strapi
 * otherwise it returns "none"
 */
export async function getNetworkIDByIdName(networkIdName) {

  let ReturnID = "none"; //assume its not there
  const ReturnRecord = await getNetworkByIdName(networkIdName);

  if (Object.keys(ReturnRecord).length === 0 && ReturnRecord.constructor === Object)  //if it is empty    
    ReturnID = "none";
  else
    ReturnID = ReturnRecord.id; //we can return the ID

  return ReturnID;
};






/** getCategoryByIdName
 * checks if a category with idName  exists - if it rexist it returns the category record
 * otherwise it returns "none"  
 * @param {*} categoryIdName 
 */
export async function getCategoryByIdName(categoryIdName) {

  let response;
  const myVariables = {
    "idName": categoryIdName
  };

  let categoryRecord = "none"; //assume its not there


  try {


    response = await apolloClient.query({
      query: CATEGORYBYIDNAME_QUERY,
      variables: myVariables
    });




    if (Array.isArray(response.data.categories)) { // there is a result set
      if (response.data.categories.length > 0) {
        categoryRecord = response.data.categories[0];
      }
    }

  }
  catch (e) {
    console.error("1.9 getCategoryByIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return categoryRecord;
};








/** getCategoryIDByIdName
 * checks if a category with idName  exists - if it rexist it returns the ID 
 * otherwise it returns "none"  
 * @param {*} categoryIdName 
 */
export async function getCategoryIDByIdName(categoryIdName) {


  let categoryID = "none"; //assume its not there

  let categoryRecord = await getCategoryByIdName(categoryIdName);

  if (categoryRecord != "none") {
    categoryID = categoryRecord.id;
  }

  return categoryID;
};



/** updateCategory
 * updates a existing category - returns the ID it gets from strapi
 * takes the ID to the existing category as parameter
 * @param {*} category 
 * @param {*} categoryID
 */
export async function updateCategory(category, categoryID) {

  let response;
  const myVariables = {
    "id": categoryID,
    "displayName": category.displayName,
    "summary": category.summary,
    "description": category.description,
    "categoryType": category.categoryType,
    "color": category.color,
    "internalImage": interchangeImage2StrapiImage(category.image)    
  };

  let ReturnCategoryID = "none"; //assume its not there


  try {


    response = await apolloClient.mutate({
      mutation: CATEGORYUPDATE_MUTATION,
      variables: myVariables
    });




    if (null != response.data.updateCategory) { // there is a result set
      if (response.data.updateCategory.category) {
        ReturnCategoryID = response.data.updateCategory.category.id;
      } else
        console.log("err updateCategory no id:", JSON.stringify(response))
    } else
      console.log("err updateCategory:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnCategoryID;
};



/** createCategory
 * adds a new category - returns the ID it gets from strapi
 * @param {*} category 
 */
export async function createCategory(category) {

  let response;
  const myVariables = {
    "idName": category.idName,
    "displayName": category.displayName,
    "summary": category.summary,
    "description": category.description,
    "categoryType": category.categoryType,
    "color": category.color,
    "internalImage": interchangeImage2StrapiImage(category.image)    

  };

  let ReturnCategoryID = "none"; //assume its not there



  try {

    response = await apolloClient.mutate({
      mutation: CATEGORYCREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createCategory) { // there is a result set
      if (response.data.createCategory.category) {
        ReturnCategoryID = response.data.createCategory.category.id;
      } else
        console.log("err createCategory no id:", JSON.stringify(response))
    } else
      console.log("err createCategory:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnCategoryID;
};





/* getCategoryitemIDByIdNameAndCategoryIdName
gets the categoryitem that belongs to a category. 
*/
export async function getCategoryitemIDByIdNameAndCategoryIdName(categoryIdName, categoryitemIdName) {

  let response;
  const myVariables = {
    "catIdName": categoryIdName,
    "catItemIdName": categoryitemIdName
  };

  let categoryID = "none"; //assume its not there


  try {

    response = await apolloClient.query({
      query: CATEGORYITEMBYIDNAMEANDCATEGORYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.categoryitems)) { // there is a result set
      if (response.data.categoryitems.length > 0) {
        categoryID = response.data.categoryitems[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getCategoryitemIDByIdNameAndCategoryIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return categoryID;
};



/* getCategoryitemIDByIdNameAndCategoryID
gets the categoryitem that belongs to a category. 

*/
export async function getCategoryitemIDByIdNameAndCategoryID(categoryID, categoryitemIdName) {

  let response;
  const myVariables = {
    "categoryitemIdName": categoryitemIdName,
    "categoryID": categoryID
  };

  let ReturnID = "none"; //assume its not there


  try {

    response = await apolloClient.query({
      query: CATEGORYITEMBYIDNAMEANDCATEGORYID_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.categoryitems)) { // there is a result set
      if (response.data.categoryitems.length > 0) {
        ReturnID = response.data.categoryitems[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getCategoryitemIDByIdNameAndCategoryIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};







/** updateCategoryitem
 * updates a existing category item - returns the ID it gets from strapi
 * takes the ID to the existing category as parameter
 * @param {*} categoryItem 
 * @param {*} categoryItemID
 */
export async function updateCategoryitem(categoryItem, categoryItemID) {

  let response;
  const myVariables = {
    "id": categoryItemID,
    "displayName": categoryItem.displayName,
    "summary": categoryItem.summary,
    "description": categoryItem.description,
    "color": categoryItem.color,
    "sortOrder": categoryItem.sortOrder,
    "internalImage": interchangeImage2StrapiImage(categoryItem.image)    
  };


  let ReturnCategoryItemID = "none"; //assume its not there


  try {

    response = await apolloClient.mutate({
      mutation: CATEGORYITEMUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateCategoryitem) { // there is a result set
      if (response.data.updateCategoryitem.categoryitem) {
        ReturnCategoryItemID = response.data.updateCategoryitem.categoryitem.id;
      } else
        console.log("err updateCategoryitem no id:", JSON.stringify(response))
    } else
      console.log("err updateCategoryitem:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateCategoryitem catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnCategoryItemID;
};

/** createCategoryitem
 * adds a category item and connects it to its parent category
 * @param {*} categoryItem 
 * @param {*} parentCategoryID 
 */
export async function createCategoryitem(categoryItem, parentCategoryID) {

  let response;
  const myVariables = {
    "parentCategoryID": parentCategoryID,
    "idName": categoryItem.idName,
    "displayName": categoryItem.displayName,
    "summary": categoryItem.summary,
    "description": categoryItem.description,
    "sortOrder": categoryItem.sortOrder,
    "color": categoryItem.color,
    "internalImage": interchangeImage2StrapiImage(categoryItem.image)    
  };

  let ReturnCategoryItemID = "none"; //assume its not there



  try {

    response = await apolloClient.mutate({
      mutation: CATEGORYITEMCREATE_MUTATION,
      variables: myVariables
    });




    if (null != response.data.createCategoryitem) { // there is a result set
      if (response.data.createCategoryitem.categoryitem) {
        ReturnCategoryItemID = response.data.createCategoryitem.categoryitem.id;
      } else
        console.log("err createCategoryitem no id:", JSON.stringify(response))
    } else
      console.log("err createCategoryitem:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createCategoryitem catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnCategoryItemID;
};




/** updateNetwork
 * updates a existing network - returns the ID it gets from strapi
 * takes the ID to the existing network as parameter
 * 
 * the network parameter contains a corectly formatted record for strapi
 * @param {*} network 
 * @param {*} networkID
 */
export async function updateNetwork(network, networkID) {

  let response;

  network.id = networkID;

  const myVariables = network;

  let ReturnNetworkID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: NETWORKUPDATE_MUTATION,
      variables: myVariables
    });


    if (null != response.data.updateNetwork) { // there is a result set
      if (response.data.updateNetwork.network) {
        ReturnNetworkID = response.data.updateNetwork.network.id;
      } else
        console.log("err updateNetwork no id:", JSON.stringify(response))
    } else
      console.log("err updateNetwork:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateNetwork catch error (" + network.displayName + ") :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnNetworkID;
};


/** createNetwork
 * create a network - returns the ID it gets from strapi
 
 */
export async function createNetwork(network) {


  let response;

  const myVariables = network;

  let ReturnNetworkID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: NETWORKCREATE_MUTATION,
      variables: myVariables
    });


    if (null != response.data.createNetwork) { // there is a result set
      if (response.data.createNetwork.network) {
        ReturnNetworkID = response.data.createNetwork.network.id;
      } else
        console.log("err createNetwork no id:", JSON.stringify(response))
    } else
      console.log("err createNetwork:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createNetwork catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnNetworkID;
};




/** getEntitytypeIDByIdName
 * checks if a entitytype with idName  exists 
 * - if it rexist it returns the ID it gets from strapi
 * otherwise it returns "none"
 * @param {*} entitytypeIdName 
 */
export async function getEntitytypeIDByIdName(entitytypeIdName) {

  let ReturnID = "none"; //assume its not there



  const ReturnRecord = await getEntitytypeByIdName(entitytypeIdName);

  if (Object.keys(ReturnRecord).length === 0 && ReturnRecord.constructor === Object)  //if it is empty    
    ReturnID = "none";
  else
    ReturnID = ReturnRecord.id; //we can return the ID

  return ReturnID;

}


/** getEntitytypeByIdName
 * checks if a entitytype with idName  exists - if it rexist it returns the record/object it gets from strapi
 * otherwise it returns an empty object
 * @param {*} entitytypeIdName 
 */
export async function getEntitytypeByIdName(entitytypeIdName) {

  let ReturnRecord = {};
  let response;
  const myVariables = {
    "idName": entitytypeIdName
  };



  try {

    response = await apolloClient.query({
      query: ENTITYTYPEBYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.entitytypes)) { // there is a result set
      if (response.data.entitytypes.length > 0) {
        ReturnRecord = response.data.entitytypes[0];
      }
    }

  }
  catch (e) {
    console.error("1.9 getEntitytypeByIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnRecord;
};










/** updateEntitytype
 * updates a existing Entitytype - returns the ID it gets from strapi
 * takes the ID to the existing network as parameter
 */
export async function updateEntitytype(entitytype, entitytypeID) {

  let response;
  const myVariables = {
    "id": entitytypeID,
    "idName": entitytype.idName,
    "displayName": entitytype.displayName,
    "summary": entitytype.summary,
    "internalImage": interchangeImage2StrapiImage(entitytype.image)    
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYTYPEUPDATE_MUTATION,
      variables: myVariables
    });


    if (null != response.data.updateEntitytype) { // there is a result set
      if (response.data.updateEntitytype.entitytype) {
        ReturnID = response.data.updateEntitytype.entitytype.id;
      } else
        console.log("err updateEntitytype no id:", JSON.stringify(response))
    } else
      console.log("err updateEntitytype:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateEntitytype catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};


/** createEntitytype
 * adds a new entitytype - returns the ID it gets from strapi
 * @param {*} entitytype 
 */
export async function createEntitytype(entitytype) {

  let response;
  const myVariables = {
    "idName": entitytype.idName,
    "displayName": entitytype.displayName,
    "summary": entitytype.summary,
    "internalImage": interchangeImage2StrapiImage(entitytype.image)    
  };

  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYTYPECREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createEntitytype) { // there is a result set
      if (response.data.createEntitytype.entitytype) {
        ReturnID = response.data.createEntitytype.entitytype.id;
      } else
        console.log("err createEntitytype no id:", JSON.stringify(response))
    } else
      console.log("err createEntitytype:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createEntitytype catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};


/* getAllEntitytypesList
returns an array of all existing entitytypes
*/
export async function getAllEntitytypesList() {


  let blockSize = 99; //how many  to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
  };




  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYTYPEALL_QUERY,
        variables: myVariables
      });


      if (Array.isArray(response.data.entitytypes)) { // there is a result set
        if (response.data.entitytypes.length > 0) {
          blockData = response.data.entitytypes;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllEntitytypesList catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }

  return dataArray;
}





/** getAllStrapiEntitiesInsightlyForeignKey
 * gets all entities and their insightly foreign key
 * if there are none a empty array is returned
 * 
 */
export async function getAllStrapiEntitiesInsightlyForeignKey() {


  let blockSize = 99; //how many entities to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor
  };




  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYALLINSIGHTLYFOREIGNKEY_QUERY,
        variables: myVariables
      });



      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllStrapiEntitiesInsightlyForeignKey catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }

  return dataArray;
};






/** getEntityAll
 * gets all entities and their related fields 
 * if there are none a empty array is returned
 * 
 */
export async function getEntityAll() {


  let blockSize = 99; //how many entities to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor
  };




  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYALL_QUERY,
        variables: myVariables
      });



      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getEntityAllAlgolia catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }

  return dataArray;
};





/** string2IdKey
* idKey: convert to string if its not
* idKey: set to lowecase
* idKey: starting and tailing space will be removed
* idKey: remove special chars
* idKey: spaces will be replaced with - 
*/
export function string2IdKey(idKey) {
  var orginalidKey = idKey;

  if (idKey) {

    if (!typeof idKey === 'string') {
      idKey = String(idKey); //convert to string if its not
    }
    idKey = idKey.toLowerCase(); //maks sure it is lowercase
    idKey = idKey.trim(); // remove starting and tailing spaces    
    idKey = idKey.replace(/\s+/g, '-'); //replace spaces with -
    // replace norwegian letters
    idKey = idKey.replace(/æ/g, 'ae');
    idKey = idKey.replace(/ø/g, 'o');
    idKey = idKey.replace(/å/g, 'a');


    // old one idKey = slugify(idKey); 

    idKey = slugify(idKey, {
      replacement: '-',  // replace spaces with replacement character, defaults to `-`
      remove: /[*+~()'"!:@/]/g, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: false,     // strip special characters except replacement, defaults to `false`
      locale: 'no'       // language code of the locale to use
    });


    if (orginalidKey != idKey) {
      // console.log("LIB/formatIdKey ==> CHANGED orginalidKey -", orginalidKey, "- to -", idKey, "-");
    }

  } else { //idKey is null, undefined or something
    //console.error("string2IdKey empty!!")
    idKey = ""; //return empty string.
  }
  return idKey
}





/** updateEntity
 * updates a existing entity - returns the ID it gets from strapi
 * takes the ID to the existing entity as parameter
 */
export async function updateEntity(strapiRecord, entityID) {

  let response;
  const myVariables = {
    "id": entityID,
    "idName": strapiRecord.idName,
    "displayName": strapiRecord.displayName,
    "slogan": strapiRecord.slogan,
    "summary": strapiRecord.summary,
    "description": strapiRecord.description,
    "url": strapiRecord.url,
    "phone": strapiRecord.phone,
    "email": strapiRecord.email,
    "visitingAddress": strapiRecord.location.visitingAddress,
    "adminLocation": strapiRecord.location.adminLocation,
    "latLng": strapiRecord.location.latLng,
    "brreg": strapiRecord.brreg,
    "foreignKeys": strapiRecord.foreignKeys,
    "domains": strapiRecord.domains,
    "internalImage": strapiRecord.internalImage,
    "entitytype": strapiRecord.entitytype,
    "socialLinks": strapiRecord.socialLinks,
    "status": strapiRecord.status
  };

  if (!myVariables.status) {
    myVariables.status = null;
  }

  let ReturnID = "none"; //assume its not there



  try {

    response = await apolloClient.mutate({
      mutation: ENTITYUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateEntity) { // there is a result set
      if (response.data.updateEntity.entity) {
        ReturnID = response.data.updateEntity.entity.id;
      } else
        console.log("err updateEntity no id:", JSON.stringify(response))
    } else
      console.log("err updateEntity:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateEntity catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};



/** createEntity
 * creates an entity - returns the ID it gets from strapi
 * it it fail it returns "none"
 */
export async function createEntity(strapiRecord) {

  let response;
  const myVariables = {
    "idName": strapiRecord.idName,
    "displayName": strapiRecord.displayName,
    "slogan": strapiRecord.slogan,
    "summary": strapiRecord.summary,
    "description": strapiRecord.description,
    "url": strapiRecord.url,
    "phone": strapiRecord.phone,
    "email": strapiRecord.email,
    "visitingAddress": strapiRecord.location.visitingAddress,
    "adminLocation": strapiRecord.location.adminLocation,
    "latLng": strapiRecord.location.latLng,
    "brreg": strapiRecord.brreg,
    "foreignKeys": strapiRecord.foreignKeys,
    "domains": strapiRecord.domains,
    "internalImage": strapiRecord.internalImage,
    "entitytype": strapiRecord.entitytype,
    "socialLinks": strapiRecord.socialLinks,
    "status": strapiRecord.status
  };

  let ReturnID = "none"; //assume its not there
  if (!myVariables.status) {
    myVariables.status = null;
  }



  try {

    response = await apolloClient.mutate({
      mutation: ENTITYCREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createEntity) { // there is a result set
      if (response.data.createEntity.entity) {
        ReturnID = response.data.createEntity.entity.id;
      } else
        console.log("err createEntity no id:", JSON.stringify(response))
    } else
      console.log("err createEntity:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createEntity catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};





/* getCategoryIDandTypeByIdName
Get a minimal record of a category. the ID and its categoryType
*/
export async function getCategoryIDandTypeByIdName(idName) {

  let category = {};
  let response;
  const myVariables = {
    idName: idName
  };

  try {


    response = await apolloClient.query({
      query: CATEGORYANDITEMSBYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.categories)) { // there is a result set
      if (response.data.categories.length > 0) {
        category = response.data.categories[0];
      }
    } else { // error - entity not there
      console.error("1.9 getCategory idName does not exist =" + idName + "=");
      debugger;
      //TODO: in case category is not there - what do we do ?      
    }

  }
  catch (e) {
    console.error("1.9 getCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }


  return category;

}




/** getEntityCategoryIDByIdName
 * checks if there is a relation between a Category and an Entity (entityCategory) - if there is one then the ID of the entityCategory is returned
 * if it dosent exist then "none" is returned
 */
export async function getEntityCategoryIDByIdName(entityIdName, categoryIdName) {

  let response;
  const myVariables = {
    "entityIdName": entityIdName,
    "categoryIdName": categoryIdName
  };

  let returnID = "none"; //assume its not there



  try {

    response = await apolloClient.query({
      query: ENTITYCATEGORYBYIDNAME_QUERY,
      variables: myVariables
    });



    if (Array.isArray(response.data.entityCategories)) { // there is a result set
      if (response.data.entityCategories.length > 0) {
        returnID = response.data.entityCategories[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getEntityCategoryByIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return returnID;
};





/** createEntityCategory 
 * create the relation between category and entity - the entityCategory
 * takes the ID of both entity and category
 * returns the ID it gets from strapi
 * 
 */
export async function createEntityCategory(entityID, categoryID, text) {

  let response;
  const myVariables = {
    "entityID": entityID,
    "categoryID": categoryID,
    "text": text
  };

  let ReturnID = "none"; //assume its not there





  try {

    response = await apolloClient.mutate({
      mutation: ENTITYCATEGORYCREATE_MUTATION,
      variables: myVariables
    });




    if (null != response.data.createEntityCategory) { // there is a result set
      if (response.data.createEntityCategory.entityCategory) {
        ReturnID = response.data.createEntityCategory.entityCategory.id;
      } else
        console.log("err createEntityCategory no id:", JSON.stringify(response))
    } else
      console.log("err createEntityCategory:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createEntityCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};



/** getEntityCategoryAnswerIDByCategoryIDandCategoryitemIdName
 * checks if there is an answer to a question 
 * EntityCategoryAnswer is the relation between Categoryitem and entityCategory (entityCategory is a relation between the entity and the category )
 *  - if it exists then return the ID of the EntityCategoryAnswer
 * if it dont exist then "none" is returned
 */
export async function getEntityCategoryAnswerIDByCategoryIDandCategoryitemIdName(entityCategoryID, categoryitemIdName) {

  let response;
  const myVariables = {
    "entityCategoryID": entityCategoryID,
    "categoryitemIdName": categoryitemIdName
  };

  let returnID = "none"; //assume its not there


  try {
    response = await apolloClient.query({
      query: ENTITYCATEGORYANSWERBYCATEGORYITEMIDANDENTTITYCATEGORYIDNAME_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.entityCategoryAnswers)) { // there is a result set
      if (response.data.entityCategoryAnswers.length > 0) {
        returnID = response.data.entityCategoryAnswers[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getEntityCategoryAnswerID catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return returnID;
};




/** createEntityCategoryAnswer
* create the relation between entityCategory (the category and entity) and the Categoryitem  
The relation between these is the answer to the categoryitem question
the text field is used for writing the relation in plain text
the entityCategoryAnswerText is used when the answer has a text answer
*/
export async function createEntityCategoryAnswer(entityCategoryID, categoryitemID,text, entityCategoryAnswerText) {

  let response;
  let ReturnID = "none"; //assume its not there

  const myVariables = {
    "entityCategoryID": entityCategoryID,
    "categoryitemID": categoryitemID,
    "answerText": entityCategoryAnswerText,
    "text": text
  };

  
  try {

    response = await apolloClient.mutate({
      mutation: ENTITYCATEGORYANSWERCREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createEntityCategoryAnswer) { // there is a result set
      if (response.data.createEntityCategoryAnswer.entityCategoryAnswer) {
        ReturnID = response.data.createEntityCategoryAnswer.entityCategoryAnswer.id;
      } else
        console.log("err createEntityCategoryAnswer no id:", JSON.stringify(response))
    } else
      console.log("err createEntityCategoryAnswer:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createEntityCategoryAnswer catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};



/** getEntityNetworkMembershipID
 * checks if there is a relation between network  and entity - the entityNetworkMembership
 * takes the ID of both entity and network
 * 
 * returns the ID it gets from strapi if there is a relation - if not return "none"
 */
export async function getEntityNetworkMembershipID(entityID, networkID) {

  let response;
  const myVariables = {
    "entityID": entityID,
    "networkID": networkID
  };

  let ReturnID = "none"; //assume its not there



  try {

    response = await apolloClient.query({
      query: ENTITYNETWORKMEMBERSHIPBYENTITYIDANDNETWORKID_QUERY,
      variables: myVariables
    });



    if (Array.isArray(response.data.entityNetworkMemberships)) { // there is a result set
      if (response.data.entityNetworkMemberships.length > 0) {
        ReturnID = response.data.entityNetworkMemberships[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getEntityNetworkMembershipID catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};



/** getEntityNetworkMembershipIDbyIdNames
 * checks if there is a relation between network  and entity - the entityNetworkMembership
 * takes the IdName of both entity and network
 * 
 * returns the ID it gets from strapi if there is a relation - if not return "none"
 */
export async function getEntityNetworkMembershipIDbyIdNames(entityIdName, networkIdName) {

  let response;
  const myVariables = {
    "entityIdName": entityIdName,
    "networkIdName": networkIdName
  };

  let ReturnID = "none"; //assume its not there



  try {

    response = await apolloClient.query({
      query: ENTITYNETWORKMEMBERSHIPBYENTITYIDNAMEANDNETWORKIDNAME_QUERY,
      variables: myVariables
    });



    if (Array.isArray(response.data.entityNetworkMemberships)) { // there is a result set
      if (response.data.entityNetworkMemberships.length > 0) {
        ReturnID = response.data.entityNetworkMemberships[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getEntityNetworkMembershipIDbyIdNames catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};


/** getPersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID
 * 
 * checks if there is a relation between 
 * the connection network  and entity ()
 * and
 * the connection person and entity ()
 * This relation defines what role the person has in the org (entity) membership of the network
 * 
 * takes the ID from both
 * 
 * returns the ID it gets from strapi if there is a relation - if not return "none"
 */
export async function getPersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID(personID, entityNetworkMembershipID) {

  let response;
  const myVariables = {
    "personID": personID,
    "entityNetworkMembershipID": entityNetworkMembershipID
  };

  let ReturnID = "none"; //assume its not there



  try {

    response = await apolloClient.query({
      query: PERSONNETWORKMEMBERSHIPROLEBYPERSONIDANDENTITYNETWORKMEMBERSHIPID_QUERY,
      variables: myVariables
    });



    if (Array.isArray(response.data.personNetworkMembershipRoles)) { // there is a result set
      if (response.data.personNetworkMembershipRoles.length > 0) {
        ReturnID = response.data.personNetworkMembershipRoles[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getPersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};






/** createEntityNetworkMembership
 * creates the relation between a entity and a network by creating the relation entityNetworkMembership
 * There are several actions that set the status of the relation. eg applied, resigned, approved and so on.
 * these use update mutations - this one uses create mutation and set the status =Pending
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function createEntityNetworkMembership(entityID, networkID, text) {

  let response;

  const myVariables = {
    "entityID": entityID,
    "networkID": networkID,
    "text": text
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYNETWORKMEMBERSHIPCREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createEntityNetworkMembership) { // there is a result set
      if (response.data.createEntityNetworkMembership.entityNetworkMembership) {
        ReturnID = response.data.createEntityNetworkMembership.entityNetworkMembership.id;
      } else
        console.log("err createEntityNetworkMembership no id:", JSON.stringify(response))
    } else
      console.log("err createEntityNetworkMembership:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createEntityNetworkMembership catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};


/** createPersonNetworkMembershipRole
 * creates the relation between a person and the membership of a org in a network.
 
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function createPersonNetworkMembershipRole(personID, entityNetworkMembershipID, text, roleName) {

  let response;


  const myVariables = {
    "personID": personID,
    "entityNetworkMembershipID": entityNetworkMembershipID,
    "text": text,
    "roleName": roleName
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: PERSONNETWORKMEMBERSHIPROLECREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createPersonNetworkMembershipRole) { // there is a result set
      if (response.data.createPersonNetworkMembershipRole.personNetworkMembershipRole) {
        ReturnID = response.data.createPersonNetworkMembershipRole.personNetworkMembershipRole.id;
      } else
        console.log("err createPersonNetworkMembershipRole no id:", JSON.stringify(response))
    } else
      console.log("err createPersonNetworkMembershipRole:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createPersonNetworkMembershipRole catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};




/** createPersonNetworkMembershipRole
 * creates the relation between a person and the membership of a org in a network.
 
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function updatePersonNetworkMembershipRole(personNetworkMembershipRoleID, text, roleName) {

  let response;


  const myVariables = {
    "personNetworkMembershipRoleID": personNetworkMembershipRoleID,
    "text": text,
    "roleName": roleName
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: PERSONNETWORKMEMBERSHIPROLEUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updatePersonNetworkMembershipRole) { // there is a result set
      if (response.data.updatePersonNetworkMembershipRole.personNetworkMembershipRole) {
        ReturnID = response.data.updatePersonNetworkMembershipRole.personNetworkMembershipRole.id;
      } else
        console.log("err updatePersonNetworkMembershipRole no id:", JSON.stringify(response))
    } else
      console.log("err updatePersonNetworkMembershipRole:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updatePersonNetworkMembershipRole catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};









/** approveEntityNetworkMembership
 * updates the relation between a entity and a network (entityNetworkMembership) to status=Approved
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function approveEntityNetworkMembership(entityNetworkMembershipID, text, approvedBy, approvedDate) {

  let response;

  const myVariables = {
    "entityNetworkMembershipID": entityNetworkMembershipID,
    "text": text,
    "approvedBy": approvedBy,
    "approvedDate": approvedDate
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYNETWORKMEMBERSHIPAPPROVE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateEntityNetworkMembership) { // there is a result set
      if (response.data.updateEntityNetworkMembership.entityNetworkMembership) {
        ReturnID = response.data.updateEntityNetworkMembership.entityNetworkMembership.id;
      } else
        console.log("err approveEntityNetworkMembership no id:", JSON.stringify(response))
    } else
      console.log("err approveEntityNetworkMembership:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 approveEntityNetworkMembership catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};



/** applyEntityNetworkMembership
 * updates the relation between a entity and a network (entityNetworkMembership) to status=Applied
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function applyEntityNetworkMembership(entityNetworkMembershipID, text, appliedBy, appliedDate) {

  let response;

  const myVariables = {
    "entityNetworkMembershipID": entityNetworkMembershipID,
    "text": text,
    "appliedBy": appliedBy,
    "appliedDate": appliedDate
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYNETWORKMEMBERSHIPAPPLY_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateEntityNetworkMembership) { // there is a result set
      if (response.data.updateEntityNetworkMembership.entityNetworkMembership) {
        ReturnID = response.data.updateEntityNetworkMembership.entityNetworkMembership.id;
      } else
        console.log("err applyEntityNetworkMembership no id:", JSON.stringify(response))
    } else
      console.log("err applyEntityNetworkMembership:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 applyEntityNetworkMembership catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};


/** inviteEntityNetworkMembership
 * updates the relation between a entity and a network (entityNetworkMembership) to status=Invited
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function inviteEntityNetworkMembership(entityNetworkMembershipID, text, invitedBy, invitedDate) {

  let response;

  const myVariables = {
    "entityNetworkMembershipID": entityNetworkMembershipID,
    "text": text,
    "invitedBy": invitedBy,
    "invitedDate": invitedDate
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYNETWORKMEMBERSHIPINVITE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateEntityNetworkMembership) { // there is a result set
      if (response.data.updateEntityNetworkMembership.entityNetworkMembership) {
        ReturnID = response.data.updateEntityNetworkMembership.entityNetworkMembership.id;
      } else
        console.log("err inviteEntityNetworkMembership no id:", JSON.stringify(response))
    } else
      console.log("err inviteEntityNetworkMembership:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 inviteEntityNetworkMembership catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};


/** resignEntityNetworkMembership
 * updates the relation between a entity and a network (entityNetworkMembership) to status=Resigned
 *  - returns the ID it gets from strapi or "none" if it fails
 */
export async function resignEntityNetworkMembership(entityNetworkMembershipID, text, resignedBy, resignedDate) {

  let response;

  const myVariables = {
    "entityNetworkMembershipID": entityNetworkMembershipID,
    "text": text,
    "resignedBy": resignedBy,
    "resignedDate": resignedDate
  };


  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: ENTITYNETWORKMEMBERSHIPRESIGN_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateEntityNetworkMembership) { // there is a result set
      if (response.data.updateEntityNetworkMembership.entityNetworkMembership) {
        ReturnID = response.data.updateEntityNetworkMembership.entityNetworkMembership.id;
      } else
        console.log("err resignEntityNetworkMembership no id:", JSON.stringify(response))
    } else
      console.log("err resignEntityNetworkMembership:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 resignEntityNetworkMembership catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger
  }

  return ReturnID;
};






/** makeEntityMemberOfNetwork
 *  makes an entity member of a network
 * if there is no reation (entityNetworkMember) then the relation is created. 
 * when the relation exists (or is created), the status is updated
 * takes entityID and networkID as key arameters.
 * returns "OK" if all is good. if not "Err"
 *
 * dataSource = text describing where the data is coming from. eg Insightly, github solutions, 
 * dataWho = what/who started the import
 */
export async function makeEntityMemberOfNetwork(entityID, networkID, entityIdName, networkIdName,  dataSource, dataWho) {

  let sourceTxt = "";
  let returnResult ="OK"
  let entityNetworkMemberID = "";

  sourceTxt = "Entity:" + entityIdName + ",Network:" + networkIdName + ",Source:" + dataSource + ",Who:"+ dataWho + ",Time:"+ new Date().toISOString(); 

  entityNetworkMemberID = await getEntityNetworkMembershipID(entityID, networkID);

  if (entityNetworkMemberID != "none") { //there is a relation between the entity and the network.

    let TMPentityNetworkMemberID; //using TMPentityNetworkMemberID and not reusing entityNetworkMemberID in case that fail on the first update
    
    // first we update applied status
    //DEL sourceTxt = "Entity:" + entityIdName + ",Network:" + networkIdName + ",Source:" + dataSource + ",Who:"+ dataWho + ",Time:"+ new Date().toISOString(); 
    let appliedBy = dataWho;
    // this stuff we leave out: let appliedDate = currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.substring(0, currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.indexOf(" "));  //extract just the date
    let appliedDate = new Date().toISOString().substring(0, 10);
    TMPentityNetworkMemberID = await applyEntityNetworkMembership(entityNetworkMemberID, sourceTxt, appliedBy, appliedDate);
    if (TMPentityNetworkMemberID != "none") { // status updated to Applied 
      console.log(sourceTxt + " Now applied");
    } else {
      console.error("Err. cant make entity a member:", sourceTxt);
      debugger
      returnResult ="Err";
    }

    // second we update approved status
    let approvedBy = dataWho;
    // skip this let approvedDate = currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.substring(0, currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.indexOf(" "));  //extract just the date
    let approvedDate = new Date().toISOString().substring(0, 10);
    TMPentityNetworkMemberID = await approveEntityNetworkMembership(entityNetworkMemberID, sourceTxt, approvedBy, approvedDate);
    if (TMPentityNetworkMemberID != "none") { // status updated to Applied 
      console.log(sourceTxt + " Now approved");
    } else {
      console.error("Err. cant make entity a member:", sourceTxt);
      debugger
      returnResult ="Err";
    }


  } else { // no relation between the entity and the relation

    //first create the relation     
    entityNetworkMemberID = await createEntityNetworkMembership(entityID, networkID, sourceTxt); // create the relation
    if (entityNetworkMemberID != "none") { // the relation was created.. now update the relation status

      let TMPentityNetworkMemberID;

      // first we update applied status
      
      let appliedBy = dataWho;
      // skip this let appliedDate = currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.substring(0, currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.indexOf(" "));  //extract just the date
      let appliedDate = new Date().toISOString().substring(0, 10);
      TMPentityNetworkMemberID = await applyEntityNetworkMembership(entityNetworkMemberID, sourceTxt, appliedBy, appliedDate);
      if (TMPentityNetworkMemberID != "none") { // status updated to Applied 
        console.log(sourceTxt + " Now applied");
      } else {
        console.error("Err. cant make entity a member:", sourceTxt);
        debugger
        returnResult ="Err";
      }

      // second we update approved status
      let approvedBy = dataWho;
      // skip this let approvedDate = currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.substring(0, currentStrapiRecord.insightlyTmpFields.DATE_CREATED_UTC.indexOf(" "));  //extract just the date
      let approvedDate = new Date().toISOString().substring(0, 10);
      TMPentityNetworkMemberID = await approveEntityNetworkMembership(entityNetworkMemberID, sourceTxt, approvedBy, approvedDate);
      if (TMPentityNetworkMemberID != "none") { // status updated to Applied 
        console.log(sourceTxt + " Now approved");
      } else {
        console.error("Err. cant make entity a member:", sourceTxt);
        returnResult ="Err";
      }



    } else { // trouble - cant create the relation 
      returnResult ="Err";
      console.error("Err. cant create relation between entity and network:", sourceTxt);
      debugger
    }

  }

  return returnResult;

}



/** makeEntityMemberOfAllNetworks
 * the currentEntityInterchangeRecord.networkmemberships contains a list of networks
 * This function loops and makes the enitity member of 
 * all of them using the function makeEntityMemberOfNetwork
 * returns OK if all updates was good 
 * if problems it returns te number of problems 
 */
export async function makeEntityMemberOfAllNetworks(currentEntityStrapiRecordID, entityIdName, networkMembershipsArray, dataSource, dataWho ) {

let returnResult = "OK";
let memberResult = "";
let problems =0;


  // now make the entity member of the NETWORK
  
  for (let networkCounter = 0; networkCounter < networkMembershipsArray.length; networkCounter++) { //loop all the networks the entity is a member of
    let networkIdName = networkMembershipsArray[networkCounter];
    let networkID = await getNetworkIDByIdName(networkIdName);
    if (networkID != "none") { //yes it exists - we need to update membership
      // now make the org member of the NETWORK
      memberResult = await makeEntityMemberOfNetwork(currentEntityStrapiRecordID, networkID, entityIdName, networkIdName, dataSource, dataWho);                           
      if (memberResult != "OK") {
        problems++;
      }

    }
    else {
      console.error("makeEntityMemberOfAllNetworks: Error Network does not exist:", networkIdName );
      problems++;
      debugger;
    }

  } //end looping network memberships

if (problems) returnResult = problems;

  return returnResult;
}





/** getAllStrapiPersonsInsightlyForeignKey
 * gets all persons and their insightly foreign key
 * if there are none a empty array is returned
 * if there is an error then "error" is returned
 */
export async function getAllStrapiPersonsInsightlyForeignKey() {


  let blockSize = 99; //how many entities to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor
  };




  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: PERSONALLINSIGHTLYFOREIGNKEY_QUERY,
        variables: myVariables
      });



      if (Array.isArray(response.data.people)) { // there is a result set
        if (response.data.people.length > 0) {
          blockData = response.data.people;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getAllStrapiPersonsInsightlyForeignKey catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger
      return "error";
    }
  }

  return dataArray;
};




/** createPerson 
 * adds a person to strapi
 
 * returns the ID of the person - if something is wrong it returns "none"
 * 
 * @param {*}  personStrapirecord
 */
export async function createPerson(personStrapirecord) {

  let response;
  const myVariables = {
    "idName": personStrapirecord.idName,
    "firstName": personStrapirecord.firstName,
    "lastName": personStrapirecord.lastName,
    "title": personStrapirecord.title,
    "internalImage": personStrapirecord.internalImage,
    "socialLinks": personStrapirecord.socialLinks,
    "foreignKeys": personStrapirecord.foreignKeys
  };


  let ReturnID = "none"; //assume its not there




  try {

    response = await apolloClient.mutate({
      mutation: PERSONCREATE_MUTATION,
      variables: myVariables
    });




    if (null != response.data.createPerson) { // there is a result set
      if (response.data.createPerson.person) {
        ReturnID = response.data.createPerson.person.id;
      } else
        console.log("err createPerson no id:", JSON.stringify(response))
    } else
      console.log("err createPerson:", JSON.stringify(response))
  }
  catch (e) {
    console.log("catch error createPerson:", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    //there is a BUG in apollo or strapi. when a CategoryItem is created during this run of the program. Then the test to find it.  
    if (e.message.includes("E11000")) { //duplicate
      console.error("Duplicate key")

    }

  }

  return ReturnID;
};



/** updatePerson
 * updates a existing person - returns the ID it gets from strapi
 * takes the ID to the existing person as parameter
 */
export async function updatePerson(strapiRecord, personID) {

  let response;
  const myVariables = {
    "id": personID,
    "idName": strapiRecord.idName,
    "firstName": strapiRecord.firstName,
    "lastName": strapiRecord.lastName,
    "title": strapiRecord.title,
    "internalImage": strapiRecord.internalImage,
    "socialLinks": strapiRecord.socialLinks,
    "foreignKeys": strapiRecord.foreignKeys
  };

  let ReturnID = "none"; //assume its not there



  try {

    response = await apolloClient.mutate({
      mutation: PERSONUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updatePerson) { // there is a result set
      if (response.data.updatePerson.person) {
        ReturnID = response.data.updatePerson.person.id;
      } else
        console.log("err updatePerson no id:", JSON.stringify(response))
    } else
      console.log("err updatePerson:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updatePerson catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};


/** updatePersonEntityRole 
 * updates roleName and text on the relation between Person and entity 
 * roleName is a description of the role the person has with the entity
 * Uses the field text to write Org:idName and Person:idName so it is simpler to debug
 * returns the ID it gets from strapi or "none" if it fails
 * 
 * 
 */
export async function updatePersonEntityRole(personEntityRoleID, roleName, text) {

  let response;
  const myVariables = {
    "personEntityRoleID": personEntityRoleID,
    "text": text,
    "roleName": roleName,
  };

  let ReturnID = "none"; //assume its not there    




  try {

    response = await apolloClient.mutate({
      mutation: PERSONENTITYROLEUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updatePersonEntityRole) { // there is a result set
      if (response.data.updatePersonEntityRole.personEntityRole) {
        ReturnID = response.data.updatePersonEntityRole.personEntityRole.id;
      } else
        console.log("err updatePersonEntityRole no id:", JSON.stringify(response))
    } else
      console.log("err updatePersonEntityRole:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updatePersonEntityRole catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;

  }

  return ReturnID;
};



/** createPersonEntityRole 
 * create the relation between Person and entity 
 * roleName is a description of the role the person has with the entity
 * Uses the field text to write Org:idName and Person:idName so it is simpler to debug
 * returns the ID it gets from strapi or "none" if it fails
 * 
 * 
 */
export async function createPersonEntityRole(entityID, personID, roleName, text) {

  let response;
  const myVariables = {
    "text": text,
    "roleName": roleName,
    "personID": personID,
    "entityID": entityID
  };

  let ReturnID = "none"; //assume its not there    




  try {

    response = await apolloClient.mutate({
      mutation: PERSONENTITYROLECREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createPersonEntityRole) { // there is a result set
      if (response.data.createPersonEntityRole.personEntityRole) {
        ReturnID = response.data.createPersonEntityRole.personEntityRole.id;
      } else
        console.log("err createPersonEntityRole no id:", JSON.stringify(response))
    } else
      console.log("err createPersonEntityRole:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createPersonEntityRole catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;

  }

  return ReturnID;
};


/** getPersonEntityRoleByEntityIDandPersonID
 * checks if there is a relation between a person and Entity (PersonEntityRole) 
 * if there is one then the ID of the PersonEntityRole is returned
 * if it dosent exist then "none" is returned
 */
export async function getPersonEntityRoleIDByEntityIDandPersonID(entityID, personID) {

  let response;
  const myVariables = {
    "entityID": entityID,
    "personID": personID
  };

  let returnID = "none"; //assume its not there



  try {

    response = await apolloClient.query({
      query: PERSONENTITYROLEIDBYENTITYIDANDPERSONID_QUERY,
      variables: myVariables
    });



    if (Array.isArray(response.data.personEntityRoles)) { // there is a result set
      if (response.data.personEntityRoles.length > 0) {
        returnID = response.data.personEntityRoles[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getPersonEntityRoleIDByEntityIDandPersonID catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return returnID;
};


/** prefixArrayObjects
 * to add domains to strapi we ned to prefix the domains with "domainName"
 * takes an array and prefix all items. 
 * returns an empty array if there are no items in the input array
 * eg. if prefix=month it changes ["jan","feb", "march"] to
  [
      {
        "month": "jan"
      },
      {
        "month": "feb"
      },
            {
        "month": "march"
      },
  ]
 * @param {*} theArray 
 * @param {*} prefix 
 */
export function prefixArrayObjects(theArray, prefix) {
  let resultArray = [];
  theArray.map(currentItem => {
    let theObject = {};
    theObject[prefix] = currentItem;
    resultArray.push(theObject);
  });
  return resultArray;

}










/* getNetworkEntitytypeByEntitytypeIDandNetworkID
gets the categoryitem that belongs to a category. 
*/
export async function getNetworkEntitytypeByEntitytypeIDandNetworkID(entitytypeID, networkID) {

  let response;
  const myVariables = {
    "entitytypeID": entitytypeID,
    "networkID": networkID
  };

  let ReturnID = "none"; //assume its not there


  try {

    response = await apolloClient.query({
      query: NETWORKENTITYTYPEBYENTITYTYPEIDANDNETWORKID_QUERY,
      variables: myVariables
    });


    if (Array.isArray(response.data.networkEntitytypes)) { // there is a result set
      if (response.data.networkEntitytypes.length > 0) {
        ReturnID = response.data.networkEntitytypes[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getNetworkEntitytypeByEntitytypeIDandNetworkID catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};





/** updateNetworkEntitytype
* update the relation between network and the entitytype
returns the ID or "none" if failed
*/
export async function updateNetworkEntitytype(networkEntitytypeID, networkEntitytypeText) {

  let response;
  const myVariables = {
    "networkEntitytypeID": networkEntitytypeID,
    "networkEntitytypeText": networkEntitytypeText
  };

  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: NETWORKENTITYTYPEUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateNetworkEntitytype) { // there is a result set
      if (response.data.updateNetworkEntitytype.networkEntitytype) {
        ReturnID = response.data.updateNetworkEntitytype.networkEntitytype.id;
      } else
        console.log("err updateNetworkEntitytype no id:", JSON.stringify(response))
    } else
      console.log("err updateNetworkEntitytype:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateNetworkEntitytype catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }


  return ReturnID;
};










/* getNetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID

*/
export async function getNetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID(networkEntitytypeID, categoryID) {

  let response;
  const myVariables = {
    "networkEntitytypeID": networkEntitytypeID,
    "categoryID": categoryID
  };

  let ReturnID = "none"; //assume its not there


  try {

    response = await apolloClient.query({
      query: NETWORKENTITYTYPECATEGORYBYNETWORKENTITYTYPEIDANDCATEGORYID_QUERY,
      variables: myVariables
    });

    if (Array.isArray(response.data.networkEntitytypeCategories)) { // there is a result set
      if (response.data.networkEntitytypeCategories.length > 0) {
        ReturnID = response.data.networkEntitytypeCategories[0].id;
      }
    }

  }
  catch (e) {
    console.error("1.9 getNetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnID;
};






/** updateNetworkEntitytypeCategory
* update the relation between networkEntitytype and the category
returns the ID or "none" if failed
*/
export async function updateNetworkEntitytypeCategory(networkEntitytypeCategoryID, networkEntitytypeCategoryTxt) {

  let response;
  const myVariables = {
    "networkEntitytypeCategoryID": networkEntitytypeCategoryID,
    "networkEntitytypeCategoryTxt": networkEntitytypeCategoryTxt
  };

  let ReturnID = "none"; //assume its not there

  try {

    response = await apolloClient.mutate({
      mutation: NETWORKENTITYTYPECATEGORYUPDATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.updateNetworkEntitytypeCategory) { // there is a result set
      if (response.data.updateNetworkEntitytypeCategory.networkEntitytypeCategory) {
        ReturnID = response.data.updateNetworkEntitytypeCategory.networkEntitytypeCategory.id;
      } else
        console.log("err updateNetworkEntitytypeCategory no id:", JSON.stringify(response))
    } else
      console.log("err updateNetworkEntitytypeCategory:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 updateNetworkEntitytypeCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }


  return ReturnID;
};




/** createNetworkEntitytypeCategory 
 * create the relation between the category and the networkEntitytype (relation between te network and entitytype)
 * returns the ID it gets from strapi or "none" if it fails
 * 
 */
export async function createNetworkEntitytypeCategory(networkEntitytypeID, categoryID, networkEntitytypeCategoryTxt) {

  let response;
  const myVariables = {
    "networkEntitytypeID": networkEntitytypeID,
    "categoryID": categoryID,
    "networkEntitytypeCategoryTxt": networkEntitytypeCategoryTxt
  };

  let ReturnID = "none"; //assume its not there    




  try {

    response = await apolloClient.mutate({
      mutation: NETWORKENTITYTYPECATEGORYCREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createNetworkEntitytypeCategory) { // there is a result set
      if (response.data.createNetworkEntitytypeCategory.networkEntitytypeCategory) {
        ReturnID = response.data.createNetworkEntitytypeCategory.networkEntitytypeCategory.id;
      } else
        console.log("err createNetworkEntitytypeCategory no id:", JSON.stringify(response))
    } else
      console.log("err createNetworkEntitytypeCategory:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createNetworkEntitytypeCategory catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;

  }

  return ReturnID;
};




/** createNetworkEntitytype 
 * create the relation between the network and the entitytype 
 * it defines if the network has members of entitytype (eg organizations, solutions and so on)
 * returns the ID it gets from strapi or "none" if it fails
 * 
 */
export async function createNetworkEntitytype(entitytypeID, networkID, networkEntitytypeCategoryTxt) {

  let response;
  const myVariables = {
    "entitytypeID": entitytypeID,
    "networkID": networkID,
    "networkEntitytypeCategoryTxt": networkEntitytypeCategoryTxt
  };

  let ReturnID = "none"; //assume its not there    




  try {

    response = await apolloClient.mutate({
      mutation: NETWORKENTITYTYPECREATE_MUTATION,
      variables: myVariables
    });



    if (null != response.data.createNetworkEntitytype) { // there is a result set
      if (response.data.createNetworkEntitytype.networkEntitytype) {
        ReturnID = response.data.createNetworkEntitytype.networkEntitytype.id;
      } else
        console.log("err createNetworkEntitytype no id:", JSON.stringify(response))
    } else
      console.log("err createNetworkEntitytype:", JSON.stringify(response))
  }
  catch (e) {
    console.error("1.9 createNetworkEntitytype catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;

  }

  return ReturnID;
};


/* getNetworkEntitytypeAndCategoriesByNetworkIdName
Gets the NetworkEntitytypeAndCategories by the idName - returns an array of all or an empty object if not found
*/
export async function getNetworkEntitytypeAndCategoriesByNetworkIdName(networkIdName) {

  let ReturnArray = [];
  let response;
  const myVariables = {
    "networkIdName": networkIdName
  };



  try {

    response = await apolloClient.query({
      query: NETWORKENTITYTYPEANDCATEGORIESBYNETWORKIDNAME_QUERY,
      variables: myVariables
    });

    if (Array.isArray(response.data.networkEntitytypes)) { // there is a result set
      if (response.data.networkEntitytypes.length > 0) {
        ReturnArray = response.data.networkEntitytypes;
      }
    }

  }
  catch (e) {
    console.error("1.9 getNetworkEntitytypeAndCategoriesByNetworkIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
    debugger;
  }

  return ReturnArray;
};



/* getNetworkEntitytypeAndCategoriesByNetworkIdNameAndEntitytypeIdName
Gets one of the entitytypes in networkEntitytype by the idName of the enititytype - returns the entitype if it exists if NOT then it returns an empty object 
does not access the database - uses getNetworkEntitytypeAndCategoriesByNetworkIdName and then query that result set
*/
export async function getNetworkEntitytypeAndCategoriesByNetworkIdNameAndEntitytypeIdName(networkIdName, entitytypeIdName) {

  let returnRecord = {};

  let networkEntitytypes = await getNetworkEntitytypeAndCategoriesByNetworkIdName(networkIdName); //reusing can be optimized


  let found = networkEntitytypes.find(
    (item) => item.entitytype.idName === entitytypeIdName
  );

  if (found) {
    returnRecord = found;
  }

  return returnRecord;

}





/** getEntityByNetworkIdNameAndEntitytypeIdName
 * gets all entities by Network IdName and Entitytype.idname 
 * Used to list all organisations belonging to a network
 * if there are none a empty array is returned
 * 
 */
export async function getEntityByNetworkIdNameAndEntitytypeIdName(networkIdName, entitytypeIdName) {


  let blockSize = 99; //how many entities to read in one read
  let cursor = 0; // where in the result set we will start from.
  let blockData = []; // the block of data read
  let keepReading = true; //read intil false
  let dataArray = []; //assume none
  let response;

  const myVariables = {
    "blockSize": blockSize,
    "cursor": cursor,
    "networkIdName": networkIdName,
    "entitytypeIdName": entitytypeIdName
  };




  while (keepReading == true) {
    try {
      response = await apolloClient.query({
        query: ENTITYBYNETWORKIDNAMEANDENTITYTYPEIDNAME_QUERY,
        variables: myVariables
      });



      if (Array.isArray(response.data.entities)) { // there is a result set
        if (response.data.entities.length > 0) {
          blockData = response.data.entities;
          dataArray = dataArray.concat(blockData);
          if (blockData.length < blockSize) {
            keepReading = false; // there is no more data to read
          } else {
            cursor = cursor + blockSize;
            myVariables.cursor = cursor;
          }
        } else keepReading = false; //some sort of error situation

      } else keepReading = false; //some sort of error situation

    }
    catch (e) {
      keepReading = false;
      console.error("1.9 getEntityByNetworkIdNameAndEntitytypeIdName catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger;
    }
  }

  return dataArray;
};




/* strapi2interchangeEntityRecord
takes a strapi record and returns a record interchange (export)
*/
export function strapi2interchangeEntityRecord(strapiRecord) {
  let interchangeRecord = {};

  let tmpResult;

  interchangeRecord.id = strapiRecord.id;
  interchangeRecord.idName = strapiRecord.idName;
  interchangeRecord.displayName = strapiRecord.displayName;
  interchangeRecord.slogan = strapiRecord.slogan;
  interchangeRecord.summary = strapiRecord.summary;
  interchangeRecord.description = strapiRecord.description;
  interchangeRecord.url = strapiRecord.url;
  interchangeRecord.phone = strapiRecord.phone;
  interchangeRecord.email = strapiRecord.email;

  tmpResult = getNested(strapiRecord, "status");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there is a status 
    interchangeRecord.status = strapiRecord.status;
    //TODO remove status.__typename
  }
//TODO: use function to convert image structure
  interchangeRecord.image = {
    "icon": getIconImage(strapiRecord.image, strapiRecord.internalImage, "entity"),
    "profile": getProfileImage(strapiRecord.image, strapiRecord.internalImage, "entity"),
    "cover": getCoverImage(strapiRecord.image, strapiRecord.internalImage, "entity"),
    "square": getSquareImage(strapiRecord.image, strapiRecord.internalImage, "entity")
  };


  // get the location stuff
  tmpResult = getNested(strapiRecord, "location");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there is a location 
    interchangeRecord.location = {};
    tmpResult = getNested(strapiRecord, "location", "visitingAddress");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a visitingAddress
      tmpResult = getNested(strapiRecord, "location", "visitingAddress", "street");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a street address. Now we assume that the rest is thee and put the data
        interchangeRecord.location.visitingAddress = {
          "street": getNested(strapiRecord, "location", "visitingAddress", "street"),
          "postcode": getNested(strapiRecord, "location", "visitingAddress", "postcode"),
          "city": getNested(strapiRecord, "location", "visitingAddress", "city"),
          "country": getNested(strapiRecord, "location", "visitingAddress", "country")
        };
      }
    }
    tmpResult = getNested(strapiRecord, "location", "latLng");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a gps
      interchangeRecord.location.latLng = {
        "lat": getNested(strapiRecord, "location", "latLng", "lat"),
        "lng": getNested(strapiRecord, "location", "latLng", "lng")
      };
    }

    tmpResult = getNested(strapiRecord, "location", "adminLocation");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a adminLocation
      interchangeRecord.location.adminLocation = {
        "municipalityId": getNested(strapiRecord, "location", "adminLocation", "municipalityId"),
        "municipalityName": getNested(strapiRecord, "location", "adminLocation", "municipalityName"),
        "countyId": getNested(strapiRecord, "location", "adminLocation", "countyId"),
        "countyName": getNested(strapiRecord, "location", "adminLocation", "countyName")
      };
    }

  }

  // the brreg stuff
  tmpResult = getNested(strapiRecord, "brreg");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
    interchangeRecord.brreg = tmpResult;
  }


  tmpResult = getNested(strapiRecord, "entitytype");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there is a entitytype
    interchangeRecord.entitytype = {
      "idName": getNested(strapiRecord, "entitytype", "idName"),
      "displayName": getNested(strapiRecord, "entitytype", "displayName"),
      "icon": getIconImage(strapiRecord.entitytype.internalImage, strapiRecord.entitytype.image, "entitytype"),
    }
  }

  tmpResult = getNested(strapiRecord, "entity_network_memberships");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there is a entity_network_memberships
    interchangeRecord.networkMemberships = array2idNameArray(strapiRecord.entity_network_memberships);
  }

  tmpResult = getNested(strapiRecord, "entity_categories");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there is a entity_categories  
    interchangeRecord.categoryAnswers = entity_categories2categoryAnswers(strapiRecord.entity_categories);
  }

  //domains 
  tmpResult = getNested(strapiRecord, "domains");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there are a domains property

    let tmpDomainsArray = [];
    for (let i = 0; i < strapiRecord.domains.length; i++) { //looping all domains
      tmpDomainsArray.push(strapiRecord.domains[i].domainName);
    }
    interchangeRecord.domains = tmpDomainsArray;
  }


  //social links

  tmpResult = getSocialLinks(strapiRecord);
  if (tmpResult != "none")
    interchangeRecord.socialLinks = tmpResult;

  //TODO: network memberships

  return interchangeRecord;

}


/** getSocialLinks
 * takes an object and if there is a socialLinks object - it returns a valid one
 * if not it returns "none"
 */
export function getSocialLinks(entity) {

  let returnObject = "none";
  let tmpResult;

  tmpResult = getNested(entity, "socialLinks");
  if ((tmpResult != undefined) && (tmpResult != null)) { // there are a socialLinks property
    returnObject = {
      "facebook": getNested(entity, "socialLinks", "facebook"),
      "linkedin": getNested(entity, "socialLinks", "linkedin"),
      "twitter": getNested(entity, "socialLinks", "twitter"),
      "instagram": getNested(entity, "socialLinks", "instagram"),
      "youtube": getNested(entity, "socialLinks", "youtube"),
      "otherURL": getNested(entity, "socialLinks", "otherURL")
    }
  }
  return returnObject;

}


/** createIdName
 * creates a idName based on input fields 
 */
function createIdName(strapiRecord) {

  let returnIdName = "none";
  let tmpResult = "";
  let found = 0;
  let validIdName = "";

  if (strapiRecord.idName == "") { // if there is no id name
    strapiRecord.idName = strapiRecord.displayName; // we will try to create one
  }

  validIdName = string2IdKey(strapiRecord.idName); //make sure it is a valid idName

  if (strapiRecord.entitytypeIdName == ORGANIZATION_ENTITYTYPE) {
    returnIdName = strapiRecord.validIdName;

  } else { //its not an organization - that means that we must prefix the idName

    tmpResult = getNested(strapiRecord, "parents");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a parents property
      if (Array.isArray(strapiRecord.parents)) { // and its an array

        found = strapiRecord.parents.find(parent => parent.mainParent == true); //will this fail if the field is not there? 
        if (found) {
          returnIdName = found.entityParentIdName + URL_SEPARATOR + strapiRecord.entitytypeIdName + URL_SEPARATOR + validIdName;
        } else { // none was defined as mainParent
          // we pick the first one 
          returnIdName = strapiRecord.parents[0].entityParentIdName + URL_SEPARATOR + strapiRecord.entitytypeIdName + URL_SEPARATOR + validIdName;
        }

      } else { // parents field is there, but not an array
        returnIdName = DEFAULT_PARENT_IDNAME + URL_SEPARATOR + strapiRecord.entitytypeIdName + URL_SEPARATOR + validIdName; // set default
      }
    } else { // it has no parent
      returnIdName = DEFAULT_PARENT_IDNAME + URL_SEPARATOR + strapiRecord.entitytypeIdName + URL_SEPARATOR + validIdName; // set default

    }


  }
  return returnIdName

}


/** interchange2strapiEntityRecord
 * takes an interchangeEntityRecord and converts it to a strapiEntityRecord
 * returns a converted record if all is fine otherwise "none"
 * 
 * Rules:
 if the enitytype is a "organization" then the idName will not be changed
 othervise the idName will be changed using the function createIdName
 * 
 */

export async function interchange2strapiEntityRecord(interchangeEntityRecord) {
  let strapiEntityRecord = {};
  let entitytypeID = "";
  let tmpResult;


  entitytypeID = await getEntitytypeIDByIdName(interchangeEntityRecord.entitytypeIdName);
  if (entitytypeID != "none") { // cant inport if there is no valid entitytypeID
    strapiEntityRecord.idName = createIdName(interchangeEntityRecord);
    if (strapiEntityRecord.idName != "") {
      strapiEntityRecord.displayName = interchangeEntityRecord.displayName;
      strapiEntityRecord.slogan = interchangeEntityRecord.slogan;
      strapiEntityRecord.summary = interchangeEntityRecord.summary;
      strapiEntityRecord.description = interchangeEntityRecord.description;
      strapiEntityRecord.url = interchangeEntityRecord.url;
      strapiEntityRecord.phone = interchangeEntityRecord.phone;
      strapiEntityRecord.email = interchangeEntityRecord.email;

      strapiEntityRecord.entitytype = entitytypeID;

      tmpResult = getNested(interchangeEntityRecord, "status");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a status 
        strapiEntityRecord.status = interchangeEntityRecord.status;
        //TODO: remove status.__typename
      }

      // get the images and place then correctly
      strapiEntityRecord.internalImage = interchangeImage2StrapiImage(interchangeEntityRecord.image);

      // get the location stuff
      tmpResult = getNested(interchangeEntityRecord, "location");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a location 
        strapiEntityRecord.location = {};
        tmpResult = getNested(interchangeEntityRecord, "location", "visitingAddress");
        if ((tmpResult != undefined) && (tmpResult != null)) { // there is a visitingAddress
          tmpResult = getNested(interchangeEntityRecord, "location", "visitingAddress", "street");
          if ((tmpResult != undefined) && (tmpResult != null)) { // there is a street address. Now we assume that the rest is thee and put the data
            strapiEntityRecord.location.visitingAddress = {
              "street": getNested(interchangeEntityRecord, "location", "visitingAddress", "street"),
              "postcode": getNested(interchangeEntityRecord, "location", "visitingAddress", "postcode"),
              "city": getNested(interchangeEntityRecord, "location", "visitingAddress", "city"),
              "country": getNested(interchangeEntityRecord, "location", "visitingAddress", "country")
            };
          }
        }
        tmpResult = getNested(interchangeEntityRecord, "location", "latLng");
        if ((tmpResult != undefined) && (tmpResult != null)) { // there is a gps
          strapiEntityRecord.location.latLng = {
            "lat": getNested(interchangeEntityRecord, "location", "latLng", "lat"),
            "lng": getNested(interchangeEntityRecord, "location", "latLng", "lng")
          };
        }

        tmpResult = getNested(interchangeEntityRecord, "location", "adminLocation");
        if ((tmpResult != undefined) && (tmpResult != null)) { // there is a adminLocation
          strapiEntityRecord.location.adminLocation = {
            "municipalityId": getNested(interchangeEntityRecord, "location", "adminLocation", "municipalityId"),
            "municipalityName": getNested(interchangeEntityRecord, "location", "adminLocation", "municipalityName"),
            "countyId": getNested(interchangeEntityRecord, "location", "adminLocation", "countyId"),
            "countyName": getNested(interchangeEntityRecord, "location", "adminLocation", "countyName")
          };
        }

      }

      // get what we have on brreg
      tmpResult = getNested(interchangeEntityRecord, "brreg");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.brreg = tmpResult;
      }


      // get the domains - if any
      tmpResult = getNested(interchangeEntityRecord, "domains");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a domains 
        strapiEntityRecord.domains = prefixArrayObjects(interchangeEntityRecord.domains, "domainName");
      }

      // get the network(s) the entity belongs to
      tmpResult = getNested(interchangeEntityRecord, "networkMemberships");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.networkMemberships = tmpResult;
      }



      // also add social fields 
      tmpResult = getSocialLinks(interchangeEntityRecord);
      if (tmpResult != "none")
        strapiEntityRecord.socialLinks = tmpResult;


      // get what we have on categoryAnswers
      tmpResult = getNested(interchangeEntityRecord, "categoryAnswers");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.categoryAnswers = tmpResult;
      }

      // get what we have on parents
      tmpResult = getNested(interchangeEntityRecord, "parents");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.parents = tmpResult;
      }


      // get what we have on children
      tmpResult = getNested(interchangeEntityRecord, "children");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.children = tmpResult;
      }


      // get what we have on contacts
      tmpResult = getNested(interchangeEntityRecord, "contacts");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.contacts = tmpResult;
      }


      // get what we have on foreignkeys
      tmpResult = getNested(interchangeEntityRecord, "foreignKeys");
      if ((tmpResult != undefined) && (tmpResult != null)) { // there is a brreg
        strapiEntityRecord.foreignKeys = tmpResult;
      }


      //
    } else { // no idName
      console.error("interchange2strapiEntityRecord: missing idName");
      strapiEntityRecord = "none";
      debugger
    }
  } else { // no valid entitytypeID
    console.error("interchange2strapiEntityRecord: idName: " + interchangeEntityRecord.idName + " Not valid entitytypeIdName:", interchangeEntityRecord.entitytypeIdName);
    strapiEntityRecord = "none";
    debugger
  }


  return strapiEntityRecord;

}




/* interchangeImage2StrapiImage
* convert imported image structure to internalImage structure
Returns false if nothing is transformed or the parameter does not contain images.
Otherwise it returns a internalImage formatted structure.
* images that are imported are like this:
 "image": {
            "cover": "https://www.abax.com/sites/default/files/styles/max_1300x1300/public/2019-04/%20All-service-hero.jpg",
            "profile": "http://bucket.urbalurba.com/logo/abax.jpg",
            "icon": ""
        }
They need to be formatted to this:
        "internalImage": {
          "cover": {
            "url": https://www.abax.com/sites/default/files/styles/max_1300x1300/public/2019-04/%20All-service-hero.jpg",
          },
          "profile": {
            "url": "http://bucket.urbalurba.com/logo/abax.jpg"
          }
        }        
*/

export function interchangeImage2StrapiImage(importImage) {
  let returnImage = {
    "cover": {
      "url": importImage.cover
    },
    "profile": {
      "url": importImage.profile
    },
    "icon": {
      "url": importImage.icon
    },
    "square": {
      "url": importImage.square
    }
  };
  let isConverted = false;

  if (importImage) {
    if (importImage.cover) {
      isConverted = true;
    } else
      delete returnImage.cover;

    if (importImage.profile) {
      isConverted = true;
    } else
      delete returnImage.profile;

    if (importImage.icon) {
      isConverted = true;
    } else
      delete returnImage.icon;

    if (importImage.square) {
      isConverted = true;
    } else
      delete returnImage.square;


  }
  if (isConverted)
    return returnImage
  else
    return false;
}



/** createEntityParents
 * connect the entity to a parent entity.
 * The childEntityID here is the currentEntityID
 * 
 * If one or more parents are found then "OK" is returned. 
 * If none is found then "none" is returned.
 */
export async function createEntityParents(childEntityID, parentsArray) {


  let foundParents="none"

  let entityrelationID = "";
  let parentEntityID = "";
  let entitytypeID = "";
  let updateParentEntityID = "";
  let newParentEntityID = "";
  let currentParent = {};

  
  for (let parentCounter in parentsArray) {
      currentParent = parentsArray[parentCounter];      
      entityrelationID = "";
      parentEntityID = "";
      entitytypeID = "";
      updateParentEntityID = "";
      newParentEntityID = "";

//TODO: handle if the entityParentIdName is invalid
      entitytypeID = await getEntitytypeIDByIdName(currentParent.entitytypeIdName);
      if (entitytypeID != "none") { //yes it exists - we can use it when connecting to a parent

          parentEntityID = await getEntityIDByIdName(currentParent.entityParentIdName);
          if (parentEntityID != "none") { //yes it exists - we can connect it as parent
              // now we have all 3 keys (childEntityID, entityTypeID, parentEntityID ) and we can create the parent relation. 

              //but first we must check if it already exist
              entityrelationID = await getEntityrelationIDByKeyIDs(childEntityID, entitytypeID, parentEntityID);
              if (entityrelationID != "none") { //yes it exists - we can update it
                  updateParentEntityID = await updateEntityrelationParent(entityrelationID, currentParent.displayName, currentParent.text);             
                  if (updateParentEntityID != "none") { // we managed to update 
                      let logText = "Updated createEntityParents. Parent is:" + currentParent.entityParentIdName + " (" + updateParentEntityID + ")";
                      console.log(logText);
                      foundParents="OK";
                  } else {
                      //trouble - could not create the answer
                      let logText = "Error could not create createEntityParents. " + currentParent.entityParentIdName + " not set to parent";
                      console.error(logText);
                      debugger
                  }

              }
              else {
                  newParentEntityID = await createEntityrelationParent(childEntityID, entitytypeID, parentEntityID, currentParent.displayName, currentParent.text);
                  if (newParentEntityID != "none") { // we managet to update an answer
                      let logText = "Create createEntityParents. Parent is:" + currentParent.entityParentIdName + "(" + newParentEntityID + ")";
                      console.log(logText);
                      foundParents="OK";
                  } else {
                      //trouble - could not create the answer
                      let logText = "Error could not create createEntityParents. " + currentParent.entityParentIdName + " not set to parent";
                      console.error(logText);
                      debugger
                  }

              }

          }
          else {
              console.error("createEntityParents: entityParentIdName=", currentParent.entityParentIdName, " does notexist. Cant make it a parent")
              debugger
          }
      }
      else {
          console.error("createEntityParents: entityParentIdName=", currentParent.entityParentIdName, " does notexist. Cant make it a parent")
          debugger
      }


  }

return foundParents;

}




/** getEntityrelationIDByKeyIDs
 * checks if a entityType with idName  exists - if it rexist it returns the ID it gets from strapi
 * otherwise it returns "none"
 */
async function getEntityrelationIDByKeyIDs(childEntityID, entityTypeID, parentEntityID) {

  let response;
  let ReturnID = "none"; //assume its not there

  const myVariables = {
      "childEntityID": childEntityID,
      "entityTypeID": entityTypeID,
      "parentEntityID": parentEntityID
  };




  try {

    response = await apolloClient.query({
          query: ENTITYRELATIONBYKEYIDS_QUERY,
          variables: myVariables
      });


      if (Array.isArray(response.data.entityrelations)) { // there is a result set
          if (response.data.entityrelations.length > 0) {
              ReturnID = response.data.entityrelations[0].id;
          }
      }

  }
  catch (e) {
      console.log("1.9 getEntityrelationIDByKeyIDs catch error ", JSON.stringify(e))
  }

  return ReturnID;
};

/** updateEntityrelationParent
 * updates a existing relaton to a parent entity - returns the ID it gets from strapi
 
 */
async function updateEntityrelationParent(entityrelationID, displayName, text) {

  let response;
  let ReturnID = "none"; //assume its not there
  
  const myVariables = {
      "entityrelationID": entityrelationID,
      "displayName": displayName,
      "text": text
  };
  


  try {

    response = await apolloClient.mutate({
          mutation: ENTITYRELATIONPARENTUPDATE_MUTATION,
          variables: myVariables
      });


      if (null != response.data.updateEntityrelation) { // there is a result set
          if (response.data.updateEntityrelation.entityrelation) {
              ReturnID = response.data.updateEntityrelation.entityrelation.id;
          } else
              console.log("err updateEntityrelationParent no id:", JSON.stringify(result))
      } else
          console.log("err updateEntityrelationParent:", JSON.stringify(result))
  }
  catch (e) {
      console.log("1.9 updateEntityrelationParent catch error ", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
  } 

  return ReturnID;
};



/** createEntityrelationParent
 * add the relation between one entity to another parent entity - returns the ID it gets from strapi
 
 */
async function createEntityrelationParent(childEntityID, entityTypeID, parentEntityID, displayName, text) {

  let response;
  let ReturnID = "none"; //assume its not there  

  const myVariables = {
      "childEntityID": childEntityID,
      "entityTypeID": entityTypeID,
      "parentEntityID": parentEntityID,
      "displayName": displayName,
      "text": text
  };
  


  try {

    response = await apolloClient.mutate({
          mutation: ENTITYRELATIONPARENTCREATE_MUTATION,
          variables: myVariables
      });


      if (null != response.data.createEntityrelation) { // there is a result set
          if (response.data.createEntityrelation.entityrelation) {
              ReturnID = response.data.createEntityrelation.entityrelation.id;
          } else
              console.log("err createEntityrelationParent no id:", JSON.stringify(response))
      } else
          console.log("err createEntityrelationParent:", JSON.stringify(response))
  }
  catch (e) {
      console.log("1.9 createEntityrelationParent catch error ", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
  }

  return ReturnID;
};






/** updateEntityCategoryAnswer
 * updates a existing  answer returns the ID it gets from strapi
 *  text is used for writin the relation in plain text
 *  entityCategoryAnswerText is used when the answer has a text answer
 */
export async function updateEntityCategoryAnswer(entityCategoryID, text, entityCategoryAnswerText) {

  let response;
  let ReturnID = "none"; //assume its not there
   
  const myVariables = {
      "entityCategoryAnswerID": entityCategoryID,
      "answerText": entityCategoryAnswerText,
      "text": text
  };


  try {
                     
    response = await apolloClient.mutate({
          mutation: ENTITYCATEGORYANSWERUPDATE_MUTATION,
          variables: myVariables
      });


      if (null != response.data.updateEntityCategoryAnswer) { // there is a result set
          if (response.data.updateEntityCategoryAnswer.entityCategoryAnswer) {
              ReturnID = response.data.updateEntityCategoryAnswer.entityCategoryAnswer.id;
          } else
              console.log("err updateEntityCategoryAnswer no id:", JSON.stringify(response))
      } else
          console.log("err updateEntityCategoryAnswer:", JSON.stringify(response))
  }
  catch (e) {
      console.log("1.9 updateEntityCategoryAnswer catch error ", JSON.stringify(e), " =>result is:", JSON.stringify(response), " =>myVariables is:", JSON.stringify(myVariables));
      debugger
  }

  return ReturnID;
};



