/* lib functions for accessing insightly */
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()


import {
    getNetworkIDByIdName,
    getEntitytypeIDByIdName, getAllStrapiEntitiesInsightlyForeignKey, updateEntity, createEntity,
    getCategoryByIdName,
    getEntityCategoryIDByIdName, createEntityCategory,
    getEntityCategoryAnswerIDByCategoryIDandCategoryitemIdName, createEntityCategoryAnswer,
    getCategoryitemIDByIdNameAndCategoryID,
    makeEntityMemberOfNetwork, getAllNetworksList,
    prefixArrayObjects,
    getAllStrapiPersonsInsightlyForeignKey, createPerson, updatePerson,
    createPersonEntityRole, updatePersonEntityRole, getPersonEntityRoleIDByEntityIDandPersonID,
    getEntityNetworkMembershipIDbyIdNames,
    getPersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID, createPersonNetworkMembershipRole, updatePersonNetworkMembershipRole,
    strapi2interchangeEntityRecord
} from "./strapidatalib.js";


import {
    replaceItemInArray, filterArray, name2UrbalurbaIdName, string2IdKey
} from "./urbalurbalib2.js";


import {
    getLocationDataByPostAddress, getFylkeByKommunenummer
} from "./geonorgelib.js";



import {
    getOrgByOrganisasjonsnummer, getOneOrganizationByName
} from "./brreglib.js";


import {
    APIFY_WEBPAGE_CONTACT_INFO_RESULT, APIFY_WEBPAGE_CONTACT_INFO_START,
    getApifyResultArray, startApifyTask,
    getScrapedURL, getScrapedPhone, createApifyUrlList
} from "./apifylib.js";




const INSIGHTLY_APIKEY = `${process.env.INSIGHTLY_APIKEY}`; //const INSIGHTLY_APIKEY = process.env.INSIGHTLY_APIKEY;
const INSIGHTLY_ORGANIZATIONSBYTAGURI = "https://api.insightly.com/v3.1/Organisations/SearchByTag?brief=false&top=500&tagName="
const INSIGHTLY_CONTACTSBYTAGURI = "https://api.insightly.com/v3.1/Contacts/SearchByTag?brief=false&top=500&count_total=false&tagName="; //`${process.env.INSIGHTLY_CONTACTSBYTAGURI}`;

const INSIGHTLY_ORGANIZATION_URL = "https://api.insightly.com/v3.1/Organisations";

const INSIGHTLY_ORGANIZATION_TAGS_URI = "https://api.insightly.com/v3.1/Organisations/:ORGANISATION_ID/Tags";

const INSIGHTLY_NETWORKS_URL = "https://api.insightly.com/v3.1/Organisations/Search?field_name=IsNetwork__c&field_value=true&brief=false&count_total=false"
const INSIGHTLY_ALLORGANIZATIONSTAG = "%23urbalurba.no" // #urbalurba.no
const INSIGHTLY_NETWORKTAGCHAR = "#";

const INSIGHTLY_CONTACT_UPDATE = "https://api.insightly.com/v3.1/Contacts";

// tags used to show what stage a org is when adding data to it
export const INSIGHTLY_TAG_BRREG_INPUT = "_brreg_Input";
const INSIGHTLY_TAG_BRREG_OK = "_brreg_OK";
const INSIGHTLY_TAG_BRREG_ERR = "_brreg_Err";
const INSIGHTLY_TAG_BRREG_INCOMPLETE = "_brreg_Incomplete";
export const INSIGHTLY_TAG_LOCATION_INPUT = "_location_Input";
const INSIGHTLY_TAG_LOCATION_OK = "_location_OK";
const INSIGHTLY_TAG_LOCATION_ERR = "_location_Err";
const INSIGHTLY_TAG_LOCATION_INCOMPLETE = "_location_Incomplete";

export const INSIGHTLY_TAG_WEBSCRAPE_INPUT = "_web_Input";
const INSIGHTLY_TAG_WEBSCRAPE_OK = "_web_OK";
const INSIGHTLY_TAG_WEBSCRAPE_ERR = "_web_Err";



// tags related to persons that will be synced to strapi
// Persons that will be synced to strapi must have a INSIGHTLY_WEB_CONTACT tag

export const INSIGHTLY_WEB_CONTACT = "%231web"; // #1web = persons that will be selected for sync to strapi - the person must also have a role tag eg #smartebyernorge.no-hoved

// The persons must also have a tag indicating what role they have related to the network
// the following roles are defined :
// hoved = main contact for the membersip in the network
// medlem = member of the network

// The tag for the main contact in the network smartebyernorge.no will look like this #smartebyernorge.no-hoved
// this tag indicated two things :
// 1 That the person belongs to the network smartebyernorge.no
// 2 that the person is the main contact for the network

// note that the main contact will also be a member of the network and will therefore have an additional member tag. Se below

// The tag for a member of the network smartebyernorge.no will look like this #smartebyernorge.no-medlem
// this tag indicated two things :
// 1 That the person belongs to the network smartebyernorge.no
// 2 that the person member of the network

// the roles are defined in the table below. A person will have just one role when transfering to strapi
// that role is the role with the lowest priority number

const PERSON_NETWORK_ROLES = [
    {
        "roleName": "-hoved",
        "roleText": "Hovedkontakt",
        "priority": 1
    },
    {
        "roleName": "-medlem",
        "roleText": "Medlem",
        "priority": 2
    }
];



const FIELD_SUMMARY_MAXCHAR = 200;

// globals for conversion
const INSIGHTLY_OLD_IMAGE = "http://bucket.urbalurba.com/";
const INSIGHTLY_NEW_IMAGE = "https://storage.googleapis.com/bucket.urbalurba.com/";


//globals for counting
let numEntityUpdated = 0;
let numEntityCategoryAnswerSynced = 0;

let numPersonUpdated = 0;
let numPersonCreated = 0;
let numPersonEntityRoleCreated = 0;
let numPersonEntityRoleUpdated = 0;





/** syncAllInsightlyOrganizations2strapi
 * This code is for syncing all members of all networks 
 * this routine makes the entity member of all the networks that are tagged in insighty
 */
export async function syncAllInsightlyOrganizations2strapi() {

    const ENTITYTYPE = "organization"; // DO NOT chage this - it is related to the entitytype definition 
    let insightlyAllTaggedOrganizations;
    let strapiAllOrganizations;
    let strapiAllNetworks;
    let networkID;
    let numEntityUpdated = 0;
    let numEntityCreadted = 0;
    let numEntityFromInsightly = 0;

    console.log("starting import of orgs ALL networks:");



    const entitytypeID = await getEntitytypeIDByIdName(ENTITYTYPE);
    if (entitytypeID == "none") {
        console.error("ENTITYTYPE is not in database: ", ENTITYTYPE);
        return
    }

    strapiAllNetworks = await getAllNetworksList();

    if (strapiAllNetworks.length > 1) {

        insightlyAllTaggedOrganizations = await getAllInsightlyOrganizationsByTag(INSIGHTLY_ALLORGANIZATIONSTAG);
        //TODO: important - check for duplicate idName's - will result in error from database        
        strapiAllOrganizations = await getAllStrapiEntitiesInsightlyForeignKey();

        numEntityFromInsightly = insightlyAllTaggedOrganizations.length;

        for (let i = 0; i < numEntityFromInsightly; i++) {
            let currentMemberID;
            let currentInsightlyOrganizationRecord = insightlyAllTaggedOrganizations[i];

            let currentEntityStrapiRecord = await insightly2strapiEntityRecord(currentInsightlyOrganizationRecord, entitytypeID);


            let insightly_idName = await getInsightlyCustomField("CKAN_NAME", currentInsightlyOrganizationRecord);

            if (insightly_idName != "") { // we have problems if there are no idName
                insightly_idName = string2IdKey(insightly_idName); //make sure it is a valid idName

                if (insightly_idName != "change != to == iota") {        //for debugging - makes it possible to target one org

                    currentMemberID = await getMemoryEntityIDByIdName(insightly_idName, strapiAllOrganizations);

                    if (currentMemberID != "none") { //yes it exists - we need to update

                        //now figure out if the entity needs to be updated - and where (in strapi or insightly)
                        let whatToUpdate = "strapi"; // decideWhatToUpdate(insightly_idName, strapiAllOrganizations, insightlyAllTaggedOrganizations)

                        switch (whatToUpdate) {
                            case "strapi":
                                // strapi must be updated with info from insightly

                                currentMemberID = await updateEntity(currentEntityStrapiRecord, currentMemberID);
                                if (currentMemberID != "none") { // we could update it
                                    numEntityUpdated++;
                                    console.log("Update Entity:", insightly_idName, " no:", i, "/", insightlyAllTaggedOrganizations.length);
                                    // there are error conditions
                                    // 1. if the organisasjonsnummer is a duplicate it will update the record - but not add the organisasjonsnummer
                                    //updateOrganizationAnswers

                                    await copyInsightlyCategoryAnswers(currentMemberID, currentEntityStrapiRecord.idName, currentEntityStrapiRecord.categories);

                                    let networkMembershipsArray = currentEntityStrapiRecord.networkmemberships;
                                    for (var networkCounter = 0; networkCounter < networkMembershipsArray.length; networkCounter++) { //loop all the networks the entity is a member of
                                        let networkIdName = networkMembershipsArray[networkCounter];
                                        networkID = await getMemoryEntityIDByIdName(networkIdName, strapiAllNetworks);
                                        if (networkID != "none") { //yes it exists - we need to update membership
                                            // now make the org member of the NETWORK
                                            await makeEntityMemberOfNetwork(currentMemberID, networkID, currentEntityStrapiRecord.idName, networkIdName, "Insightly sync", "Insightly job");
                                            //TODO: check that it was possible to make the entity a member of the network
                                        }
                                        else {
                                            console.error("Network:", networkIdName, " does not exist. When updating Entity:", insightly_idName);
                                            debugger
                                        }

                                    } //end looping network memberships
                                } else {
                                    console.error("ERROR did NOT Update Org:", insightly_idName, " no:", i, "/", insightlyAllTaggedOrganizations.length);
                                    debugger;
                                }

                                break;
                            default:
                                // nothing
                                break;

                        }




                    } else {// its not there - lets add it   

                        currentMemberID = await createEntity(currentEntityStrapiRecord);
                        if (currentMemberID != "none") { // we could create it
                            numEntityCreadted++;
                            console.log("Create Org:", insightly_idName, " no:", i, "/", insightlyAllTaggedOrganizations.length);
                            //write currentMemberID back to insightly ?
                            await copyInsightlyCategoryAnswers(currentMemberID, currentEntityStrapiRecord.idName, currentEntityStrapiRecord.categories);

                            // now make the entity member of the NETWORK
                            let networkMembershipsArray = currentEntityStrapiRecord.networkmemberships;
                            for (var networkCounter = 0; networkCounter < networkMembershipsArray.length; networkCounter++) { //loop all the networks the entity is a member of
                                let networkIdName = networkMembershipsArray[networkCounter];
                                networkID = await getMemoryEntityIDByIdName(networkIdName, strapiAllNetworks);
                                if (networkID != "none") { //yes it exists - we need to update membership
                                    // now make the org member of the NETWORK
                                    await makeEntityMemberOfNetwork(currentMemberID, networkID, currentEntityStrapiRecord.idName, networkIdName, "Insightly sync", "Insightly job");
                                    //TODO: check that it was possible to make the entity a member of the network
                                }
                                else {
                                    console.error("ERROR did NOT Create Org:", insightly_idName, " no:", i, "/", insightlyAllTaggedOrganizations.length);
                                    debugger;
                                }

                            } //end looping network memberships
                        }
                        else {
                            console.error("Network:", networkIdName, " does not exist. When updating Entity:", insightly_idName);
                            debugger;
                        }
                    }
                }
                else
                    console.log("debug skipping :", insightly_idName, " no:", i, "/", insightlyAllTaggedOrganizations.length);

            } else
                console.log("No idName (CKAN_NAME) on: ", currentInsightlyOrganizationRecord.ORGANISATION_NAME, " no:", i, "/", insightlyAllTaggedOrganizations.length);
        } //end for
    } else {
        console.error("NO networks defined. Import networks first");
        debugger;
    }

    let returnMsg = "numEntityFromInsightly:" + numEntityFromInsightly + " numEntityUpdated= " + numEntityUpdated + "numEntityCreadted= " + numEntityCreadted;
    console.log("Finished updating: ", returnMsg);





    return returnMsg;
};



/** updateInsightlyLodationData
 * takes a tag name and updates location data for all organizations 
 * 
 Tags are used to indicate the status of an organization

organisations to be read from brreg is tagged INSIGHTLY_TAG_LOCATION_INPUT



 */
export async function updateInsightlyLodationData(insightlyTagName) {

    let numEntityFromInsightly = 0;
    let numEntityUpdated = 0;
    let numEntityUpdateError = 0;
    let numEntityUpdateNoChange = 0;
    let returnMsg = "";
    let forceLookup = true;

    let organizationTagArray;

    let insightlyAllTaggedOrganizations;
    insightlyAllTaggedOrganizations = await getAllInsightlyOrganizationsByTag(insightlyTagName);

    if (insightlyAllTaggedOrganizations != "none") { //no problem getting data from insightly
        numEntityFromInsightly = insightlyAllTaggedOrganizations.length;

        for (let i = 0; i < numEntityFromInsightly; i++) {
            let currentInsightlyOrganizationRecord = insightlyAllTaggedOrganizations[i];

            currentInsightlyOrganizationRecord = await populateInsightlyLocationRecord(currentInsightlyOrganizationRecord, forceLookup); //looks up address stuff and populates the insightlyRecord

            if (currentInsightlyOrganizationRecord != "none") { // there was a change

                let opdatedOrg = await updateInsightlyOrganization(currentInsightlyOrganizationRecord);
                if (opdatedOrg != "none") { // we could update 
                    numEntityUpdated++;
                    console.log("Updated " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME, " Road:", currentInsightlyOrganizationRecord.ADDRESS_SHIP_STREET, " Zipcode:", currentInsightlyOrganizationRecord.ADDRESS_SHIP_POSTCODE);
                    organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                    if (organizationTagArray != "none") { // we could read tags 
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_INCOMPLETE, organizationTagArray); // delete for manual check
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_INPUT, organizationTagArray);
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_ERR, organizationTagArray);
                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_LOCATION_OK, organizationTagArray);


                        let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                        if (updateTagsResult == "none") { //we are in trouble
                            console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                            debugger
                        }
                    } else { // we could not read the tags
                        console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                        debugger

                    }

                } else { // problems updating 
                    console.error("Error: could not update " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                    debugger;
                    numEntityUpdateError++;
                    organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                    if (organizationTagArray != "none") { // we could read tags 
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_INCOMPLETE, organizationTagArray); // delete for manual check
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_OK, organizationTagArray);
                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_LOCATION_ERR, organizationTagArray);


                        let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                        if (updateTagsResult == "none") { //we are in trouble
                            console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                        }
                    } else { // we could not read the tags
                        console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                        debugger

                    }




                }

            } else { //no change
                console.log("no update " + (i + 1) + "/" + numEntityFromInsightly + " : ", insightlyAllTaggedOrganizations[i].ORGANISATION_NAME, " Road:", insightlyAllTaggedOrganizations[i].ADDRESS_SHIP_STREET, " Zipcode:", insightlyAllTaggedOrganizations[i].ADDRESS_SHIP_POSTCODE);
                numEntityUpdateNoChange++;
                organizationTagArray = await getInsightlyOrganizationTags(insightlyAllTaggedOrganizations[i].ORGANISATION_ID);
                if (organizationTagArray != "none") { // we could read tags 
                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_INCOMPLETE, organizationTagArray); // delete for manual check
                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_LOCATION_OK, organizationTagArray);
                    organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_LOCATION_ERR, organizationTagArray);

                    let updateTagsResult = await updateInsightlyOrganizationTags(insightlyAllTaggedOrganizations[i].ORGANISATION_ID, organizationTagArray);
                    if (updateTagsResult == "none") { //we are in trouble
                        console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", insightlyAllTaggedOrganizations[i].ORGANISATION_NAME);
                        debugger
                    }
                } else { // we could not read the tags
                    console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", insightlyAllTaggedOrganizations[i].ORGANISATION_NAME);
                    debugger

                }




            }

        }

        returnMsg = "numEntityFromInsightly:" + numEntityFromInsightly + " numEntityUpdated= " + numEntityUpdated + "numEntityUpdateError= " + numEntityUpdateError + "numEntityUpdateNoChange= " + numEntityUpdateNoChange;
    } else { //trouble
        returnMsg = "Error - No contact with Insightly";
    }

    console.log("Finished updating: ", returnMsg);

    return returnMsg;

}


/** populateInsightlyLocationRecord
 * takes a insightly record and updates its location info
 * returns the updated record or "none" if nothing is changed
 
 uses these fields
        "ADDRESS_SHIP_STREET": "PO Box 7700",
        "ADDRESS_SHIP_CITY": "Bergen",
        "ADDRESS_SHIP_STATE": null,
        "ADDRESS_SHIP_POSTCODE": "5020",
        "ADDRESS_SHIP_COUNTRY": "Norway",

to update these fields
        "CUSTOMFIELDS": [
            {
                "FIELD_NAME": "LOCATION_FYLKENAVN__c",
                "FIELD_VALUE": "VESTLAND",
                "CUSTOM_FIELD_ID": "LOCATION_FYLKENAVN__c"
            },
            {
                "FIELD_NAME": "LOCATION_FYLKENUMMER__c",
                "FIELD_VALUE": "46",
                "CUSTOM_FIELD_ID": "LOCATION_FYLKENUMMER__c"
            },
            {
                "FIELD_NAME": "LOCATION_KOMMUNENAVN__c",
                "FIELD_VALUE": "BERGEN",
                "CUSTOM_FIELD_ID": "LOCATION_KOMMUNENAVN__c"
            },
            {
                "FIELD_NAME": "LOCATION_KOMMUNENUMMER__c",
                "FIELD_VALUE": "4601",
                "CUSTOM_FIELD_ID": "LOCATION_KOMMUNENUMMER__c"
            },
            {
                "FIELD_NAME": "LOCATION_LATITUDE__c",
                "FIELD_VALUE": "60.39210719649853",
                "CUSTOM_FIELD_ID": "LOCATION_LATITUDE__c"
            },
            {
                "FIELD_NAME": "LOCATION_LONGITUDE__c",
                "FIELD_VALUE": "60.39210719649853",
                "CUSTOM_FIELD_ID": "LOCATION_LONGITUDE__c"
            }

        ]


 */
export async function populateInsightlyLocationRecord(insightlyRecord, forceLookup) {


    let road = insightlyRecord.ADDRESS_SHIP_STREET;
    let zipcode = insightlyRecord.ADDRESS_SHIP_POSTCODE;
    let country = insightlyRecord.ADDRESS_SHIP_COUNTRY;


    let newRoad = "";
    let newZipcode = "";
    let newPostoffice = "";
    let newCountry = "";
    let newLocationKommuneNavn = "";
    let newLocationKommuneNummer = "";
    let kommuneinfo = {};
    let newLocationFylkeNavn = "";
    let newLocationFylkeNummer = "";
    let newLocationLatitude = 0;
    let newLocationLongitude = 0;

    let setCustomFieldResult = "";




    if (country == "Norway" || country == "" || country == null) { // this is just for norwegian 

        //some adresses has everything written in one field. lets try to sort it out
        if (road) {
            let isComma = road.includes(",");  //is there is a comma in the address
            if (isComma) { //there is a comma in the address
                let commaPosition = road.indexOf(",");
                road = road.substr(0, commaPosition); // we assuma that the letters before the comma is the road 

                let zipcodeNumValue = parseInt(zipcode);
                if ((zipcodeNumValue <= 0) && isComma) { // no number in the zipcode AND there is a comma
                    // lets assume that the complete address is written "vestengkleiva 3, 1385 asker, norway"
                    // then the first numbers after the comma is what we want.
                    let maybePostaddress = insightlyRecord.ADDRESS_SHIP_STREET.substr(commaPosition); //first copy everything after the comma
                    maybePostaddress = maybePostaddress.trim(); //remove spaces
                    let firstSpacePosition = maybePostaddress.indexOf(" ");
                    if (firstSpacePosition != -1) { // there was a space in the middle of the text
                        maybePostaddress = maybePostaddress.substr(0, firstSpacePosition); //copy from start to first space
                    }
                    zipcodeNumValue = parseint(maybePostaddress); // lest see if its a number
                    if (zipcodeNumValue > 0) { //yes - its a number
                        zipcode = maybePostaddress; // then we use it as the zipcode
                    }
                }
            }
        }




        let existingLatitude = "";
        existingLatitude = getInsightlyCustomField("LOCATION_LONGITUDE", insightlyRecord);
        if (forceLookup) {
            existingLatitude = ""; //
        }

        if (existingLatitude == "") {  // latitude is not set - we assume that the rest is NOT set as well 

            if (road && zipcode) { // there are values here - so we can lookup

                let geonorgePosition = await getLocationDataByPostAddress(road, zipcode);
                if (geonorgePosition != "none") { //we got an address

                    newRoad = geonorgePosition.adressetekst;
                    newZipcode = geonorgePosition.postnummer;
                    newPostoffice = geonorgePosition.poststed;
                    newCountry = "Norway";
                    newLocationKommuneNavn = geonorgePosition.kommunenavn;
                    newLocationKommuneNummer = geonorgePosition.kommunenummer;
                    newLocationLatitude = geonorgePosition.representasjonspunkt.lat;
                    newLocationLongitude = geonorgePosition.representasjonspunkt.lon;
                    kommuneinfo = await getFylkeByKommunenummer(newLocationKommuneNummer);
                    if (kommuneinfo != "none") { //we got kommuneinfo
                        newLocationFylkeNavn = kommuneinfo.fylkesnavn;
                        newLocationFylkeNummer = kommuneinfo.fylkesnummer;
                    }

                    // now we got all the new info - lets opdate the insightlyRecord

                    insightlyRecord.ADDRESS_SHIP_COUNTRY = newCountry;
                    insightlyRecord.ADDRESS_SHIP_STATE = newLocationFylkeNavn;
                    insightlyRecord.ADDRESS_SHIP_POSTCODE = newZipcode;
                    insightlyRecord.ADDRESS_SHIP_CITY = newPostoffice;
                    insightlyRecord.ADDRESS_SHIP_STREET = newRoad;


                    setCustomFieldResult = setInsightlyCustomField("LOCATION_FYLKENAVN", newLocationFylkeNavn, insightlyRecord);
                    setCustomFieldResult = setInsightlyCustomField("LOCATION_FYLKENUMMER", newLocationFylkeNummer, insightlyRecord);
                    setCustomFieldResult = setInsightlyCustomField("LOCATION_KOMMUNENAVN", newLocationKommuneNavn, insightlyRecord);
                    setCustomFieldResult = setInsightlyCustomField("LOCATION_KOMMUNENUMMER", newLocationKommuneNummer, insightlyRecord);
                    setCustomFieldResult = setInsightlyCustomField("LOCATION_LATITUDE", newLocationLatitude, insightlyRecord);
                    setCustomFieldResult = setInsightlyCustomField("LOCATION_LONGITUDE", newLocationLongitude, insightlyRecord);

                } else { // invalid address
                    insightlyRecord = "none"; //report no changes
                }

            } else { // no road or postal address -
                insightlyRecord = "none"; //report no changes
            }
        } else { // the address already has a position - there are no changes
            insightlyRecord = "none"; //report no changes    
        }


    }
    else { //not norwegian address
        console.log("Not Norwegian do some google lookup");
        insightlyRecord = "none"; //report no changes
    }


    return insightlyRecord;


}






/** updateInsightlyBrregData
 * takes a tag name and updates location data for all organizations 
 * 
Tags are used to indicate the status of an organization

organisations to be read from brreg is tagged INSIGHTLY_TAG_BRREG_INPUT

If the organization is found and OK then the organixationis tagged INSIGHTLY_TAG_BRREG_OK and 
the other tags removed.

Problems: 
INSIGHTLY_TAG_BRREG_ERR Means that we could not update insightly after reading from brreg. 
The INSIGHTLY_TAG_BRREG_INCOMPLETE and INSIGHTLY_TAG_BRREG_OK is removed 
the INSIGHTLY_TAG_BRREG_INPUT is not changed.




INSIGHTLY_TAG_BRREG_INCOMPLETE


INSIGHTLY_TAG_BRREG_OK



 * 
 */
export async function updateInsightlyBrregData(insightlyTagName) {

    let numEntityFromInsightly = 0;
    let numEntityUpdated = 0;
    let numEntityUpdateError = 0;
    let numEntityUpdateOrgNumErr = 0;
    let numEntityUpdateOrgIncomplete = 0;
    let returnMsg = "";

    let brregRecord;
    let organizationTagArray;
    let organisasjonsnummer = "";

    let insightlyAllTaggedOrganizations;
    insightlyAllTaggedOrganizations = await getAllInsightlyOrganizationsByTag(insightlyTagName);

    if (insightlyAllTaggedOrganizations != "none") { //no problem getting data from insightly
        numEntityFromInsightly = insightlyAllTaggedOrganizations.length;

        for (let i = 0; i < numEntityFromInsightly; i++) {
            let currentInsightlyOrganizationRecord = insightlyAllTaggedOrganizations[i];

            organizationTagArray = []; //init
            brregRecord = "none";
            organisasjonsnummer = "";

            // several conditions here.
            // 1. we have a Organisasjonsnummer and we can do a direct lookup
            // --> The result will be one entry and we can use that entry

            // 2. we have the organization name and can use that forlookup

            // 3. er have a website name and we can use that for lookup


            organisasjonsnummer = getInsightlyCustomField("Organisasjonsnummer", currentInsightlyOrganizationRecord);
            if (organisasjonsnummer != "") { // 1. we have a org number and we can do a direct lookup
                brregRecord = await getOrgByOrganisasjonsnummer(organisasjonsnummer); //see if we can get it directly


                if (brregRecord != "none") {

                    if (brregRecord.slettedato) { //the org is deleted from brreg.
                        console.log("Brreg deleted " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME, " deleted date:", brregRecord.slettedato);

                        let setCustomFieldResult = setInsightlyCustomField("BRREG_DELETE_DATE", brregRecord.slettedato, currentInsightlyOrganizationRecord);
                        let slettetOrg = await updateInsightlyOrganization(currentInsightlyOrganizationRecord);
                        //TODO: handle if we cant update insightly to report that a org is deleted in brreg 

                        organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                        if (organizationTagArray != "none") { // we could read tags 
                            organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // delete for manual check
                            organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INPUT, organizationTagArray);
                            organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);
                            organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);


                            let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                            if (updateTagsResult == "none") { //we are in trouble
                                console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                debugger
                            }
                        } else { // we could not read the tags
                            console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                            debugger

                        }

                    } else { // org is not deleted - continue


                        currentInsightlyOrganizationRecord = await populateInsightlyFromBrregRecord(currentInsightlyOrganizationRecord, brregRecord);

                        let opdatedOrg = await updateInsightlyOrganization(currentInsightlyOrganizationRecord);
                        if (opdatedOrg != "none") { // we could update 
                            numEntityUpdated++;
                            console.log("Updated " + (i + 1) + "/" + numEntityFromInsightly + " : ", opdatedOrg.ORGANISATION_NAME, " Est. date:", getInsightlyCustomField("BRREG_ESTABLISHMENT_DATE", opdatedOrg), " Road:", opdatedOrg.ADDRESS_SHIP_STREET);
                            organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                            if (organizationTagArray != "none") { // we could read tags 
                                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // delete for manual check
                                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INPUT, organizationTagArray);
                                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);
                                organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);


                                let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                                if (updateTagsResult == "none") { //we are in trouble
                                    console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                    debugger
                                }
                            } else { // we could not read the tags
                                console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                debugger

                            }


                        } else { // problems updating 
                            console.error("Error: could not update " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                            numEntityUpdateError++;

                            organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                            if (organizationTagArray != "none") { // we could read tags 
                                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // delete for manual check
                                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);
                                organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);


                                let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                                if (updateTagsResult == "none") { //we are in trouble
                                    console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                    debugger
                                }
                            } else { // we could not read the tags
                                console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                debugger

                            }
                        }

                    } //end else org not deleted


                } else { // no valid org number found
                    numEntityUpdateOrgNumErr++;
                    console.error("NO valid Organisasjonsnummer on " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                    debugger
                    organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                    if (organizationTagArray != "none") { // we could read tags 
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // delete for manual check
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);
                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);
                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_INPUT, organizationTagArray); //put it back in queue

                        let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                        if (updateTagsResult == "none") { //we are in trouble
                            console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                            debugger
                        }
                    } else { // we could not read the tags
                        console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                        debugger

                    }

                }

            }
            /* TODO: if there are no organisasjonsnummer we can make some guessing - code is not complete            
                         else { // there is no org number
                            
                            // 2. we have the cmpany name and can use that forlookup
                            brregRecord = await getOneOrganizationByName(currentInsightlyOrganizationRecord.ORGANISATION_NAME);
            
                            // here we could make the guessing even more accurate if we also looked up website and checked if they both returned the same org
            
                            if (brregRecord != "none") {
                                currentInsightlyOrganizationRecord = await populateInsightlyFromBrregRecord(currentInsightlyOrganizationRecord, brregRecord);
            
                                let opdatedOrg = await updateInsightlyOrganization(currentInsightlyOrganizationRecord);
                                if (opdatedOrg != "none") { // we could update 
                                    numEntityUpdated++;
                                    console.log("Updated " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME, " Est. date:", getInsightlyCustomField("BRREG_ESTABLISHMENT_DATE", opdatedOrg), " Road:", opdatedOrg.ADDRESS_SHIP_STREET);
                                    organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                                    if (organizationTagArray != "none") { // we could read tags 
                                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // delete for manual check
                                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INPUT, organizationTagArray);
                                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);
                                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);
            
            
                                        let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                                        if (updateTagsResult == "none") { //we are in trouble
                                            console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                        }
                                    } else { // we could not read the tags
                                        console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
            
                                    }
            
                                } else { // problems updating 
                                    console.error("Error: could not update " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                    numEntityUpdateError++;
                                    organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
                                    if (organizationTagArray != "none") { // we could read tags 
                                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // delete for manual check
                                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);
                                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);
            
            
                                        let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                                        if (updateTagsResult == "none") { //we are in trouble
                                            console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                        }
                                    } else { // we could not read the tags
                                        console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
            
                                    }
            
                                }
            
            
            
            
            
                            } else { // did not find the org by searching with name
                                numEntityUpdateOrgIncomplete++;
                                console.error("Not found when searchin by name  " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                organizationTagArray = await getInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID);
            
                                if (organizationTagArray != "none") { // we could read tags 
                                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_OK, organizationTagArray);
                                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_ERR, organizationTagArray);
                                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_BRREG_INPUT, organizationTagArray); // remove from queue
                                    organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_BRREG_INCOMPLETE, organizationTagArray); // mark for manual check
            
            
                                    let updateTagsResult = await updateInsightlyOrganizationTags(currentInsightlyOrganizationRecord.ORGANISATION_ID, organizationTagArray);
                                    if (updateTagsResult == "none") { //we are in trouble
                                        console.error("Error: could not update TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
                                    }
            
                                } else { // we could not read the tags
                                    console.error("Error: could not read TAGS " + (i + 1) + "/" + numEntityFromInsightly + " : ", currentInsightlyOrganizationRecord.ORGANISATION_NAME);
            
                                }
                            }
                        }
            */





        } //loop
        returnMsg = "numEntityFromInsightly:" + numEntityFromInsightly + " numEntityUpdated= " + numEntityUpdated + " numEntityUpdateError= " + numEntityUpdateError + " numEntityUpdateOrgNumErr= " + numEntityUpdateOrgNumErr + " numEntityUpdateOrgIncomplete=" + numEntityUpdateOrgIncomplete;
    } else { //trouble
        returnMsg = "Error - No contact with Insightly";
    }

    console.log("Finished updating: ", returnMsg);

    return returnMsg;

}

/** verifyWebsite
 * looks at the myWebsite and figures out if the url is the same or simmilar to the brregWebsite
 * returns the selected website. If none of them are valid then "none" is returned.
 */
function verifyWebsite(myWebsite, brregWebsite) {

    let returnWebsite = "none";

    if (brregWebsite) { // has value

        if (!myWebsite) { // if there are no value in insighty
            returnWebsite = brregWebsite; // then we just copy it
        } else { // they both have value - lets figure out what to do

            if (brregWebsite.toUpperCase() != myWebsite.toUpperCase()) { //they are not euqal
                let strippedWEBSITE = myWebsite;
                strippedWEBSITE = ""; // remove http:// or https://
                strippedWEBSITE = ""; //remove any /something after domain name
                if (brregWebsite.toUpperCase() == strippedWEBSITE.toUpperCase()) { //the domain is equal
                    //then we leave insightlyRecord.WEBSITE as is.  The path stuff should be there
                    returnWebsite = myWebsite;
                } else { // they are still not the same
                    strippedWEBSITE = ""; //remove what is in front of  dot (.) this so that we can compare www.vg.no and vg.no
                    if (brregWebsite.toUpperCase() == strippedWEBSITE.toUpperCase()) { //compare vg.no to www.vg.no
                        returnWebsite = myWebsite;
                    }
                    else { //the web sites are not the same. We need to choose one of them
                        returnWebsite = myWebsite; //we select what we have over brreg value                        
                    }
                }


            } else { // they are eqial
                returnWebsite = myWebsite;
            }

        }
    } else { // brregWebsite has no value
        if (myWebsite) { //so if myWebsite has value
            returnWebsite = myWebsite; // we return what we had
        } else {
            returnWebsite = "none"; // otherwise we return "none"
        }

    }

    return returnWebsite;


}


/** populateInsightlyAddressFromBrregAddress
 * 
 */
function populateInsightlyAddressFromBrregAddress(insightlyRecord, brregForretningsadresse) {

    let returnInsightlyRecord = insightlyRecord;
    let setCustomFieldResult;

    if (brregForretningsadresse.land == "Norge") {
        returnInsightlyRecord.ADDRESS_SHIP_COUNTRY = "Norway";
    } else { //here we should translate all countries to english... another day,, maybe
        returnInsightlyRecord.ADDRESS_SHIP_COUNTRY = brregForretningsadresse.land;
        debugger
    }

    returnInsightlyRecord.ADDRESS_SHIP_CITY = brregForretningsadresse.poststed;
    returnInsightlyRecord.ADDRESS_SHIP_POSTCODE = brregForretningsadresse.postnummer;


    // if the adresse array has more than one entry - then we pick the last one of them - hoping this is the address
    var totAdresses = brregForretningsadresse.adresse.length;
    if (totAdresses == 1) {
        returnInsightlyRecord.ADDRESS_SHIP_STREET = brregForretningsadresse.adresse[0]; //pick the first value
    } else {
        returnInsightlyRecord.ADDRESS_SHIP_STREET = brregForretningsadresse.adresse[totAdresses - 1]; //pick the last value
    }

    setCustomFieldResult = setInsightlyCustomField("LOCATION_KOMMUNENAVN", brregForretningsadresse.kommune, insightlyRecord);
    setCustomFieldResult = setInsightlyCustomField("LOCATION_KOMMUNENUMMER", brregForretningsadresse.kommunenummer, insightlyRecord);


    return returnInsightlyRecord;
}

/** populateInsightlyFromBrregRecord
 * takes an insightly record and a brreg record
 * Updates fields in the insightly record with data from the brreg record
 * returns a updated insightly record
 */
function populateInsightlyFromBrregRecord(insightlyRecord, brregRecord) {

    let setCustomFieldResult;

    let intOrganisasjonsnummer = parseInt(brregRecord.organisasjonsnummer); //convert to int as the field is an int in insightly
    setCustomFieldResult = setInsightlyCustomField("Organisasjonsnummer", intOrganisasjonsnummer, insightlyRecord); //we copy it so that in case it had spaces and other letters it is now correct

    //insightlyRecord.ORGANISATION_NAME //not sure what to do. in brreg all orgs are in capital letters


    let tmpWebsite = verifyWebsite(insightlyRecord.WEBSITE, brregRecord.hjemmeside);
    if (tmpWebsite != "none")
        insightlyRecord.WEBSITE = tmpWebsite;

    if (brregRecord.forretningsadresse) { //norwegian registered companies has a norwegian business address
        insightlyRecord = populateInsightlyAddressFromBrregAddress(insightlyRecord, brregRecord.forretningsadresse);
    } else { //foreign registered companies just have a postal address 
        // what to do about this - lets just do nothing and hope that the postal address in insightly is ok
        console.info("populateInsightlyFromBrregRecord: the org: ", brregRecord.navn, " does not have a forretningsadresse")
    }


    setCustomFieldResult = setInsightlyCustomField("BRREG_EMPLOYEES", brregRecord.antallAnsatte, insightlyRecord);
    setCustomFieldResult = setInsightlyCustomField("BRREG_ESTABLISHMENT_DATE", brregRecord.stiftelsesdato, insightlyRecord);
    let tmpOrgtype = brregRecord.organisasjonsform.kode + "," + brregRecord.organisasjonsform.beskrivelse;
    setCustomFieldResult = setInsightlyCustomField("BRREG_ORGTYPE", tmpOrgtype, insightlyRecord);





    return insightlyRecord;
}





/** syncInsightlyContacts2strapi
 * takes all contacts tagged (INSIGHTLY_WEB_CONTACT) from insightly  and check if they exist in strapi.
 * 
 * 
 */
export async function syncInsightlyContacts2strapi() {
    let insightlyAllTaggedContacts;
    let strapiAllPersons;
    let strapiAllOrganizations;

    console.log("starting import of contacts: syncInsightlyContacts2strapi");
    insightlyAllTaggedContacts = await getAllInsightlyContactsByTag(INSIGHTLY_WEB_CONTACT);



    strapiAllPersons = await getAllStrapiPersonsInsightlyForeignKey();
    strapiAllOrganizations = await getAllStrapiEntitiesInsightlyForeignKey();

    console.log("syncInsightlyContacts2strapi: InsightlyPersons= ", insightlyAllTaggedContacts.length, " StrapiPersons=", strapiAllPersons.length);



    let insightlyPersonRecord = {};
    let existingStrapiPerson = {};
    let strapiPersonRecord = {};
    let strapiPersonID;
    let strapiEntityIdName;
    let strapiEntityID = "";
    let strapiEntityRecord;
    let personEntityRoleText = "";
    let roleName = "Hovedkontakt SBN";
    let personEntityRoleID;
    let strapi_idname = "";


    //loop trugh all tagged contacts in insightly 
    for (let insightlyContactCounter = 0; insightlyContactCounter < insightlyAllTaggedContacts.length; insightlyContactCounter++) { //loop all contacts

        insightlyPersonRecord = insightlyAllTaggedContacts[insightlyContactCounter];
        strapiPersonRecord = await insightly2strapiPersonRecord(insightlyPersonRecord);


        existingStrapiPerson = findStrapiPersonWithInsightlyID(strapiAllPersons, insightlyPersonRecord.CONTACT_ID);

        if (existingStrapiPerson == "none") { //the contact does not exist in strapi as a insightly contact
            // the person should now be created. 
            //we also need tofind the Entity (org) the person belongs to before we can create the person as a contact to that entity (org)


            strapiEntityRecord = findStrapiEntityWithInsightlyID(strapiAllOrganizations, insightlyPersonRecord.ORGANISATION_ID);
            if (strapiEntityRecord != "none") { // the enitity (org) that the person is contact for does exist
                strapiEntityID = strapiEntityRecord.id;
                strapiEntityIdName = strapiEntityRecord.idName;
                //strapiPersonRecord.idName = findUniqeContactIdName(strapiPersonRecord, strapiAllPersons); //if nessesary change the default generated idName
                console.log("New person: ", strapiPersonRecord.firstName);

                strapiPersonID = await createPerson(strapiPersonRecord);
                if (strapiPersonID != "none") { // person was created
                    // Now we can create the relation between Person and Entity (the org)
                    console.log("Created person: ", strapiPersonRecord.firstName, strapiPersonRecord.lastName,);
                    numPersonCreated++;
                    personEntityRoleText = "Person:" + strapiPersonRecord.idName + ",Org:" + strapiEntityIdName + ",Source:insightly"; //for knowing where the connection came from
                    //TODO: roleName = find the role of the person by looking at the tags
                    personEntityRoleID = await createPersonEntityRole(strapiEntityID, strapiPersonID, roleName, personEntityRoleText); //add the connection between 

                    if (personEntityRoleID != "none") {
                        numPersonEntityRoleCreated++;
                        console.log("Created personEntityRole: ", strapiPersonRecord.firstName, " works for :", strapiEntityIdName);

                        let personRoleUpdateResult = await assignPersonNetworkRoles(strapiPersonID, personEntityRoleID, strapiEntityRecord.idName, strapiPersonRecord.networkmemberships);



                    } else {
                        console.error("syncInsightlyContacts2strapi: Error cant create personEntityRole: ", strapiPersonRecord.firstName, " works for :", strapiEntityIdName);
                        debugger
                    }

                } else {
                    console.error("syncInsightlyContacts2strapi: Error create person: ", strapiPersonRecord.firstName);
                    debugger
                }
            } else {
                console.error("syncInsightlyContacts2strapi: The Entity (org) for witch the contact persion is contact for does not exist. The person: ", strapiPersonRecord.firstName, strapiPersonRecord.lastName, " the insightly ORGANISATION_ID= ", insightlyPersonRecord.ORGANISATION_ID);
                debugger
            }

        } else { // the person exists already in strapi and we can update
            strapiPersonID = await updatePerson(strapiPersonRecord, existingStrapiPerson.id);
            if (strapiPersonID != "none") { // was able to update person
                console.log("Updated person: ", strapiPersonRecord.firstName, strapiPersonRecord.lastName,);
                numPersonUpdated++;


                strapiEntityRecord = findStrapiEntityWithInsightlyID(strapiAllOrganizations, insightlyPersonRecord.ORGANISATION_ID);
                if (strapiEntityRecord != "none") { // the enitity (org) that the person is contact for does exist
                    strapiEntityID = strapiEntityRecord.id;
                    strapiEntityIdName = strapiEntityRecord.idName;
                    personEntityRoleID = await getPersonEntityRoleIDByEntityIDandPersonID(strapiEntityID, strapiPersonID); //se if there is a relation between person ane entity
                    if (personEntityRoleID != "none") { //there is a personEntityRole

                        personEntityRoleText = "Person:" + strapiPersonRecord.idName + ",Org:" + strapiEntityIdName + ",Source:insightly"; //for knowing where the connection came from
                        personEntityRoleID = await updatePersonEntityRole(personEntityRoleID, roleName, personEntityRoleText); //update the  relation

                        if (personEntityRoleID != "none") {
                            numPersonEntityRoleUpdated++;
                            console.log("Updated personEntityRole: ", strapiPersonRecord.firstName, " works for :", strapiEntityIdName);

                            let personRoleUpdateResult = await assignPersonNetworkRoles(strapiPersonID, personEntityRoleID, strapiEntityRecord.idName, strapiPersonRecord.networkmemberships);

                        } else {
                            console.error("syncInsightlyContacts2strapi: Error cant update personEntityRole: ", strapiPersonRecord.firstName, " works for :", strapiEntityIdName);
                            debugger
                        }

                    } else { //there is no personEntityRole - needs to be created
                        personEntityRoleText = "Person:" + strapiPersonRecord.idName + ",Org:" + strapiEntityIdName + ",Source:insightly"; //for knowing where the connection came from
                        personEntityRoleID = await createPersonEntityRole(strapiEntityID, strapiPersonID, roleName, personEntityRoleText); //add the connection between 

                        if (personEntityRoleID != "none") {
                            numPersonEntityRoleCreated++;
                            console.log("Created personEntityRole: ", strapiPersonRecord.firstName, " works for :", strapiEntityIdName);
                        } else {
                            console.error("syncInsightlyContacts2strapi: Error cant create personEntityRole: ", strapiPersonRecord.firstName, " works for :", strapiEntityIdName);
                            debugger
                        }

                    }
                } else {
                    console.error("The Entity (org) for witch the contact persion is fontact for does not exist. The person: ", strapiPersonRecord.firstName, strapiPersonRecord.lastName, " the insightly ORGANISATION_ID= ", insightlyPersonRecord.ORGANISATION_ID);
                    debugger
                }

            } else {
                console.error("syncInsightlyContacts2strapi: Error Updating person: ", strapiPersonRecord.firstName);
                debugger
            }


        }



    } //loop

    let returnMsg = "numPersonUpdated= " + numPersonUpdated + " numPersonCreated= " + numPersonCreated + " numPersonEntityRoleUpdated= " + numPersonEntityRoleUpdated + " numPersonEntityRoleCreated= " + numPersonEntityRoleCreated;
    return returnMsg;


}


/** assignPersonNetworkRoles 
 * creates and updates the personNetworkMembershipRoles based on the contacs networkmemberships array
 * returns "OK" if everything went fine
 * returns "Err" is all or at least one update went wrong
 * 
 * 

                        // next is to connect the person to the membership relation between the orgnization and the network.
                        // a person can be connected to many organizations (entities) this is defined by the personEntityRole table
                        // the persons role in the membership between an entity and a network is defined by the table personNetworkMembershipRoles



 */
//TODO: needs to be extended so that relations are deleted as well
async function assignPersonNetworkRoles(strapiPersonID, personEntityRoleID, networkIdName, networkmemberships) {

    let ReturnResponse = "OK";

    let numNetworks = networkmemberships.length;
    for (let netCounter = 0; netCounter < numNetworks; netCounter++) { //loop all roles the person has


        let curentNetworkIdName = networkmemberships[netCounter].networkIdName;
        let curentNetworkRole = networkmemberships[netCounter].roleName;
        let curentNetworkRoleText = networkmemberships[netCounter].roleText;
        // to do the connection we need strapiPersonID and id of the relation between org (entity) and the network (entityNetworkMembership)
        // strapiEntityRecord has the idName of the org 
        let entityNetworkMembershipID = await getEntityNetworkMembershipIDbyIdNames(networkIdName, curentNetworkIdName);

        if (entityNetworkMembershipID != "none") { // there is a relation between the org and the network - now make the connection to the person
            //console.info("assignPersonNetworkRoles: there is a relation between the org and the network")

            // first see if there already is a connection between entityNetworkMembership and the person
            let personNetworkMembershipRoleID = await getPersonNetworkMembershipRoleByPersonIDandEntityNetworkMembershipID(personEntityRoleID, entityNetworkMembershipID);
            if (personNetworkMembershipRoleID == "none") { // no relation between the org and the network 
                //console.info("assignPersonNetworkRoles: NO relation between the person and the network - action=create ");
                personNetworkMembershipRoleID = await createPersonNetworkMembershipRole(strapiPersonID, entityNetworkMembershipID, curentNetworkRoleText, curentNetworkRole);
                if (personNetworkMembershipRoleID != "none") { // managed to create relation
                    console.log("assignPersonNetworkRoles: Created personNetworkMembershipRole: ", strapiPersonID, " has role :", curentNetworkRoleText, " in network :", curentNetworkIdName);
                } else { // error - could not create relation
                    console.error("Could NOT create personNetworkMembershipRole: ", strapiPersonID, " role :", curentNetworkRoleText, " in network :", curentNetworkIdName);
                    ReturnResponse = "Err";
                    debugger
                }

            } else { // there is relation between the org and the network 
                //console.info("assignPersonNetworkRoles: relation between the person and the network - action=update ");
                personNetworkMembershipRoleID = await updatePersonNetworkMembershipRole(personNetworkMembershipRoleID, curentNetworkRoleText, curentNetworkRole);
                if (personNetworkMembershipRoleID != "none") { // managed to update relation
                    console.log("assignPersonNetworkRoles: Updated personNetworkMembershipRole: ", strapiPersonID, " has role :", curentNetworkRoleText, " in network :", curentNetworkIdName);
                } else { // error - could not create relation
                    console.error("Could NOT UPDATE personNetworkMembershipRole: ", strapiPersonID, " role :", curentNetworkRoleText, " in network :", curentNetworkIdName);
                    ReturnResponse = "Err";
                    debugger
                }
            }


        } else { // the person has a role in insightly that does not exist in strapi
            console.error("assignPersonNetworkRoles: Err: Relation between Org and network does not exist! cant make ", strapiPersonID, " role :", curentNetworkRoleText, " in network :", curentNetworkIdName);
            ReturnResponse = "Err";
            debugger

        }


    } // loop of network roles

    return ReturnResponse;

}


/** insightly2strapiEntityRecord
 * takes a insightly record and return a strapi record
 * this function deals only with the fields that belongs to the entity 
 * and not to fields that belong to relations
 
 
A insightly record looks like this
   {
        "ORGANISATION_ID": 90622173,
        "ORGANISATION_NAME": "Bergen kommune",
        "BACKGROUND": "Bergen by ble grunnlagt på en grønn slette mellom fjellene for over 900 år siden. I dag bor der 277.391 innbyggere - og byen er fortsatt nokke for seg sjøl.",
        "IMAGE_URL": null,
        "OWNER_USER_ID": 1212582,
        "VISIBLE_TO": "EVERYONE",
        "VISIBLE_TEAM_ID": null,
        "DATE_CREATED_UTC": "2016-09-23 07:42:19",
        "DATE_UPDATED_UTC": "2020-05-27 07:08:05",
        "LAST_ACTIVITY_DATE_UTC": "2020-03-18 18:34:16",
        "NEXT_ACTIVITY_DATE_UTC": null,
        "CREATED_USER_ID": 1212582,
        "PHONE": "55565556",
        "PHONE_FAX": null,
        "WEBSITE": "https://www.bergen.kommune.no/",
        "ADDRESS_BILLING_STREET": null,
        "ADDRESS_BILLING_CITY": null,
        "ADDRESS_BILLING_STATE": null,
        "ADDRESS_BILLING_COUNTRY": null,
        "ADDRESS_BILLING_POSTCODE": null,
        "ADDRESS_SHIP_STREET": "PO Box 7700",
        "ADDRESS_SHIP_CITY": "Bergen",
        "ADDRESS_SHIP_STATE": null,
        "ADDRESS_SHIP_POSTCODE": "5020",
        "ADDRESS_SHIP_COUNTRY": "Norway",
        "SOCIAL_LINKEDIN": null,
        "SOCIAL_FACEBOOK": null,
        "SOCIAL_TWITTER": null,
        "EMAIL_DOMAIN": "bergen.kommune.no",
        "CUSTOMFIELDS": [
            {
                "FIELD_NAME": "CKAN_LOGO_IMAGE__c",
                "FIELD_VALUE": "http://bucket.urbalurba.com/logo/bergen.jpg",
                "CUSTOM_FIELD_ID": "CKAN_LOGO_IMAGE__c"
            },
            {
                "FIELD_NAME": "CKAN_NAME__c",
                "FIELD_VALUE": "bergen-kommune",
                "CUSTOM_FIELD_ID": "CKAN_NAME__c"
            },
            {
                "FIELD_NAME": "fylke__c",
                "FIELD_VALUE": "Vestland",
                "CUSTOM_FIELD_ID": "fylke__c"
            },
            {
                "FIELD_NAME": "kommunenr__c",
                "FIELD_VALUE": 4601.0,
                "CUSTOM_FIELD_ID": "kommunenr__c"
            },
            {
                "FIELD_NAME": "member_tags__c",
                "FIELD_VALUE": "Kommune",
                "CUSTOM_FIELD_ID": "member_tags__c"
            },
            {
                "FIELD_NAME": "Organisasjonsnummer__c",
                "FIELD_VALUE": 964338531.0,
                "CUSTOM_FIELD_ID": "Organisasjonsnummer__c"
            },
            {
                "FIELD_NAME": "organization_segments__c",
                "FIELD_VALUE": "Wather;Health;Waste",
                "CUSTOM_FIELD_ID": "organization_segments__c"
            },
            {
                "FIELD_NAME": "organization_type__c",
                "FIELD_VALUE": "municipality",
                "CUSTOM_FIELD_ID": "organization_type__c"
            },
            {
                "FIELD_NAME": "problems_solved__c",
                "FIELD_VALUE": "Enhanced data collection",
                "CUSTOM_FIELD_ID": "problems_solved__c"
            },
            {
                "FIELD_NAME": "segment__c",
                "FIELD_VALUE": "Kommune",
                "CUSTOM_FIELD_ID": "segment__c"
            },
            {
                "FIELD_NAME": "slogan__c",
                "FIELD_VALUE": "Kompetent, åpen, pålitelig og samfunnsengasjert",
                "CUSTOM_FIELD_ID": "slogan__c"
            },
            {
                "FIELD_NAME": "summary__c",
                "FIELD_VALUE": "summary field",
                "CUSTOM_FIELD_ID": "summary__c"
            },
            {
                "FIELD_NAME": "Sustainable_Development_Goals__c",
                "FIELD_VALUE": "11, 17",
                "CUSTOM_FIELD_ID": "Sustainable_Development_Goals__c"
            }
        ],
        "TAGS": [
            {
                "TAG_NAME": "+Bergen"
            },
            {
                "TAG_NAME": "=SBNmedlemsvirksomhet"
            },
            {
                "TAG_NAME": "=Smartbydugnaden19"
            },
            {
                "TAG_NAME": "=Smartbydugaden20"
            }
        ],
        "DATES": [],
        "EMAILDOMAINS": [
            {
                "EMAIL_DOMAIN_ID": 6047314,
                "EMAIL_DOMAIN": "bergen.kommune.no"
            }
        ]
    },
 
A strapi record looks like this
{
"_id": "5eaaa33fae9c8ebdf463cfc4",
"idName": "last-mile-communication",
"summary": "LMC (Last Mile Communication) er et selskap som holder til i Asker, og leverer teknologisk baserte systemer og løsninger som ivaretar mennesker og verdier. Vår grunnleggende forretningside gjenspeiles i vårt navn, vi hjelper teknologien med å komme «helt i mål», (the last mile). Vi setter ideer og løsninger ut i livet – og sikrer at oppgaver blir løst slik det var tenkt.",
"foreignKeys": null,
"displayName": "Last Mile Communication (LMC)",
"url": "https://www.lmc.no/",
"description": "Siden 1999 har vi i Last Mile Communikation lyttet til våre kunder og utviklet og levert tekniske løsninger det er behov for å løse kommunaltekniske oppgaver og forpliktelser. Dette gjør at vi i dag er et av de største og ledende leverandører av teknologiske systemer og løsninger. Designet fr miljøer og sektorer som har høye krav til kvalitet og operasjonell drift.\n\nEt hovedfokusområde for oss i dag er å planlegge, designe og levere komplette Smart City systemer og løsninger for kommunal drift. Hele verdikjeden fra sensor til analyse-systemer som integreres i bl.a for Big Data, AI og maskinlærings-systemer.\n\nI samarbeid med våre kunder leverer vi også utstyr og systemer til installasjoner over hele verden. Og spesialtilpassede løsninger på oppdrag og konsulent bistand.\n\n– Vi har siden 2013 levert flere tusen IoT løsninger der ute som allerede er i drift. Dette gjør oss til en av de få som faktisk har løsninger i drift og ikke minst har erfaring med IoT løsninger.\n\n- Vi tar for oss hele verdikjeden innen Internet of Things",
"slogan": "Datakommunikasjon og videoløsninger",
"answer": [],
"location": {
    "_id": "5eaaa340ae9c8ebdf463cfc5",
    "shippingAddress": {
    "_id": "5eaaa340ae9c8ebdf463cfc6",
    "street": "Askerveien 61",
    "city": "Asker",
    "postcode": "1383",
    "country": "Norway",
    "createdAt": "2020-04-30T10:06:56.331Z",
    "updatedAt": "2020-05-08T07:20:41.503Z",
    "__v": 0,
    "id": "5eaaa340ae9c8ebdf463cfc6"
    },
"gps": null,
"createdAt": "2020-04-30T10:06:56.190Z",
"updatedAt": "2020-05-08T07:20:42.075Z",
"__v": 1,
"id": "5eaaa340ae9c8ebdf463cfc5"
},
"domains": [
{
"_id": "5eaaa341ae9c8ebdf463cfc9",
"domainname": "lmc.no",
"createdAt": "2020-04-30T10:06:57.689Z",
"updatedAt": "2020-05-08T07:20:43.018Z",
"__v": 0,
"id": "5eaaa341ae9c8ebdf463cfc9"
}
],
"contact": [
{
"_id": "5eb5084c95ab10816f9aef71",
"kind": "ComponentEntityContact",
"ref": "5eaaa342ae9c8ebdf463cfcb"
}
],
"image": {
    "_id": "5eaaa490ae9c8ebdf463cfd3",
    "createdAt": "2020-04-30T10:12:32.830Z",
    "updatedAt": "2020-05-08T07:20:45.097Z",
    "__v": 0,
    "large": "5eaaa452ae9c8ebdf463cfcd",
    "medium": "5eaaa476ae9c8ebdf463cfce",
        "profile": {
            "_id": "5eaaa476ae9c8ebdf463cfce",
            "name": "lmc",
            "alternativeText": "",
            "caption": "",
            "hash": "lmc_e4307c5e7a",
            "ext": ".jpeg",
            "mime": "image/jpeg",
            "size": 5.7,
            "width": 400,
            "height": 200,
            "url": "/uploads/lmc_e4307c5e7a.jpeg",
            "formats": {
            "thumbnail": {
            "hash": "thumbnail_lmc_e4307c5e7a",
            "ext": ".jpeg",
            "mime": "image/jpeg",
            "width": 245,
            "height": 122,
            "size": 3.14,
            "url": "/uploads/thumbnail_lmc_e4307c5e7a.jpeg"
        }
    },
    "provider": "local",
    "related": [
        "5eaaa490ae9c8ebdf463cfd3",
        "5eaaa490ae9c8ebdf463cfd3"
    ],
    "createdAt": "2020-04-30T10:12:06.998Z",
    "updatedAt": "2020-05-08T07:19:48.095Z",
    "__v": 0,
    "id": "5eaaa476ae9c8ebdf463cfce"
    },
"cover": {
"_id": "5eaaa452ae9c8ebdf463cfcd",
"name": "lmc-top",
"alternativeText": "",
"caption": "",
"hash": "lmc-top_55c2bc4caa",
"ext": ".jpeg",
"mime": "image/jpeg",
"size": 128.74,
"width": 1280,
"height": 545,
"url": "/uploads/lmc-top_55c2bc4caa.jpeg",
"formats": {
"thumbnail": {
"hash": "thumbnail_lmc-top_55c2bc4caa",
"ext": ".jpeg",
"mime": "image/jpeg",
"width": 245,
"height": 104,
"size": 8.57,
"url": "/uploads/thumbnail_lmc-top_55c2bc4caa.jpeg"
},
"large": {
"hash": "large_lmc-top_55c2bc4caa",
"ext": ".jpeg",
"mime": "image/jpeg",
"width": 1000,
"height": 426,
"size": 95.85,
"url": "/uploads/large_lmc-top_55c2bc4caa.jpeg"
},
"medium": {
"hash": "medium_lmc-top_55c2bc4caa",
"ext": ".jpeg",
"mime": "image/jpeg",
"width": 750,
"height": 319,
"size": 59.42,
"url": "/uploads/medium_lmc-top_55c2bc4caa.jpeg"
},
"small": {
"hash": "small_lmc-top_55c2bc4caa",
"ext": ".jpeg",
"mime": "image/jpeg",
"width": 500,
"height": 213,
"size": 29.49,
"url": "/uploads/small_lmc-top_55c2bc4caa.jpeg"
}
},
"provider": "local",
"related": [
"5eaaa490ae9c8ebdf463cfd3",
"5eaaa490ae9c8ebdf463cfd3",
"5ec293d2307db46302515d51",
"5ec29411307db46302515d58"
],
"createdAt": "2020-04-30T10:11:30.392Z",
"updatedAt": "2020-05-18T13:56:33.492Z",
"__v": 0,
"id": "5eaaa452ae9c8ebdf463cfcd"
},
"id": "5eaaa490ae9c8ebdf463cfd3"
},
"createdAt": "2020-04-30T10:06:55.987Z",
"updatedAt": "2020-05-08T07:20:45.654Z",
"__v": 3,
"internalImage": null,
"contacts": [],
"org_cats": [],
"id": "5eaaa33fae9c8ebdf463cfc4"
}    
 
 */
export function insightly2strapiEntityRecord(insightlyRecord, entitytypeID) {
    let strapiRecord = {};

    let socialLinks = {};

    strapiRecord.idName = getInsightlyCustomField("CKAN_NAME", insightlyRecord).toString();
    if (strapiRecord.idName != "") {
        strapiRecord.entitytype = entitytypeID,
            strapiRecord.displayName = insightlyRecord.ORGANISATION_NAME.toString();
        strapiRecord.slogan = getInsightlyCustomField("slogan", insightlyRecord);
        strapiRecord.summary = getInsightlyCustomField("summary", insightlyRecord);
        strapiRecord.description = insightlyRecord.BACKGROUND;
        strapiRecord.url = insightlyRecord.WEBSITE;
        strapiRecord.phone = insightlyRecord.PHONE;
        strapiRecord.email = getInsightlyCustomField("ORGANIZATION_EMAIL", insightlyRecord);
        strapiRecord.location = {
            "visitingAddress": {
                "street": insightlyRecord.ADDRESS_SHIP_STREET,
                "city": insightlyRecord.ADDRESS_SHIP_CITY,
                "postcode": insightlyRecord.ADDRESS_SHIP_POSTCODE,
                "country": insightlyRecord.ADDRESS_SHIP_COUNTRY
            },
            "adminLocation": {
                "countyName": getInsightlyCustomField("LOCATION_FYLKENAVN", insightlyRecord).toString(),
                "countyId": getInsightlyCustomField("LOCATION_FYLKENUMMER", insightlyRecord).toString(),
                "municipalityId": getInsightlyCustomField("LOCATION_KOMMUNENUMMER", insightlyRecord).toString(),
                "municipalityName": getInsightlyCustomField("LOCATION_KOMMUNENAVN", insightlyRecord).toString()
            }
        };

        strapiRecord.foreignKeys = {
            "organisasjonsnummer": getInsightlyCustomField("Organisasjonsnummer", insightlyRecord).toString(),
            "sbn_insightly": insightlyRecord.ORGANISATION_ID.toString()
        };

        strapiRecord.domains = insightlyGetEmailDomains(insightlyRecord);


        let lat = getInsightlyCustomField("LOCATION_LATITUDE", insightlyRecord).toString();
        if (lat) { //we have an gps address
            strapiRecord.location.latLng = {
                "lat": lat,
                "lng": getInsightlyCustomField("LOCATION_LONGITUDE", insightlyRecord).toString()
            }
        }



        let foundedDate = getInsightlyCustomField("BRREG_ESTABLISHMENT_DATE", insightlyRecord).toString();
        if (foundedDate == "") { //its empty
            foundedDate = null;
        } else { // strapi dates are like this "2021-01-01"
            //no need to format
        }

        let endDate = getInsightlyCustomField("BRREG_DELETE_DATE", insightlyRecord).toString();
        if (endDate == "") { //its empty
            endDate = null;
        } else { // strapi dates are like this "2021-01-01"
            //no need to format
        }

        strapiRecord.brreg = {
            "organizationNumber": parseInt(getInsightlyCustomField("Organisasjonsnummer", insightlyRecord)),
            "employees": parseInt(getInsightlyCustomField("BRREG_EMPLOYEES", insightlyRecord)),
            "foundedDate": foundedDate,
            "endDate": endDate,
            "orgType": getInsightlyCustomField("BRREG_ORGTYPE", insightlyRecord).toString()

        }

        strapiRecord.internalImage = {
            "profile": {
                "url": getInsightlyCustomField("CKAN_LOGO_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE),
            },
        };


        let coverImageURL = getInsightlyCustomField("COVER_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE);
        if (coverImageURL != "") {
            strapiRecord.internalImage.cover = {
                "url": coverImageURL
            };
        }

        let iconImageURL = getInsightlyCustomField("ICON_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE);
        if (iconImageURL != "") {
            strapiRecord.internalImage.icon = {
                "url": iconImageURL
            };
        }

        let squareImageURL = getInsightlyCustomField("SQUARE_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE);
        if (squareImageURL != "") {
            strapiRecord.internalImage.square = {
                "url": squareImageURL
            };
        }



        strapiRecord.insightlyTags = string2array(insightlyGetTags(insightlyRecord));

        strapiRecord.categories = {}; //empty



        let tmpTag = string2array(getInsightlyCustomField("member_tags", insightlyRecord).replace(/;/g, ',')); //the .replace changes ; to ,
        let tmpSector = orgType2array(getInsightlyCustomField("organization_type", insightlyRecord));
        let tmpSdg = string2array(getInsightlyCustomField("Sustainable_Development_Goals", insightlyRecord).replace(/;/g, ','));
        let tmpIndustry = string2array(getInsightlyCustomField("organization_segments", insightlyRecord).replace(/;/g, ','));
        let tmpChallenge = string2array(getInsightlyCustomField("problems_solved", insightlyRecord).replace(/;/g, ','));

        //next thing to do is to convert all categories and tags to valid idName's
        // eg the challenge contains "Enhanced data collection" this must be converted to "enhanced-data-collection"


        //we are only going to add .categories that has values 
        if (tmpTag != "") {
            strapiRecord.categories.tag = convertCategoryitems2Keys(tmpTag);
        }
        if (tmpSector != "") {
            strapiRecord.categories.sector = convertCategoryitems2Keys(tmpSector);
        }
        if (tmpSdg != "") {
            strapiRecord.categories.sdg = convertCategoryitems2Keys(tmpSdg);
        }
        if (tmpIndustry != "") {
            strapiRecord.categories.industry = convertCategoryitems2Keys(tmpIndustry);
        }
        if (tmpChallenge != "") {
            strapiRecord.categories.challenge = convertCategoryitems2Keys(tmpChallenge);
        }



        // we also need to make sure the idName is a legal idName
        strapiRecord.idName = string2IdKey(strapiRecord.idName);

        //in my dyslectic rambelings I have missspelled water as wather
        if (tmpIndustry != "") {
            strapiRecord.categories.industry = replaceItemInArray("wather", "water", strapiRecord.categories.industry);
        }

        // to add domains to strapi we ned to prefix the domains with domainName
        strapiRecord.domains = prefixArrayObjects(strapiRecord.domains, "domainName");


        // the insightlyRecord.BACKGROUND is null if empty - make it an empty string
        if (insightlyRecord.BACKGROUND == null)
            strapiRecord.description = "";


        // the insightlyRecord.WEBSITE is null if empty - make it an empty string
        if (insightlyRecord.WEBSITE == null)
            strapiRecord.url = "";


        // the insightlyRecord.PHONE is null if empty - make it an empty string
        if (insightlyRecord.PHONE == null)
            strapiRecord.phone = "";


        // if we do not have a valid address then we set the address to Å in Røst municipality
        if (insightlyRecord.ADDRESS_SHIP_STREET == null || insightlyRecord.ADDRESS_SHIP_CITY == null || insightlyRecord.ADDRESS_SHIP_POSTCODE == null || insightlyRecord.ADDRESS_SHIP_COUNTRY == null) {
            strapiRecord.location = {
                "visitingAddress": {
                    "street": "Å vegen 5",
                    "city": "Sørvågen",
                    "postcode": "8392",
                    "country": "Norway"
                }
            }
        }




        //Insightly organization is not using the summary field yet. So copy the description field for now
        if (strapiRecord.summary == "")
            strapiRecord.summary = strapiRecord.description.substring(0, FIELD_SUMMARY_MAXCHAR);

        // the summary cannot be empty. In Insightly that might be the case. So fix it
        if (strapiRecord.summary == "") {
            console.log("empty description/summary field in Insightly for: ", strapiRecord.idName);
            strapiRecord.summary = "missing text";
        }


        // adding temp fields to strapiRecord that will be used to figure out if the og has ben updated 
        // strapiCreatedDate holds just the date so that it can be written to strapi 
        strapiRecord.insightlyTmpFields = {
            "DATE_CREATED_UTC": insightlyRecord.DATE_CREATED_UTC,
            "DATE_UPDATED_UTC": insightlyRecord.DATE_UPDATED_UTC
        }


        // also add social fields to be synced
        if (insightlyRecord.SOCIAL_LINKEDIN) {
            socialLinks.linkedin = insightlyRecord.SOCIAL_LINKEDIN
        }

        if (insightlyRecord.SOCIAL_FACEBOOK) {
            socialLinks.facebook = insightlyRecord.SOCIAL_FACEBOOK
        }

        if (insightlyRecord.SOCIAL_TWITTER) {
            socialLinks.twitter = insightlyRecord.SOCIAL_TWITTER
        }

        let insightlyInstagram = getInsightlyCustomField("SOCIAL_INSTRAGRAM", insightlyRecord);
        if (insightlyInstagram != "") {
            socialLinks.instagram = insightlyInstagram
        }

        let insightlyYoutube = getInsightlyCustomField("SOCIAL_YOUTUBE", insightlyRecord);
        if (insightlyYoutube != "") {
            socialLinks.youtube = insightlyYoutube
        }



        //if there are no social links, then we set socialLinks= null othwevise we ass the socialLinks object
        if (Object.keys(socialLinks).length === 0 && socialLinks.constructor === Object)
            strapiRecord.socialLinks = null;
        else
            strapiRecord.socialLinks = socialLinks;


        //Get the insightly tags
        let insightlyTagString = insightlyGetTags(insightlyRecord);
        // convet to array 
        let insightlyTagArray = string2array(insightlyTagString);
        //copy only the array items that starts with INSIGHTLY_NETWORKTAGCHAR
        let insightlyNetworksArray = filterArray(INSIGHTLY_NETWORKTAGCHAR, insightlyTagArray)
        // then return the result
        strapiRecord.networkmemberships = insightlyNetworksArray;

        // get and copy the tags that the members added
        let insightlyMemberTags = getInsightlyCustomField("member_tags", insightlyRecord).toString();
        strapiRecord.tags = string2array(insightlyMemberTags);




    } else
        console.log("Cannot import ", insightlyRecord.ORGANISATION_NAME, " Missing CKAN_NAME");




    return strapiRecord;

}






/** getAllInsightlyOrganizationsByTag
 * Get the organisations that are tagged with tagName
 *
 */
export async function getAllInsightlyOrganizationsByTag(tagName) {


    let insightlyRequestURL = INSIGHTLY_ORGANIZATIONSBYTAGURI + tagName;
    let data = "none"
    let result;

    try {
        result = await axios.get(insightlyRequestURL, {
            auth: {
                username: INSIGHTLY_APIKEY
            }
        });
        data = result.data;

    }
    catch (e) {
        console.error("1.9 getAllInsightlyOrganizationsByTag catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(result));
        debugger
    }

    return data;

};



/** updateInsightlyOrganization
 * updates a organization in Insightly. 
 * WARNING a full insightlyRecord must be provided, complete with all fields.
 * All fields that are not provided will be deleted if they exist in Insightly database.
 * 
 *
 */
export async function updateInsightlyOrganization(insightlyRecord) {

    let data = "none";
    let result;

    // There is a bug in insightly - sometimes the field "IMAGE_URL" is long and contains an invalid url
    // if we try to write it back to insightly - then we get an error. So we test for the lenght - it it is long we set it to empy
    if (insightlyRecord.IMAGE_URL) {
        if (insightlyRecord.IMAGE_URL.length > 100) {
            insightlyRecord.IMAGE_URL = null;
        }
    }


    try {

        result = await axios(
            {
                url: INSIGHTLY_ORGANIZATION_URL,
                method: 'put',
                auth: {
                    username: INSIGHTLY_APIKEY
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(insightlyRecord)
            }
        );
        data = result.data;

    }
    catch (e) {
        console.error("1.9 updateInsightlyOrganization catch error (" + insightlyRecord.ORGANISATION_NAME + "): ", JSON.stringify(e, null, 2), " =>result is: ", JSON.stringify(result, null, 2));
        debugger
    }

    return data;

};

/** getInsightlyOrganization
 * gets a organization in Insightly. 
 
 */
export async function getInsightlyOrganization(organisation_id) {

    let insightlyRequestURL = INSIGHTLY_ORGANIZATION_URL + "/" + organisation_id
    let data = "none";
    let result;

    try {

        result = await axios(
            {
                url: insightlyRequestURL,
                method: 'get',
                auth: {
                    username: INSIGHTLY_APIKEY
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        data = result.data;

    }
    catch (e) {
        console.error("1.9 getInsightlyOrganization catch error : ", JSON.stringify(e, null, 2), " =>result is: ", JSON.stringify(result, null, 2));
        debugger
    }

    return data;

};










/** getInsightlyCustomField
 *  returns the value of the fieldName provided in the parameter.
 *  orgRecord parameter is the org we are extracting the custom field from
 *  If the tag is not defined it returns ""
 * custom fields is in a structure like this:
        "CUSTOMFIELDS": [
            {
                "FIELD_NAME": "LOCATION_FYLKENAVN__c",
                "FIELD_VALUE": "VESTLAND",
                "CUSTOM_FIELD_ID": "LOCATION_FYLKENAVN__c"
            },
            {
                "FIELD_NAME": "LOCATION_FYLKENUMMER__c",
                "FIELD_VALUE": "46",
                "CUSTOM_FIELD_ID": "LOCATION_FYLKENUMMER__c"
            },
            {
                "FIELD_NAME": "LOCATION_KOMMUNENAVN__c",
                "FIELD_VALUE": "BERGEN",
                "CUSTOM_FIELD_ID": "LOCATION_KOMMUNENAVN__c"
            },
            {
                "FIELD_NAME": "LOCATION_KOMMUNENUMMER__c",
                "FIELD_VALUE": "4601",
                "CUSTOM_FIELD_ID": "LOCATION_KOMMUNENUMMER__c"
            },
            {
                "FIELD_NAME": "LOCATION_LATITUDE__c",
                "FIELD_VALUE": "60.39210719649853",
                "CUSTOM_FIELD_ID": "LOCATION_LATITUDE__c"
            },
            {
                "FIELD_NAME": "LOCATION_LONGITUDE__c",
                "FIELD_VALUE": "60.39210719649853",
                "CUSTOM_FIELD_ID": "LOCATION_LONGITUDE__c"
            }
 
        ]
 
 *
 */

function getInsightlyCustomField(fieldName, orgRecord) {

    fieldName = fieldName + "__c"; // custom field has a __c ending
    if (orgRecord.hasOwnProperty("CUSTOMFIELDS")) { //if there are costom fields here
        if (Array.isArray(orgRecord.CUSTOMFIELDS)) { // and it is an array
            let theCustomFields = orgRecord.CUSTOMFIELDS;
            for (var i = 0; i < theCustomFields.length; i++) {
                // V2.2 API if(theCustomFields[i].CUSTOM_FIELD_ID == fieldName) { // we found it
                if (theCustomFields[i].FIELD_NAME == fieldName) { // we found it
                    return theCustomFields[i].FIELD_VALUE;
                }
            }

        }
    }

    return ""; // not found
}


/** getInsightlyOrganizationTags
 * takes and organisation_id and returns all tags for that organization
 * if there are noene or the org does not exist then "none" is returned
 The tags looks like this:
 [
    {
        "TAG_NAME": "+Oslo"
    },
    {
        "TAG_NAME": "+Trondheim"
    },
    {
        "TAG_NAME": "=Hurtigruten18"
    },
    {
        "TAG_NAME": "=SBNmedlemsvirksomhet"
    },
    {
        "TAG_NAME": "=Smartbydugnaden19"
    },
    {
        "TAG_NAME": "#byggalliansen.no"
    },
    {
        "TAG_NAME": "#constructioncity.no"
    }
]
 
 */
async function getInsightlyOrganizationTags(organisation_id) {

    let insightlyRequestURL = INSIGHTLY_ORGANIZATION_TAGS_URI.replace(":ORGANISATION_ID", organisation_id); //replace the text with the value from the parameter

    let data = "none"
    let result;



    try {
        result = await axios.get(insightlyRequestURL, {
            auth: {
                username: INSIGHTLY_APIKEY
            }
        });
        data = result.data;

    }
    catch (e) {
        console.error("1.9 getInsigthlyOrganizationTags catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(result));
        debugger
    }

    return data;


}


/** updateInsightlyOrganizationTags
 * takes an organisation_id and the full array of tags and write the tags to insightly.
 * returns the tags as they are received from insightly if all is OK. 
 * If something is wrong then "none" is returned. 
 see getInsigthlyOrganizationTags for doc on the array of tags.
 */
async function updateInsightlyOrganizationTags(organisation_id, tagsArray) {

    let insightlyRequestURL = INSIGHTLY_ORGANIZATION_TAGS_URI.replace(":ORGANISATION_ID", organisation_id); //replace the text with the value from the parameter

    let data = "none";
    let result;

    try {

        result = await axios(
            {
                url: insightlyRequestURL,
                method: 'put',
                auth: {
                    username: INSIGHTLY_APIKEY
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(tagsArray)
            }
        );
        data = result.data;

    }
    catch (e) {
        console.error("1.9 updateInsightlyOrganizationTags catch error : ", JSON.stringify(e, null, 2), " =>result is: ", JSON.stringify(result, null, 2));
        debugger
    }

    return data;



}

/** setInsightlyTag
 * takes a tagName and a tagArray. 
 * If the tagName exists in the tagArray then nothing happens
 * If tagName does not exist then the tagName is added to the tagArray
 If all is fine the tagArray is returned - if something goes wrong then "none" is returned.
 */
function setInsightlyTag(tagName, tagArray) {

    //TODO: check for illegal chars in tag. This can create problems later when writing 

    let foundIndex;

    foundIndex = tagArray.findIndex(tag => tag.TAG_NAME == tagName);
    if (foundIndex >= 0) { // its there
        tagArray[foundIndex].TAG_NAME = tagName; //we set it
    } else {
        let tagRecord = {
            "TAG_NAME": tagName
        }
        tagArray.push(tagRecord)

    }

    return tagArray;

}

/** deleteInsightlyTag
 * takes a tagName and a tagArray. 
 * If the tagName exists in the tagArray then it is removed from the array
 
 If all is fine the tagArray is returned 
 - if something goes wrong then "none" is returned.
 */
function deleteInsightlyTag(tagName, tagArray) {

    let foundIndex;

    foundIndex = tagArray.findIndex(tag => tag.TAG_NAME == tagName);
    if (foundIndex >= 0) {
        tagArray.splice(foundIndex, 1);
    }
    return tagArray


}

/** hasInsightlyTag
 * takes a tagName and a tagArray. 
 * If the tagName exists in the tagArray then tagName is returned 
 * if not then "none" is returned.
 */
function hasInsightlyTag(tagName, tagArray) {

    let foundIndex;

    foundIndex = tagArray.findIndex(tag => tag.TAG_NAME == tagName);
    if (foundIndex >= 0) { // its there
        return tagName; //we found it
    } else {
        return "none"
    }


}




/** setInsightlyCustomField
 *  sets customFieldName to customFieldValue in a insightlyRecord
 if the customFieldName does not exist then it will be added.
 
 returns the customField record if all is OK - if something goes wrong it returns "none"
 
 * custom fields is in a structure like this:
         "CUSTOMFIELDS": [
            {
                "FIELD_NAME": "LOCATION_FYLKENAVN__c",
                "FIELD_VALUE": "VESTLAND",
                "CUSTOM_FIELD_ID": "LOCATION_FYLKENAVN__c"
            },
            {
                "FIELD_NAME": "LOCATION_FYLKENUMMER__c",
                "FIELD_VALUE": "46",
                "CUSTOM_FIELD_ID": "LOCATION_FYLKENUMMER__c"
            },
            {
                "FIELD_NAME": "LOCATION_KOMMUNENAVN__c",
                "FIELD_VALUE": "BERGEN",
                "CUSTOM_FIELD_ID": "LOCATION_KOMMUNENAVN__c"
            },
            {
                "FIELD_NAME": "LOCATION_KOMMUNENUMMER__c",
                "FIELD_VALUE": "4601",
                "CUSTOM_FIELD_ID": "LOCATION_KOMMUNENUMMER__c"
            },
            {
                "FIELD_NAME": "LOCATION_LATITUDE__c",
                "FIELD_VALUE": "60.39210719649853",
                "CUSTOM_FIELD_ID": "LOCATION_LATITUDE__c"
            },
            {
                "FIELD_NAME": "LOCATION_LONGITUDE__c",
                "FIELD_VALUE": "60.39210719649853",
                "CUSTOM_FIELD_ID": "LOCATION_LONGITUDE__c"
            }
 
        ]
 
 *
 */

function setInsightlyCustomField(customFieldName, customFieldValue, insightlyRecord) {

    const CUSTOM_FIELD_ENDING = "__c";
    let createNewCustomField = true;
    let returnRecord = "none"

    customFieldName = customFieldName + CUSTOM_FIELD_ENDING; // custom field has a __c ending
    if (insightlyRecord.hasOwnProperty("CUSTOMFIELDS")) { //if there are costom fields here
        if (Array.isArray(insightlyRecord.CUSTOMFIELDS)) { // and it is an array
            let theCustomFields = insightlyRecord.CUSTOMFIELDS;
            for (var i = 0; i < theCustomFields.length; i++) {
                if (theCustomFields[i].FIELD_NAME == customFieldName) { // we found it
                    createNewCustomField = false; //we are updating - so no need to create
                    theCustomFields[i].FIELD_VALUE = customFieldValue; // update with new value
                    returnRecord = theCustomFields[i]; //return the changed record  
                }
            }

            if (createNewCustomField) { // we did not find it. So we create it
                let newCustomField = {
                    "CUSTOM_FIELD_ID": customFieldName,
                    "CUSTOM_FIELD_NAME": customFieldName,
                    "FIELD_VALUE": customFieldValue
                };
                insightlyRecord.CUSTOMFIELDS.push(newCustomField); // add it to the array               
                returnRecord = newCustomField;
            }

        }
    }

    return returnRecord;
}







/** getMemoryEntityIDByIdName
 * takes an array of entities (entityArray) and a entityIdName
 * 
 * checks if an entity with entityIdName  exists - if it exist it returns the strapi ID 
 * otherwise it returns "none"
 * @param {*} entityIdName 
 */
export async function getMemoryEntityIDByIdName(entityIdName, entityArray) {

    let organizationID = "none"; //assume its not there
    let strapiOrg = {};
    strapiOrg = entityArray.find(org => org.idName == entityIdName);
    if (strapiOrg == undefined) { // did not work Object.entries(person).length === 0
        console.log(entityIdName, "getMemoryEntityIDByIdName -> NOT in memory");
    } else {
        console.log(entityIdName, "getMemoryEntityIDByIdName -> YES in memory");
        organizationID = strapiOrg.id;
    }


    return organizationID;
};






/** copyInsightlyCategoryAnswers
 * creates entityCategory and entityCategoryAnswer in strapi. It just copies - no test of what is there from before.
 * 
 */
export async function copyInsightlyCategoryAnswers(entityID, entityIdName, insightlyCategories) {

    let logText = "";

    for (const categoryIdName in insightlyCategories) {


        if (categoryIdName != "tag") { //debugging -- tag has problems



            let caregoryRecord = await getCategoryByIdName(categoryIdName); //get the record




            if (caregoryRecord != "none") { // we have a category


                let categoryType = caregoryRecord.categoryType; // need it in case it is a type of tag. In that case we will create the categoryItem record
                let categoryID = caregoryRecord.id;

                // First check if there is a relation between the org and the category already
                let entityCategoryID = await getEntityCategoryIDByIdName(entityIdName, categoryIdName);
                if (entityCategoryID == "none") { //Does not exist. We need to create it first
                    //Now we can create the relation between category and entity - the entityCategory
                    let text = "Category:" + categoryIdName + ",Org:" + entityIdName + ",Source:insightly"; //for knowing where the answer came from

                    entityCategoryID = await createEntityCategory(entityID, categoryID, text);
                    if (entityCategoryID != "none") { // we have could create 
                        logText = "create EntityCategory Org:" + entityIdName + ",Cat:" + categoryIdName;
                        console.log(logText);
                    }
                }

                if (entityCategoryID != "none") { // we managed to create a entityCategory OR it was there - eigther way lets create the answers

                    let answersArray = insightlyCategories[categoryIdName]; // get the array of answers

                    for (var OrgCatAnswerCounter = 0; OrgCatAnswerCounter < answersArray.length; OrgCatAnswerCounter++) { //loop for the answers in the category 
                        let categoryitemIdName = answersArray[OrgCatAnswerCounter];


                        let categoryitemID = await getCategoryitemIDByIdNameAndCategoryID(categoryID, categoryitemIdName);
                        if (categoryitemID != "none") { // we have a category Item

                            //Lets see if there is already a entityCategoryAnswer
                            let entityCategoryAnswerID = await getEntityCategoryAnswerIDByCategoryIDandCategoryitemIdName(entityCategoryID, categoryitemIdName);
                            if (entityCategoryAnswerID != "none") { // there is already a answer
                                logText = "Exist entityCategoryAnswer. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                console.info(logText);
                            } else {
                                // There is no answer for this - Now we can create the relation between entityCategory and categoryItem                            

                                numEntityCategoryAnswerSynced++;

                                let entityCategoryAnswerText = ""; //
                                let debugText = "CatItem:" + categoryitemIdName + ",Cat:" + categoryIdName + ",Org:" + entityIdName + ",Source:insightly"; //for knowing where the answer came from
                                entityCategoryAnswerID = await createEntityCategoryAnswer(entityCategoryID, categoryitemID, debugText, entityCategoryAnswerText);

                                if (entityCategoryAnswerID != "none") { // we managed to create an answer
                                    logText = "Create EntityCategoryAnswer. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                    console.log(logText);
                                } else {
                                    //trouble - could not create the answer
                                    logText = "Error could not create EntityCategoryAnswer. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                    console.error(logText);
                                    debugger
                                }

                            }



                        } else { //there is no categoryitem for the answer - THIS CODE WILL NOT BE REACHED - IT IS MENT TO HANDLE TAG CREATON

                            //if the categoryType = "tag" then we create the categoryItem 
                            console.log("skiping tag. code below must be rewritten BIG TODO:");


                            /*
                                                        if (categoryType == "tag") {
                                                            logText = "Create categoryItem. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                                            console.log(logText);
                                                            sourceComment = "Insightly import. First organization to use the tag=" + categoryitemIdName + " is org=" + entityIdName;
                                                            categoryitemID = await addCategoryItemTag(categoryitemIdName, categoryID, sourceComment);
                            
                                                            // Now we can create the relation between OrgCat and categoryItem                            
                                                            let orgCatAnswerText = "CatItem:" + categoryitemIdName + ",Cat:" + categoryIdName + ",Org:" + entityIdName + ",Source:insightly"; //for knowing where the answer came from
                                                            entityCategoryAnswerID = await addOrgCatAnswer(entityCategoryID, categoryitemID, orgCatAnswerText);
                            
                                                            if (entityCategoryAnswerID != "none") { // we managet to create an answer
                                                                logText = "Create OrgCatAnswer. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                                                console.log(logText);
                                                            } else {
                                                                //trouble - could not create the answer
                                                                logText = "Error could not create OrgCatAnswer. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                                                console.error(logText);
                                                            }
                            
                            
                                                        } else {
                                                            //trouble - the categry item is not defined
                                                            logText = "Error categoryItem is not defined. Org:" + entityIdName + ",Cat:" + categoryIdName + ",CatItem:" + categoryitemIdName;
                                                            console.error(logText);
                                                        }
                            */

                        }


                    } // end looping answers

                } else {
                    // trouble - could nor create entityCategory
                    logText = "Error could nor create entityCategory. Org:" + entityIdName + ",Cat:" + categoryIdName;
                    console.error(logText);
                    debugger
                }

            } else {
                //trouble - the cateory does not exist
                logText = "Error the cateory does not exist. Org:" + entityIdName + ",Cat:" + categoryIdName;
                console.error(logText);
                debugger
            }

        } else {
            console.log("skipping ", categoryIdName);
        }

    } // end looping categories


}



/** insightlyGetEmailDomains
 * takes an insightlyRecord and return all EMAILDOMAINS in an array
 * if there are no domains a empty array is returned
 * @param {*} insightlyRecord 
 */

function insightlyGetEmailDomains(insightlyRecord) {
    let domainsArray = [];

    if (insightlyRecord.hasOwnProperty("EMAILDOMAINS")) {
        if (Array.isArray(insightlyRecord.EMAILDOMAINS)) { // and it is an array
            let theEmailDomains = insightlyRecord.EMAILDOMAINS;

            for (var i = 0; i < theEmailDomains.length; i++) {
                domainsArray[i] = theEmailDomains[i].EMAIL_DOMAIN;
            }
            return domainsArray;
        }
    }
    return domainsArray; // empty array
}




/** string2array 
 * converts string separated by comma to array and removes leading and tailing blanks
 * 
*/
function string2array(mystring) {
    var tempArrray = new Array();
    if (mystring) {
        tempArrray = mystring.split(",");

        // we got the array. Now remove blanks 
        for (var i = 0; i < tempArrray.length; i++) {
            tempArrray[i] = tempArrray[i].trim();
        }
    }
    return tempArrray
}

/** orgType2array
 * converts a single string value to an single item in an array
 */
function orgType2array(mystring) {
    var tempArrray = new Array();
    mystring = mystring.trim(); //remove blanks if any
    tempArrray.push(mystring);

    return tempArrray
}




/** insightlyGetTags
 * Returns tags on a record as a comma separated string.
 * If there are no tags then it returns ""
 * The tag structure looks like this
 *  "TAGS": [
            {
                "TAG_NAME": "+Stavanger"
            },
            {
                "TAG_NAME": "=SBNmedlemsvirksomhet"
            },
            {
                "TAG_NAME": "SS_Privat"
            }
        ]
 */
function insightlyGetTags(orgRecord) {

    if (orgRecord.hasOwnProperty("TAGS")) {
        if (Array.isArray(orgRecord.TAGS)) { // and it is an array
            let theTags = orgRecord.TAGS;
            let comma = ""; //no leading comma
            let tagString = "";
            for (var i = 0; i < theTags.length; i++) {
                tagString = tagString + comma + theTags[i].TAG_NAME
                comma = ","; //now we put a comma
            }
            return tagString;
        }
    }
    return ""; // no tags
}



/** convertCategoryitems2Keys
* Takes the categry holding the categoryitems that is saved on the entry
* and finds its keys by removing blanks etc.
* The keys can after this be used to look up in the definition of all categories 
* @param {*} category 
*/
function convertCategoryitems2Keys(category) { //eg for industry
    var localCategory;
    var localKey;
    var returnCategory = [];
    localCategory = category;
    localCategory.map(currentCategoryKey => {
        localKey = string2IdKey(currentCategoryKey);
        //console.log("LIB/getCatagoryItemAnswerKeys The key is :", localKey);
        if (localKey != "") {
            returnCategory.push(localKey);
        } else {
            console.error("convertCategoryitems2Keys has blank. category=", category);

        }
    });
    return returnCategory;
}






/** getAllInsightlyContactsByTag
 * Get the contacts that are tagged with tagName
 */
async function getAllInsightlyContactsByTag(tagName) {


    let insightlyRequestURL = INSIGHTLY_CONTACTSBYTAGURI + tagName;
    let data;
    let result;


    try {
        result = await axios.get(insightlyRequestURL, {
            auth: {
                username: INSIGHTLY_APIKEY
            }
        });
        data = result.data;

    }
    catch (e) {
        console.error("1.9 getAllInsightlyContactsByTag catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(result));
        debugger
    }

    return data;

};





/** insightly2strapiPersonRecord
 * takes a insightly record and return a strapi record
 * this function deals only with the fields that belongs to the entity 
 * and not to fields that belong to relations
 * @param {*} insightlyRecord 
 
A insightly record looks like this
 
{
        "CONTACT_ID": 188796766,
        "SALUTATION": null,
        "FIRST_NAME": "Siw",
        "LAST_NAME": "Andersen",
        "IMAGE_URL": "https://s3.amazonaws.com/insightly.userfiles/720224/0V82XC/708a9765-77a8-4b36-9e59-60887a1bda0a.jpeg?AWSAccessKeyId=AKIAJRNAGB7KJX37RU4Q&Expires=1591706311&Signature=nTqbLNVRAfZ4No5EfIPNxY5ng8E%3D",
        "BACKGROUND": null,
        "VISIBLE_TO": "EVERYONE",
        "OWNER_USER_ID": 1212582,
        "VISIBLE_TEAM_ID": null,
        "DATE_CREATED_UTC": "2016-09-22 20:32:10",
        "DATE_UPDATED_UTC": "2020-06-09 12:37:22",
        "SOCIAL_LINKEDIN": "https://www.linkedin.com/in/siwander/",
        "SOCIAL_FACEBOOK": "",
        "SOCIAL_TWITTER": "",
        "DATE_OF_BIRTH": null,
        "PHONE": null,
        "PHONE_HOME": null,
        "PHONE_MOBILE": "+4799721004",
        "PHONE_OTHER": "+47 997 21 004",
        "PHONE_ASSISTANT": "004799721004",
        "PHONE_FAX": null,
        "EMAIL_ADDRESS": "siw@oslobusinessregion.no",
        "ASSISTANT_NAME": null,
        "ADDRESS_MAIL_STREET": null,
        "ADDRESS_MAIL_CITY": null,
        "ADDRESS_MAIL_STATE": null,
        "ADDRESS_MAIL_POSTCODE": null,
        "ADDRESS_MAIL_COUNTRY": null,
        "ADDRESS_OTHER_STREET": null,
        "ADDRESS_OTHER_CITY": null,
        "ADDRESS_OTHER_STATE": null,
        "ADDRESS_OTHER_POSTCODE": null,
        "ADDRESS_OTHER_COUNTRY": null,
        "LAST_ACTIVITY_DATE_UTC": "2020-02-13 19:07:45",
        "NEXT_ACTIVITY_DATE_UTC": null,
        "CREATED_USER_ID": 1212582,
        "ORGANISATION_ID": 90706639,
        "TITLE": "Director International Relations ",
        "EMAIL_OPTED_OUT": false,
        "CUSTOMFIELDS": [
            {
                "FIELD_NAME": "other_url__c",
                "FIELD_VALUE": "https://www.koso.no/siw-andersen",
                "CUSTOM_FIELD_ID": "other_url__c"
            }
        ],
        "TAGS": [
            {
                "TAG_NAME": "+Oslo"
            },
            {
                "TAG_NAME": "Startup community"
            },
            {
                "TAG_NAME": "Networking HUB"
            },
            {
                "TAG_NAME": "=SBNhovedkontakt"
            },
            {
                "TAG_NAME": "=SBNmedlem"
            },
            {
                "TAG_NAME": "z_aarskonferansen2020-1"
            },
            {
                "TAG_NAME": "SmartCity"
            },
            {
                "TAG_NAME": "z_aarskonferansen2020-2"
            },
            {
                "TAG_NAME": "z_aarskonferansen2020-3"
            },
            {
                "TAG_NAME": "z_aarskonferansen2020-4"
            }
        ],
        "DATES": []
    },
 
 
 */
async function insightly2strapiPersonRecord(insightlyRecord) {
    let strapiRecord = {};

    let socialLinks = {};
    let strapi_idname;


    // first see if we need to generate a STRAPI_IDNAME
    strapi_idname = getInsightlyCustomField("STRAPI_IDNAME", insightlyRecord).toString();
    if (strapi_idname != "") {
        strapi_idname = generateInsightlyContactStrapiIdName(insightlyRecord);
        let setCustomFieldResult = setInsightlyCustomField("STRAPI_IDNAME", strapi_idname, insightlyRecord);
    }

    strapiRecord.idName = strapi_idname;


    if (strapiRecord.idName != "") {

        strapiRecord.firstName = insightlyRecord.FIRST_NAME;
        strapiRecord.lastName = insightlyRecord.LAST_NAME;
        strapiRecord.title = insightlyRecord.TITLE;


        if (insightlyRecord.IMAGE_URL != null) { //if there is a profile image
            strapiRecord.internalImage = {
                "profile": {
                    "url": insightlyRecord.IMAGE_URL
                }
            };
            //TODO: the images from insightly are expiring all the time 
            strapiRecord.internalImage = {
                "profile": {
                    "url": ""
                }
            };


        }


        // also add social fields to be synced
        if (insightlyRecord.SOCIAL_LINKEDIN) {
            socialLinks.linkedin = insightlyRecord.SOCIAL_LINKEDIN
        }

        if (insightlyRecord.SOCIAL_FACEBOOK) {
            socialLinks.facebook = insightlyRecord.SOCIAL_FACEBOOK
        }

        if (insightlyRecord.SOCIAL_TWITTER) {
            socialLinks.twitter = insightlyRecord.SOCIAL_TWITTER
        }


        let otherURL = getInsightlyCustomField("other_url", insightlyRecord).toString();
        if (otherURL) {
            socialLinks.otherURL = otherURL
        }



        //if there are no social links, then we set socialLinks= null othwevise we ass the socialLinks object
        if (Object.keys(socialLinks).length === 0 && socialLinks.constructor === Object)
            strapiRecord.socialLinks = null;
        else
            strapiRecord.socialLinks = socialLinks;


        strapiRecord.foreignKeys = {
            "sbn_insightly": insightlyRecord.CONTACT_ID.toString()
        }




        // populate network memberships for the person
        strapiRecord.networkmemberships = getPersonNetworkRoles(insightlyRecord);



    } else
        console.log("insightly2strapiPersonRecord: Cannot import ", insightlyRecord.FIRST_NAME, " idName not good");


    return strapiRecord;

}




/** getPersonNetworkRoles
 * the roles of a person is defined by tags. A person can have many roles for each network
 * eg. Main contact, member and so on. 
 * We just need one of the roles for each network - And it must be the most significant role.
 * takes a personInsightlyRecord and returns an array of networkmemberships 
 * an empty array is returned if the person has no roles
 */
function getPersonNetworkRoles(personInsightlyRecord) {




    let networkmemberships = [];

    //now figure out what networks the person belongs to -- determines if the person is listed as a contact for the org when the org is displayed inthat network
    //Get the insightly tags
    let insightlyTagString = insightlyGetTags(personInsightlyRecord);
    // convet to array 
    let insightlyTagArray = string2array(insightlyTagString);
    //copy only the array items that starts with INSIGHTLY_NETWORKTAGCHAR
    let insightlyNetworksArray = filterArray(INSIGHTLY_NETWORKTAGCHAR, insightlyTagArray)


    let curentNetworkRole;
    let currentNetwork = {};

    let foundRole;
    let networkIdName;
    let legalRolePos;


    let numNetworks = insightlyNetworksArray.length;
    for (let networkCounter = 0; networkCounter < numNetworks; networkCounter++) {
        curentNetworkRole = insightlyNetworksArray[networkCounter];

        for (let i = 0; i < PERSON_NETWORK_ROLES.length; i++) { // loop the array of legal roles
            legalRolePos = curentNetworkRole.lastIndexOf(PERSON_NETWORK_ROLES[i].roleName); //is there a legal role in the curentNetworkRole string
            if (legalRolePos != -1) { // it's a legal role
                networkIdName = curentNetworkRole.slice(0, legalRolePos);
                currentNetwork = { //populate the network role record
                    "networkIdName": networkIdName,
                    "roleName": PERSON_NETWORK_ROLES[i].roleName,
                    "roleText": PERSON_NETWORK_ROLES[i].roleText,
                    "priority": PERSON_NETWORK_ROLES[i].priority
                }
                //do we already have a role for this network 

                foundRole = networkmemberships.findIndex(networkRole => networkRole.networkIdName == networkIdName); // find the first (and only)
                if (foundRole >= 0) { // its there                        
                    if (networkmemberships[foundRole].priority > PERSON_NETWORK_ROLES[i].priority) { // does the the one there have a higher significance
                        networkmemberships[foundRole] = currentNetwork; // yes - higher significance - replace the one we have with this one
                    } else { // the one we already have has a higher significance
                        //do nothing
                    }
                } else { // not there - we can add it
                    networkmemberships.push(currentNetwork);

                }

            } else { // not a legal role
                //do nothing - skip it
            }


        } // end for loop - array of legal roles

    } // end for loop - every item in array


    return networkmemberships;
}

/** findStrapiPersonWithInsightlyID
 * takes strapiAllPersons and finds the first person that has foreignKeys.sbn_insightly (insightlyID)
 * there will be persons that does not have foreignKeys property - so handle this
 * returns the person record if found - otherwise "none"
 */
function findStrapiPersonWithInsightlyID(strapiAllPersons, insightlyID) {

    //let existingStrapiPerson = strapiAllPersons.find(person => person.foreignKeys.sbn_insightly == insightlyID);
    let currentPersonRecord;
    let returnPersonRecord = "none"
    for (let personCounter = 0; personCounter < strapiAllPersons.length; personCounter++) { //loop all persons
        currentPersonRecord = strapiAllPersons[personCounter];
        if (currentPersonRecord.hasOwnProperty('foreignKeys')) { //has the property 
            if (currentPersonRecord.foreignKeys != null) {        // and the property is not null
                if (currentPersonRecord.foreignKeys.hasOwnProperty('sbn_insightly')) {
                    if (currentPersonRecord.foreignKeys.sbn_insightly == insightlyID) {
                        returnPersonRecord = currentPersonRecord
                        return returnPersonRecord
                    }
                }
            } /*else {
                console.log("foreignKeys is null FOR personCounter=" + personCounter + " IDNAME=" + currentPersonRecord.idName);            
            }*/

        } /*else {
            console.log("missing foreignKeys FOR personCounter=" + personCounter + " IDNAME=" + currentPersonRecord.idName);
        }*/


    }

    return returnPersonRecord

}

/** findStrapiEntityWithInsightlyID
 * takes strapiAllOrganizations and finds the first entity that has foreignKeys.sbn_insightly (insightlyID)
 * there will be persons that does not have foreignKeys property - so handle this
 * returns the person record if found - otherwise "none"
 */
function findStrapiEntityWithInsightlyID(strapiAllOrganizations, insightlyID) {


    let currentEntityRecord;
    let returnEntityRecord = "none";
    for (let entityCounter = 0; entityCounter < strapiAllOrganizations.length; entityCounter++) { //loop all persons
        currentEntityRecord = strapiAllOrganizations[entityCounter];
        if (currentEntityRecord.hasOwnProperty('foreignKeys')) { //has the property 
            if (currentEntityRecord.foreignKeys != null) {        // and the property is not null
                if (currentEntityRecord.foreignKeys.hasOwnProperty('sbn_insightly')) {
                    if (currentEntityRecord.foreignKeys.sbn_insightly == insightlyID) {
                        returnEntityRecord = currentEntityRecord
                        return returnEntityRecord
                    }
                }
            } else {
                console.log("foreignKeys is null FOR entityCounter=" + entityCounter + " IDNAME=" + currentEntityRecord.idName);
            }

        } else {
            console.log("missing foreignKeys FOR entityCounter=" + entityCounter + " IDNAME=" + currentEntityRecord.idName);
        }


    }

    return returnEntityRecord

}



/** getAllInsightlyNetworks
 * reads all organizations in insightly 
 * that are marked as a network
 * by using the url INSIGHTLY_NETWORK_SEARCH_URL
 */
async function getAllInsightlyNetworks() {

    let insightlyRequestURL = INSIGHTLY_NETWORKS_URL;
    let data;
    let result;

    try {
        result = await axios.get(insightlyRequestURL, {
            auth: {
                username: INSIGHTLY_APIKEY
            }
        });
        data = result.data;

    }
    catch (e) {
        console.error("1.9 getAllInsightlyNetworks catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(result));
        debugger
    }

    return data;

};

/** readNetworksFromInsightly
 * reads all organizations marked as networks from insightly 
 * and converts them to merge records and add network fields. 
 * Returns an array of network records - or an empty array if there are none
 */

export async function readNetworksFromInsightly() {

    let returnArray = [];

    const entitytypeID = "not used!"



    let insightlyAllNetworkOrganizations = await getAllInsightlyNetworks();

    for (let i = 0; i < insightlyAllNetworkOrganizations.length; i++) {
        let currentIinsightlyNetworkOrganizationRecord = insightlyAllNetworkOrganizations[i];


        let currentMergeRecord = insightly2mergeRecord(currentIinsightlyNetworkOrganizationRecord);

        //then we need to extract the network specific fields
        let networkName = await getInsightlyCustomField("NetworkName", currentIinsightlyNetworkOrganizationRecord);
        if (networkName) {
            currentMergeRecord.idName = string2IdKey(networkName); //here we are changing the ID - so incase they have different ID' that is possible
        }

        let networkMemberTypes = await getInsightlyCustomField("networkMemberTypes", currentIinsightlyNetworkOrganizationRecord);

        if (networkMemberTypes) currentMergeRecord.networkMemberTypes = JSON.parse(networkMemberTypes);


        returnArray.push(currentMergeRecord);
    }

    return returnArray;

}


/*** generateInsightlyContactStrapiIdName
 * takes a insightlyPersonRecord and returns a generated STRAPI_IDNAME
  * The value in STRAPI_IDNAME is unique and is generated with the following rule
 * firstname + "-" + lastname + "-" + Record ID
 * names are sluggified to get proper url
 * 
 */
function generateInsightlyContactStrapiIdName(insightlyPersonRecord) {
    let strapi_idname = "none";

    strapi_idname = string2IdKey(insightlyPersonRecord.FIRST_NAME) + "-" + string2IdKey(insightlyPersonRecord.LAST_NAME) + "-" + insightlyPersonRecord.CONTACT_ID;

    return strapi_idname;
}



/** insightlyJobContactsCreateStrapiIdNames
 * takes  an array of contacts from insightly (insightlyContactsArray) and 
 * assigns value to the custom field STRAPI_IDNAME.
 
 * 
 * an array of the contacts that has been assigned STRAPI_IDNAME is returned
 * if here are none to be changed then the array returned is empty; 
 * 
 */
export async function insightlyJobContactsCreateStrapiIdNames(insightlyContactsArray) {

    let insightlyAllTaggedContactsWrite = []; //array to hold the changed contacts to be written back to insightly
    let strapi_idname = "";
    let insightlyPersonRecord;

    console.log("insightlyJobContactsCreateStrapiIdNames: InsightlyPersons= ", insightlyContactsArray.length);

    //loop trugh all tagged contacts in insightly 
    for (let insightlyContactCounter = 0; insightlyContactCounter < insightlyContactsArray.length; insightlyContactCounter++) { //loop all contacts
        strapi_idname = "";
        insightlyPersonRecord = insightlyContactsArray[insightlyContactCounter];
        strapi_idname = getInsightlyCustomField("STRAPI_IDNAME", insightlyPersonRecord).toString();

        if (strapi_idname == "") { // the person is NOT assigned a STRAPI_IDNAME
            strapi_idname = generateInsightlyContactStrapiIdName(insightlyPersonRecord);
            let setCustomFieldResult = setInsightlyCustomField("STRAPI_IDNAME", strapi_idname, insightlyPersonRecord);
            insightlyAllTaggedContactsWrite.push(insightlyPersonRecord); //put the changed record in the write queue
            console.info("insightlyJobContactsCreateStrapiIdNames: assigned idName", strapi_idname);
        } else { // the person IS assigned a STRAPI_IDNAME - no need to do anything
            console.info("insightlyJobContactsCreateStrapiIdNames: has idName", strapi_idname);
        }
    }
    console.log("insightlyJobContactsCreateStrapiIdNames: new assigned idName's= ", insightlyAllTaggedContactsWrite.length);

    return insightlyAllTaggedContactsWrite; //return the records that must be updated

}



/** insightlyContactsAssignIdNames
 * gets all contacts from insightly tagged  (insightlyTaggedContacts) and 
 * uses insightlyJobContactsCreateStrapiIdNames to assign STRAPI_IDNAME to the contacts that are missing
 * writes the contacts that are changed back to insightly 
 * 
 * returns "OK" if all if good
 * otherwise "ERR"
 */
export async function insightlyContactsAssignIdNames(insightlyTaggedContacts) {

    let insightlyAllTaggedContactsWrite = []; //array to hold the changed contacts to be written back to insightly
    let insightlyAllTaggedContacts;
    let writeResult;
    let returnResult = "OK"

    console.log("starting import of contacts: insightlyContactsAssignIdNames");
    insightlyAllTaggedContacts = await getAllInsightlyContactsByTag(insightlyTaggedContacts);
    console.log("insightlyContactsAssignIdNames: InsightlyPersons= ", insightlyAllTaggedContacts.length);

    insightlyAllTaggedContactsWrite = await insightlyJobContactsCreateStrapiIdNames(insightlyAllTaggedContacts);
    if (insightlyAllTaggedContactsWrite.length) { //there was some changes
        writeResult = await insightlyContactArrayUpdate(insightlyAllTaggedContactsWrite);
        if (writeResult != "OK") {
            returnResult = "ERR" //we have some failed
        }
    }

    return returnResult;
}


/*** insightlyContactArrayUpdate
 * takes an array of contacts and write them back to insightly
 * returns "OK" if all contacts are written
 * if some failed it returns the number of failed
 */
export async function insightlyContactArrayUpdate(insightlyContactsArray) {

    let writeResult;
    let contactsWritten = 0;
    let contactsFailed = 0;
    let insightlyPersonRecord;

    //loop trugh all tagged contacts in insightly 
    for (let insightlyContactCounter = 0; insightlyContactCounter < insightlyContactsArray.length; insightlyContactCounter++) { //loop all contacts
        insightlyPersonRecord = insightlyContactsArray[insightlyContactCounter];
        writeResult = await updateInsightlyContact(insightlyPersonRecord);
        if (writeResult != "none") {
            contactsWritten++;
            console.info("insightlyContactArrayUpdate: (" + (insightlyContactCounter + 1) + "/" + insightlyContactsArray.length + ") Updated:", insightlyPersonRecord.FIRST_NAME);
        } else {
            contactsFailed++;
            console.info("insightlyContactArrayUpdate: (" + (insightlyContactCounter + 1) + "/" + insightlyContactsArray.length + ") Failed:", insightlyPersonRecord.FIRST_NAME);
        }

    }
    if (contactsFailed) {
        return contactsFailed;
    } else {
        return "OK"
    }


}


/*** updateInsightlyContact
 * updates a organization in Insightly. 
 * WARNING a full insightlyRecord must be provided, complete with all fields.
 * All fields that are not provided will be deleted if they exist in Insightly database.
 *
 */
export async function updateInsightlyContact(insightlyRecord) {

    let data = "none";
    let result;

    try {

        result = await axios(
            {
                url: INSIGHTLY_CONTACT_UPDATE,
                method: 'put',
                auth: {
                    username: INSIGHTLY_APIKEY
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(insightlyRecord)
            }
        );
        data = result.data;

    }
    catch (e) {
        console.error("1.9 updateInsightlyContact catch error (" + insightlyRecord.FIRST_NAME + "): ", JSON.stringify(e, null, 2), " =>result is: ", JSON.stringify(result, null, 2));
        debugger
    }

    return data;


}




/** apifyWebpageContactInfo2insightly
 * gets a list of organizations created by web crawling apify 
 * the entries in the list contains the social media links, 
 * phone numbers and email adresses that the web scraping was able to find.
 * 
 * This program fetches organizations from insightly and updates with the social 
 * info that is in the list from apify.
 * 
 */
export async function apifyWebpageContactInfo2insightly() {

    let apifyWebpageContactInfoResultArray = [];
    let apifyWebpageContactInfoInputArray = [];
    let insightlyAllTaggedOrganizationsArray = [];
    let insightlyAllTaggedOrganizationsArrayWrite = [];
    let writeResult = "dont know";

    console.log("starting import of webpage scraping: apifyWebpageContactInfo2insightly");
    //get all url's from insightly
    insightlyAllTaggedOrganizationsArray = await getAllInsightlyOrganizationsByTag(INSIGHTLY_TAG_WEBSCRAPE_INPUT);

    //create a list of urls
    apifyWebpageContactInfoInputArray = await createApifyUrlList(insightlyAllTaggedOrganizationsArray, "WEBSITE");

    //start the task with the list of urls 
    // result = await startApifyTask(APIFY_WEBPAGE_CONTACT_INFO_START);

    //get the results from apify
    apifyWebpageContactInfoResultArray = await getApifyResultArray(APIFY_WEBPAGE_CONTACT_INFO_RESULT);

    if (apifyWebpageContactInfoResultArray != "none") { // we got something
        if (Array.isArray(apifyWebpageContactInfoResultArray)) { // and it is an array

            insightlyAllTaggedOrganizationsArrayWrite = await insightlyJobOrganizationsUpdateContactInfo(insightlyAllTaggedOrganizationsArray, apifyWebpageContactInfoResultArray);
            if (insightlyAllTaggedOrganizationsArrayWrite.length > 0) { //there was some changes
                writeResult = await insightlyOrganizationArrayUpdate(insightlyAllTaggedOrganizationsArrayWrite);

            } else { //an empty array
                writeResult = " insightlyJobOrganizationsUpdateContactInfo returned an empty array - nothing to update"
            }

        } else { // its not an array
            writeResult = " getApifyResultArray did not return an array"
        }

    } else { // we got nothing - some error
        writeResult = " getApifyResultArray got nothing - serious problem"
    }

    if (writeResult != "OK") {
        writeResult = "Failed to update " + writeResult
    }

    return writeResult

}



/** insightlyJobOrganizationsUpdateContactInfo
 * takes  an array of organizations from insightly (insightlyAllTaggedOrganizationsArray) 
 * and an array of scraped web pages (apifyWebpageContactInfoArray)
 *  
 The data in insightly looks like this:
"PHONE": "55565556",
"WEBSITE": "https://www.bergen.kommune.no/",
"SOCIAL_LINKEDIN": null,
"SOCIAL_FACEBOOK": null,
"SOCIAL_TWITTER": null,
"EMAIL_DOMAIN": "bergen.kommune.no",

 * the key in both arrays is web page url - no its not
 *
 *
 * 
 */
export async function insightlyJobOrganizationsUpdateContactInfo(insightlyOrgArray, apifyWebpageContactInfoArray) {

    let insightlyAllTaggedOrganizationsArrayWrite = [];

    let currentInsightlyOrganizationRecord;
    let foundScraped = 0;
    let websiteID = ""; //this is the key in both tables
    let webDuplicates = [];
    let updatedInfo = false; //used to determine if we have new info on the insightly org
    let scrapedFacebook = "";
    let scrapedLinkedin = "";
    let scrapedTwitter = "";
    let scrapedPhone = "";
    let scrapedEmail = "";
    let scrapedInstagram = "";
    let scrapedYoutube = "";
    let foundRecord = {};
    let wwwPos = 0;
    let slashPos = 0;
    let webDomain = "";
    let organizationTagArray = [];
    let email = "";
    let instagram = "";
    let youtube = "";

    console.log("insightlyJobOrganizationsUpdateContactInfo: InsightlyOrganizations :" + insightlyOrgArray.length + " ScrapedOrganizations= :" + apifyWebpageContactInfoArray.length);

    //loop trugh all tagged contacts in insightly 
    for (let insightlyOrgCounter = 0; insightlyOrgCounter < insightlyOrgArray.length; insightlyOrgCounter++) { //loop all contacts

        updatedInfo = false; //assume we dont have new info
        scrapedFacebook = "";
        scrapedLinkedin = "";
        scrapedTwitter = "";
        scrapedPhone = "";
        scrapedEmail = "";
        scrapedInstagram = "";
        scrapedYoutube = "";
        webDuplicates = [];
        foundRecord = {};
        wwwPos = 0;
        slashPos = 0;
        webDomain = "";
        organizationTagArray = [];
        email = "";
        instagram = "";
        youtube = "";


        currentInsightlyOrganizationRecord = insightlyOrgArray[insightlyOrgCounter];
        websiteID = currentInsightlyOrganizationRecord.WEBSITE;

        if (websiteID) { // if the org has a website


            wwwPos = websiteID.indexOf("http");
            if (wwwPos == -1)  // does not have http or https
                websiteID = "http://" + websiteID //just add http is there is none

            let domain = (new URL(websiteID));
            webDomain = domain.hostname.replace('www.', '');

            if (currentInsightlyOrganizationRecord.IMAGE_URL) {
                if (currentInsightlyOrganizationRecord.IMAGE_URL.length > 200)
                    currentInsightlyOrganizationRecord.IMAGE_URL = ""; //to long to be correct- reset it
            }

            // first check if there are duplicate websiteID in insightly --> that is an error
            //webDuplicates = insightlyOrgArray.filter(item => item.WEBSITE.indexOf(websiteID) !== -1); //return all organizations that has WEBSITE containing websiteID


            if (webDuplicates.length == 0) { // no duplicates

                // this was not good foundScraped = apifyWebpageContactInfoArray.findIndex(item => item.url == websiteID); // find the first (and only)
                foundScraped = apifyWebpageContactInfoArray.findIndex(item => item.domain == webDomain); // find the first (and only)
                if (foundScraped >= 0) { // its there  
                    foundRecord = apifyWebpageContactInfoArray[foundScraped];

                    // now lets see what we can update

                    // facebook ?
                    if (currentInsightlyOrganizationRecord.SOCIAL_FACEBOOK) { //do we have facebook already
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have facebook - lets see if we got a value from the scraping
                        scrapedFacebook = getScrapedURL(foundRecord.facebooks);
                        if (scrapedFacebook != "none") { //we got a link
                            updatedInfo = true;
                            currentInsightlyOrganizationRecord.SOCIAL_FACEBOOK = scrapedFacebook;
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Facebook: " + scrapedFacebook);
                        }
                    }

                    // linkedin ?
                    if (currentInsightlyOrganizationRecord.SOCIAL_LINKEDIN) { //do we have one
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have it - lets see if we got a value from the scraping
                        scrapedLinkedin = getScrapedURL(foundRecord.linkedIns);
                        if (scrapedLinkedin != "none") { //we got a link
                            updatedInfo = true;
                            currentInsightlyOrganizationRecord.SOCIAL_LINKEDIN = scrapedLinkedin;
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New LinkedIn: " + scrapedLinkedin);
                        }
                    }

                    // twitter ?
                    if (currentInsightlyOrganizationRecord.SOCIAL_TWITTER) { //do we have one
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have it - lets see if we got a value from the scraping
                        scrapedTwitter = getScrapedURL(foundRecord.twitters);
                        if (scrapedTwitter != "none") { //we got a link
                            updatedInfo = true;
                            currentInsightlyOrganizationRecord.SOCIAL_TWITTER = scrapedTwitter;
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Twitter: " + scrapedTwitter);
                        }
                    }

                    // phone ?
                    if (currentInsightlyOrganizationRecord.PHONE) { //do we have one
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have it - lets see if we got a value from the scraping
                        scrapedPhone = getScrapedPhone(foundRecord.phones);
                        if (scrapedPhone != "none") { //we got a link
                            updatedInfo = true;
                            currentInsightlyOrganizationRecord.PHONE = scrapedPhone;
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Phone: " + scrapedPhone);
                        } else { // there was no phones, lets see if there are some that looks like phone numbers
                            scrapedPhone = getScrapedPhone(foundRecord.phonesUncertain);
                            if (scrapedPhone != "none") { //we got a link
                                if (scrapedPhone.length >= 8) { //we are working with norwegian numbers and they are mostly 8 digits
                                    updatedInfo = true;
                                    currentInsightlyOrganizationRecord.PHONE = scrapedPhone;
                                    console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Phone..: " + scrapedPhone);
                                }
                            }
                        }
                    }


                    // email ?
                    email = await getInsightlyCustomField("ORGANIZATION_EMAIL", currentInsightlyOrganizationRecord);
                    if (email) { //do we have one
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have it - lets see if we got a value from the scraping
                        scrapedEmail = getScrapedURL(foundRecord.emails);
                        if (scrapedEmail != "none") { //we got a link
                            updatedInfo = true;
                            let setCustomFieldResult = setInsightlyCustomField("ORGANIZATION_EMAIL", scrapedEmail, currentInsightlyOrganizationRecord);
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Email: " + scrapedEmail);
                        }
                    }


                    // instagram ?
                    instagram = await getInsightlyCustomField("SOCIAL_INSTRAGRAM", currentInsightlyOrganizationRecord);
                    if (instagram) { //do we have one
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have it - lets see if we got a value from the scraping
                        scrapedInstagram = getScrapedURL(foundRecord.instagrams);
                        if (scrapedInstagram != "none") { //we got a link
                            updatedInfo = true;
                            let setCustomFieldResult = setInsightlyCustomField("SOCIAL_INSTRAGRAM", scrapedInstagram, currentInsightlyOrganizationRecord);
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Instagram: " + scrapedInstagram);
                        }
                    }

                    // youtube ?
                    youtube = await getInsightlyCustomField("SOCIAL_YOUTUBE", currentInsightlyOrganizationRecord);
                    if (youtube) { //do we have one
                        // do nothing - mabe later we can make a forced switch 
                    } else { // we dont have it - lets see if we got a value from the scraping
                        scrapedYoutube = getScrapedURL(foundRecord.youtubes);
                        if (scrapedYoutube != "none") { //we got a link
                            updatedInfo = true;
                            let setCustomFieldResult = setInsightlyCustomField("SOCIAL_YOUTUBE", scrapedYoutube, currentInsightlyOrganizationRecord);
                            console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -New Youtube: " + scrapedYoutube);
                        }
                    }




                    if (updatedInfo) { // some fields are updated
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_INPUT, currentInsightlyOrganizationRecord.TAGS); // delete for manual check
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_ERR, currentInsightlyOrganizationRecord.TAGS);
                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_OK, currentInsightlyOrganizationRecord.TAGS);

                        insightlyAllTaggedOrganizationsArrayWrite.push(currentInsightlyOrganizationRecord);
                    } else { // no update
                        console.info("insightlyJobOrganizationsUpdateContactInfo: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -No new info");
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_INPUT, currentInsightlyOrganizationRecord.TAGS); // delete for manual check
                        organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_ERR, currentInsightlyOrganizationRecord.TAGS);
                        organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_OK, currentInsightlyOrganizationRecord.TAGS);

                        insightlyAllTaggedOrganizationsArrayWrite.push(currentInsightlyOrganizationRecord);
                    }

                } else {// no url found- that is strange
                    console.error("insightlyJobOrganizationsUpdateContactInfo: Err (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -Website: " + websiteID + " NOT scraped");
                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_INPUT, currentInsightlyOrganizationRecord.TAGS); // delete for manual check
                    organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_OK, currentInsightlyOrganizationRecord.TAGS);
                    organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_ERR, currentInsightlyOrganizationRecord.TAGS);

                    insightlyAllTaggedOrganizationsArrayWrite.push(currentInsightlyOrganizationRecord);
                }


            } else { //duplicates - error
                console.error("insightlyJobOrganizationsUpdateContactInfo: Err (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -Duplicates website: " + websiteID + " found:" + webDuplicates.length + "times");
                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_INPUT, currentInsightlyOrganizationRecord.TAGS); // delete for manual check
                organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_OK, currentInsightlyOrganizationRecord.TAGS);
                organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_ERR, currentInsightlyOrganizationRecord.TAGS);

                insightlyAllTaggedOrganizationsArrayWrite.push(currentInsightlyOrganizationRecord);
            }
        } else { // no website !!
            console.error("insightlyJobOrganizationsUpdateContactInfo: Err (" + (insightlyOrgCounter + 1) + "/" + insightlyOrgArray.length + ") org: " + currentInsightlyOrganizationRecord.ORGANISATION_NAME + " -NO website: " + websiteID);
            organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_INPUT, currentInsightlyOrganizationRecord.TAGS); // delete for manual check
            organizationTagArray = deleteInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_OK, currentInsightlyOrganizationRecord.TAGS);
            organizationTagArray = setInsightlyTag(INSIGHTLY_TAG_WEBSCRAPE_ERR, currentInsightlyOrganizationRecord.TAGS);

            insightlyAllTaggedOrganizationsArrayWrite.push(currentInsightlyOrganizationRecord);
        }


    } // end loop

    console.log("insightlyJobOrganizationsUpdateContactInfo: updated organizations= ", insightlyAllTaggedOrganizationsArrayWrite.length);

    return insightlyAllTaggedOrganizationsArrayWrite; //return the records that must be updated

}




/*** insightlyOrganizationArrayUpdate
 * takes an array of organizations and write them back to insightly
 * returns "OK" if all contacts are written
 * if some failed it returns the number of failed
 */
export async function insightlyOrganizationArrayUpdate(insightlyOrganizationsArray) {

    let writeResult;
    let organizationsWritten = 0;
    let organizationsFailed = 0;
    let insightlyOrganizationRecord;

    //loop trugh all organizations
    for (let insightlyOrgCounter = 0; insightlyOrgCounter < insightlyOrganizationsArray.length; insightlyOrgCounter++) { //loop all 
        insightlyOrganizationRecord = insightlyOrganizationsArray[insightlyOrgCounter];
        writeResult = await updateInsightlyOrganization(insightlyOrganizationRecord);
        if (writeResult != "none") {
            organizationsWritten++;
            console.info("insightlyOrganizationArrayUpdate: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrganizationsArray.length + ") Updated:", insightlyOrganizationRecord.ORGANISATION_NAME);
        } else {
            organizationsFailed++;
            console.info("insightlyOrganizationArrayUpdate: (" + (insightlyOrgCounter + 1) + "/" + insightlyOrganizationsArray.length + ") Failed:", insightlyOrganizationRecord.ORGANISATION_NAME);
        }

    }
    if (organizationsFailed) {
        return organizationsFailed;
    } else {
        return "OK"
    }


}

/** insightly2mergeRecord
 takes a insightly record and transforms it to a merge record 
 This one should replace the various transformations

see doc for insightly2strapiEntityRecord
 */
export function insightly2mergeRecord(insightlyRecord) {
    let mergeRecord = {};

    let socialLinks = {};

    mergeRecord.idName = getInsightlyCustomField("CKAN_NAME", insightlyRecord).toString();
    // we also need to make sure the idName is a legal idName
    mergeRecord.idName = string2IdKey(mergeRecord.idName);
    mergeRecord.urbalurbaScrapeDate = new Date().toISOString();

    if (mergeRecord.idName != "") {
        mergeRecord.domain = mergeRecord.idName; // this is how its is defined - the domain is the id
        //mergeRecord.entitytype = entitytypeID,
        mergeRecord.displayName = insightlyRecord.ORGANISATION_NAME.toString();
        mergeRecord.urbalurbaIdName = name2UrbalurbaIdName(mergeRecord.displayName);


        mergeRecord.slogan = getInsightlyCustomField("slogan", insightlyRecord);
        mergeRecord.summary = getInsightlyCustomField("summary", insightlyRecord);
        mergeRecord.description = insightlyRecord.BACKGROUND;
        mergeRecord.web = insightlyRecord.WEBSITE;
        mergeRecord.phone = insightlyRecord.PHONE;
        mergeRecord.email = getInsightlyCustomField("ORGANIZATION_EMAIL", insightlyRecord);
        mergeRecord.location = {
            "visitingAddress": {
                "street": insightlyRecord.ADDRESS_SHIP_STREET,
                "city": insightlyRecord.ADDRESS_SHIP_CITY,
                "postcode": insightlyRecord.ADDRESS_SHIP_POSTCODE,
                "country": insightlyRecord.ADDRESS_SHIP_COUNTRY
            },
            "adminLocation": {
                "countyName": getInsightlyCustomField("LOCATION_FYLKENAVN", insightlyRecord).toString(),
                "countyId": getInsightlyCustomField("LOCATION_FYLKENUMMER", insightlyRecord).toString(),
                "municipalityId": getInsightlyCustomField("LOCATION_KOMMUNENUMMER", insightlyRecord).toString(),
                "municipalityName": getInsightlyCustomField("LOCATION_KOMMUNENAVN", insightlyRecord).toString()
            }
        };


        mergeRecord.organizationNumber = getInsightlyCustomField("Organisasjonsnummer", insightlyRecord).toString();
        mergeRecord.sbn_insightly = insightlyRecord.ORGANISATION_ID.toString();


        mergeRecord.domains = insightlyGetEmailDomains(insightlyRecord);


        let lat = getInsightlyCustomField("LOCATION_LATITUDE", insightlyRecord).toString();
        if (lat) { //we have an gps address
            mergeRecord.location.latLng = {
                "lat": lat,
                "lng": getInsightlyCustomField("LOCATION_LONGITUDE", insightlyRecord).toString()
            }
        }



        let foundedDate = getInsightlyCustomField("BRREG_ESTABLISHMENT_DATE", insightlyRecord).toString();
        if (foundedDate == "") { //its empty
            foundedDate = null;
        } else { // strapi dates are like this "2021-01-01"
            //no need to format
        }

        let endDate = getInsightlyCustomField("BRREG_DELETE_DATE", insightlyRecord).toString();
        if (endDate == "") { //its empty
            endDate = null;
        } else { // strapi dates are like this "2021-01-01"
            //no need to format
        }

        mergeRecord.brreg = {
            "organizationNumber": parseInt(getInsightlyCustomField("Organisasjonsnummer", insightlyRecord)),
            "employees": parseInt(getInsightlyCustomField("BRREG_EMPLOYEES", insightlyRecord)),
            "foundedDate": foundedDate,
            "endDate": endDate,
            "orgType": getInsightlyCustomField("BRREG_ORGTYPE", insightlyRecord).toString()

        }




        mergeRecord.image = {
            "profile": getInsightlyCustomField("CKAN_LOGO_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE)
        };


        let coverImageURL = getInsightlyCustomField("COVER_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE);
        if (coverImageURL != "") {
            mergeRecord.image.cover = coverImageURL
        }

        let iconImageURL = getInsightlyCustomField("ICON_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE);
        if (iconImageURL != "") {
            mergeRecord.image.icon = iconImageURL
        }

        let squareImageURL = getInsightlyCustomField("SQUARE_IMAGE", insightlyRecord).toString().replace(INSIGHTLY_OLD_IMAGE, INSIGHTLY_NEW_IMAGE);
        if (squareImageURL != "") {
            mergeRecord.image.square = squareImageURL
        }



        mergeRecord.insightlyTags = string2array(insightlyGetTags(insightlyRecord));

        mergeRecord.categories = {}; //empty



        let tmpTag = string2array(getInsightlyCustomField("member_tags", insightlyRecord).replace(/;/g, ',')); //the .replace changes ; to ,
        let tmpSector = orgType2array(getInsightlyCustomField("organization_type", insightlyRecord));
        let tmpSdg = string2array(getInsightlyCustomField("Sustainable_Development_Goals", insightlyRecord).replace(/;/g, ','));
        let tmpIndustry = string2array(getInsightlyCustomField("organization_segments", insightlyRecord).replace(/;/g, ','));
        let tmpChallenge = string2array(getInsightlyCustomField("problems_solved", insightlyRecord).replace(/;/g, ','));

        //next thing to do is to convert all categories and tags to valid idName's
        // eg the challenge contains "Enhanced data collection" this must be converted to "enhanced-data-collection"


        //we are only going to add .categories that has values 
        if (tmpTag != "") {
            mergeRecord.categories.tag = convertCategoryitems2Keys(tmpTag);
        }
        if (tmpSector != "") {
            mergeRecord.categories.sector = convertCategoryitems2Keys(tmpSector);
        }
        if (tmpSdg != "") {
            mergeRecord.categories.sdg = convertCategoryitems2Keys(tmpSdg);
        }
        if (tmpIndustry != "") {
            mergeRecord.categories.industry = convertCategoryitems2Keys(tmpIndustry);
        }
        if (tmpChallenge != "") {
            mergeRecord.categories.challenge = convertCategoryitems2Keys(tmpChallenge);
        }





        //in my dyslectic rambelings I have missspelled water as wather
        if (tmpIndustry != "") {
            mergeRecord.categories.industry = replaceItemInArray("wather", "water", mergeRecord.categories.industry);
        }


        // the insightlyRecord.BACKGROUND is null if empty - make it an empty string
        if (insightlyRecord.BACKGROUND == null)
            mergeRecord.description = "";


        // the insightlyRecord.WEBSITE is null if empty - make it an empty string
        if (insightlyRecord.WEBSITE == null)
            mergeRecord.url = "";


        // the insightlyRecord.PHONE is null if empty - make it an empty string
        if (insightlyRecord.PHONE == null)
            mergeRecord.phone = "";


        // if we do not have a valid address then we set the address to Å in Røst municipality
        if (insightlyRecord.ADDRESS_SHIP_STREET == null || insightlyRecord.ADDRESS_SHIP_CITY == null || insightlyRecord.ADDRESS_SHIP_POSTCODE == null || insightlyRecord.ADDRESS_SHIP_COUNTRY == null) {
            mergeRecord.location = {
                "visitingAddress": {
                    "street": "Å vegen 5",
                    "city": "Sørvågen",
                    "postcode": "8392",
                    "country": "Norway"
                }
            }
        }




        //Insightly organization is not using the summary field yet. So copy the description field for now
        if (mergeRecord.summary == "")
            mergeRecord.summary = mergeRecord.description.substring(0, FIELD_SUMMARY_MAXCHAR);

        // the summary cannot be empty. In Insightly that might be the case. So fix it
        if (mergeRecord.summary == "") {
            console.log("empty description/summary field in Insightly for: ", mergeRecord.idName);
            mergeRecord.summary = "missing text";
        }


        // adding temp fields to strapiRecord that will be used to figure out if the og has ben updated 
        // strapiCreatedDate holds just the date so that it can be written to strapi 
        mergeRecord.insightlyDateFields = {
            "DATE_CREATED_UTC": insightlyRecord.DATE_CREATED_UTC,
            "DATE_UPDATED_UTC": insightlyRecord.DATE_UPDATED_UTC
        }


        // also add social fields to be synced
        if (insightlyRecord.SOCIAL_LINKEDIN) {
            socialLinks.linkedin = insightlyRecord.SOCIAL_LINKEDIN
        }

        if (insightlyRecord.SOCIAL_FACEBOOK) {
            socialLinks.facebook = insightlyRecord.SOCIAL_FACEBOOK
        }

        if (insightlyRecord.SOCIAL_TWITTER) {
            socialLinks.twitter = insightlyRecord.SOCIAL_TWITTER
        }

        let insightlyInstagram = getInsightlyCustomField("SOCIAL_INSTRAGRAM", insightlyRecord);
        if (insightlyInstagram != "") {
            socialLinks.instagram = insightlyInstagram
        }

        let insightlyYoutube = getInsightlyCustomField("SOCIAL_YOUTUBE", insightlyRecord);
        if (insightlyYoutube != "") {
            socialLinks.youtube = insightlyYoutube
        }



        //if there are no social links, then we set socialLinks= null othwevise we ass the socialLinks object
        if (Object.keys(socialLinks).length === 0 && socialLinks.constructor === Object)
            mergeRecord.socialLinks = null;
        else
            mergeRecord.socialLinks = socialLinks;


        //Get the insightly tags
        let insightlyTagString = insightlyGetTags(insightlyRecord);
        // convet to array 
        let insightlyTagArray = string2array(insightlyTagString);
        //copy only the array items that starts with INSIGHTLY_NETWORKTAGCHAR
        let insightlyNetworksArray = filterArray(INSIGHTLY_NETWORKTAGCHAR, insightlyTagArray)
        // then return the result
        mergeRecord.networkmemberships = insightlyNetworksArray;

        // get and copy the tags that the members added
        let insightlyMemberTags = getInsightlyCustomField("member_tags", insightlyRecord).toString();
        mergeRecord.tags = string2array(insightlyMemberTags);




    } else
        console.log("Cannot import ", insightlyRecord.ORGANISATION_NAME, " Missing CKAN_NAME");




    return mergeRecord;

}


/** insightlyArray2mergeArray
 takes an insightly array and returns a merge array
 */
export function insightlyArray2mergeArray(insightlyArray) {

    let mergeArray = [];



    for (let i = 0; i < insightlyArray.length; i++) {

        let insightlyRecord = insightlyArray[i];

        let mergeRecord = insightly2mergeRecord(insightlyRecord);
        mergeArray.push(mergeRecord);

    }

    return mergeArray;

}

/** merge2insightlyRecord
 takes a merge Record (mergeRecord) and transforms it's fields to a insightly Record
 !! be aware that when updating insightly a full record must be written - fields that are not there is lost
 To prevent loss of data the function thakes a template insighty record (existingInsightlyRecord) - so read the record first then use this function

A insightly record looks like this
https://api.insightly.com/v3.1/Organisations/98965342


 */
export function merge2insightlyRecord(mergeRecord, existingInsightlyRecord) {


    
    let updatedInsightlyRecord = {};

    updatedInsightlyRecord = existingInsightlyRecord; // copy whatever is in the insightly record

    if (mergeRecord.organization.sbn_insightly && (mergeRecord.organization.sbn_insightly == existingInsightlyRecord.ORGANISATION_ID)) { // if it exists in insightly 

        updatedInsightlyRecord.ORGANISATION_NAME = mergeRecord.organization.displayName;
        updatedInsightlyRecord.BACKGROUND = mergeRecord.organization.description;
        updatedInsightlyRecord.PHONE = mergeRecord.organization.phone;
        updatedInsightlyRecord.WEBSITE = mergeRecord.organization.web;

        updatedInsightlyRecord.ADDRESS_SHIP_STREET = mergeRecord.organization.location.visitingAddress.street;
        updatedInsightlyRecord.ADDRESS_SHIP_CITY = mergeRecord.organization.location.visitingAddress.city;
        updatedInsightlyRecord.ADDRESS_SHIP_STATE = mergeRecord.organization.location.adminLocation.countyName;
        updatedInsightlyRecord.ADDRESS_SHIP_POSTCODE = mergeRecord.organization.location.visitingAddress.postcode;
        updatedInsightlyRecord.ADDRESS_SHIP_COUNTRY = mergeRecord.organization.location.visitingAddress.country;


        updatedInsightlyRecord.EMAIL_DOMAIN = mergeRecord.organization.domain;



        //CUSTOMFIELDS
        let setCustomFieldResult;

        //organization_type is ???? 
        //TODO: setCustomFieldResult = setInsightlyCustomField("organization_type", mergeRecord.organizationNumber, updatedInsightlyRecord);    



        //the social fields
        setCustomFieldResult = setInsightlyCustomField("SOCIAL_LINKEDIN", mergeRecord.organization.socialLinks.linkedin, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("SOCIAL_FACEBOOK", mergeRecord.organization.socialLinks.facebook, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("SOCIAL_TWITTER", mergeRecord.organization.socialLinks.twitter, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("SOCIAL_INSTRAGRAM", mergeRecord.organization.socialLinks.instagram, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("SOCIAL_YOUTUBE", mergeRecord.organization.socialLinks.youtube, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("SOCIAL_OTHER", mergeRecord.organization.socialLinks.otherURL, updatedInsightlyRecord);


        //slogan
        setCustomFieldResult = setInsightlyCustomField("slogan", mergeRecord.organization.slogan, updatedInsightlyRecord);

        // summary 
        setCustomFieldResult = setInsightlyCustomField("summary", mergeRecord.organization.summary, updatedInsightlyRecord);

        //email
        setCustomFieldResult = setInsightlyCustomField("ORGANIZATION_EMAIL", mergeRecord.organization.email, updatedInsightlyRecord);

        //CKAN_NAME is the idName
        setCustomFieldResult = setInsightlyCustomField("CKAN_NAME", mergeRecord.organization.idName, updatedInsightlyRecord);

        //fylke is  countyName
        setCustomFieldResult = setInsightlyCustomField("fylke", mergeRecord.organization.location.adminLocation.countyName, updatedInsightlyRecord);

        //kommunenr is  countyName
        setCustomFieldResult = setInsightlyCustomField("kommunenr", mergeRecord.organization.location.adminLocation.municipalityId, updatedInsightlyRecord);

        //Organisasjonsnummer is organizationNumber 
        setCustomFieldResult = setInsightlyCustomField("kommunenr", mergeRecord.organization.organizationNumber, updatedInsightlyRecord);


        //TODO: change brreg fields
        setCustomFieldResult = setInsightlyCustomField("BRREG_EMPLOYEES", mergeRecord.organization.brreg.employees, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("BRREG_ORGTYPE", mergeRecord.organization.brreg.orgType, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("BRREG_ESTABLISHMENT_DATE", mergeRecord.organization.brreg.foundedDate, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("BRREG_DELETE_DATE", mergeRecord.organization.brreg.endDate, updatedInsightlyRecord);


        // images
        setCustomFieldResult = setInsightlyCustomField("CKAN_LOGO_IMAGE", mergeRecord.organization.image.profile, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("COVER_IMAGE", mergeRecord.organization.image.cover, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("ICON_IMAGE", mergeRecord.organization.image.icon, updatedInsightlyRecord);
        setCustomFieldResult = setInsightlyCustomField("SQUARE_IMAGE", mergeRecord.organization.image.square, updatedInsightlyRecord);


        // fields that are in the categories 
        let sector = categoryArray2string(mergeRecord.organization.categories.sector, ";");
        setCustomFieldResult = setInsightlyCustomField("organization_type", sector, updatedInsightlyRecord);

        let member_tags = categoryArray2string(mergeRecord.organization.categories.tag, ",");
        setCustomFieldResult = setInsightlyCustomField("member_tags", member_tags, updatedInsightlyRecord);

        let organization_segments = categoryArray2string(mergeRecord.organization.categories.industry, ";");
        setCustomFieldResult = setInsightlyCustomField("organization_segments", organization_segments, updatedInsightlyRecord);

        let Sustainable_Development_Goals = categoryArray2string(mergeRecord.organization.categories.sdg, ",");
        setCustomFieldResult = setInsightlyCustomField("Sustainable_Development_Goals", Sustainable_Development_Goals, updatedInsightlyRecord);

        let problems_solved = categoryArray2string(mergeRecord.organization.categories.challenge, ";");
        setCustomFieldResult = setInsightlyCustomField("problems_solved", problems_solved, updatedInsightlyRecord);


        //EMAILDOMAINS
        updatedInsightlyRecord.EMAILDOMAINS = mergeDomains2insightly(mergeRecord.organization.domains, updatedInsightlyRecord.EMAILDOMAINS);



        //TAGS is the way we define what network the org is member of
        updatedInsightlyRecord.TAGS = mergeNetworkmemberships2insightly(mergeRecord.networkmemberships, updatedInsightlyRecord.TAGS);


    } else {  // trouble
        updatedInsightlyRecord = "none";

    }

    return updatedInsightlyRecord;


}



/** category2string
 takes a category array and put all of its items in a string separeted by delimiter
 if category is empty or not an array then "" is returned
 if there are no delimiter then it is set to ";"
 */
function categoryArray2string(category, delimiter) {

    let returnString = "";
    if (!delimiter) delimiter = ";"; // use ; if nothing defined

    if (Array.isArray(category)) { // and it is an array
        for (let i = 0; i < category.length; i++) {
            if (returnString != "") {
                returnString = returnString + delimiter; // put delimiter, but not the first time 
            }
            returnString = returnString + category[i]; //concatinate
        }
    }
    return returnString;
}

/** mergeDomains2insightly
 takes the marge domains and the existing insightly domains
 in Insightly the domains have ID' so that we need to check if a domain exists before we add it

 the structure of domains in insighty
    "EMAILDOMAINS": [
        {
            "EMAIL_DOMAIN_ID": 10396971,
            "EMAIL_DOMAIN": "abax.com"
        },
        {
            "EMAIL_DOMAIN_ID": 2212018,
            "EMAIL_DOMAIN": "abax.no"
        }
    ]
 */
function mergeDomains2insightly(mergeDomains, exisistingInsightyDomains) {

    let returnInsightlyDomains = [];
    let foundIndex;

    if (Array.isArray(mergeDomains)) { // and it is an array

        for (let i = 0; i < mergeDomains.length; i++) {
            foundIndex = 0;
            foundIndex = exisistingInsightyDomains.findIndex(domain => domain.EMAIL_DOMAIN == mergeDomains[i]);
            if (foundIndex >= 0) { // its there
                returnInsightlyDomains.push(exisistingInsightyDomains[foundIndex]); // its already there - keep it
            } else {
                let domainRecord = {
                    "EMAIL_DOMAIN": tagName
                }
                returnInsightlyDomains.push(domainRecord)
            }
        }

    }

    return returnInsightlyDomains;

}

/** mergeNetworkmemberships2insightly
 takes the merge networkmemberships and the tags in insightly.
in Insightly we use a tags to indicate what network the organization is member of.
every tag that has a # as first char is a network. 
eg #smartebyernorge.no means that the organization is mamber of the network smartebyernorge.no

the tags are usedfor other stuff also. So we must NOT mess with tags that has no #

 */
function mergeNetworkmemberships2insightly(networkmemberships, exisistingInsightyTags) {


    let returnInsightlyTags = [];

    //first copy all tags that is not a network. 
    for (let i = 0; i < exisistingInsightyTags.length; i++) {
        if (INSIGHTLY_NETWORKTAGCHAR != exisistingInsightyTags[i].TAG_NAME.slice(0, 1)) {
            returnInsightlyTags.push(exisistingInsightyTags[i])
        }
    }

    // then add the networkmemberships as tags
    for (let i = 0; i < networkmemberships.length; i++) {
        let tagRecord = {
            "TAG_NAME": INSIGHTLY_NETWORKTAGCHAR + networkmemberships[i]
        }
        returnInsightlyTags.push(tagRecord)
    }

}