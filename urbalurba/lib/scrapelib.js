/* functions for 
- communication with strapi backend
- converting+++
22mar21- in the urbalurba-api
*/



import axios from 'axios';

import { string2IdKey } from "./strapidatalib.js";
import { getNested } from "./urbalurbalib2.js";


const MERGE_DATASET = "merges";


/** getAllMerges
*/
async function getAllMerges(config) {


    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET;
    let data = "none"
    let result;

    try {
        result = await axios.get(strapiRequestURL, {
            headers: {
                Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                'Content-Type': 'application/json'
            }
        });
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 getAllMerges catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};


/** getMergesByIdNameANDentitytype
 get (should be just one) Merge by idName and entitytype
 */
async function getMergesByIdNameANDentitytype(config, idName, entitytype) {


    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "?entitytype=" + entitytype + "&idName=" + idName;
    let data = "none"
    let result;

    try {
        result = await axios.get(strapiRequestURL, {
            headers: {
                Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                'Content-Type': 'application/json'
            }
        });
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 getMergesByIdNameANDentitytype catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};


/** getMergesByEntitytypeANDstatus
Gets all merges by entitytype and jobStatus.
used to get all ?
 */

async function getMergesByEntitytypeANDstatus(config, entitytype, jobStatus) {


    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "?entitytype=" + entitytype + "&jobStatus=" + jobStatus;
    let data = "none"
    let result;

    try {
        result = await axios.get(strapiRequestURL, {
            headers: {
                Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                'Content-Type': 'application/json'
            }
        });
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 getMergesByEntitytypeANDstatus catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};






/** updateMerge
 updates a record in the merge dataset
 */
async function updateMerge(config, newData, idName, jobStatus, mergeID, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, jobLog) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "/" + mergeID;

    jobLog = addJobLog(config.JOBNAME, jobStatus, jobLog);


    let mergeRecord = {
        idName: idName,

        data: newData,

        jobName: config.JOBNAME,
        jobLog: jobLog,
        jobStatus: jobStatus
    };

    if (urbalurbaIdName) {
        mergeRecord.urbalurbaIdName = urbalurbaIdName;
    }

    if (organizationNumber) {
        mergeRecord.organizationNumber = organizationNumber;
    }

    if (sbn_insightly) {
        mergeRecord.sbn_insightly = sbn_insightly;
    }

    if (domain) {
        mergeRecord.domain = domain;
    }

    if (web) {
        mergeRecord.web = web;
    }




    let data = "none";
    let result;

    try {

        result = await axios(
            {
                url: strapiRequestURL,
                method: 'put',
                headers: {
                    Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(mergeRecord)
            }
        );
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 updateMerge catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};


/** createMerge
 creates a new record in the merge dataset
 */
async function createMerge(config, newData, idName, jobStatus, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET;

    let jobLog = null; // jobLog does not exist the first time
    jobLog = addJobLog(config.JOBNAME, jobStatus, jobLog);

    let mergeRecord = {
        idName: idName,
        entitytype: config.ENTITYTYPE_OUTPUT,

        data: newData,

        jobName: config.JOBNAME,
        jobLog: jobLog,
        jobStatus: jobStatus
    };

    if (urbalurbaIdName) {
        mergeRecord.urbalurbaIdName = urbalurbaIdName;
    }

    if (organizationNumber) {
        mergeRecord.organizationNumber = organizationNumber;
    }

    if (sbn_insightly) {
        mergeRecord.sbn_insightly = sbn_insightly;
    }

    if (domain) {
        mergeRecord.domain = domain;
    }

    if (web) {
        mergeRecord.web = web;
    }


    let data = "none";
    let result;

    try {

        result = await axios(
            {
                url: strapiRequestURL,
                method: 'post',
                headers: {
                    Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(mergeRecord)
            }
        );
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 createMerge catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};

/** addJobLog
takes the jobLogField on the merge record as parameter.
adds a new attribute to the field.
The attribute looks like this:
{
    "1": { 
        date: time of update
        jobName: the name of the job that updated the merge record
        jobStatus: the result of the update - if any
    }
} 
 */
function addJobLog(jobName, jobStatus, jobLogField) {

    if (!jobLogField) { // first time
        jobLogField = {
            jobNumber: 0
        }
    }

    jobLogField.jobNumber = jobLogField.jobNumber + 1;
    jobLogField[jobLogField.jobNumber] = {
        date: new Date().toISOString(),
        jobName: jobName,
        jobStatus: jobStatus
    }

    return jobLogField;

}


/** setJobStatus
 set the jobStatus for a jobName
 */
export async function setJobStatus(config, mergeID, jobName, jobStatus, jobLog) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "/" + mergeID;


    jobLog = addJobLog(jobName, jobStatus, jobLog);


    //config values
    let scrapeRecord = {
        jobName: jobName,
        jobStatus: jobStatus,
        jobLog: jobLog
    }


    let data = "none";
    let result;

    try {

        result = await axios(
            {
                url: strapiRequestURL,
                method: 'put',
                headers: {
                    Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(scrapeRecord)
            }
        );
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 setJobStatus catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;




}




/* pushData
* Checks if there is a record with ids idName AND entitytype
* if there is - then the record is updated with the latest jsonScrapeData
* if not- then the recod is created.
*/
export async function pushData(config, data, idName, entitytype, jobStatus) {

    let returnResult = "none";


    if (!idName) idName = config.IDNAME;
    if (!entitytype) entitytype = config.ENTITYTYPE_OUTPUT;


    if (!jobStatus) jobStatus = config.JOBSTATUS_OUTPUT;

    let jobName = config.JOBNAME; //any reason for a parameter?


    let organizationNumber = null;
    let urbalurbaIdName = null;
    let sbn_insightly = null;
    let domain = null;
    let web = null;

    let mergeArray = await getMergesByIdNameANDentitytype(config, idName, entitytype);

    if (mergeArray.length == 0) { // there is no previous record


        let newData = {};
        newData[config.DATA_SECTION_OUTPUT] = {};
        newData[config.DATA_SECTION_OUTPUT][jobName] = data;
        urbalurbaIdName = data.urbalurbaIdName; //assume there is
        organizationNumber = data.organizationNumber; //assume there is        
        sbn_insightly = data.sbn_insightly; //assume there is
        domain = data.domain; //assume there is
        web = data.web; //assume there is

        let mergeRecord = await createMerge(config, newData, idName, jobStatus, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web);


        if (mergeRecord == "none") { // there is was an error
            console.error("pushData: Error creating scraping for:" + idName);
            returnResult = "Error"
        } else {
            console.log("pushData: Created scraping for:" + idName);
            returnResult = "OK"
        }
    } else { // there is a previous merge record - we will update it


        console.log("pushData: idName:" + idName + " already has entitytype=" + entitytype);

        let existingData = mergeArray[0].data; // pick the first one                    
        if (!existingData.hasOwnProperty(config.DATA_SECTION_OUTPUT)) { // no secttion
            existingData[config.DATA_SECTION_OUTPUT] = {};
        }

        existingData[config.DATA_SECTION_OUTPUT][jobName] = data; //update info from the source    

        // get all the top level ID's

        if (mergeArray[0].urbalurbaIdName) { //if there is a urbalurbaIdName
            urbalurbaIdName = mergeArray[0].urbalurbaIdName; //keep the initial 
        } else {
            urbalurbaIdName = data.urbalurbaIdName; //if not take the one from the new data
        }



        if (mergeArray[0].organizationNumber) { // we have a organizationNumber
            organizationNumber = mergeArray[0].organizationNumber; // keep the initial
        } else { // we take whatever is here
            organizationNumber = data.organizationNumber;
        }



        if (mergeArray[0].sbn_insightly) { // we have a insightly ID
            sbn_insightly = mergeArray[0].sbn_insightly; // keep the initial
        } else { // we take whatever is here
            sbn_insightly = data.sbn_insightly;
        }

        if (mergeArray[0].domain) { // we have a domain
            domain = mergeArray[0].domain; // keep the initial
        } else { // we take whatever is here
            domain = data.domain;
        }

        if (mergeArray[0].web) { // we have a web
            web = mergeArray[0].web; // keep the initial
        } else { // we take whatever is here
            web = data.web;
        }






        let updateMergeRecordResult = await updateMerge(config, existingData, idName, jobStatus, mergeArray[0].id, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, mergeArray[0].jobLog);

        if (updateMergeRecordResult == "none") { // there is was an error
            console.error("pushData: Error updating scraping for:" + idName);
            returnResult = "Error"
        } else {
            console.log("pushData: Updated scraping for:" + idName);
            returnResult = "OK"
        }
    }
    return returnResult;

}


/** getFirstReadyNetwork
 * Get one of the merge records that contain a membership list that is Ready to be scraped
 * returns one scrapeRecord or "none" if there isnt any or we have problems
 */
async function getFirstReadyNetwork(config) {

    let firstMergeRecord = "none"; //indicate problem
    let mergedRecordArray = [];

    let jobStatusInput = config.JOBSTATUS_INPUT;
    let entitytypeInput = config.ENTITYTYPE_INPUT;

    mergedRecordArray = await getMergesByEntitytypeANDstatus(config, entitytypeInput, jobStatusInput);

    if (mergedRecordArray.length > 0) { // there are ready 
        firstMergeRecord = mergedRecordArray[0]; // we pick the first one
    } else {
        console.log("getFirstReadyNetwork: No ready member lists");
    }

    return firstMergeRecord;

}

/** createEntities
 * gets the first scanned memberlist that is Ready.
 * creates en entry for each member 
 * returns false if there are no more networks that we can split into entries.
 */

export async function createEntities(config) {

    let moreReadyNetworks = true; // there might be more networks to split
    let firstNetwork = await getFirstReadyNetwork(config);


    if (firstNetwork != "none") { //we have a list to work on

        let statusResult;

        statusResult = await setJobStatus(config, firstNetwork.id, config.JOBNAME, "Running", firstNetwork.jobLog); // mark the network so that we know it is running

        //inside the data property there should be just one property.And that property should have the jobName of the job that created it
        // since that can be lots of jobName's we must list them to find its name. Then pick that name
        let dataProperties = Object.getOwnPropertyNames(firstNetwork.data[config.DATA_SECTION_INPUT]); //get list of all property names
        let jobName = "";
        if (dataProperties.length > 0) {
            jobName = dataProperties[0]; // get the name of the job that created the property that contains the members

            // loop all members in the list and create one mergeRecord for each member
            let members = firstNetwork.data[config.DATA_SECTION_INPUT][jobName];
            for (let member = 0; member < members.length; member++) {
                let idName = members[member].domain;
                if (idName) {
                    let existingMergeRecordArray = await getMergesByIdNameANDentitytype(config, idName, config.ENTITYTYPE_OUTPUT);
                    if (existingMergeRecordArray.length == 0) { // there is no previous record      

                        let newData = {};
                        newData[config.DATA_SECTION_OUTPUT] = {};
                        newData[config.DATA_SECTION_OUTPUT][jobName] = members[member];

                        // get all the top level ID's
                        let urbalurbaIdName = members[member].urbalurbaIdName;
                        let organizationNumber = members[member].organizationNumber;
                        let sbn_insightly = members[member].sbn_insightly;
                        let domain = members[member].domain;
                        let web = members[member].web;
                        web = addWebProtocol(web); // there is a posibility that the web address does not contain http:// or https://        

                        let createResult = await createMerge(config, newData, idName, config.JOBSTATUS_OUTPUT, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web);
                        if (createResult == "none") { // there is was an error
                            console.error("createEntities: (" + member + ") idName:" + idName + " Error creating");
                        } else {
                            console.log("createEntities: (" + member + ") idName:" + idName + " Created");
                        }
                    } else {
                        console.log("createEntities: (" + member + ") idName:" + idName + " already has entitytype=" + config.ENTITYTYPE_OUTPUT);

                        let updatedData = existingMergeRecordArray[0].data; // there should be only one - pick the first one                    
                        updatedData[config.DATA_SECTION_OUTPUT][jobName] = members[member]

                        // get all the top level ID's
                        let urbalurbaIdName = "";
                        if (existingMergeRecordArray[0].urbalurbaIdName) { //if there is a urbalurbaIdName
                            urbalurbaIdName = existingMergeRecordArray[0].urbalurbaIdName; //keep the initial 
                        } else {
                            urbalurbaIdName = members[member].urbalurbaIdName; //if not take the one from the new data
                        }

                        let organizationNumber = "";
                        if (existingMergeRecordArray[0].organizationNumber) { // we have a organizationNumber
                            organizationNumber = existingMergeRecordArray[0].organizationNumber; // keep the initial
                        } else { // we take whatever is here
                            organizationNumber = members[member].organizationNumber;
                        }

                        let sbn_insightly = "";
                        if (existingMergeRecordArray[0].sbn_insightly) { // we have a insightly ID
                            sbn_insightly = existingMergeRecordArray[0].sbn_insightly; // keep the initial
                        } else { // we take whatever is here
                            sbn_insightly = members[member].sbn_insightly;
                        }

                        let domain = "";
                        if (existingMergeRecordArray[0].domain) { // we have a domain
                            domain = existingMergeRecordArray[0].domain; // keep the initial
                        } else { // we take whatever is here
                            domain = members[member].domain;
                        }

                        let web = "";
                        if (existingMergeRecordArray[0].web) { // we have a domain
                            web = existingMergeRecordArray[0].web; // keep the initial
                        } else { // we take whatever is here
                            web = members[member].web;
                        }
                        web = addWebProtocol(web);

                        let updateResult = await updateMerge(config, updatedData, idName, config.JOBSTATUS_OUTPUT, existingMergeRecordArray[0].id, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, existingMergeRecordArray[0].jobLog);
                        if (updateResult == "none") { // there is was an error
                            console.error("createEntities: Error cannot update idName=" + idName);
                        } else {
                            console.log("createEntities: Updated idName=" + idName);
                        }

                    }

                } else {
                    console.log("createEntities: (" + member + ")No idName:" + idName + " skipping");
                }

            }


            // Finished updating - now we mark it finished
            statusResult = await setJobStatus(config, firstNetwork.id, firstNetwork.jobName, "Finished", firstNetwork.jobLog);


        } else {
            console.error("createEntities: we are in a shit of trouble");
            debugger;
        }








    } else {
        console.log("createEntities: No ready member lists");
        moreReadyNetworks = false; // we now know thatthere are no more ready networks to split
    }


    return moreReadyNetworks;

}





/***  useEmailAsDomain
 checks if the email can be used as domain. 
 when there is no domain name we can check if the email provided has a domain that can be used.
 If the email is not one of the public providers we will used it.

returns a domain name if it can be used - if not ""

*/
export function useEmailAsDomain(email) {

    // if the list is not good then try tis list https://gist.github.com/ammarshah/f5c2624d767f91a7cbdc4e54db8dd0bf
    const publicEmailDomains = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
        "yahoo.com",
        "aol.com",
        "mail.com",
        "me.com",
        "online.no"
    ];

    let returnDomainname = ""
    let tmpUrl = "";

    let pos = email.search("@");
    if (pos != -1) { // there is a @ there
        email = email.slice(pos + 1); //assume all after the @ is a domain name


        let found = publicEmailDomains.findIndex(domain => domain === email); // check if it is one of the public email provisers
        if (-1 == found) { // not a public email - do more testing
            tmpUrl = "http://" + email; // adding so that we create what can be a valid url
            try {
                tmpUrl = new URL(tmpUrl); // can cause error if it is not a valid web address
                returnDomainname = tmpUrl.hostname; // if we can get a domain from it - then we return it
            }
            catch (e) { // the web address is not valid
                console.log("Invalid email :" + email);
            }

        }
    }



    return returnDomainname;

}


/** domainFromWeb
 * takes a web address. If the domain name can be extracted from it 
 * if there is a www.domainname.no then www. is removed
 * then the domain name is returned - if not then "" is returned
 */
export function domainFromWeb(web) {

    let returnDomainname = "";

    if ((web != "") && (web != null) && (web != undefined)) { // there is a web address

        web = addWebProtocol(web); // there is a posibility that the web address does not contain http:// or https://        

        try {
            let tmpUrl = new URL(web); // can cause error if it is not a valid web address
            let hostname = tmpUrl.hostname;

            if (hostname) {
                var n = hostname.indexOf("www.");
                if (n == 0)
                    returnDomainname = hostname.slice(4);
                else
                    returnDomainname = hostname;
            }
        }
        catch (e) { // the web address is not valid
            console.log("Invalid web:" + web);
        }

    }

    return returnDomainname;

}



/** findLinkText
 * searches all links on the page for a link that starts with linkText (in href and the text on the link)
 * returns the link or "" when not found
 * @param {*} linkText 
 * @param {*} $ 
 */
export function findLinkText(linkText, $) {
    let returnURL = "";
    let allLinks = $("a");
    linkText = linkText.toUpperCase();
    let linkTextLen = linkText.length;
    let linkHref = linkText;
    let endingSpace = linkText.endsWith(" ");
    if (endingSpace) {
        linkHref = linkHref.substr(0, linkTextLen - 1) + "-"; //replace ending space 
    }

    for (let i = 0; i < allLinks.length; i++) {

        let currentLinkHref = $(allLinks[i]).attr('href')
        if ((currentLinkHref != undefined) || (currentLinkHref != null)) { //sometime its undefined, dont know why
            currentLinkHref = currentLinkHref.trim().toUpperCase();

            //there might be a long path with several /path/path/
            let slashPos = currentLinkHref.lastIndexOf("/");
            if (slashPos != -1) {
                currentLinkHref = currentLinkHref.slice(slashPos + 1);
            }
            let currentLinkTxt = $(allLinks[i]).text().trim().toUpperCase();

            if ((linkHref == currentLinkHref.slice(0, linkTextLen)) || (linkText == currentLinkTxt.slice(0, linkTextLen))) {
                returnURL = $(allLinks[i]).attr('href'); //select the first that matches
                break;
            }
        } else {
            //console.log("allLinks[" + i + "] = " + $(allLinks[i]).text());
        }

    };

    return returnURL;
}



/** pageImages2Array
 receives a html page as $ parameter - returns an array containing all images and their properties
 if no images found it returns an empty array
 */
export async function pageImages2Array($) {

    let returnImageArray = [];
    let allImages = $("img");

    for (let i = 0; i < allImages.length; i++) {

        returnImageArray.push({
            src: $(allImages[i]).attr('src'),
            alt: $(allImages[i]).attr('alt'),
            width: $(allImages[i]).attr('width'),
            height: $(allImages[i]).attr('height'),
            style: $(allImages[i]).attr('style'),
            class: $(allImages[i]).attr('class'),
            data_src: $(allImages[i]).attr('data-src'),
            href: $(allImages[i]).attr('href')
        });

    }

    return returnImageArray;

}

/** companyName2displayName
 takes a company name and removes AS or ASA eg "Fjordkraft AS" becomes "Fjordkraft"
 */
//TODO: make it smarter so that we have an aray of teksts - add "IKS"
function companyName2displayName(companyName) {


    const removeEndings = [
        " ASA",
        " AS",
        " AB",
        " IKS"
    ];

    let tmpCompanyName = ""
    let pos = 0;
    companyName = companyName.trim(); //no spaces in beginning or end
    tmpCompanyName = companyName.toUpperCase();


    for (let i = 0; i < removeEndings.length; i++) {

        if (tmpCompanyName.endsWith(removeEndings[i])) {
            pos = tmpCompanyName.lastIndexOf(removeEndings[i]);
            if (-1 != pos) {
                companyName = companyName.slice(0, pos);
                tmpCompanyName = tmpCompanyName.slice(0, pos);
                break; // stop looping
            }
        }


    }




    companyName = companyName.trim();
    return companyName;

}







/** name2UrbalurbaIdName
takes a name and converts it to a urbalurba idName
returns a idName 

 */
export function name2UrbalurbaIdName(displayName) {


    displayName = companyName2displayName(displayName); //make sure there are no AS / ASA

    displayName = string2IdKey(displayName);


    return displayName;

}



/** getMergesByJobANDjobStatus
Gets all merge records with jobName= and jobStatus=
*/
export async function getMergesByJobANDjobStatus(config, jobName, jobStatus) {


    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "?jobName=" + jobName + "&jobStatus=" + jobStatus + "&entitytype=" + config.ENTITYTYPE_INPUT;
    let data = "none"
    let result;

    try {
        result = await axios.get(strapiRequestURL, {
            headers: {
                Authorization: `Bearer ${config.STRAPI_APIKEY}`,
                'Content-Type': 'application/json'
            }
        });
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 getMergesByJobANDjobStatus catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};




/** getJobArray_web
  Gets the web links to for the merge record that has jobName
 */
export async function getJobArray_web(config, jobName) {

    let returnJobArray = [];

    let jobArray = await getMergesByJobANDjobStatus(config, jobName, config.JOBSTATUS_INPUT);

    if (jobArray.length > 0) { // we got some jobs

        for (let i = 0; i < jobArray.length; i++) {
            let mergeRecord = jobArray[i];


            // we must look at all the memberships for one entry and see if here is a web property. If there is more than one -- what then ?
            let membershipArray = Object.getOwnPropertyNames(mergeRecord.data[config.DATA_SECTION_INPUT]); //get list of all memberships

            for (let prop = 0; prop < membershipArray.length; prop++) { // loop all memberships 
                let name = membershipArray[prop];
                let currentMembership = mergeRecord.data[config.DATA_SECTION_INPUT][name];
                let web = getNested(currentMembership, "web"); // get value of property web - if there is one
                if (web) { // web has a value
                    console.log("getJobArray_web: (" + i + ") idName:" + mergeRecord.idName + " web:" + web + " found");
                    // there is a posibility that the web address does not contain http:// or https://        
                    if ((-1 == web.search("http://")) && (-1 == web.search("https://"))) {
                        web = "http://" + web; //just add http
                    }

                    let webObject = {
                        url: web,
                        userData: {
                            domain: mergeRecord.idName,
                            id: mergeRecord.id,
                            jobLog: mergeRecord.jobLog
                        }
                    }


                    // we should now have a web - skip looping the rest f the memberships for this entity
                    returnJobArray.push(webObject);
                    break; // stop looping/looking for other web properties for this 

                }


            }


        }

    }

    return returnJobArray; //
}


/** getJobFacebookArray
returns a list of object that contains the facebook pages to be scraped

 */
async function getJobFacebookArray(job) {

    let jobFacebookArray = [];

    let jobArray = await getMergesByJobANDjobStatus(config, job, "Ready");

    if (jobArray.length > 0) { // we got some jobs

        for (let i = 0; i < jobArray.length; i++) {
            let scrapeRecord = jobArray[i];


            // we must look at all the info's for one entry and see if here is a facebook property. If there is more than one -- what then ?
            let infoArray = Object.getOwnPropertyNames(scrapeRecord.jsonScrapeData.info); //get list of all info's

            for (let prop = 0; prop < infoArray.length; prop++) { // loop all memberships 
                let name = infoArray[prop];
                let currentMembership = scrapeRecord.jsonScrapeData.info[name];
                let facebook = getNested(currentMembership, "facebook"); // get value of property facebook - if there is one
                if (facebook) { // facebook has a value

                    // now we must find the facebook about page

                    facebook = facebook.toLowerCase(); // make sure we are dealing with lowercase

                    // there is a posibility that the web address does not contain http:// or https://        
                    if ((-1 == facebook.search("http://")) && (-1 == facebook.search("https://"))) {
                        facebook = "https://" + facebook; //just add https
                    }
                    // we must use https when accessing facebook                    
                    facebook = facebook.replace("http:", "https:");

                    // we target the simpler mobile site
                    facebook = facebook.replace("www.", "mobile.");

                    // we target the simpler mobile site - but not the m.facebook.com
                    facebook = facebook.replace("m.", "mobile.");

                    // if the url is facebook.com/pagename - we add mobile.
                    if (facebook.startsWith("facebook.com", 8)) { //is it facebook.com just after the https:// ?
                        facebook = "https://mobile." + facebook.slice(8); //add mobile. at the beginning
                    }



                    let facebookObject = {
                        url: facebook,
                        userData: {
                            domain: scrapeRecord.idName,
                            id: scrapeRecord.id
                        }
                    }

                    // we should now have a facebook - skip looping the rest 
                    jobFacebookArray.push(facebookObject);
                    break; // stop looping/looking for other web properties for this 

                }


            }


        }

    }

    return jobFacebookArray; //
}





/** maestro
 
TODO: doc is wrong - udate it!
maestro is the one that start jobs 
all other jobs must give control back to maestro when they finish

The jobs have these statuses

idName - ScrapeIdName - Status - Job - JobStatus - Source


1. Import of organizations
What: the jobs like "avfallnorge-no-members" are the ones that scrape member lists. 
Start: whenever
Output: One scraperecord that has a list of members
Stop: ScrapeIdName=members and Status=Ready / Job=maestro JobStatus=Ready

2. members2organization
What: splits the scrapedmember lists into separate organizations. One scraperecord pr member
Start: ScrapeIdName=members and Status=Ready
Output: one scraperecord pr member
Stop: 
- for the newly created scraperecord: ScrapeIdName=organization and Status=Ready / Job=maestro JobStatus=Ready
- for the scraperecord containing the list of members: ScrapeIdName=members and Status=Finished

0. maestroPrepareWebpageInfo
What: put all organizations that a) has webpage field into scraping queue for webpage-info and
b) webpage is not already scraped
Start: every time maestro runs
Output: opdates Job and JobStatus
Stop: Job=webpage-info JobStatus=Ready

3. webpage-info
What: scrapes all web pages ready to be scraped
Start: Job=webpage-info JobStatus=Ready
Output: updates every scraperecord with webpage info 
Stop: Job=maestro JobStatus=Ready

0. maestro.prepareFacebookInfo
What: put all organizations that a) has facebook field into scraping queue for facebook-info and
b) facebook is not already scraped
Start: every time maestro runs
Output: opdates Job and JobStatus
Stop: Job=facebook-info JobStatus=Ready

4. facebook-info
What: scrapes all facebook pages ready to be scraped
Start: Job=facebook-info JobStatus=Ready
Output: updates every scraperecord with facebook info 
Stop: Job=maestro JobStatus=Ready

0. maestro.prepareTwitterInfo
What: put all organizations that a) has twitter field into scraping queue for twitter-info and
b) twitter is not already scraped
Start: every time maestro runs
Output: opdates Job and JobStatus
Stop: Job=twitter-info JobStatus=Ready


4. twitter-info
What: scrapes all twitter pages ready to be scraped
Start: Job=twitter-info JobStatus=Ready
Output: updates every scraperecord with twitter info 
Stop: Job=maestro JobStatus=Ready

0. maestro.prepareBrregInfo
What: put all organizations that a) has organizationnumber field into scraping queue for twitter-info and
b) twitter is not already scraped
Start: every time maestro runs
Output: opdates Job and JobStatus
Stop: Job=twitter-info JobStatus=Ready

5. brreg-info
What: scrapes all twitter pages ready to be scraped
Start: Job=twitter-info JobStatus=Ready
Output: updates every scraperecord with twitter info 
Stop: Job=maestro JobStatus=Ready







 */
export async function maestro(config) {


    const jobList = [
        {
            number: 1,
            previousJobName: "members2organization",
            getJobStatus: "Finished",
            nextJobName: "webpage-info",
            setJobStatus: "Ready",
            nextJobStartUrl: "https://jalla.com"

        },
        {
            number: 2,
            previousJobName: "webpage-info",
            getJobStatus: "Finished",
            nextJobName: "brreg-orgnum,brreg-web",
            setJobStatus: "Ready",
            nextJobStartUrl: "https://jalla.com"
        }
    ];


    let finishedJobArray = [];
    let totQued =0;

    for (let i = 0; i < jobList.length; i++) { // loop the list of job types

        finishedJobArray = await getMergesByJobANDjobStatus(config, jobList[i].previousJobName, jobList[i].getJobStatus);

        for (let readyJob = 0; readyJob < finishedJobArray.length; readyJob++) { //loop the ready jobs


            if (jobList[i].number == 2) { // after web-info we must do one of two lookups depending on if we have a org number or not
                if (finishedJobArray[readyJob].organizationNumber ) { // if we have a org num
                    let setJobResult = await setJobStatus(config, finishedJobArray[readyJob].id, "brreg-orgnum", jobList[i].setJobStatus, finishedJobArray[readyJob].jobLog);
                    console.log("maestro: (" + readyJob + ") idName:" + finishedJobArray[readyJob].idName + " previousJobName:" + jobList[i].previousJobName + " ==> " + "brreg-orgnum");
                    totQued++;
                } else { //there is no orgnum - we will try using web 
                    let setJobResult = await setJobStatus(config, finishedJobArray[readyJob].id, "brreg-web", jobList[i].setJobStatus, finishedJobArray[readyJob].jobLog);
                    console.log("maestro: (" + readyJob + ") idName:" + finishedJobArray[readyJob].idName + " previousJobName:" + jobList[i].previousJobName + " ==> " + "brreg-web");
                    totQued++;
                }
            } else { // it is not job number 2
                let setJobResult = await setJobStatus(config, finishedJobArray[readyJob].id, jobList[i].nextJobName, jobList[i].setJobStatus, finishedJobArray[readyJob].jobLog);
                console.log("maestro: (" + readyJob + ") idName:" + finishedJobArray[readyJob].idName + " previousJobName:" + jobList[i].previousJobName + " ==> " + jobList[i].nextJobName)
                totQued++;
            }


        }
        if (finishedJobArray.length > 0) { // if there was stuff to be processed - then
            console.log("maestro: starting  nextJobName:" + jobList[i].nextJobName); //send signal to start the nextJob
        }



    }




return "Total queued is: " + totQued;





}


/** findFirstAttribute
takes a full mergeRecord and searches for attribute in a property named dataSection
Returns the value if found or "none" if not found

example 
    mergeRecord = {
        "data": {
            "memberships": {
                "avfallnorge-no-members": {
                    "scrapeDate": "2021-03-23T13:30:40.054Z",
                    "domain": "terrateam.no",
                    "displayName": "Miljøteknikk Terrateam AS",
                    "phone": "75144950",
                    "urbalurbaIdName": "miljoteknikk-terrateam",
                    "networkIdName": "avfallnorge.no",
                    "web": "http://www.terrateam.no/",
                    "location": "Mo i Rana",
                    "email": "miljoteknikk@­terrateam.no"
                }
            }
        }
    }

findFirstAttribute(mergeRecord, "memberships", "web") returns "http://www.terrateam.no/"
    
 */

export function findFirstAttribute(mergeRecord, dataSection, attribute) {


    let attributeValue = "none";

    let dataSectionNames = Object.getOwnPropertyNames(mergeRecord.data[dataSection]); //get list of all properties i the dataSection

    for (let prop = 0; prop < dataSectionNames.length; prop++) { // loop all properties 
        let name = dataSectionNames[prop];
        let currentDataSection = mergeRecord.data[dataSection][name];
        attributeValue = getNested(currentDataSection, attribute); // get value of the property - if there is one

        if (attributeValue) {
            break; // stop looping - we have found the value
        }

    }

    return attributeValue;


}

/** addWebProtocol
 adds http:// to a web address if it does not have http or https
 */
export function addWebProtocol(web) {

    if ((web != "") && (web != null) && (web != undefined)) { // there is a web address
        // there is a posibility that the web address does not contain http:// or https://        
        if ((-1 == web.search("http://")) && (-1 == web.search("https://"))) {
            web = "http://" + web; //just add http
        }
    }
    return web;
}

/** stripWebUrl
 * takes a web address. verifies that it is a legal address and removes the path and the protocoll
 * valid hostname is returned - if not then "" is returned
 */
export function stripWebUrl(web) {

    let returnHostname = "";

    if ((web != "") && (web != null) && (web != undefined)) { // there is a web address

        web = addWebProtocol(web); // there is a posibility that the web address does not contain http:// or https://        

        try {
            let tmpUrl = new URL(web); // can cause error if it is not a valid web address
            let hostname = tmpUrl.hostname;

            if (hostname) {
                returnHostname = hostname;
            }
        }
        catch (e) { // the web address is not valid
            console.log("Invalid web:" + web);
        }

    }

    return returnHostname;

}

/** brreg2MergeRecord
convers a brreg record to a merge record. 
 This is done so that all programs that put data into the merge record uses the same attributes


 the brregRecord is the data comming from brreg. The data format  may vary depending on what type of lookup we are doing.

The following data formats exists:
- direct lookup using organizationNumber --> just one element is returned
- search using web -> one or more elements is returned

If there are just one org returned we set the field urbalurbaVerified = "yes"
If more than one org is returned - thn we must do :
* urbalurbaVerified = "no"
* get all org numbers - what do we do with them

 
 The following field must be changed:
 
copy field: "hjemmeside" --> "domain" and remove the www is any
copy field: "navn" --> "displayName"
create field: urbalurbaIdName: name2UrbalurbaIdName(displayName)
copy field: "hjemmeside" --> "web" and add http://
copy field: "organisasjonsnummer" --> "organizationNumber"
create field: urbalurbaScrapeDate 
create field: urbalurbaVerified

copy field:
"forretningsadresse": {
                    "land": "Norge",
                    "landkode": "NO",
                    "postnummer": "8626",
                    "poststed": "MO I RANA",
                    "adresse": [
                        "Tungtransportveien 19"
                    ],
                    "kommune": "RANA",
                    "kommunenummer": "1833"
                },
to                 
    "location": {
        "visitingAddress": {
            "street": "Tungtransportveien 19",
            "city": "MO I RANA",
            "postcode": "8626",
            "country": "Norway"
        },



In the brregRecord there are some categories: 
    "naeringskode1": {
        "beskrivelse": "Sortering og bearbeiding av avfall for materialgjenvinning",
        "kode": "38.320"
    },
    "naeringskode2": {
    "beskrivelse" : "Skipsmegling",
    "kode" : "52.292"
    },   

They will be converted to:    
"categories": {
        "naeringskode": [
            "38.320",
            "52.292"
        ],
        "organisasjonsform": [
            "AS"
        ],
        "institusjonellSektorkode": [
            "2100"
        ]
    }

 */
export function brreg2mergeRecord(brregRecord, hjemmeside) {

    let tmpResult = "";
    let mergeRecord = {};

    let oneBrregOrg; // this is the one we are going to select
    let totalElements = 0; // number of orgs returned by search

    const BRREG_VERIFIED = "yes"; // a direct web lookup is verified
    const BRREG_MANY = "many"; // a direct web lookup is NOT verified

    let urbalurbaScrapeDate = new Date().toISOString();
    // add fields 
    mergeRecord.urbalurbaScrapeDate = urbalurbaScrapeDate;


    // first figure out if we have more than one response
    totalElements = getNested(brregRecord, "page", "totalElements");
    if (totalElements) { // The brregRecord is from a  web search 
        if (totalElements > 1) { // yes we have more than one result 

            let brregEnheter = getNested(brregRecord, "_embedded", "enheter");
            let brregWebEnheter = []; // for storing the result enheter that actually has the hjemmeside 
            for (let j = 0; j < brregEnheter.length; j++) { //loop the org's returned

                let fixHjemmeside = brregEnheter[j].hjemmeside.toLowerCase();
                fixHjemmeside = stripWebUrl(fixHjemmeside); //we need to do this because the hjemmeside sometimes has a ending "/"
                if (fixHjemmeside == hjemmeside.toLowerCase()) {
                    brregWebEnheter.push(brregEnheter[j]); // if it is the same - then we keep it
                }
            }
            if (brregWebEnheter.length == 1) { // there is just one - we select it 
                oneBrregOrg = brregWebEnheter[0]; //slect the first and only one
                mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"            
                mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
            } else {

                if (brregWebEnheter.length > 1) { // there are several                        
                    mergeRecord.urbalurbaImport = brregWebEnheter; //store them all
                    mergeRecord.urbalurbaVerified = BRREG_MANY;
                    mergeRecord.urbalurbaError = "Search for hjemmeside=" + hjemmeside + " resulted in:" + totalElements + " organizations";
                } else {// there are none
                    // the search is sending bullshit back to us
                    // not sure what to do 
                    console.error("brreg2mergeRecord: Error. search for hjemmeside=" + hjemmeside + " is returning:" + totalElements +  " .NONE of them has correct hjemmeside !!");
                    mergeRecord.urbalurbaError = "Error Search for hjemmeside=" + hjemmeside + " is returning:" + totalElements +  " .NONE of them has correct hjemmeside !!";
                    debugger;
                }

            }


        } else { //there is just one result
            oneBrregOrg = brregRecord._embedded.enheter[0]; //slect the first and only one
            mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"            
            mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
        }

    } else { // The brregRecord is from org number lookup
        oneBrregOrg = brregRecord; // the record contains just one
        mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"
        mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
    }




    // if we dont have a oneBrregOrg then we can skip the rest.
    if (oneBrregOrg) {


        //copy field: "hjemmeside" --> "domain" and remove the www is any
        tmpResult = getNested(oneBrregOrg, "hjemmeside");
        if (tmpResult) { // its there        
            mergeRecord.domain = domainFromWeb(tmpResult);
        }

        //copy field: "navn" --> "displayName"
        tmpResult = getNested(oneBrregOrg, "navn");
        if (tmpResult) { // its there
            mergeRecord.displayName = tmpResult;
        }

        mergeRecord.urbalurbaIdName = name2UrbalurbaIdName(mergeRecord.displayName);


        //copy field: "hjemmeside" --> "web" and add http://
        tmpResult = getNested(oneBrregOrg, "hjemmeside");
        if (tmpResult) { // its there
            mergeRecord.web = addWebProtocol(tmpResult);
        }


        //copy field: "organisasjonsnummer" --> "organizationNumber"
        tmpResult = getNested(oneBrregOrg, "organisasjonsnummer");
        if (tmpResult) { // its there
            mergeRecord.organizationNumber = tmpResult;
        }


        //copy and reformat field: "forretningsadresse" --> "location"

        tmpResult = getNested(oneBrregOrg, "forretningsadresse");
        if (tmpResult) { // its there
            mergeRecord.location = {
                visitingAddress: {}
            };
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "adresse");
            if (tmpResult) { // its there
                mergeRecord.location.visitingAddress.street = tmpResult[0];
            }
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "poststed");
            if (tmpResult) { // its there
                mergeRecord.location.visitingAddress.city = tmpResult;
            }
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "postnummer");
            if (tmpResult) { // its there
                mergeRecord.location.visitingAddress.postcode = tmpResult;
            }
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "land");
            if (tmpResult) { // its there
                if (tmpResult.toUpperCase() == "NORGE") tmpResult = "Norway"; // translate Norge to Norway
                mergeRecord.location.visitingAddress.country = tmpResult;
            }

        } // end if forretningsadresse


        // now the categories
        mergeRecord.categories = {};

        // first naeringskode    
        mergeRecord.categories.naeringskode = [];

        // there can be 3 of them
        tmpResult = getNested(oneBrregOrg, "naeringskode1", "kode");
        if (tmpResult) { // its there        
            mergeRecord.categories.naeringskode.push(tmpResult);
        }

        // there can be 3 of them
        tmpResult = getNested(oneBrregOrg, "naeringskode2", "kode");
        if (tmpResult) { // its there        
            mergeRecord.categories.naeringskode.push(tmpResult);
        }

        // there can be 3 of them
        tmpResult = getNested(oneBrregOrg, "naeringskode3", "kode");
        if (tmpResult) { // its there        
            mergeRecord.categories.naeringskode.push(tmpResult);
        }


        // then organisasjonsform
        mergeRecord.categories.organisasjonsform = [];
        // there is just one
        tmpResult = getNested(oneBrregOrg, "organisasjonsform", "kode");
        if (tmpResult) { // its there        
            tmpResult = tmpResult.toLowerCase();
            mergeRecord.categories.organisasjonsform.push(tmpResult);
        }


        // then institusjonellSektorkode
        mergeRecord.categories.institusjonellSektorkode = [];
        // there is just one
        tmpResult = getNested(oneBrregOrg, "institusjonellSektorkode", "kode");
        if (tmpResult) { // its there        
            mergeRecord.categories.institusjonellSektorkode.push(tmpResult);
        }

    } else { // we dont have a oneBrregOrg
        //let totalElements = getNested(brregRecord, "page", "totalElements");
        //mergeRecord.urbalurbaError = "Error Search for hjemmeside=" + hjemmeside + " resulted in:" + totalElements + " organizations";

    }


    return mergeRecord;

}

