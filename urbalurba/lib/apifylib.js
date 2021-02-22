/* lib functions for accessing apify */
import axios from 'axios';

const NORSKEIENDOM_MEMBER_LIST = "https://api.apify.com/v2/datasets/E7WjaPncy4TcI9Uin/items";



const APIFY_URL_INPUT_GOOGLESHEET = "https://docs.google.com/spreadsheets/d/1YVx38Tj06fz9FLDUTu4N_nV5Vnb3HwuxVrGrR_wR2EQ/gviz/tq?tqx=out:csv";

/*Runs this actor task and waits for its finish. Optionally, the POST payload can contain a JSON object whose fields override the actor input configuration. Beware that the HTTP connection might time out for long-running actors.*/
export const APIFY_WEBPAGE_CONTACT_INFO_START = "https://api.apify.com/v2/actor-tasks/terchris~get-social-links/run-sync?token=w8Zgfm2tvPRdHeSRYPtn4FzEJ";

export const APIFY_WEBPAGE_CONTACT_INFO_RESULT = "https://api.apify.com/v2/datasets/xRQBW4HStdLvWc0jh/items?clean=true&format=json";



/* twitter api links
https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-users-profile_banner



*/


/** getApifyResultArray
 * gets the result set from apify
 * if it goes wrong then "none" is returned.
 */
export async function getApifyResultArray(resultURL) {

    let data = "none"
    let result;

    try {
        result = await axios.get(resultURL);
        data = result.data;
    }
    catch (e) {
        console.error("1.9 getyApifyResultArray catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(result));
        debugger
    }

    return data;

}

/** startApifyTask
 * starts an apify task and waits for it to finish
 * 
 * return "OK" if all is fine
 */
//TODO: add parameter that contain input values to the task
export async function startApifyTask(taskURL) {

    let data = "none"
    let result;

    try {
        result = await axios.get(taskURL);
        data = result.data;
    }
    catch (e) {
        console.error("1.9 startApifyTask catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(result));
        debugger
    }

    return data;

}



/** getScrapedURL
 * takes an array of facebook links found on a scraped page
 * if there are none then "none" is returned
 * otherwise the first item in the array is returned... (not a complex function)
 */
export function getScrapedURL(urlArray) {

    let returnURL = "none";

    if (Array.isArray(urlArray)) { // and it is an array
        if (urlArray.length >= 1) { //and it contains one or more links
            if (urlArray[0]) { // cant be null or undefined
                returnURL = urlArray[0]; //return the first element in the array
            }
            
        }
    }
    return returnURL;
}


/** getScrapedPhone
 * takes an array of phone numbers found on a scraped page
 * if there are none then "none" is returned

 we can make this more advanced, but it will do for now
 */
export function getScrapedPhone(phoneArray) {

    let returnURL = "none";
    let counter = 0;

    if (Array.isArray(phoneArray)) { // and it is an array
        if (phoneArray.length >= 1) { //and it contains one or more items

            for (counter = 0; counter < phoneArray.length; counter++) { //loop
                phoneArray[counter] = phoneArray[counter].replace(/[^a-z0-9+]/g, ''); //remove chars that are not  
            }
            returnURL = phoneArray[0]; //return the first element in the array
        }
    }
    return returnURL;
}

/** createApifyUrlList
 * takes an array (insightlyArray) 
 * and the name of the field containing the url (urlName)
 */
export async function createApifyUrlList(insightlyArray, urlName) {

    let returnArray = [];
    let counter = 0;
    let url = "";
    let pos = -1;

    if (Array.isArray(insightlyArray)) { // and it is an array

        for (counter = 0; counter < insightlyArray.length; counter++) { //loop
            url = "";
            pos = -1;
            url = insightlyArray[counter][urlName];
            if (url) {
                pos = url.indexOf("http");
                if (pos == -1)  // does not have http or https
                    url = "http://" + url //just add http is there is none

                returnArray.push(url);
            } else { // no url
                console.error("createApifyUrlList: (" + (counter + 1) + "/" + insightlyArray.length + ") Empty " + urlName);
            }

        }


    }
    return returnArray;



}