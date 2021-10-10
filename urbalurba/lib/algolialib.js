
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




    if (checkAlgoliaConfig()) {

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
                'idName', 'displayName', 'slogan', 'summary', 'description', 'phone', 'organizationNumber', 'domains'
            ],
            // Define business metrics for ranking and sorting
            customRanking: [
                'desc(displayName)'
            ],
            // Set up some attributes to filter results on
            attributesForFaceting: [
                'networkMemberships', 'entitytype', 'categories', 'city', 'municipalityName', 'countyName', 'country'
            ]
        });


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

    algoliaRecord.objectID = interchangeRecord.idName; //algolia must have the unique id in the field objectID

    delete algoliaRecord.id; // where did the id come from - well its gone now

    /*Algolia needs the location to be formatted in a certan way - do that if the gps position is there
    "_geoloc": {
        "lat": 40.639751,
        "lng": -73.778925
        }
    */
    tmpResult = getNested(interchangeRecord, "location", "latLng");
    if ((tmpResult != undefined) && (tmpResult != null)) { // there is a gps
        algoliaRecord._geoloc = {
            "lat": Number(getNested(interchangeRecord, "location", "latLng", "lat")),
            "lng": Number(getNested(interchangeRecord, "location", "latLng", "lng"))
        }
        delete algoliaRecord.location.latLng; // elete the gps object since it is now redundant
    }

    /* categoryAnswers to do filtering we need to format the categories we need to format categories 
    according to https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/#hierarchical-facets
*/

    algoliaRecord.categories = [];
    // for all categories
    for (let i = 0; i < interchangeRecord.categoryAnswers.length; i++) {

        let categoryRecord = {};
        categoryRecord[interchangeRecord.categoryAnswers[i].displayName] = [];
        for (let j = 0; j < interchangeRecord.categoryAnswers[i].answers.length; j++) { // loop the answers
            let theAnswer = interchangeRecord.categoryAnswers[i].answers[j].displayName;
            categoryRecord[interchangeRecord.categoryAnswers[i].displayName].push(theAnswer);
        }
        algoliaRecord.categories.push(categoryRecord);
    }
    delete algoliaRecord.categoryAnswers;



    // entitytype 
    algoliaRecord.entitytype = getNested(interchangeRecord, "entitytype", "displayName");

    // image
    algoliaRecord.image = getNested(interchangeRecord, "image", "profile");

    // organizationNumber
    algoliaRecord.organizationNumber = getNested(interchangeRecord, "brreg", "organizationNumber");
    delete algoliaRecord.brreg;



    // city municipalityName countyName country
    algoliaRecord.city = getNested(interchangeRecord, "location", "visitingAddress", "city");
    algoliaRecord.municipalityName = getNested(interchangeRecord, "location", "adminLocation", "municipalityName");
    algoliaRecord.countyName = getNested(interchangeRecord, "location", "adminLocation", "countyName");
    algoliaRecord.country = getNested(interchangeRecord, "location", "visitingAddress", "country");
    delete algoliaRecord.location;

    return algoliaRecord;

}












/* checkAlgoliaConfig
checks if the env variables are set - returns true if all OK otherwise false
*/
function checkAlgoliaConfig() {
    let configOK = true;


    if (ALGOLIA_APPLICATION_ID == "undefined" || ALGOLIA_APPLICATION_ID == "") {
        console.error("checkAlgoliaConfig: ALGOLIA_APPLICATION_ID = NOT set");
        configOK = false;
    }

    if (ALGOLIA_SEARCH_ONLY_APIKEY == "undefined" || ALGOLIA_SEARCH_ONLY_APIKEY == "") {
        console.error("checkAlgoliaConfig: ALGOLIA_SEARCH_ONLY_APIKEY = NOT set");
        configOK = false;
    }

    if (ALGOLIA_ADMIN_APIKEY == "undefined" || ALGOLIA_ADMIN_APIKEY == "") {
        console.error("checkAlgoliaConfig: ALGOLIA_ADMIN_APIKEY = NOT set");
        configOK = false;        
    }

    if (ALGOLIA_INDEXNAME == "undefined" || ALGOLIA_INDEXNAME == "") {
        console.error("checkAlgoliaConfig: ALGOLIA_INDEXNAME = NOT set");
        configOK = false;           
    }

    return configOK;

}