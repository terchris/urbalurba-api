/* lib functions for accessing geonorge / kartverket */
/*
they have stuff here https://github.com/kartverket

*/

import axios from 'axios';






/** getLocationDataByPostAddress
*  takes road and zipcode and returns ONE (the first, and only) object as described in the "Adresse REST-API"
 *  https://ws.geonorge.no/adresser/v1/
 *   
 * TEST URL https://ws.geonorge.no/adresser/v1/sok?adressetekst=vestengkleiva%203&postnummer=1385"
 * 
 * some doc here https://kartkatalog.geonorge.no/metadata/44eeffdc-6069-4000-a49b-2d6bfc59ac61
 */
export async function getLocationDataByPostAddress(road, zipcode) {

    const GEONORGE_ADRESS_URL = "https://ws.geonorge.no/adresser/v1/sok?";

    road = encodeURIComponent(road); // encode it correctly
    let geonorgeRequestURL = GEONORGE_ADRESS_URL + "adressetekst=" + road + "&postnummer=" + zipcode
    let data = "none";
    let response;

    try {
        response = await axios.get(geonorgeRequestURL);


        if (null != response.data.metadata) { // there is a result set
            
            if (response.data.metadata.hasOwnProperty('totaltAntallTreff') ) {
                let numResponses = parseInt(response.data.metadata.totaltAntallTreff);
                if (numResponses == 1) { //only valid if there is just one response
                    data = response.data.adresser[0]; // return the one that is there
                }
            } else {            
                console.log("err getLocationDataByPostAddress no totaltAntallTreff:", JSON.stringify(response));
                debugger
            }
        } else {
            console.log("err getLocationDataByPostAddress no metadata:", JSON.stringify(response));
            debugger
        }
    }
    catch (e) {
        console.error("1.9 getLocationDataByPostAddress catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response));
        debugger
    }

    return data;

}





/** getFylkeByKommunenummer
 * 
 * TEST URL https://ws.geonorge.no/kommuneinfo/v1/kommuner/3025
 */
export async function getFylkeByKommunenummer(kommunenummer) {

    const GEONORGE_ADRESS_URL = "https://ws.geonorge.no/kommuneinfo/v1/kommuner/";


    let geonorgeRequestURL = GEONORGE_ADRESS_URL + kommunenummer
    let data = "none";
    let response;

    try {
        response = await axios.get(geonorgeRequestURL);

        if (null != response.data.fylkesnavn) { // there is a result set
            data = response.data; // return the record
        } else {
            console.log("err getFylkeByKommunenummer no fylkesnavn:", JSON.stringify(response))
            debugger
        }
            

    }
    catch (e) {
        console.error("1.9 getFylkeByKommunenummer catch error :", JSON.stringify(e), " =>result is:", JSON.stringify(response));
        debugger
    }

    return data;

}

