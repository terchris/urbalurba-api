/* lib functions for accessing brreg */
// documentation for the undelying brreg API is here: https://data.brreg.no/enhetsregisteret/api/docs/index.html

import axios from 'axios';




/** getOrgByOrganisasjonsnummer
 * Takes a org ID - if found a organization is returned
 * Returns "none" is there are no org by that Organisasjonsnummer
 The data returned is described here https://data.brreg.no/enhetsregisteret/api/docs/index.html#enheter-oppslag
 */
export async function getOrgByOrganisasjonsnummer(orgNumber) {


    const BRREG_ENHETER_URL = "https://data.brreg.no/enhetsregisteret/api/enheter/";
    let brregRequestURL;

    let data = "none";
    let response;

    let validOrgNumber = "";
    let isValidOrgNumber = false;


    if (orgNumber) { // has value and is not null 

        validOrgNumber = orgNumber;
        validOrgNumber = validOrgNumber.toString(); //make sure we are dealing with a string
        validOrgNumber = validOrgNumber.trim(); // trim spaces at beginning and end
        validOrgNumber = validOrgNumber.replace(/\D/g, ''); // remove non numeric characters

        if (validOrgNumber.length == 9) // lenght must be 9 numbers
            isValidOrgNumber = true;


        if (isValidOrgNumber) { //if there is a valid number

            brregRequestURL = BRREG_ENHETER_URL + validOrgNumber;

            try {
                response = await axios.get(brregRequestURL);

                if (null != response.data.organisasjonsnummer) { // there is a result set            
                    data = response.data; // return the one that is there
                } else {
                    console.error("err getOrgByOrganisasjonsnummer no organisasjonsnummer:", JSON.stringify(response));
                }

            }
            catch (e) {
                console.error("1.9 getOrgByOrganisasjonsnummer catch error:", JSON.stringify(e, null, 2));
                debugger
            }


        } else { //no valid number
            data = "none";
        }
    } else { // has no value eg. null 
        data = "none";
    }

    return data;

}







/** getOrganizationsByName
 * Takes a organization name as parameter
 * Returns an array of organizations based on brreg fuzzy search - probably a page of 20 organizations
 The data returned is described here https://data.brreg.no/enhetsregisteret/api/docs/index.html#enheter-oppslag
 */
export async function getOrganizationsByName(orgName) {


    const BRREG_ENHETER_URL = "https://data.brreg.no/enhetsregisteret/api/enheter/";
    let brregRequestURL;
    let orgNameSearchTxt = "";
    let data = "none";
    let response;


    if (orgName) { // has value and is not null 

        orgNameSearchTxt = orgName.toString(); //make sure we are dealing with a string
        orgNameSearchTxt = orgNameSearchTxt.toUpperCase();
        orgNameSearchTxt = orgNameSearchTxt.trim();


        orgNameSearchTxt = encodeURIComponent(orgNameSearchTxt); // encode it correctly

        brregRequestURL = BRREG_ENHETER_URL + "?navn=" + orgNameSearchTxt;

        try {
            response = await axios.get(brregRequestURL);

            if (null != response.data.page) { // there is a result set            
                if (response.data.hasOwnProperty('_embedded')) {
                    if (response.data._embedded.hasOwnProperty('enheter')) {
                        data = response.data._embedded.enheter;
                    } else {
                        console.log("err getOrganizationsByName no enheter:", JSON.stringify(response));
                        debugger
                    }

                } else {
                    console.log("err getOrganizationsByName no _embedded:", JSON.stringify(response));
                    debugger
                }

            } else {
                console.log("err getOrganizationsByName no page:", JSON.stringify(response));
                debugger
            }


        }
        catch (e) {
            console.error("1.9 getOrganizationsByName catch error:", JSON.stringify(e, null, 2));
            debugger
        }


    } else { // has no value eg. null 
        data = "none";
    }

    return data;

}

/** getOneOrganizationByName
 * takes an organization name as parameter and uses getOrganizationsByName to 
 * get all a list of organizations that has a similar name.
 * Then it tries to pick the correct organization 
 * returns the selected organization or "none" if we feel that the match is not good enugh.
 */
export async function getOneOrganizationByName(orgName) {

    let orgNameSearchName = "";
    let orgNameCompareName = "";
    let sameOrgNameArray = [];
    let returnOrganization = "none";

    let organizationsArray = await getOrganizationsByName(orgName);

    if (organizationsArray != "none") {
        orgNameSearchName = orgName.toString(); //make sure we are dealing with a string
        orgNameSearchName = orgNameSearchName.toUpperCase();
        orgNameSearchName = orgNameSearchName.trim();

        if (orgNameSearchName.endsWith(" AS")) { // remove ending " AS" 
            orgNameSearchName = orgNameSearchName.substr(0, (orgNameSearchName.length - 3));
        }
        if (orgNameSearchName.endsWith(" A/S")) { // remove ending " A/S" 
            orgNameSearchName = orgNameSearchName.substr(0, (orgNameSearchName.length - 4));
        }
        if (orgNameSearchName.endsWith(" ASA")) { // remove ending " ASA" 
            orgNameSearchName = orgNameSearchName.substr(0, (orgNameSearchName.length - 4));
        }


        for (let i = 0; i < organizationsArray.length; i++) {
            orgNameCompareName = organizationsArray[i].navn.toUpperCase().trim();
            if (orgNameCompareName.endsWith(" AS")) { // remove ending " AS" 
                orgNameCompareName = orgNameCompareName.substr(0, (orgNameCompareName.length - 3));
            }
            if (orgNameCompareName.endsWith(" ASA")) { // remove ending " ASA" 
                orgNameCompareName = orgNameCompareName.substr(0, (orgNameCompareName.length - 4));
            }



            if (orgNameSearchName == orgNameCompareName) {
                sameOrgNameArray.push(organizationsArray[i]);
            }
        }

        if (sameOrgNameArray.length == 1) { //there was just one with the same name
            returnOrganization = sameOrgNameArray[0]; //then we say that this is the org
        } else { // we just say that we cant select one
            // but it might be possible to compare with other fields we have registered and make a guessing
            returnOrganization = "none";
        }



    } else { // trouble
        // might be that we could not access brreg server
        returnOrganization = "none";
    }

    return returnOrganization;
}





/** getOrgByWeb
 * Takes a domain name like www.somedoman.com or somedomain.com - if found a organization is returned
 * Returns "none" is there are no org by that domain
 The data returned is described here https://data.brreg.no/enhetsregisteret/api/docs/index.html#enheter-oppslag
 */
export async function getOrgByWeb(domainName) {


    const BRREG_ENHETER_URL = "https://data.brreg.no/enhetsregisteret/api/enheter/";
    let brregRequestURL;

    let data = "none";
    let response;


    if (domainName) { // has value and is not null 

        brregRequestURL = BRREG_ENHETER_URL + "?hjemmeside=" + domainName;

        try {
            response = await axios.get(brregRequestURL);

            if (response.data.page.totalElements > 0) { // there is a result set            
                data = response.data; // return the one that is there
            } else {
                console.log("err getOrgByWeb noone registered with web:", domainName);
            }

        }
        catch (e) {
            console.error("1.9 getOrgByWeb catch error:", JSON.stringify(e, null, 2));
            debugger
        }


    } else { //no domainName parameter
        data = "none";
    }


    return data;

}

