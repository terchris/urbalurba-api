/* lib funcions for initial setup and installation of urbalurba */
import fetch from 'cross-fetch';

import {
    getCategoryIDByIdName, updateCategory, createCategory, getCategoryByIdName,
    getCategoryitemIDByIdNameAndCategoryIdName, updateCategoryitem, createCategoryitem,
    getNetworkIDByIdName, updateNetwork, createNetwork,
    getEntitytypeIDByIdName, updateEntitytype, createEntitytype,
    getNetworkEntitytypeByEntitytypeIDandNetworkID, createNetworkEntitytype, updateNetworkEntitytype,
    getNetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID, createNetworkEntitytypeCategory, updateNetworkEntitytypeCategory,
    getAllEntitiesList, createEntity, updateEntity, getEntityIDByIdName,
    createEntityParents,
    prefixArrayObjects, getSocialLinks,
    interchange2strapiEntityRecord, getEntityCategoryIDByIdName, getCategoryitemIDByIdNameAndCategoryID, getEntityCategoryAnswerIDByCategoryIDandCategoryitemIdName, createEntityCategory, createEntityCategoryAnswer, updateEntityCategoryAnswer, makeEntityMemberOfAllNetworks, interchangeImage2StrapiImage
} from "./strapidatalib.js";


import {
    getNested, string2IdKey, URL_SEPARATOR, ORGANIZATION_ENTITYTYPE
} from "./urbalurbalib2.js";

import {
    getMemoryEntityIDByIdName, copyInsightlyCategoryAnswers
} from "./insightlylib.js";


const CATEGORIES_URL = "https://terchris.github.io/urbalurba-data/categories.json";
const ENTITYTYPES_URL = "https://terchris.github.io/urbalurba-data/entitytypes.json";
const GITHUB_NETWORKS_URL = "https://terchris.github.io/urbalurba-data/networks.json";
export const GITHUB_SOLUTIONS_URL = "https://terchris.github.io/urbalurba-data/solutions.json";
export const GITHUB_PROJECTS_URL = "https://terchris.github.io/urbalurba-data/project-2parents.json";

//export const GITHUB_EVENTS_URL = "https://terchris.github.io/urbalurba-data/events.json";
// need one GITHUB_ORGANIZATIONS_URL as well



/* updateCategories
updates categories or create them if they do not exist.
takes caregoryData as parameter. Returns the number of categories imported
*/
export async function updateCategories(caregoryData) {

    let catCounter = 0;
    let catItemCounter = 0;

    for (catCounter = 0; catCounter < caregoryData.length; catCounter++) {
        let currentCategoryID;
        let currentCategory = caregoryData[catCounter];

        console.log("--- IdName =", currentCategory.idName);
        currentCategoryID = await getCategoryIDByIdName(currentCategory.idName);
        //console.log("getCategoryIDByIdName currentCategoryID =", currentCategoryID)
        if (currentCategoryID != "none") { //yes it exists - we need to update            
            currentCategoryID = await updateCategory(currentCategory, currentCategoryID);
            console.log("updateCategory currentCategoryID =", currentCategoryID)
        } else {// its not there - lets add it   
            currentCategoryID = await createCategory(currentCategory);
            console.log("createCategory currentCategoryID =", currentCategoryID)
        }
        for (catItemCounter = 0; catItemCounter < currentCategory.categoryItems.length; catItemCounter++) {
            let childCategoryItemID;
            let currentCategoryItem = currentCategory.categoryItems[catItemCounter];
            childCategoryItemID = await getCategoryitemIDByIdNameAndCategoryIdName(currentCategory.idName, currentCategoryItem.idName)
            //console.log("getCategoryitemIDByIdNameAndCategoryIdName childCategoryItemID =", childCategoryItemID)

            if (childCategoryItemID != "none") { //yes it exists - we need to update
                childCategoryItemID = await updateCategoryitem(currentCategoryItem, childCategoryItemID);
                console.log("updateCategoryitem childCategoryItemID =", childCategoryItemID)
            } else { // its not there - lets add it   
                childCategoryItemID = await createCategoryitem(currentCategoryItem, currentCategoryID);
                console.log("createCategoryitem childCategoryItemID =", childCategoryItemID)
            }

        }

    }


    console.log("Finished updateCategories. No of categories updated:", catCounter);
    return catCounter;


}




/* readCategories
read the json structure containing categories
*/
export async function readCategories() {

    const response = await fetch(CATEGORIES_URL);

    return response.json();

}



/* updateStrapiNetworks
updates networks or create them if they do not exist.
takes networkData as parameter. Returns the number of networks imported
*/
export async function updateStrapiNetworks(interchangeNetworkArray) {

    let netCounter = 0;
    let currentNetworkID;
    let currentInterchangeNetworkRecord;
    let currentStrapiNetworkRecord;

    for (netCounter = 0; netCounter < interchangeNetworkArray.length; netCounter++) {
        currentNetworkID = "none";

        currentInterchangeNetworkRecord = interchangeNetworkArray[netCounter];
        currentInterchangeNetworkRecord.idName = string2IdKey(currentInterchangeNetworkRecord.idName); //make sure its a valid idName

        currentStrapiNetworkRecord = await interchange2strapiNetworkRecord(currentInterchangeNetworkRecord);

        console.log("network idName:", currentStrapiNetworkRecord.idName)
        currentNetworkID = await getNetworkIDByIdName(currentStrapiNetworkRecord.idName);


        if (currentNetworkID !== "none") { //yes it exists - we need to update
            currentNetworkID = await updateNetwork(currentStrapiNetworkRecord, currentNetworkID);
            if (currentNetworkID != "none") {
                console.log("Updated network: ", currentStrapiNetworkRecord.idName);

                //now we need to update the types of memberships the network has
                await copyNetworkEntitytypes(currentInterchangeNetworkRecord, currentNetworkID);

            } else {
                console.error("Error Cant update network: ", currentStrapiNetworkRecord.idName);
                debugger;
            }

        } else { // its not there - lets add it   
            currentNetworkID = await createNetwork(currentStrapiNetworkRecord);
            if (currentNetworkID != "none") {
                console.log("Added network: ", currentStrapiNetworkRecord.idName);

                //now we need to update the types of memberships the network has
                await copyNetworkEntitytypes(currentInterchangeNetworkRecord, currentNetworkID);

            } else {
                console.error("Error Cant create network: ", currentStrapiNetworkRecord.idName);
                debugger;
            }
        }

    }
    console.log("updateNetworks finished. Processed total :", netCounter);
    return netCounter;
};


/* readNetworksFromGithub
read the json structure containing categories
*/
export async function readNetworksFromGithub() {

    const response = await fetch(GITHUB_NETWORKS_URL);

    return response.json();

}

/* readEntitiesFromGithub
read the json structure containing entities
takes the full URL in the parameter jsonURL
*/
export async function readEntitiesFromGithub(jsonURL) {

    const response = await fetch(jsonURL);

    return response.json();

}




/* updateEntitytypes
updates entitytypes or create them if they do not exist.
takes entitytypeData as parameter. Returns the number of entitytypes imported
*/
export async function updateEntitytypes(entitytypeData) {

    let entitytypeCounter = 0;
    console.log("updateEntitytypes: starting");

    for (entitytypeCounter = 0; entitytypeCounter < entitytypeData.length; entitytypeCounter++) {
        let currentEntitytypeID;
        let currentEntitytype = entitytypeData[entitytypeCounter];

        //TODO: use string2IdKey to make sure the idName does not contain illegal chars        



        currentEntitytypeID = await getEntitytypeIDByIdName(currentEntitytype.idName);
        if (currentEntitytypeID != "none") { //yes it exists - we need to update
            currentEntitytypeID = await updateEntitytype(currentEntitytype, currentEntitytypeID);
            if (currentEntitytypeID != "none") {
                console.info("Updated Entitytype: ", currentEntitytype.idName);
            } else {
                console.error("Error Cant update Entitytype: ", currentEntitytype.idName);
            }

        } else { // its not there - lets add it   
            currentEntitytypeID = await createEntitytype(currentEntitytype);
            if (currentEntitytypeID != "none") {
                console.info("Added Entitytype: ", currentEntitytype.idName);
            } else {
                console.error("Error Cant create Entitytype: ", currentEntitytype.idName);
                debugger
            }
        }


    }
    console.log("updateEntitytypes: finished");

    return entitytypeCounter;
};








/* readEntitytypes
read the json structure containing entitytypes
*/
export async function readEntitytypes() {

    const response = await fetch(ENTITYTYPES_URL);

    return response.json();

}


/* interchange2strapiNetworkRecord
takes the imported networkRecord and converts it to the structure for a network record in strapi
*/
function interchange2strapiNetworkRecord(insightlyNetworkRecord) {
    let strapiRecord = {};

    let socialLinks = {};
    let tmpResult;

    strapiRecord = {
        "idName": insightlyNetworkRecord.idName,
        "displayName": insightlyNetworkRecord.displayName,
        "slogan": insightlyNetworkRecord.slogan,
        "summary": insightlyNetworkRecord.summary,
        "description": insightlyNetworkRecord.description,
        "url": insightlyNetworkRecord.url,
        "phone": insightlyNetworkRecord.phone,
        "email": insightlyNetworkRecord.email,
        "location": insightlyNetworkRecord.location,
        "brreg": insightlyNetworkRecord.brreg,
        "internalImage": interchangeImage2StrapiImage(insightlyNetworkRecord.image)

    };

    // get the domains - if any
    tmpResult = getNested(insightlyNetworkRecord, "domains");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a domains 
        strapiRecord.domains = prefixArrayObjects(insightlyNetworkRecord.domains, "domainName");
    }



    // also add social fields 
    tmpResult = getSocialLinks(insightlyNetworkRecord);
    if (tmpResult != "none")
        strapiRecord.socialLinks = tmpResult;


    return strapiRecord;

}


/* copyNetworkEntitytypes
The networkMemberTypes looks like this:

        "networkMemberTypes": [
            {
                "entityType": "organization",
                "displayName": "Medlemskatagorier",
                "summary": "Medlemmene i nettverket",
                "categoryIdNames": ["sector","sdg", "industry", "challenge","tag" ]
            },
            {
                "entityType": "solution",
                "displayName": "Løsningskategorier",
                "summary": "Løsninger fra medlemmene",
                "categoryIdNames": ["sdg","industry", "challenge","tag", "impact", "result"]
            }
        ]



*/
async function copyNetworkEntitytypes(importNetworkRecord, networkID) {

    let currentMemberTypeRecord;
    let currentEntitytypeID;
    let currentNetworkEntitytypeID;
    let networkMemberTypesArray = importNetworkRecord.networkMemberTypes;

    for (let memberTypeCounter = 0; memberTypeCounter < networkMemberTypesArray.length; memberTypeCounter++) { //looping all networkMemberTypes
        currentMemberTypeRecord = networkMemberTypesArray[memberTypeCounter];

        currentEntitytypeID = await getEntitytypeIDByIdName(currentMemberTypeRecord.entityType);
        if (currentEntitytypeID != "none") { //yes it exists - we can proceed

            // we have the entitytypeID and the networkID - now we can find the networkEntitytype that binds them
            currentNetworkEntitytypeID = await getNetworkEntitytypeByEntitytypeIDandNetworkID(currentEntitytypeID, networkID);
            if (currentNetworkEntitytypeID != "none") { //there is a relation

                currentNetworkEntitytypeID = await updateNetworkEntitytype(currentNetworkEntitytypeID, currentMemberTypeRecord);
                if (currentNetworkEntitytypeID != "none") { // update was sucessful 
                    console.log("...Updated Network entityType: ", currentMemberTypeRecord.entityType);
                    await copyNetworkEntitytypeCategory(currentNetworkEntitytypeID, currentMemberTypeRecord.categoryIdNames); //make the connection whit the categories

                } else { //failed to update NetworkEntitytype 
                    console.error("Err copyNetworkEntitytypes updateNetworkEntitytype failed.   for =" + currentMemberTypeRecord.idName + "= ")
                    debugger;
                }

            } else { // there is no relation between the network and the entitytype - we need to create it

                currentNetworkEntitytypeID = await createNetworkEntitytype(currentEntitytypeID, networkID, currentMemberTypeRecord);
                if (currentNetworkEntitytypeID != "none") { // create was sucessful 
                    console.log("...Created Network entityType: ", currentMemberTypeRecord.entityType);
                    await copyNetworkEntitytypeCategory(currentNetworkEntitytypeID, currentMemberTypeRecord.categoryIdNames); //make the connection whit the categories

                } else { // could not create networkEntitytype
                    console.error("Err copyNetworkEntitytypes createNetworkEntitytype failed.   for =" + currentMemberTypeRecord.idName + "= ");
                    debugger;

                }


            }




        } else { // its not there 
            console.error("Err copyNetworkEntitytypes entitytype =" + currentMemberTypeRecord.entityType + "= does NOT exist.");
            debugger;
        }



    }


}

/* copyNetworkEntitytypeCategory
connects the NetworkEntitytype to categories
"categoryIdNames": ["sector","sdg", "industry", "challenge","tag" ]
*/
async function copyNetworkEntitytypeCategory(networkEntitytypeID, categoryIdNames) {

    // now we need to connect the categories for this NetworkEntitytype
    // the categories are in the array categoryIdNames
    // now we must loop trugh the categoryIdNames and find the id

    let networkEntitytypeCategoryID = "none";
    let categoryID = "none";
    let categoryIdName = "none"
    let networkEntitytypeCategoryTxt = ""


    for (let categoryCounter = 0; categoryCounter < categoryIdNames.length; categoryCounter++) {
        networkEntitytypeCategoryID = "none";
        categoryID = "none";
        categoryIdName = "none"
        categoryIdName = categoryIdNames[categoryCounter];
        categoryID = await getCategoryIDByIdName(categoryIdName);
        if (categoryID != "none") { // there is a category in the system 

            //networkEntitytypeCategory is the relation between the category and the networkEntitytype
            networkEntitytypeCategoryID = await getNetworkEntitytypeCategoryByNetworkEntitytypeIDandCategoryID(networkEntitytypeID, categoryID);
            if (networkEntitytypeCategoryID != "none") { // there is a relation - lets update it
                //networkEntitytypeCategoryTxt = "Network:" + importNetworkRecord.idName + "  entitytype:" + currentMemberTypeRecord.idName + " category:" + categoryIdName;
                networkEntitytypeCategoryTxt = "category:" + categoryIdName;
                networkEntitytypeCategoryID = await updateNetworkEntitytypeCategory(networkEntitytypeCategoryID, networkEntitytypeCategoryTxt);
                if (networkEntitytypeCategoryID != "none") { // we where able to update
                    console.log("...... updateNetworkEntitytypeCategory: ", networkEntitytypeCategoryTxt)
                } else { // not possible to update
                    console.error("...... Err updateNetworkEntitytypeCategory failed: ", networkEntitytypeCategoryTxt)
                }

            }
            else { // there is no relation - it should be created
                //networkEntitytypeCategoryTxt = "Network:" + importNetworkRecord.idName + "  entitytype:" + currentMemberTypeRecord.idName + " category:" + categoryIdName;
                networkEntitytypeCategoryTxt = "category:" + categoryIdName;
                networkEntitytypeCategoryID = await createNetworkEntitytypeCategory(networkEntitytypeID, categoryID, networkEntitytypeCategoryTxt);
                if (networkEntitytypeCategoryID != "none") { // we where able to update
                    console.log("...... createNetworkEntitytypeCategory: ", networkEntitytypeCategoryTxt)
                } else { // not possible to update
                    console.error("...... Err createNetworkEntitytypeCategory failed: ", networkEntitytypeCategoryTxt)
                }

            }

        }
        else { // no category with that name - input data is wrong
            console.error("Err The category:" + categoryIdName + ": on entitytype:" + currentMemberTypeRecord.idName + ": for network:" + importNetworkRecord.idName + ": does not exist. check import data");
            debugger;
        }


    } // end loop




}




/** updateStrapiEntities
 * takes an array of entities (can be organizations, solutions +++)
 * updates existing or creates new ones if they dont exist
 * 
 * dataSource = text describing where the data is coming from. eg Insightly, github solutions, 
 * dataWho = what/who started the import
 * 
 */
export async function updateInterchangeEntities(updateInterchangeEntitiesArray, dataSource, dataWho) {

    let strapiAllNetworksArray = [];
    let strapiAllEntitiesArray = [];
    let strapiAllPersonsArray = [];
    let currentEntityInterchangeRecord = {};
    let currentEntityStrapiRecord = {};
    let currentEntityStrapiRecordIdName = {};
    let currentEntityStrapiRecordID = 0;
    let numEntityCreadted = 0;
    let numEntityUpdated = 0;
    let numEntityFailed = 0;
    let numEntitySkipped = 0;
    let networkResult;
    let numNetworkProblems = 0;
    let numParentProblems = 0;

    let numUpdateEntites = updateInterchangeEntitiesArray.length;
    console.log("updateInterchangeEntities: starting import of " + numUpdateEntites + " entities");

    /*    
        strapiAllNetworksArray = await getAllNetworksList();   
        console.log("All Networks in strapi:", strapiAllNetworksArray.length);
    
    strapiAllEntitiesArray = await getAllEntitiesList();
    console.log("All entities in strapi:", strapiAllEntitiesArray.length);
    
        strapiAllPersonsArray = await strapiGetAllPersons();
        console.log("All persons in strapi:", strapiAllPersonsArray.length);
     */

    for (let updateEntityCounter = 0; updateEntityCounter < numUpdateEntites; updateEntityCounter++) {



        currentEntityInterchangeRecord = updateInterchangeEntitiesArray[updateEntityCounter];

        currentEntityStrapiRecord = await interchange2strapiEntityRecord(currentEntityInterchangeRecord);

        if (currentEntityStrapiRecord != "none") {
            currentEntityStrapiRecordIdName = currentEntityStrapiRecord.idName;
            //currentEntityStrapiRecordID = await getMemoryEntityIDByIdName(currentEntityStrapiRecordIdName, strapiAllEntitiesArray);
            currentEntityStrapiRecordID = await getEntityIDByIdName(currentEntityStrapiRecordIdName);

            if (currentEntityStrapiRecordID != "none") { //yes it exists - we need to update
                currentEntityStrapiRecordID = await updateEntity(currentEntityStrapiRecord, currentEntityStrapiRecordID);
                if (currentEntityStrapiRecordID != "none") { // we could update it
                    numEntityUpdated++;
                    console.info("updateInterchangeEntities: (" + (updateEntityCounter + 1) + "/" + numUpdateEntites + ") Updated:", currentEntityStrapiRecordIdName);
                } else { // failed to update
                    numEntityFailed++;
                    console.error("updateInterchangeEntities: (" + (updateEntityCounter + 1) + "/" + numUpdateEntites + ") Error Update failed:", currentEntityStrapiRecordIdName);
                }
            } else { //does not exist - going to be created
                currentEntityStrapiRecordID = await createEntity(currentEntityStrapiRecord);
                if (currentEntityStrapiRecordID != "none") { // we could create it
                    numEntityCreadted++;
                    console.info("updateInterchangeEntities: (" + (updateEntityCounter + 1) + "/" + numUpdateEntites + ") Created:", currentEntityStrapiRecordIdName);
                } else { // failed to create
                    numEntityFailed++;
                    console.error("updateInterchangeEntities: (" + (updateEntityCounter + 1) + "/" + numUpdateEntites + ") Error Create failed:", currentEntityStrapiRecordIdName);
                }
            }

            // so now we have created, updated or failed
            if (currentEntityStrapiRecordID != "none") { // we have sucessfully created or updated
                //1. Update the answers                 
                await updateInterchangeEntityAnswers(currentEntityStrapiRecordID, currentEntityStrapiRecord.idName, currentEntityStrapiRecord.categoryAnswers, dataSource, dataWho);
                

                //2. Make entity member of all of the networks defined in .networkmemberships
                networkResult = await makeEntityMemberOfAllNetworks(currentEntityStrapiRecordID, currentEntityStrapiRecord.idName, currentEntityStrapiRecord.networkMemberships, dataSource, dataWho);
                if (networkResult != "OK") {
                    numNetworkProblems++
                }
                

                //3. Update links to parent entities
                let parentFoundResult = await createEntityParents(currentEntityStrapiRecordID, currentEntityStrapiRecord.parents);
                
                if (parentFoundResult == "OK") {

                    //4. Update links to child entities
                    //skipping this for now
                    console.log("TODO: 4. Update links to child entities")

                    //5. Update or add contacts                 
                    // todo await createEntityContacts(currentEntityID, strapiEntityRecord.contacts);
                    console.log("TODO: 5. Import contacts")

                } else {
                    numParentProblems++
                }



            } else { // could not update or create
                console.error("could not update or create currentEntityInterchangeRecord");
                debugger

            }

        } else {  // skipping because there was something wrong with the currentEntityInterchangeRecord
            console.error("something wrong with the currentEntityInterchangeRecord");
            numEntitySkipped++
            debugger
        }

    } // end for loop

    let returnMsg = "updateInterchangeEntities: Updated= " + numEntityUpdated + " Created= " + numEntityCreadted + " Failed= " + numEntityFailed + " Skipped= " + numEntitySkipped + " numNetworkProblems=" + numNetworkProblems +" numParentProblems=" +numParentProblems;
    return returnMsg;


}




/** updateInterchangeEntityAnswers
 * takes the categoryAnswers for an entity and updates strapi
 * 
 * dataSource = text describing where the data is coming from. eg Insightly, github solutions, 
 * dataWho = what/who started the import
*/
async function updateInterchangeEntityAnswers(entityID, entityIdName, categoryAnswers, dataSource, dataWho) {

    let logText = "";
    let currentCategory = "";
    let categoryIdName = "";
    let categoryID = "";
    let entityCategoryID = "";





    for (let categoryCounter in categoryAnswers) {
        currentCategory = categoryAnswers[categoryCounter];
        categoryIdName = currentCategory.categoryIdName;

        if (categoryIdName != "tag") { //debugging -- tag has problems



            categoryID = await getCategoryIDByIdName(categoryIdName); //get the ID and the categoryType


            if (categoryID != "none") { // we have a category

                // First check if there is a relation between the sol and the category already
                entityCategoryID = await getEntityCategoryIDByIdName(entityIdName, categoryIdName);
                if (entityCategoryID == "none") { //Does not exist. We need to create it first
                    //Now we can create the relation between category and entity - the EntityCategory
                    let debugText = "Category:" + categoryIdName + ",Entity:" + entityIdName + ",Source:" + dataSource + ",Who:" + dataWho; //for knowing where the answer came from
                    entityCategoryID = await createEntityCategory(entityID, categoryID, debugText);
                    if (entityCategoryID != "none") { // yes - its created
                        logText = "Created entityCategory. " + debugText;
                        console.log(logText);
                    }
                    else {
                        logText = "Error Could not create entityCategory. " + debugText;
                        console.error(logText);
                        debugger
                    }
                } else {
                    console.log("TODO: updateEntityCategory for category=" + categoryIdName + "idName=" + entityIdName)
                }

                if (entityCategoryID != "none") { // we managed to create a entityCategory OR it was there - eigther way lets create the answers


                    let answers = currentCategory.answers; // get the array of answers




                    for (let answerCounter = 0; answerCounter < answers.length; answerCounter++) { //loop for the answers in the category
                        let currentAnswer = answers[answerCounter];
                        let categoryitemIdName = currentAnswer.answerIdName;
                        let categoryItemID = ""; // the ID of the categoryitem
                        let existEntityCategoryID = ""; // the ID of an existing answer
                        let newEntityCategoryID = ""; // the ID of the added answer
                        let updateEntityCategoryID = "";


                        categoryItemID = await getCategoryitemIDByIdNameAndCategoryID(categoryID, categoryitemIdName); //does the category have a categoryitem that can be answered

                        if (categoryItemID != "none") { // we have a category Item

                            //Lets see if there is already a entityCategoryAnswer
                            existEntityCategoryID = await getEntityCategoryAnswerIDByCategoryIDandCategoryitemIdName(entityCategoryID, categoryitemIdName);
                            if (existEntityCategoryID != "none") { // there is already a answer

                                let entityCategoryAnswerText = currentAnswer.text;
                                let debugText = "Categoryitem:" + categoryitemIdName + ",Category:" + categoryIdName + ",Entity:" + entityIdName + ",Source:" + dataSource + ",Who:" + dataWho + ",Time:" + new Date().toISOString();

                                updateEntityCategoryID = await updateEntityCategoryAnswer(existEntityCategoryID, debugText, entityCategoryAnswerText);
                                if (updateEntityCategoryID != "none") { // we managet to update an answer
                                    logText = "Update EntityCategoryAnswer. " + debugText + "(updateEntityCategoryID=" + updateEntityCategoryID + ")";
                                    console.log(logText);
                                } else {
                                    //trouble - could not create the answer
                                    logText = "Error could not update EntityCategoryAnswer. " + debugText + "(updateEntityCategoryID=" + updateEntityCategoryID + ")";
                                    console.error(logText);
                                    debugger
                                }

                            } else {
                                // Now we can create the relation between entityCategory and categoryitem
                                let entityCategoryAnswerText = currentAnswer.text;
                                let debugText = "Categoryitem:" + categoryitemIdName + ",Category:" + categoryIdName + ",Entity:" + entityIdName + ",Source:" + dataSource + ",Who:" + dataWho + ",Time:" + new Date().toISOString();
                                newEntityCategoryID = await createEntityCategoryAnswer(entityCategoryID, categoryItemID, debugText, entityCategoryAnswerText);

                                if (newEntityCategoryID != "none") { // we managet to create an answer
                                    logText = "Create EntityCategoryAnswer. " + debugText + "(newEntityCategoryID=" + newEntityCategoryID + ")";
                                    console.log(logText);
                                } else {
                                    //trouble - could not create the answer                                     
                                    logText = "Error could not create EntityCategoryAnswer. " + debugText + "(newEntityCategoryID=" + newEntityCategoryID + ")";
                                    console.error(logText);
                                    debugger
                                }

                            }



                        } else {
                            //TODO: this needs to be rewritten
                            //if the categoryType = "tag" then we create the categoryItem
                            if (categoryType == "tag") {
                                logText = "Create categoryItem. Org:" + organizationIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                console.log(logText);
                                sourceComment = "Insightly import. First organization to use the tag=" + categoryitemIdName + " is org=" + organizationIdName;
                                categoryItemID = await addCategoryItemTag(categoryitemIdName, categoryID, sourceComment);

                                // Now we can create the relation between OrgCat and categoryItem
                                let orgCatAnswerText = "CatItem:" + categoryitemIdName + ",Cat:" + categoryIdName + ",Org:" + organizationIdName + ",Source:insightly"; //for knowing where the answer came from
                                orgCatAnswerID = await addOrgCatAnswer(orgCatID, categoryItemID, orgCatAnswerText);

                                if (orgCatAnswerID != "none") { // we managet to create an answer
                                    logText = "Create OrgCatAnswer. Org:" + organizationIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                    console.log(logText);
                                } else {
                                    //trouble - could not create the answer
                                    logText = "Error could not create OrgCatAnswer. Org:" + organizationIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                    console.error(logText);
                                }


                            } else {
                                //trouble - the categry item is not defined
                                logText = "Error categoryItem is not defined. Org:" + organizationIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                console.error(logText);
                            }

                        }


                    } // end looping answers

                } else {
                    // trouble                     
                    logText = "Error could nor create entityCategory. Category:" + categoryIdName + ",Entity:" + entityIdName + ",Source:" + dataSource + ",Who:" + dataWho + ",Time:" + new Date().toISOString();
                    console.error(logText);
                    debugger
                }

            } else {
                //trouble - the cateory does not exist
                logText = "Error the cateory does not exist. Category:" + categoryIdName + ",Entity:" + entityIdName + ",Source:" + dataSource + ",Who:" + dataWho + ",Time:" + new Date().toISOString();
                console.error(logText);
                debugger
            }

        } else {
            logText = "TODO:  skipping category. Category:" + categoryIdName + ",Entity:" + entityIdName + ",Source:" + dataSource + ",Who:" + dataWho + ",Time:" + new Date().toISOString();
            console.log(logText);
        }

    } // end looping categories


}

