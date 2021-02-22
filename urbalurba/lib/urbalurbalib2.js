// Library functions to urbalurba gui

import { IMAGEANDCOLOR } from "./libconfig.js";


// URL_SEPARATOR when creating a valid global URL we need to have a way to separate 
// the idName from the rest of the url.
// see example under with  URL_SEPARATOR = "@" 
// eg: "smartfredrikstad.no" and "elektrisk-passasjerferge" will be http://localhost/id/smartfredrikstad.no@elektrisk-passasjerferge
export const URL_SEPARATOR="~";

export const ORGANIZATION_ENTITYTYPE="organization"; //corresponds with the entitytype defined in CATEGORIES_URL
export const DEFAULT_PARENT_IDNAME="urbalurba.no"; //if an entity has no parent and is not a ORGANIZATION_ENTITYTYPE then this is the default parent it will belong to



/** getNested
 * used to get values in deep nested objects 
 * returns the value if there is one otherwise "undefined"
 * see example here
 * https://www.w3docs.com/snippets/javascript/how-to-check-for-the-existence-of-nested-javascript-object-key.html
 */
export function getNested(obj, ...args) {
  return args.reduce((obj, level) => obj && obj[level], obj)
}


export function getCoverImage(image, internalImage, imageType) {

  let coverImage = ""; //see libconfig file for def
  coverImage = IMAGEANDCOLOR[imageType].cover;


  if (image) { //image is there
    if (image.hasOwnProperty("cover") && (image.cover != null)) { //profile is there
      if (image.cover.hasOwnProperty("url") && (image.cover.url != null)) { //has url 
        if (typeof (image.cover.url) === "string") {
          coverImage = image.cover.url
        }
      }
    }
  } else
    if (internalImage) { //image is there      
      if (internalImage.hasOwnProperty("cover")) { //cover is there
        if (internalImage.cover != null) { // and its not null
          if (internalImage.cover.hasOwnProperty("url")) { //has url 
            if (internalImage.cover.url != null) { //and is not null
              if (typeof (internalImage.cover.url) === "string") {
                if (internalImage.cover.url !== "")
                  coverImage = internalImage.cover.url
              }
            }
          }
        }
      }
    }

  return coverImage;

}

export function getSquareImage(image, internalImage, imageType) {

  let squareImage = ""; //see libconfig file for def
  squareImage = IMAGEANDCOLOR[imageType].square;


  if (image) { //image is there
    if (image.hasOwnProperty("square") && (image.square != null)) { //square is there
      if (image.square.hasOwnProperty("url") && (image.square.url != null)) { //has url 
        if (typeof (image.square.url) === "string") {
          squareImage = image.square.url
        }
      }
    }
  } else
    if (internalImage) { //image is there      
      if (internalImage.hasOwnProperty("square")) { //square is there
        if (internalImage.square != null) { // and its not null
          if (internalImage.square.hasOwnProperty("url")) { //has url 
            if (internalImage.square.url != null) { //and is not null
              if (typeof (internalImage.square.url) === "string") {
                if (internalImage.square.url !== "")
                  squareImage = internalImage.square.url
              }
            }
          }
        }
      }
    }

  return squareImage;

}





export function getProfileImage(image, internalImage, imageType) {

  let profileImage = ""; //see libconfig file for def
  profileImage = IMAGEANDCOLOR[imageType].profile;


  if (image) { //image is there
    if (image.hasOwnProperty("profile") && (image.profile != null)) {  //profile is there
      if (image.profile.hasOwnProperty("url") && (image.profile.url != null)) { //has url 
        if (typeof (image.profile.url) === "string") {
          profileImage = image.profile.url
        }
      }
    }
  } else
    if (internalImage) { //image is there
      if (internalImage.hasOwnProperty("profile") && (internalImage.profile != null)) { //profile is there
        if (internalImage.profile.hasOwnProperty("url") && (internalImage.profile.url != null)) { //has url 
          if (typeof (internalImage.profile.url) === "string") {
            if (internalImage.profile.url !== "")
              profileImage = internalImage.profile.url
          }
        }
      }
    }

  return profileImage;

}




export function getIconImage(image, internalImage, imageType) {

  let iconImage = "";


  iconImage = IMAGEANDCOLOR[imageType].icon; //see libconfig file for def

  if (image) { //image is there
    if (image.hasOwnProperty("icon") && (image.icon != null)) { //icon is there
      if (image.icon.hasOwnProperty("url") && (image.icon.url != null)) { //has url 
        if (typeof (image.icon.url) === "string") {
          iconImage = image.icon.url
        }
      }
    }
  } else
    if (internalImage) { //image is there
      if (internalImage.hasOwnProperty("icon") && (internalImage.icon != null)) { //icon is there
        if (internalImage.icon.hasOwnProperty("url") && (internalImage.icon.url != null)) { //has url 
          if (typeof (internalImage.icon.url) === "string") {
            if (internalImage.icon.url !== "")
              iconImage = internalImage.icon.url
          }
        }
      }
    }

  return iconImage;

}


export function displayCategoryItemAnswerTxt(categoryType) {

  let display = false;

  switch (categoryType) {
    case "single":
      display = false;
      break;
    case "multiple":
      display = false;
      break;
    case "tag":
      display = false;
      break;
    case "input":
      display = true;
      break;
    default:
      display = false;
      break;
  }
  return display;
}



export function isSingleChoiceItemAnswer(categoryType) {

  let singleChoice = false;

  switch (categoryType) {
    case "single":
      singleChoice = true;
      break;
    case "multiple":
      singleChoice = false;
      break;
    case "tag":
      singleChoice = false;
      break;
    case "input":
      singleChoice = false;
      break;
    default:
      singleChoice = false;
      break;
  }
  return singleChoice;
}



/*** setFormInputValues
 * takes the full list of possible answers and the list of ansers 
 * returns  an object where every answer (idName) has a value true or false. 
 eg newDefaultValues ={
  energy: true,
  water: false
}
*/
export function setFormInputValues(categoryitems, entityCategoryAnswers) {
  let newDefaultValues = {};

  for (let i = 0; i < categoryitems.length; i++) {
    let found = entityCategoryAnswers.find(
      (item) => item.categoryitem.idName === categoryitems[i].idName
    );
    if (found) {
      newDefaultValues[categoryitems[i].idName] = true;
      let textAttribute = found.categoryitem.idName + "-text";
      newDefaultValues[textAttribute] = found.text;
      //console.log("textAttribute: ", textAttribute, "newDefaultValues[textAttribute]",newDefaultValues[textAttribute] );
    } else newDefaultValues[categoryitems[i].idName] = false;
  }
  return newDefaultValues;
}

/*** readFormInputValuesMultiple
 * takes the full list of possible answers (categoryitems) and the list of ansers that was there before they was displayo n the screen (entityCategoryAnswers) 
 * the object inputAnswers contains the answers after the user has changed some of them.
 * This function figures out what has changed and returns an array of objects that is marked 
 * updated, deleted, added for each of the possible answers

 * returns  an array  that can be used to update the database.


*/
export function readFormInputValuesMultiple(
  entityCategoryID,
  categoryitems,
  entityCategoryAnswers,
  inputAnswers
) {


  let newEntityCategoryAnswers = [];

  let newEntityCategoryAnswerRecord = {};

  for (let i = 0; i < categoryitems.length; i++) {
    // loop trugh all possible answers
    newEntityCategoryAnswerRecord = {
      action: "dont know", // "unchanged", "create", "delete" or "update"
      idName: categoryitems[i].idName, //just for debugging
      text: "dont know",
      entityCategoryAnswerID: "dont know", //for existing answers a ID for new its empty
      categoryitemID: "dont know",
      entityCategoryID: entityCategoryID
    };

    // first figure out if this answer was already in the database before we enabeled editing
    let alreadyChecked = entityCategoryAnswers.find(
      (item) => item.categoryitem.idName === categoryitems[i].idName
    );

    // if the entity already has one or more answers in this category. then there is a entityCategory record
    //


    if (inputAnswers[categoryitems[i].idName] && alreadyChecked) {
      // if the checkbox is checked and it was checked before editing


      //Now we need to figure out if the text has changed. If it has then we must mark it to be UPDATE
      if ((inputAnswers[`${categoryitems[i].idName}-text`] !== alreadyChecked.text) && (inputAnswers[`${categoryitems[i].idName}-text`] !== undefined)) {
        // console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION UPDATE TEXT CHANGED alreadyChecked.text=",alreadyChecked.text, "= text=", inputAnswers[`${categoryitems[i].idName}-text`], "=" );        
        newEntityCategoryAnswerRecord.action = "UPDATE";
        newEntityCategoryAnswerRecord.text = inputAnswers[`${categoryitems[i].idName}-text`]; //text is changed
      } else {

        //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION unchanged");
        newEntityCategoryAnswerRecord.action = "unchanged";
        newEntityCategoryAnswerRecord.text = alreadyChecked.text; //this has not been changed in this input
      }
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = alreadyChecked.id; //for existing answers a ID for new its empty

      newEntityCategoryAnswerRecord.categoryitemID =
        alreadyChecked.categoryitem.id;
      newEntityCategoryAnswerRecord.idName = alreadyChecked.categoryitem.idName;
    }

    if (inputAnswers[categoryitems[i].idName] && !alreadyChecked) {
      // if the checkbox is checked and it was NOT checked before editing
      //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION create");
      newEntityCategoryAnswerRecord.action = "CREATE";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "to be created"; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = inputAnswers[`${categoryitems[i].idName}-text`]; //text is changed
      newEntityCategoryAnswerRecord.categoryitemID = categoryitems[i].id;
      newEntityCategoryAnswerRecord.idName = categoryitems[i].idName;
    }
    if (!inputAnswers[categoryitems[i].idName] && alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION delete");
      newEntityCategoryAnswerRecord.action = "DELETE";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = alreadyChecked.id; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = alreadyChecked.text; //this has no been changed in this input
      newEntityCategoryAnswerRecord.categoryitemID =
        alreadyChecked.categoryitem.id;
      newEntityCategoryAnswerRecord.idName = alreadyChecked.categoryitem.idName;
    }

    if (!inputAnswers[categoryitems[i].idName] && !alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION not selected");
      newEntityCategoryAnswerRecord.action = "not selected";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "not selected";
      newEntityCategoryAnswerRecord.text = "not selected";
      newEntityCategoryAnswerRecord.categoryitemID = categoryitems[i].id;
      newEntityCategoryAnswerRecord.idName = categoryitems[i].idName;
    }

    // now we have the record - lets add it to the array
    newEntityCategoryAnswers.push(
      newEntityCategoryAnswerRecord
    );

  } // end loop



  return newEntityCategoryAnswers;
}


/*** readFormInputValuesSingle
 * takes the full list of possible answers (categoryitems) and the list of ansers that was there before they was displayo n the screen (entityCategoryAnswers) 
 * the object inputAnswers contains the answers after the user has changed some of them.
 * This function figures out what has changed and returns an array of objects that is marked 
 * updated, deleted, added for each of the possible answers

 * returns  an array (newAnswersArray) that can be used to update the database.


*/

export function readFormInputValuesSingle(
  entityCategoryID,
  categoryitems,
  entityCategoryAnswers,
  inputAnswers
) {

  let newEntityCategoryAnswers = [];

  let newEntityCategoryAnswerRecord = {};

  // For a category of categoryType="single" the answer is set in selectedAnswer.RadioSelected 
  let selectedIdName = inputAnswers.RadioSelected;

  if (entityCategoryAnswers.length <= 0) { // The first time - there is no previousSelectedIdName so we dont need to delete anything before creating
    // Mark the new for creation
    let newSelection = categoryitems.find(
      (item) => item.idName === selectedIdName
    );

    if (newSelection) {
      newEntityCategoryAnswerRecord = {};

      console.log("readFormInputValuesSingle idName:", selectedIdName, " ACTION create");
      newEntityCategoryAnswerRecord.action = "CREATE";
      newEntityCategoryAnswerRecord.text = ""; //no text on single 
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "to be created"; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.categoryitemID = newSelection.id;
      newEntityCategoryAnswerRecord.idName = newSelection.idName;
      newEntityCategoryAnswerRecord.entityCategoryID = entityCategoryID;

      newEntityCategoryAnswers.push(newEntityCategoryAnswerRecord);


    } else
      console.error("readFormInputValuesSingle selected value =" + selectedIdName + "= is not in database. This should never happen!");



  } else { // This is a change
    let previousSelectedIdName = entityCategoryAnswers[0].categoryitem.idName;


    if (selectedIdName === previousSelectedIdName) { //No change
      newEntityCategoryAnswerRecord = {};

      console.log("readFormInputValuesSingle idName:", selectedIdName, " ACTION unchanged");
      newEntityCategoryAnswerRecord.action = "unchanged";
      newEntityCategoryAnswerRecord.text = ""; //no text on single 
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = entityCategoryAnswers[0].id;
      newEntityCategoryAnswerRecord.categoryitemID = entityCategoryAnswers[0].categoryitem.id;
      newEntityCategoryAnswerRecord.idName = entityCategoryAnswers[0].categoryitem.idName;
      newEntityCategoryAnswerRecord.entityCategoryID = entityCategoryID;
      newEntityCategoryAnswers.push(newEntityCategoryAnswerRecord);

    } else { //changed

      // Mark the previous for deletion
      newEntityCategoryAnswerRecord = {};

      console.log("readFormInputValuesSingle idName:", previousSelectedIdName, " ACTION delete");
      newEntityCategoryAnswerRecord.action = "DELETE";
      newEntityCategoryAnswerRecord.text = ""; //no text on single 
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = entityCategoryAnswers[0].id;
      newEntityCategoryAnswerRecord.categoryitemID = entityCategoryAnswers[0].categoryitem.id;
      newEntityCategoryAnswerRecord.idName = entityCategoryAnswers[0].categoryitem.idName;
      newEntityCategoryAnswerRecord.entityCategoryID = entityCategoryID;

      newEntityCategoryAnswers.push(newEntityCategoryAnswerRecord);



      // Mark the new for creation
      let newSelection = categoryitems.find(
        (item) => item.idName === selectedIdName
      );

      if (newSelection) {
        newEntityCategoryAnswerRecord = {};

        console.log("readFormInputValuesSingle idName:", selectedIdName, " ACTION create");
        newEntityCategoryAnswerRecord.action = "CREATE";
        newEntityCategoryAnswerRecord.text = ""; //no text on single 
        newEntityCategoryAnswerRecord.entityCategoryAnswerID = "to be created"; //for existing answers a ID for new its empty
        newEntityCategoryAnswerRecord.categoryitemID = newSelection.id;
        newEntityCategoryAnswerRecord.idName = newSelection.idName;
        newEntityCategoryAnswerRecord.entityCategoryID = entityCategoryID;

        newEntityCategoryAnswers.push(newEntityCategoryAnswerRecord);


      } else
        console.error("readFormInputValuesSingle selected value =" + selectedIdName + "= is not in database. This should never happen!");


    }


  }


  return newEntityCategoryAnswers;
}






/*** setFormCategoryInputValues
 
 eg newDefaultValues ={
  sdg: true,
  industry: false
}
*/
export function setFormCategoryInputValues(networkCategories, entityCategories) {
  let newDefaultValues = {};

  for (let i = 0; i < networkCategories.length; i++) {
    let found = entityCategories.find(
      (item) => item.category.idName === networkCategories[i].idName
    );
    if (found) {
      newDefaultValues[networkCategories[i].idName] = true;
      let textAttribute = found.category.idName + "-text";
      newDefaultValues[textAttribute] = found.text;
      //console.log("textAttribute: ", textAttribute, "newDefaultValues[textAttribute]",newDefaultValues[textAttribute] );
    } else newDefaultValues[networkCategories[i].idName] = false;
  }
  return newDefaultValues;
}


/*** readFormCategoryInputValuesMultiple
 * This function figures out what has changed and returns an array of objects that is marked 
 * updated, deleted, added for each of the possible answers

 * returns  an array  that can be used to update the database.


*/
export function readFormCategoryInputValuesMultiple(
  entityID,
  networkCategories,
  entityCategories,
  inputAnswers
) {


  let newEntityCategories = [];

  let newEntityCategoryRecord = {};

  for (let i = 0; i < networkCategories.length; i++) {
    // loop trugh all possible categories
    newEntityCategoryRecord = {
      action: "dont know", // "unchanged", "create", "delete" or "update"
      idName: networkCategories[i].idName, //just for debugging
      text: "dont know",
      entityCategoryID: "dont know", //for existing answers a ID for new its empty
      categoryID: "dont know",
      entityID: entityID
    };

    // first figure out if this category was already in the database before we enabeled editing
    let alreadyChecked = entityCategories.find(
      (item) => item.category.idName === networkCategories[i].idName
    );

    // if the entity already has one or more answers in this category. then there is a entityCategory record
    //


    if (inputAnswers[networkCategories[i].idName] && alreadyChecked) {
      // if the checkbox is checked and it was checked before editing


      //Now we need to figure out if the text has changed. If it has then we must mark it to be UPDATE
      if ((inputAnswers[`${networkCategories[i].idName}-text`] !== alreadyChecked.text) && (inputAnswers[`${networkCategories[i].idName}-text`] !== undefined)) {
        // console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION UPDATE TEXT CHANGED alreadyChecked.text=",alreadyChecked.text, "= text=", inputAnswers[`${categoryitems[i].idName}-text`], "=" );        
        newEntityCategoryRecord.action = "UPDATE";
        newEntityCategoryRecord.text = inputAnswers[`${networkCategories[i].idName}-text`]; //text is changed
      } else {

        //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION unchanged");
        newEntityCategoryRecord.action = "unchanged";
        newEntityCategoryRecord.text = alreadyChecked.text; //this has not been changed in this input
      }
      newEntityCategoryRecord.entityCategoryID = alreadyChecked.id; //for existing answers a ID for new its empty
      newEntityCategoryRecord.categoryID = networkCategories[i].id;
      newEntityCategoryRecord.idName = alreadyChecked.category.idName;
    }

    if (inputAnswers[networkCategories[i].idName] && !alreadyChecked) {
      // if the checkbox is checked and it was NOT checked before editing
      //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION create");
      newEntityCategoryRecord.action = "CREATE";
      newEntityCategoryRecord.entityCategoryID = "to be created"; //for existing answers a ID for new its empty      
      newEntityCategoryRecord.text = inputAnswers[`${networkCategories[i].idName}-text`]; //text is changed
      if (newEntityCategoryRecord.text === undefined) newEntityCategoryRecord.text = ""; //dont put empty text in db
      newEntityCategoryRecord.categoryID = networkCategories[i].id;
      newEntityCategoryRecord.idName = networkCategories[i].idName;
    }
    if (!inputAnswers[networkCategories[i].idName] && alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION delete");
      newEntityCategoryRecord.action = "DELETE";
      newEntityCategoryRecord.entityCategoryID = alreadyChecked.id; //for existing answers a ID for new its empty
      newEntityCategoryRecord.text = alreadyChecked.text; //this has no been changed in this input
      newEntityCategoryRecord.categoryID = networkCategories[i].id;
      newEntityCategoryRecord.idName = alreadyChecked.category.idName;
    }

    if (!inputAnswers[networkCategories[i].idName] && !alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      //console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION not selected");
      newEntityCategoryRecord.action = "not selected";
      newEntityCategoryRecord.entityCategoryID = "not selected";
      newEntityCategoryRecord.text = "not selected";
      newEntityCategoryRecord.categoryID = networkCategories[i].id;
      newEntityCategoryRecord.idName = networkCategories[i].idName;
    }

    // now we have the record - lets add it to the array
    newEntityCategories.push(newEntityCategoryRecord);

  } // end loop



  return newEntityCategories;
}







/*** setFormNetworkInputValues
 
 eg newDefaultValues ={
  sdg: true,
  industry: false
}
*/
export function DELETEsetFormNetworkInputValues(networks, entityNetworkMemberships) {
  let newDefaultValues = {};

  for (let i = 0; i < networks.length; i++) {
    let found = entityNetworkMemberships.find(
      (item) => item.network.idName === networks[i].idName
    );
    if (found) {
      newDefaultValues[networks[i].idName] = true;
      let textAttribute = networks[i].idName + "-text";
      newDefaultValues[textAttribute] = found.text;

      //then the rest of the fields
      newDefaultValues[`${networks[i].idName}-status`] = found.status;
      newDefaultValues[`${networks[i].idName}-approvedDate`] = found.approvedDate;
      newDefaultValues[`${networks[i].idName}-approvedBy`] = found.approvedBy;
      newDefaultValues[`${networks[i].idName}-appliedDate`] = found.appliedDate;
      newDefaultValues[`${networks[i].idName}-appliedBy`] = found.appliedBy;
      newDefaultValues[`${networks[i].idName}-resignedDate`] = found.resignedDate;
      newDefaultValues[`${networks[i].idName}-resignedBy`] = found.resignedBy;

      //console.log("textAttribute: ", textAttribute, "newDefaultValues[textAttribute]",newDefaultValues[textAttribute] );
    } else newDefaultValues[networks[i].idName] = false;
  }
  return newDefaultValues;
}




/*** readFormNetworkInputValues
 * This function figures out what has changed and returns an array of objects that is marked 
 * updated, deleted, added for each of the possible answers

 * returns  an array  that can be used to update the database.
      networks,
      entityNetworkMemberships,

*/
export function readFormNetworkInputValues(
  entityID,
  networks,
  entityNetworkMemberships,
  inputAnswers
) {

  let nowDate = new Date();
  let statusNextDate = nowDate.toISOString().split('T')[0];
  //let statusNextDate = nowDate.toISOString(); //full date
  let emptyDate = new Date(null);
  let emptyDateStr = emptyDate.toISOString().split('T')[0]; //empty date is not possible
  //TODO: Fix emptyDateStr date 
  let newEntityNetworkMemberships = [];

  let newEntityNetworkMembershipRecord = {};

  for (let i = 0; i < networks.length; i++) {
    // loop trugh all possible categories
    newEntityNetworkMembershipRecord = {
      action: "unchanged", // "unchanged", "create", "delete" or "update"
      idName: networks[i].idName, //just for debugging
      text: "dont know",
      status: "dont know",
      approvedDate: "dont know",
      approvedBy: "dont know",
      appliedDate: "dont know",
      appliedBy: "dont know",
      resignedDate: "dont know",
      resignedBy: "dont know",
      invitedDate: "dont know",
      invitedBy: "dont know",
      entityNetworkMembershipID: "dont know", //for existing answers a ID for new its empty
      networkID: "dont know",
      entityID: entityID
    };




    // figure out if this network is marked for update
    if (inputAnswers[networks[i].idName]) { // checkbox true

      // so now lets figure out what kind of update 
      if (inputAnswers[`${networks[i].idName}-apply`]) { //its an application
        newEntityNetworkMembershipRecord.status = "Applied";
        newEntityNetworkMembershipRecord.appliedDate = statusNextDate;
        newEntityNetworkMembershipRecord.appliedBy = "logged in user";
        newEntityNetworkMembershipRecord.text = inputAnswers[`${networks[i].idName}-text`];

        //next we need to figure out if there is already a relation between the entity and the network. It might be that there are previous statuses that we need to preserve
        let previousRelation = entityNetworkMemberships.find(
          (item) => item.network.idName === networks[i].idName
        );

        if (previousRelation) {
          newEntityNetworkMembershipRecord.action = "UPDATE"; //an existing record - needs to be updated


          newEntityNetworkMembershipRecord.approvedDate = previousRelation.approvedDate; //special case: might have resigned and is now applying again
          newEntityNetworkMembershipRecord.approvedBy = previousRelation.approvedBy; //special case: might have resigned and is now applying again

          newEntityNetworkMembershipRecord.resignedDate = previousRelation.resignedDate; //special case: might have resigned and is now applying again
          newEntityNetworkMembershipRecord.resignedBy = previousRelation.resignedBy; //special case: might have resigned and is now applying again

          newEntityNetworkMembershipRecord.invitedDate = previousRelation.invitedDate;
          newEntityNetworkMembershipRecord.invitedBy = previousRelation.invitedBy;


          newEntityNetworkMembershipRecord.entityNetworkMembershipID = previousRelation.id;
          newEntityNetworkMembershipRecord.networkID = networks[i].id;
          newEntityNetworkMembershipRecord.entityID = entityID;

        } else { //No existingrelation between entity and network
          newEntityNetworkMembershipRecord.action = "CREATE"; //create the relation

          newEntityNetworkMembershipRecord.approvedDate = emptyDateStr;
          newEntityNetworkMembershipRecord.approvedBy = ""

          newEntityNetworkMembershipRecord.resignedDate = emptyDateStr;
          newEntityNetworkMembershipRecord.resignedBy = ""

          newEntityNetworkMembershipRecord.invitedDate = emptyDateStr;
          newEntityNetworkMembershipRecord.invitedBy = ""


          newEntityNetworkMembershipRecord.entityNetworkMembershipID = "to be created";
          newEntityNetworkMembershipRecord.networkID = networks[i].id;
          newEntityNetworkMembershipRecord.entityID = entityID;

        }


      }

      if (inputAnswers[`${networks[i].idName}-resign`]) { //its an application
        newEntityNetworkMembershipRecord.status = "Resigned";
        newEntityNetworkMembershipRecord.resignedDate = statusNextDate;
        newEntityNetworkMembershipRecord.resignedBy = "logged in user";
        newEntityNetworkMembershipRecord.text = inputAnswers[`${networks[i].idName}-text`];

        //next we need to figure out if there is already a relation between the entity and the network. It might be that there are previous statuses that we need to preserve
        let previousRelation = entityNetworkMemberships.find(
          (item) => item.network.idName === networks[i].idName
        );

        if (previousRelation) {
          newEntityNetworkMembershipRecord.action = "UPDATE"; //an existing record - needs to be updated


          newEntityNetworkMembershipRecord.approvedDate = previousRelation.approvedDate;
          newEntityNetworkMembershipRecord.approvedBy = previousRelation.approvedBy;

          newEntityNetworkMembershipRecord.appliedDate = previousRelation.appliedDate;
          newEntityNetworkMembershipRecord.appliedBy = previousRelation.appliedBy;

          newEntityNetworkMembershipRecord.invitedDate = previousRelation.invitedDate;
          newEntityNetworkMembershipRecord.invitedBy = previousRelation.invitedBy;


          newEntityNetworkMembershipRecord.entityNetworkMembershipID = previousRelation.id;
          newEntityNetworkMembershipRecord.networkID = networks[i].id;
          newEntityNetworkMembershipRecord.entityID = entityID;

        } else { //No existingrelation between entity and network --This should never happen
          newEntityNetworkMembershipRecord.action = "CREATE"; //create the relation

          newEntityNetworkMembershipRecord.approvedDate = emptyDateStr;
          newEntityNetworkMembershipRecord.approvedBy = ""

          newEntityNetworkMembershipRecord.appliedDate = emptyDateStr;
          newEntityNetworkMembershipRecord.appliedBy = ""

          newEntityNetworkMembershipRecord.invitedDate = emptyDateStr;
          newEntityNetworkMembershipRecord.invitedBy = ""


          newEntityNetworkMembershipRecord.entityNetworkMembershipID = "to be created";
          newEntityNetworkMembershipRecord.networkID = networks[i].id;
          newEntityNetworkMembershipRecord.entityID = entityID;

        }


      }




    }

    // now we have the record - lets add it to the array
    newEntityNetworkMemberships.push(newEntityNetworkMembershipRecord);

  } // end loop



  return newEntityNetworkMemberships;
}


/** getEntityCategory
 * find the category and return it
 * @param {*} entity_categories 
 * @param {*} categoryIdName 
 */

export function getEntityCategory(entity_categories, categoryIdName) {

  const inputCategory = entity_categories.find(element => element.category.idName === categoryIdName);

  if (inputCategory) {
    return inputCategory;
  }
  return undefined;

}


/** getTextBlock
 * find the category and return it
 * @param {*} textBlocks 
 * @param {*} textBlockIdName 
 */

export function getTextBlock(textBlocks, textBlockIdName) {

  const foundTextBlock = textBlocks.find(element => element.idName === textBlockIdName);

  if (foundTextBlock) {
    return foundTextBlock;
  }
  return undefined;

}




/** getCategoryitem
 * takes a category that contain all its categoryitems as input
 * and returns the categoryitem with categoryitemIdName
 */

export function getCategoryitem(category, categoryitemIdName) {

  const categoryitem = category.categoryitems.find(element => element.idName === categoryitemIdName);

  if (categoryitem) {
    return categoryitem;
  }
  return undefined;

}

/** replaceItemInArray
 * Loops trugh an array and eplaces all occurences with a new value
 * returns an array
 * @param {*} itemToReplace 
 * @param {*} newItem 
 * @param {*} theArray 
 */
export function replaceItemInArray(itemToReplace, newItem, theArray) {

  let returnArray = [];
  theArray.map(currentItem => {
      if (currentItem == itemToReplace)
          returnArray.push(newItem);
      else
          returnArray.push(currentItem);
  });

  return returnArray;
}

/* filterArray
takes an array and returns all items that starts with the string startStr
returns an array of the items that starts with startStr or an empty array
a item that is returned in the array must have minimum 2 char langht
*/
export function filterArray(startStr, theArray) {

  let returnArray = [];
  let n = 0;
  let networkIdName = "";
  const startStrLen = startStr.length;

  theArray.map(currentItem => {
      n = currentItem.indexOf(startStr);
      if (n == 0) { // it is at the start
        networkIdName = currentItem.substring(startStrLen);
        n = networkIdName.length;
        if (n > 2) { //a network nome must be at least 2 char
          returnArray.push(networkIdName);
        }
      }
  });

  return returnArray;
}

