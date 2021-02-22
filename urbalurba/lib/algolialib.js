
/* lib functions for accessing algolia */
import algoliasearch from 'algoliasearch';

import {
    getEntityAll,
    strapi2interchangeEntityRecord

} from "./strapidatalib.js";

import {
     getNested
} from "./urbalurbalib2.js";



const ALGOLIA_APPLICATION_ID = `${process.env.ALGOLIA_APPLICATION_ID}`;
const ALGOLIA_SEARCH_ONLY_APIKEY = `${process.env.ALGOLIA_SEARCH_ONLY_APIKEY}`;
const ALGOLIA_ADMIN_APIKEY = `${process.env.ALGOLIA_ADMIN_APIKEY}`;
const ALGOLIA_INDEXNAME = `${process.env.ALGOLIA_INDEXNAME}`;


/** pushStrapi2algolia
 * takes all entities and push them to algolia.
 * NOT for updating - just push all data
 */

export async function pushStrapi2algolia() {

    let allStrapiEntitiesArray;
    let allInterchangeEntitiesArray;
    let allAlgoliaEntitiesArray;

    debugger
    console.log("start pushing data from strapi to algolia");

    if (checkConfig()) {

        allStrapiEntitiesArray = await getEntityAll();
        console.log("pushStrapi2algolia:", allStrapiEntitiesArray.length, " read from strapi");


        allInterchangeEntitiesArray = strapiEntityArray2interchangeEntityArray(allStrapiEntitiesArray);
        allAlgoliaEntitiesArray = interchangeEntityArray2algoliaEntityArray(allInterchangeEntitiesArray);


        const algoliaClient = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_ADMIN_APIKEY);
        const algoliaIndex = algoliaClient.initIndex(ALGOLIA_INDEXNAME)

        let algoliaSaveResult = await algoliaIndex.saveObjects(allAlgoliaEntitiesArray);
        let algoliaConfigResult = await algoliaIndex.setSettings({
            // Select the attributes you want to search in
            searchableAttributes: [
                'idName', 'displayName', 'slogan', 'summary', 'description', 'phone'
            ],
            // Define business metrics for ranking and sorting
            customRanking: [
                'desc(displayName)'
            ],
            // Set up some attributes to filter results on
            attributesForFaceting: [
                'networkMemberships', 'entitytype.displayName', 'categoryAnswers.displayName'
            ]
        });


        /*        
                algoliaIndex
                .saveObjects(allAlgoliaEntitiesArray)
                .then(({ objectIDs }) => {
                  console.log(objectIDs);
                  console.log(".then save finished now");
                });
                */

        console.log("Finished pushing data to algolia");
    } else {
        console.error("ALGOLIA variable problems");
    }

    let returnMsg = "pushStrapi2algolia. Pushed:" + allStrapiEntitiesArray.length + " entities";
    return returnMsg;


}


/** strapiEntityArray2interchangeEntityArray
 * 
 */
function strapiEntityArray2interchangeEntityArray(strapiArray) {
    let returnArray = [];
    let interchangeRecord = {};

    for (let i = 0; i < strapiArray.length; i++) {
        interchangeRecord = {};
        interchangeRecord = strapi2interchangeEntityRecord(strapiArray[i]);
        returnArray.push(interchangeRecord);
    }

    return returnArray;

}




/** interchangeEntityArray2algoliaEntityArray
 * 
 */
function interchangeEntityArray2algoliaEntityArray(interchangeEntityArray) {
    let returnArray = [];
    let algoliaRecord = {};

    for (let i = 0; i < interchangeEntityArray.length; i++) {
        algoliaRecord = {};
        algoliaRecord = interchange2algoliaEntityRecord(interchangeEntityArray[i]);
        returnArray.push(algoliaRecord);
    }

    return returnArray;

}



/* interchange2algoliaEntityRecord
takes a interchange record and returns a record to be exported to algolia
*/
function interchange2algoliaEntityRecord(interchangeRecord) {
    let algoliaRecord = {};

    let tmpResult;

    //fist copy the whole interchangeRecord
    algoliaRecord = JSON.parse(JSON.stringify(interchangeRecord));

    algoliaRecord.objectID = interchangeRecord.id; //algolia must have the unique id in the field objectID

    //Algolia needs the location to be formatted in a certan way - do that if the gps position is there
    tmpResult = getNested(algoliaRecord, "location", "gps");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a gps
        algoliaRecord.location._geoloc = {
            "lat": Number(getNested(algoliaRecord, "location", "latLng", "lat")),
            "lang": Number(getNested(algoliaRecord, "location", "latLng", "lng"))
        }
    }
    // should we delete the gps object since it is now redundant ?


    return algoliaRecord;

}







/** entity_categories2categoryAnswers
 * takes the entity_categories array and returns an categoryAnswers array
 */

function entity_categories2categoryAnswers(entity_categories) {
    let returnArray = [];
    let categoryRecord = {};
    let answerRecord = {};

    // for all categories
    for (let i = 0; i < entity_categories.length; i++) {
        categoryRecord = {};
        categoryRecord.idName = entity_categories[i].category.idName;
        categoryRecord.displayName = entity_categories[i].category.displayName;
        categoryRecord.answers = [];

        // for all answers to the category
        for (let j = 0; j < entity_categories[i].entity_category_answers.length; j++) {
            answerRecord = {};
            answerRecord.text = entity_categories[i].entity_category_answers[j].text;
            answerRecord.idName = entity_categories[i].entity_category_answers[j].categoryitem.idName;
            answerRecord.displayName = entity_categories[i].entity_category_answers[j].categoryitem.displayName;
            categoryRecord.answers.push(answerRecord);
        }

        returnArray.push(categoryRecord);
    }


    return returnArray;
}


/** array2idNameArray
 * takes entity_network_memberships array and return just the idNames in an array.
 * if there are none a empty array will be returned.
 */
function array2idNameArray(arrayWithIdNames) {
    let returnArray = [];

    for (let i = 0; i < arrayWithIdNames.length; i++) {
        returnArray.push(arrayWithIdNames[i].network.idName);
    }

    return returnArray;

}





/* checkConfig
chacks if the env variables are set - returns true if all OK otherwise false
*/
function checkConfig() {
    let configOK = true;


    if (ALGOLIA_APPLICATION_ID != "undefined" || ALGOLIA_APPLICATION_ID != "")
        console.log("ALGOLIA_APPLICATION_ID = OK. is set");
    else {
        console.error("ALGOLIA_APPLICATION_ID = NOT set");
        configOK = false;
    }

    if (ALGOLIA_SEARCH_ONLY_APIKEY != "undefined" || ALGOLIA_SEARCH_ONLY_APIKEY != "")
        console.log("ALGOLIA_SEARCH_ONLY_APIKEY = OK. is set");
    else {
        console.error("ALGOLIA_SEARCH_ONLY_APIKEY = NOT set");
        configOK = false;
    }

    if (ALGOLIA_ADMIN_APIKEY != "undefined" || ALGOLIA_ADMIN_APIKEY != "")
        console.log("ALGOLIA_ADMIN_APIKEY = OK. is set");
    else {
        console.error("ALGOLIA_ADMIN_APIKEY = NOT set");
        configOK = false;
    }

    if (ALGOLIA_INDEXNAME != "undefined" || ALGOLIA_INDEXNAME != "")
        console.log("ALGOLIA_INDEXNAME = OK. is set");
    else {
        console.error("ALGOLIA_INDEXNAME = NOT set");
        configOK = false;
    }



    return configOK;

}