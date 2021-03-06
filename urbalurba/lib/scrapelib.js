/* functions for 
- communication with strapi backend
- converting+++
25may
*/



import axios from 'axios';
import { MERGECONFIG } from "./mergeconfig.js";
import {
    getNested,
    name2UrbalurbaIdName,
    string2IdKey,
    companyName2displayName,

} from "./urbalurbalib2.js";

import {
    prefixArrayObjects
} from "./strapidatalib.js";


import {
    insightly2mergeRecord
} from "./insightlylib.js";

import {
    logger
} from "./logger.js";

export const DISPLAYLOG = true;
export const DISPLAYDEBUG = false;

const MERGE_DATASET = "merges";
const MERGEJOB_DATASET = "merge-jobs";
export const MERGEJOB_RUNNING = "Running";
export const MERGEJOB_FINISHED = "Finished";


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
export async function getMergesByIdNameANDentitytype(config, idName, entitytype) {


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
export async function updateMerge(config, newData, idName, jobStatus, mergeID, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, jobLog, dataSource, exportReady) {

    let tmpResultArray = [];
    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "/" + mergeID;

    jobLog = addJobLog(config.JOBNAME, dataSource, jobStatus, jobLog);

    if (!exportReady) { //this so that we can update whitehout setting exportReady to false. It is used when writing data bask after updated Insightly
        exportReady = false;
    }


    let newMasterRecord = generateNewMasterRecord(newData);

    let newDisplayName = idName;
    if (newMasterRecord == "none") {
        newMasterRecord = null;
    } else {
        newDisplayName = newMasterRecord.organization.displayName; // alway use the latest displayName
    }


    // if there are members on the record. Then this is a network has members thatare scraped from their web page
    if (newData.hasOwnProperty("members")) {
        debugger;
    }


    let mergeRecord = {
        idName: idName,
        displayName: newDisplayName,

        data: newData,
        exportReady: exportReady,

        jobName: config.JOBNAME,
        jobLog: jobLog,
        jobStatus: jobStatus,
        masterRecord: newMasterRecord
    };

    if (urbalurbaIdName) {
        mergeRecord.urbalurbaIdName = urbalurbaIdName;
        if (newMasterRecord) { // is there a new master record - this is not the case if webscraping is done before export from insightly
            mergeRecord.masterRecord.organization.urbalurbaIdName = mergeRecord.urbalurbaIdName; //put it in the master record as well
        }
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

    if (newMasterRecord) { // if there is a master record -then we must get the domains and networkmemberships

        // get the domains - if any
        tmpResultArray = getNested(newMasterRecord, "organization", "domains");
        if ((tmpResultArray != undefined) && (tmpResultArray != null)) { // there is a domains 
            mergeRecord.domains = prefixArrayObjects(tmpResultArray, "domainName");
        }

        // get the network(s) the entity belongs to
        tmpResultArray = getNested(newMasterRecord, "networkmemberships");
        if ((tmpResultArray != undefined) && (tmpResultArray != null)) {
            mergeRecord.networkmemberships = prefixArrayObjects(tmpResultArray, "networkIdName");
        }

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




/** updateMergeMasterRecord
 updates a the masterReord on a merge
 */
export async function updateMergeMasterRecord(config, newMasterRecord, jobStatus, mergeID, jobLog) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "/" + mergeID;

    jobLog = addJobLog(config.JOBNAME, config.DATASOURCE, jobStatus, jobLog);


    let mergeRecord = {
        masterRecord: newMasterRecord,
        exportReady: true,

        jobName: config.JOBNAME,
        jobLog: jobLog,
        jobStatus: jobStatus
    };

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
        let logTxt = "1.9 updateMergeMasterRecord catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

};







/** createMerge
 creates a new record in the merge dataset
 */
export async function createMerge(config, newData, idName, jobStatus, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, dataSource) {

    let tmpResultArray = [];
    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET;

    let jobLog = null; // jobLog does not exist the first time
    jobLog = addJobLog(config.JOBNAME, dataSource, jobStatus, jobLog);

    let newMasterRecord = generateNewMasterRecord(newData);

    let newDisplayName = idName; // set it to the same as idName so that in case there is no newMasterRecord we at least have a displayName
    if (newMasterRecord == "none") {
        newMasterRecord = null;
    } else {
        newDisplayName = newMasterRecord.organization.displayName; // alway use the latest displayName
    }

    let mergeRecord = {
        idName: idName,
        displayName: newDisplayName,
        entitytype: config.ENTITYTYPE_OUTPUT,

        data: newData,

        exportReady: false,

        jobName: config.JOBNAME,
        jobLog: jobLog,
        jobStatus: jobStatus,
        masterRecord: newMasterRecord
    };

    if (urbalurbaIdName) { // existing rcord
        mergeRecord.urbalurbaIdName = urbalurbaIdName;
    } else { // new record
        mergeRecord.urbalurbaIdName = name2UrbalurbaIdName(idName); // this MUST be the only call to name2UrbalurbaIdName
        if (newMasterRecord) { // is there a new master record - this is not the case if webscraping is done before export from insightly
            mergeRecord.masterRecord.organization.urbalurbaIdName = mergeRecord.urbalurbaIdName; //put it in the master record as well
        }

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

    if (newMasterRecord) { // if there is a master record -then we must get the domains and networkmemberships

        // get the domains - if any
        tmpResultArray = getNested(newMasterRecord, "organization", "domains");
        if ((tmpResultArray != undefined) && (tmpResultArray != null)) { // there is a domains 
            mergeRecord.domains = prefixArrayObjects(tmpResultArray, "domainName");
        }

        // get the network(s) the entity belongs to
        tmpResultArray = getNested(newMasterRecord, "networkmemberships");
        if ((tmpResultArray != undefined) && (tmpResultArray != null)) {
            mergeRecord.networkmemberships = prefixArrayObjects(tmpResultArray, "networkIdName");
        }

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
function addJobLog(jobName, dataSource, jobStatus, jobLogField, logMessage) {

    if (!jobLogField) { // first time
        jobLogField = {
            jobNumber: 0
        }
    }

    jobLogField.jobNumber = jobLogField.jobNumber + 1;
    jobLogField[jobLogField.jobNumber] = {
        date: new Date().toISOString(),
        jobName: jobName,
        dataSource: dataSource,
        jobStatus: jobStatus,
        logMessage: logMessage
    }

    return jobLogField;

}


/** setJobStatus
 set the jobStatus for a jobName
 */
export async function setJobStatus(config, mergeID, jobName, jobStatus, jobLog, errorMessage) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "/" + mergeID;


    jobLog = addJobLog(jobName, config.DATASOURCE, jobStatus, jobLog, errorMessage);


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


    let dataSource = config.DATASOURCE;


    let organizationNumber = null;
    let urbalurbaIdName = null;
    let sbn_insightly = null;
    let domain = null;
    let web = null;

    let mergeArray = await getMergesByIdNameANDentitytype(config, idName, entitytype);

    if (mergeArray.length == 0) { // there is no previous record


        let newData = {};
        newData[config.DATA_SECTION_OUTPUT] = {};
        newData[config.DATA_SECTION_OUTPUT][dataSource] = data;
        urbalurbaIdName = data.urbalurbaIdName; //assume there is
        organizationNumber = data.organizationNumber; //assume there is        
        sbn_insightly = data.sbn_insightly; //assume there is
        domain = data.domain; //assume there is
        web = data.web; //assume there is

        let mergeRecord = await createMerge(config, newData, idName, jobStatus, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, dataSource);


        if (mergeRecord == "none") { // there is was an error
            let errorMessage = "Error creating merge";
            if (DISPLAYLOG) console.log("pushData: idName:" + idName + " -> " + errorMessage);
            logger.error(errorMessage, { "idName": idName, "jobName": config.JOBNAME });
            returnResult = "Error"
        } else {
            if (DISPLAYLOG) console.log("pushData: Created merge for:" + idName);
            let okMessage = "pushData: Created merge for:" + idName;
            logger.info(okMessage, { "idName": idName, "jobName": config.JOBNAME });
            returnResult = "OK"
        }
    } else { // there is a previous merge record - we will update it




        let existingData = mergeArray[0].data; // pick the first one                    
        if (!existingData.hasOwnProperty(config.DATA_SECTION_OUTPUT)) { // no secttion
            existingData[config.DATA_SECTION_OUTPUT] = {};
        }

        existingData[config.DATA_SECTION_OUTPUT][dataSource] = data; //update info from the source    

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






        let updateMergeRecordResult = await updateMerge(config, existingData, idName, jobStatus, mergeArray[0].id, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, mergeArray[0].jobLog, dataSource);

        if (updateMergeRecordResult == "none") { // there is was an error
            let errorMessage = "pushData: Error updating merge";
            if (DISPLAYLOG) console.error("pushData: Error updating merge for:" + idName);
            logger.error(errorMessage, { "idName": idName, "jobName": config.JOBNAME });
            returnResult = "Error"
        } else {
            let okMessage = "pushData: Updated merge";
            if (DISPLAYLOG) console.log("pushData: Updated merge for:" + idName);
            logger.info(okMessage, { "idName": idName, "jobName": config.JOBNAME });
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
        //if (DISPLAYLOG) console.log("getFirstReadyNetwork: No ready member lists");
    }

    return firstMergeRecord;

}

/** splitNetwork2organizations
 Gets the first network that is ready. Then creates all organizations for this network.
 Sets the status for the first network to "Running" while creating the organizations. 
 And "Finished" when all organizations are created.
 returns false if there are no more networks that we can split into entries.
 */

export async function splitNetwork2organizations(config) {

    let moreReadyNetworks = true; // there might be more networks to split
    let firstNetwork = await getFirstReadyNetwork(config);

    if (firstNetwork != "none") { //we have a list to work on
        let statusMessage = "Splitting network: " + firstNetwork.idName;
        let canStartJob = await canStartMergeJob(config, config.JOBNAME, MERGEJOB_RUNNING, statusMessage);
        if (canStartJob) {

            let statusResult;

            statusResult = await setJobStatus(config, firstNetwork.id, config.JOBNAME, "Running", firstNetwork.jobLog); // mark the network so that we know it is running

            //inside the data property there should be just one property.And that property should have the jobName of the job that created it
            // since that can be lots of jobName's we must list them to find its name. Then pick that name
            let dataProperties = Object.getOwnPropertyNames(firstNetwork.data[config.DATA_SECTION_INPUT]); //get list of all property names
            let dataSource = "";
            if (dataProperties.length > 0) {
                dataSource = dataProperties[0]; // get the name of the job that created the property that contains the members

                // loop all members in the list and create one mergeRecord for each member
                let members = firstNetwork.data[config.DATA_SECTION_INPUT][dataSource];

                let numUpdated = await updateMergeOrganizations(config, members, dataSource);

                // Finished updating - now we mark it finished
                statusResult = await setJobStatus(config, firstNetwork.id, firstNetwork.jobName, "Finished", firstNetwork.jobLog);
                statusMessage = "Network: " + firstNetwork.idName + " has " + numUpdated + " members";
                canStartJob = await canStartMergeJob(config, config.JOBNAME, MERGEJOB_FINISHED, statusMessage);
                let okMessage = "Network updated. Status=" + statusResult;
                logger.info(okMessage, { "networkIdName": firstNetwork.idName, "updatedMembers": numUpdated, "jobName": config.JOBNAME });

            } else {
                let errorMessage = "We are in a shit of trouble";
                if (DISPLAYLOG) console.error("splitNetwork2organizations:" + " -> " + errorMessage);
                logger.error(errorMessage, { "networkIdName": firstNetwork.idName, "jobName": config.JOBNAME });
                debugger;
            }

        } else { // cant start the job
            //returnMessage = "job already running OR a job is using a resource that cannot run in paralell"
            // here we could write a status to the job - but no point
        }
    } else {
        if (DISPLAYLOG) console.log("splitNetwork2organizations: No ready member lists");
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
                if (DISPLAYLOG) console.log("Invalid email :" + email);
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
            if (DISPLAYLOG) console.log("Invalid web:" + web);
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


            
            if (mergeRecord.web) { // must have web address if we are going to webscrape

                let webObject = {
                    url: mergeRecord.web,
                    userData: {
                        domain: mergeRecord.idName,
                        id: mergeRecord.id,
                        jobLog: mergeRecord.jobLog,
                        displayName: mergeRecord.displayName
                    }
                };
                returnJobArray.push(webObject);

            } else {
                let logTxt = "1.9 getJobArray_web error. No web for idName="+ mergeRecord.idName; 
                console.error(logTxt);
                debugger
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



/** bareWebUrl
 * takes a web address. verifies that it is a legal address.
 *  and removes the path eg from http://www.sol.no/something to http://www.sol.no/
 * valid web address is returned - if not then "" is returned
 */
export function bareWebUrl(web) {

    let returnBareWebUrl = "";

    if ((web != "") && (web != null) && (web != undefined)) { // there is a web address

        web = addWebProtocol(web); // there is a posibility that the web address does not contain http:// or https://        

        try {
            let tmpUrl = new URL(web); // can cause error if it is not a valid web address
            let hostname = tmpUrl.hostname;

            if (hostname) {
                returnBareWebUrl = tmpUrl.protocol + "//" + hostname;
            }
        }
        catch (e) { // the web address is not valid
            console.log("Invalid web:" + web);
        }

    }

    return returnBareWebUrl;

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

The property organization will be created and contains
        foundedDate: 
        organizationNumber: 
        employees: 
        orgType: 
        lastAnnualReport: 
if there is a end date slettedato then the field endDate is added to organization




 */
export function brreg2mergeRecord(brregRecord, searchHjemmeside, searchOrganizationName) {

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
    if (totalElements) { // The brregRecord is from a  web search or a name search

        if (searchHjemmeside) { //its from a homepage search

            if (totalElements > 1) { // yes we have more than one result 

                let brregEnheter = getNested(brregRecord, "_embedded", "enheter");
                let brregWebEnheter = []; // for storing the result enheter that actually has the hjemmeside 
                for (let j = 0; j < brregEnheter.length; j++) { //loop the org's returned

                    let fixHjemmeside = brregEnheter[j].hjemmeside.toLowerCase();
                    fixHjemmeside = stripWebUrl(fixHjemmeside); //we need to do this because the hjemmeside sometimes has a ending "/"
                    if (fixHjemmeside == searchHjemmeside.toLowerCase()) {
                        brregWebEnheter.push(brregEnheter[j]); // if it is the same - then we keep it
                    }
                }
                if (brregWebEnheter.length == 1) { // there is just one - we select it 

                    if (stripWebUrl(brregWebEnheter[0].hjemmeside) == searchHjemmeside) { //We must make sure it is a correct 
                        oneBrregOrg = brregWebEnheter[0]; //slect the first and only one
                        mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"            
                        mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
                    } else { // brreg has sent us shit again
                        if (DISPLAYLOG) console.error("brreg2mergeRecord: Error. search for hjemmeside=" + searchHjemmeside + " is returning hjemmeisde=" + brregRecord._embedded.enheter[0].hjemmeside + " Not equal!");
                        mergeRecord.urbalurbaError = "Error search for hjemmeside=" + searchHjemmeside + " is returning hjemmeisde=" + brregRecord._embedded.enheter[0].hjemmeside + "= Not equal!";
                        debugger;
                    }

                } else {

                    if (brregWebEnheter.length > 1) { // there are several                        
                        mergeRecord.urbalurbaImport = brregWebEnheter; //store them all
                        mergeRecord.urbalurbaVerified = BRREG_MANY;
                        mergeRecord.urbalurbaError = "Search for hjemmeside=" + searchHjemmeside + " resulted in:" + totalElements + " organizations";
                    } else {// there are none
                        // the search is sending bullshit back to us
                        // not sure what to do 
                        if (DISPLAYLOG) console.error("brreg2mergeRecord: Error. search for hjemmeside=" + searchHjemmeside + " is returning:" + totalElements + " .NONE of them has correct hjemmeside !!");
                        mergeRecord.urbalurbaError = "Error Search for hjemmeside=" + searchHjemmeside + " is returning:" + totalElements + " .NONE of them has correct hjemmeside !!";
                        debugger;
                    }

                }


            } else { //there is just one result
                // the brreg API is messy and they send results that are not correct. 
                if (stripWebUrl(brregRecord._embedded.enheter[0].hjemmeside) == searchHjemmeside) { //We must make sure it is a correct 
                    oneBrregOrg = brregRecord._embedded.enheter[0]; //slect the first and only one
                    mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"            
                    mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
                } else { // brreg has set us shit again
                    if (DISPLAYLOG) console.error("brreg2mergeRecord: Error. search for hjemmeside=" + searchHjemmeside + " is returning hjemmeisde=" + brregRecord._embedded.enheter[0].hjemmeside + " Not equal!");
                    mergeRecord.urbalurbaError = "Error search for hjemmeside=" + searchHjemmeside + " is returning hjemmeisde=" + brregRecord._embedded.enheter[0].hjemmeside + "= Not equal!";
                    debugger;
                }
            }

        } else { // its from a organizationName search


            // start --------- Handling search with organizationName



            if (totalElements > 1) { // yes we have more than one result 


                let brregEnheter = getNested(brregRecord, "_embedded", "enheter");
                let brregNameEnheter = []; // for storing the result enheter that actually has the organizationName
                for (let j = 0; j < brregEnheter.length; j++) { //loop the org's returned

                    let fixOrganizationName = brregEnheter[j].navn.toLowerCase();
                    fixOrganizationName = companyName2displayName(fixOrganizationName); //strip away the A/S AS IKS or whatever

                    if (fixOrganizationName == searchOrganizationName) {
                        brregNameEnheter.push(brregEnheter[j]); // if it is the same - then we keep it
                    }
                }
                if (brregNameEnheter.length == 1) { // there is just one - we select it 
                    let fixOrganizationName = brregNameEnheter[0].navn.toLowerCase();
                    fixOrganizationName = companyName2displayName(fixOrganizationName) //strip away the A/S AS IKS or whatever

                    if (fixOrganizationName == searchOrganizationName) { //We must make sure it is a correct 
                        oneBrregOrg = brregNameEnheter[0]; //slect the first and only one
                        mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"            
                        mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
                    } else { // brreg has sent us shit again
                        if (DISPLAYLOG) console.error("brreg2mergeRecord: Error. search for navn=" + searchOrganizationName + "= is returning navn=" + brregRecord._embedded.enheter[0].navn + " Not equal!");
                        mergeRecord.urbalurbaError = "Error search for navn=" + searchOrganizationName + "= is returning navn=" + brregRecord._embedded.enheter[0].navn + "= Not equal!";
                        debugger;
                    }

                } else {

                    if (brregNameEnheter.length > 1) { // there are several                        
                        mergeRecord.urbalurbaImport = brregNameEnheter; //store them all
                        mergeRecord.urbalurbaVerified = BRREG_MANY;
                        mergeRecord.urbalurbaError = "Search for navn=" + searchOrganizationName + " resulted in:" + totalElements + " organizations";
                    } else {// there are none
                        // the search is sending bullshit back to us
                        // not sure what to do 
                        if (DISPLAYLOG) console.error("brreg2mergeRecord: Error. search for navn=" + searchOrganizationName + "= is returning:" + totalElements + " .NONE of them has correct navn !!");
                        mergeRecord.urbalurbaError = "Error Search for navn=" + searchOrganizationName + "= is returning:" + totalElements + " .NONE of them has correct navn !!";
                        debugger;
                    }

                }


            } else { //there is just one result
                // the brreg API is messy and they send results that are not correct. 
                let fixOrganizationName = brregRecord._embedded.enheter[0].navn.toLowerCase();
                fixOrganizationName = companyName2displayName(fixOrganizationName); //strip away the A/S AS IKS or whatever
                if (fixOrganizationName == searchOrganizationName) { //We must make sure it is a correct 
                    oneBrregOrg = brregRecord._embedded.enheter[0]; //slect the first and only one
                    mergeRecord.urbalurbaImport = oneBrregOrg; //the imported data is stored in "".import"            
                    mergeRecord.urbalurbaVerified = BRREG_VERIFIED;
                } else { // brreg has set us shit again
                    if (DISPLAYLOG) console.error("brreg2mergeRecord: Error. search for navn=" + searchOrganizationName + "= is returning navn=" + brregRecord._embedded.enheter[0].navn + " Not equal!");
                    mergeRecord.urbalurbaError = "Error search for navn=" + searchOrganizationName + "= is returning hjemmeisde=" + brregRecord._embedded.enheter[0].navn + "= Not equal!";
                    debugger;
                }
            }






            // stop ----
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
        if (tmpResult != undefined) { // its there        
            mergeRecord.domain = domainFromWeb(tmpResult);
        }

        //copy field: "navn" --> "displayName"
        tmpResult = getNested(oneBrregOrg, "navn");
        if (tmpResult != undefined) { // its there
            mergeRecord.displayName = tmpResult;
        }

        //JALLA delete        mergeRecord.urbalurbaIdName = name2UrbalurbaIdName(mergeRecord.displayName);


        //copy field: "hjemmeside" --> "web" and add http://
        tmpResult = getNested(oneBrregOrg, "hjemmeside");
        if (tmpResult != undefined) { // its there
            mergeRecord.web = addWebProtocol(tmpResult);
        }


        //copy field: "organisasjonsnummer" --> "organizationNumber"
        tmpResult = getNested(oneBrregOrg, "organisasjonsnummer");
        if (tmpResult != undefined) { // its there
            mergeRecord.organizationNumber = tmpResult;
        }


        //copy and reformat field: "forretningsadresse" --> "location"

        tmpResult = getNested(oneBrregOrg, "forretningsadresse");
        if (tmpResult != undefined) { // its there
            mergeRecord.location = {
                visitingAddress: {}
            };
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "adresse");
            if (tmpResult != undefined) { // its there
                // there might be a c/o address here. 
                if (tmpResult.length > 1) { // there is a c/o address - select the next line
                    mergeRecord.location.visitingAddress.street = tmpResult[1];
                } else { // there is just one address line. - select it
                    mergeRecord.location.visitingAddress.street = tmpResult[0];
                }
            }
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "poststed");
            if (tmpResult != undefined) { // its there
                mergeRecord.location.visitingAddress.city = tmpResult;
            }
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "postnummer");
            if (tmpResult != undefined) { // its there
                mergeRecord.location.visitingAddress.postcode = tmpResult;
            }
            tmpResult = getNested(oneBrregOrg, "forretningsadresse", "land");
            if (tmpResult != undefined) { // its there
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
        if (tmpResult != undefined) { // its there        
            mergeRecord.categories.naeringskode.push(tmpResult);
        }

        // there can be 3 of them
        tmpResult = getNested(oneBrregOrg, "naeringskode2", "kode");
        if (tmpResult != undefined) { // its there        
            mergeRecord.categories.naeringskode.push(tmpResult);
        }

        // there can be 3 of them
        tmpResult = getNested(oneBrregOrg, "naeringskode3", "kode");
        if (tmpResult != undefined) { // its there        
            mergeRecord.categories.naeringskode.push(tmpResult);
        }


        // then organisasjonsform
        mergeRecord.categories.organisasjonsform = [];
        // there is just one
        tmpResult = getNested(oneBrregOrg, "organisasjonsform", "kode");
        if (tmpResult != undefined) { // its there        
            tmpResult = tmpResult.toLowerCase();
            mergeRecord.categories.organisasjonsform.push(tmpResult);
        }


        // then institusjonellSektorkode
        mergeRecord.categories.institusjonellSektorkode = [];
        // there is just one
        tmpResult = getNested(oneBrregOrg, "institusjonellSektorkode", "kode");
        if (tmpResult != undefined) { // its there        
            mergeRecord.categories.institusjonellSektorkode.push(tmpResult);
        }

        let endDate = getNested(oneBrregOrg, "slettedato");
        let orgTypeKode = getNested(oneBrregOrg, "organisasjonsform", "kode");
        let orgTypeBeskrivelse = getNested(oneBrregOrg, "organisasjonsform", "beskrivelse");

        mergeRecord.organization = {
            foundedDate: getNested(oneBrregOrg, "stiftelsesdato"),
            organizationNumber: mergeRecord.organizationNumber,
            employees: getNested(oneBrregOrg, "antallAnsatte"),
            orgType: orgTypeKode + "," + orgTypeBeskrivelse,
            lastAnnualReport: getNested(oneBrregOrg, "sisteInnsendteAarsregnskap")
        }

        if (endDate) {
            mergeRecord.organization.endDate = endDate
        }


    } else { // we dont have a oneBrregOrg
        //let totalElements = getNested(brregRecord, "page", "totalElements");
        //mergeRecord.urbalurbaError = "Error Search for hjemmeside=" + hjemmeside + " resulted in:" + totalElements + " organizations";
        //debugger;
    }



    return mergeRecord;

}
/** member2mergeRecord
 the data or one member (memberData) needs to be split into two parts
 The data that is info goes into source: {} and the data that describes the membership goes into memberships:
 Returns a data record that can be written to the database.
 The full memberData is copied to the field urbalurbaImport 
 */
export function member2mergeRecord(dataSource, SOURCE, MEMBERSHIPS, newData, existingData) {

    let returnData = {};
    let infoData = {};
    let membershipsData = {};
    let urbalurbaImportData = {}; //this is where we store all fields that are not known
    let tmpResult;

    const INFOFIELDSARRAY = [
        "idName",
        "displayName",
        "slogan",
        "summary",
        "description",
        "web",
        "phone",
        "domains",
        "image",
        "location",
        "status",
        "socialLinks",
        "externalLinks",
        "brreg",
        "email",

        "sbn_insightly",
        "organizationNumber",

        //entitytype      
        "domain",
        "pages",

        "categories",
        "urbalurbaScrapeDate",
        "urbalurbaIdName"

    ];
    const MEMBERSHIPFIELDSARRAY = [
        // "networkIdName",
        "networkmemberships",
        //"networkMemberTypes",
        "urbalurbaScrapeDate"

    ];
    const DELETEFIELDSARRAY = [
        "tags",
        "insightlyTags"
    ];

    // first thing. We need to persist the existing data. And we do not know what is there so we copy it

    returnData = existingData; //do we nee to copy or can we just do this?




    // check if there nessesery fields are there. If not we create them
    tmpResult = getNested(returnData, SOURCE); // check the INFO
    if (!tmpResult) { // its data in the INFO
        returnData[SOURCE] = {}; // create the INFO
    }

    tmpResult = getNested(returnData, MEMBERSHIPS); // check the MEMBERSHIPS
    if (!tmpResult) { // its data in the MEMBERSHIPS
        returnData[MEMBERSHIPS] = {}; // create the MEMBERSHIPS
    }


    // so now we have preserved what was there.

    let foundIndex; // for searching 
    let newDataFieldNames = Object.getOwnPropertyNames(newData); //get list of all properties 
    // then we need to delete fields that we dont want into merge

    for (let prop = 0; prop < newDataFieldNames.length; prop++) { // loop all properties 
        let fieldName = newDataFieldNames[prop];

        foundIndex = DELETEFIELDSARRAY.findIndex(infoField => infoField == fieldName); //look for the fieldname in the 
        if (foundIndex >= 0) { // its a known field
            delete newData[fieldName]; // delete the field
        } else { // do nothing
        }

    }

    // next is to start copying fields into INFO - we do a replace
    // then we store the known INFO fields and put the not know in urbalurbaImport
    newDataFieldNames = Object.getOwnPropertyNames(newData); //get list of all properties 
    for (let prop = 0; prop < newDataFieldNames.length; prop++) { // loop all properties 
        let fieldName = newDataFieldNames[prop];

        foundIndex = INFOFIELDSARRAY.findIndex(infoField => infoField == fieldName); //look for the fieldname in the 
        if (foundIndex >= 0) { // its a known field
            infoData[fieldName] = getNested(newData, fieldName); // get the field and store it in the infoData
        } else { // the field should not be in info - lets see if it is supposed to go in memberships

            foundIndex = MEMBERSHIPFIELDSARRAY.findIndex(infoField => infoField == fieldName); //look for the fieldname in the 
            if (foundIndex >= 0) { // its in membership
                // skipping it 
            } else { // unknown field                
                urbalurbaImportData[fieldName] = getNested(newData, fieldName); // get the field and store it in the urbalurbaImport
            }

        }

    }

    // now we copy the fields that should be in the memberships
    for (let prop = 0; prop < newDataFieldNames.length; prop++) { // loop all properties 
        let fieldName = newDataFieldNames[prop];

        foundIndex = MEMBERSHIPFIELDSARRAY.findIndex(infoField => infoField == fieldName); //look for the fieldname in the 
        if (foundIndex >= 0) { // its a known field
            membershipsData[fieldName] = getNested(newData, fieldName); // get the field and store it in the infoData
        } else { // unknown field
            // skipping it 
        }

    }

    // now we have the old data. And the new data is split into 3 parts



    // put the info data in place
    returnData[SOURCE][dataSource] = infoData;
    // put the fields that is not known in the urbalurbaImport
    returnData[SOURCE][dataSource].urbalurbaImport = urbalurbaImportData;
    // put the membership in place
    returnData[MEMBERSHIPS][dataSource] = membershipsData;




    return returnData;

}









/** strapi2mergeRecord
 convers a strapi record to a merge record. 
 This is done so that all programs that put data into the merge record uses the same attributes
 
 The following field must be changed:
 
copy field: "idName" --> "domain" 
copy field: "url" --> "web"
copy field: foreignKeys.organisasjonsnummer --> "organizationNumber"
copy field: foreignKeys.sbn_insightly --> "sbn_insightly"
copy field: internalImage.profile.url --> "image.profile"
copy field: internalImage.cover.url --> "image.cover"
copy field: internalImage.square.url --> "image.square"

create field: urbalurbaScrapeDate 
create field: networkIdName 
 */
function strapi2mergeRecord(strapiRecord) {


    let tmpResult;

    strapiRecord.domain = strapiRecord.idName;
    strapiRecord.web = strapiRecord.url;
    delete strapiRecord.url; // after moving we delete it



    tmpResult = getNested(strapiRecord, "foreignKeys", "organisasjonsnummer");
    if (tmpResult != undefined) {
        strapiRecord.organizationNumber = tmpResult;
    }

    tmpResult = getNested(strapiRecord, "foreignKeys", "sbn_insightly");
    if (tmpResult != undefined) {
        strapiRecord.sbn_insightly = tmpResult;
    }
    delete strapiRecord.foreignKeys; // after moving we delete it

    strapiRecord.urbalurbaScrapeDate = new Date().toISOString();
    // CHANGED to networkmemberships - strapiRecord.networkIdName = config.IDNAME; // belongsto the network that imports








    tmpResult = getNested(strapiRecord, "internalImage");
    if (tmpResult != undefined) { // there is a attribute name internalImage
        strapiRecord.image = {};


        tmpResult = getNested(strapiRecord, "internalImage", "profile", "url");
        if (tmpResult != undefined) {
            strapiRecord.image.profile = tmpResult;
        }

        tmpResult = getNested(strapiRecord, "internalImage", "cover", "url");
        if (tmpResult != undefined) {
            strapiRecord.image.cover = tmpResult;
        }

        tmpResult = getNested(strapiRecord, "internalImage", "square", "url");
        if (tmpResult != undefined) {
            strapiRecord.image.square = tmpResult;
        }

        delete strapiRecord.internalImage; // then delete the "internalImage" prop

    }

    // delete other fields we dont want to export 
    delete strapiRecord.entitytype;
    delete strapiRecord.insightlyTags;
    delete strapiRecord.insightlyTmpFields;
    delete strapiRecord.tags;


    //JALLA delete    strapiRecord.urbalurbaIdName = name2UrbalurbaIdName(strapiRecord.displayName);

    return strapiRecord;

}


/** updateMergeOrganizations
 takes a list of organizations and create/update them.

 a organization record must be formatted as a mergeRecord
 returns the number of organizations created/updated
 */
export async function updateMergeOrganizations(config, mergeOrganizationsArray, dataSource) {

    let numUpdated = 0;
    let numCreated = 0;
    let numError = 0;

    let returnMsg = "";

    const SOURCE = "source";
    const MEMBERSHIPS = "memberships";


    for (let orgCounter = 0; orgCounter < mergeOrganizationsArray.length; orgCounter++) {
        let idName = mergeOrganizationsArray[orgCounter].idName;
        if (idName) {

            // there are cases when an organization has more than one domain. 
            // so in case there are no existing organization with idname we must look at the second domaninname to see if it is registered under that domain            
            let existingMergeRecordArray = await getMergesByIdNameANDentitytype(config, idName, config.ENTITYTYPE_OUTPUT); // first check for the idName
            if (existingMergeRecordArray.length == 0 && mergeOrganizationsArray[orgCounter].hasOwnProperty("domains")) { // there is no previous record  AND there is a domains property    

                for (let i = 0; i < mergeOrganizationsArray[orgCounter].domains.length; i++) { // loop the domains
                    let tmpIdName = mergeOrganizationsArray[orgCounter].domains[i];
                    if (tmpIdName == idName) {
                        // we already searched for this above                        
                    } else {
                        existingMergeRecordArray = await getMergesByIdNameANDentitytype(config, tmpIdName, config.ENTITYTYPE_OUTPUT); // check if this domain has a idName 
                        if (existingMergeRecordArray.length != 0) { // we found the org as tmpIdName
                            idName = tmpIdName; //
                            mergeOrganizationsArray[orgCounter].idName = tmpIdName;
                            mergeOrganizationsArray[orgCounter].domain = tmpIdName;
                            break; //stop looping - we have found an org
                        }
                    }
                }


            } //end checking if the org exists under another domain / idName




            if (existingMergeRecordArray.length == 0) { // there is no previous record      

                let newData = {};

                // split the information about a member into two parts. One "source" part and one "membership" part
                newData = member2mergeRecord(dataSource, SOURCE, MEMBERSHIPS, mergeOrganizationsArray[orgCounter], newData);

                // get all the top level ID's 

                //-- urbalurbaIdName is not defined when there is a new record -- unless we are importing from strapi or insightly
                let urbalurbaIdName = mergeOrganizationsArray[orgCounter].urbalurbaIdName;

                let organizationNumber = mergeOrganizationsArray[orgCounter].organizationNumber;
                let sbn_insightly = mergeOrganizationsArray[orgCounter].sbn_insightly;
                let domain = mergeOrganizationsArray[orgCounter].domain;
                let web = mergeOrganizationsArray[orgCounter].web;
                web = addWebProtocol(web); // there is a posibility that the web address does not contain http:// or https://        

                let createResult = await createMerge(config, newData, idName, config.JOBSTATUS_OUTPUT, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, dataSource);
                if (createResult == "none") { // there is was an error
                    let errorMessage = "Error creating merge";
                    if (DISPLAYLOG) console.error("updateMergeOrganizations: ( " + (orgCounter + 1) + "/" + mergeOrganizationsArray.length + ")  idName:" + idName + " -> " + errorMessage);
                    logger.error(errorMessage, { "idName:": idName, "jobName": config.JOBNAME });
                    numError++;
                } else {
                    let okMessage = "Success creating merge "
                    if (DISPLAYLOG) console.log("updateMergeOrganizations: ( " + (orgCounter + 1) + "/" + mergeOrganizationsArray.length + ")  idName:" + idName + " -> " + okMessage);
                    logger.info(okMessage, { "idName": idName, "jobName": config.JOBNAME });
                    numCreated++;
                }


            } else { // there is an existing org here
                // if (DISPLAYLOG) console.log("updateMergeOrganizations: ( " + (orgCounter + 1) + "/" + mergeOrganizationsArray.length + ")  idName:" + idName + " already has entitytype=" + config.ENTITYTYPE_OUTPUT);


                // split the information about a member into two parts. One "source" part and one "membership" part
                let existingData = existingMergeRecordArray[0].data; // there should be only one - pick the first one                    

                let updatedData = member2mergeRecord(dataSource, SOURCE, MEMBERSHIPS, mergeOrganizationsArray[orgCounter], existingData);


                // get all the top level ID's
                let urbalurbaIdName = "";
                if (existingMergeRecordArray[0].urbalurbaIdName) { //if there is a urbalurbaIdName
                    urbalurbaIdName = existingMergeRecordArray[0].urbalurbaIdName; //keep the initial 
                } else {
                    urbalurbaIdName = mergeOrganizationsArray[orgCounter].urbalurbaIdName; //if not take the one from the new data
                }

                let organizationNumber = "";
                if (existingMergeRecordArray[0].organizationNumber) { // we have a organizationNumber
                    organizationNumber = existingMergeRecordArray[0].organizationNumber; // keep the initial
                } else { // we take whatever is here
                    organizationNumber = mergeOrganizationsArray[orgCounter].organizationNumber;
                }

                let sbn_insightly = "";
                if (existingMergeRecordArray[0].sbn_insightly) { // we have a insightly ID
                    sbn_insightly = existingMergeRecordArray[0].sbn_insightly; // keep the initial
                } else { // we take whatever is here
                    sbn_insightly = mergeOrganizationsArray[orgCounter].sbn_insightly;
                }

                let domain = "";
                if (existingMergeRecordArray[0].domain) { // we have a domain
                    domain = existingMergeRecordArray[0].domain; // keep the initial
                } else { // we take whatever is here
                    domain = mergeOrganizationsArray[orgCounter].domain;
                }

                let web = "";
                if (existingMergeRecordArray[0].web) { // we have a domain
                    web = existingMergeRecordArray[0].web; // keep the initial
                } else { // we take whatever is here
                    web = mergeOrganizationsArray[orgCounter].web;
                }
                web = addWebProtocol(web);

                let updateResult = await updateMerge(config, updatedData, idName, config.JOBSTATUS_OUTPUT, existingMergeRecordArray[0].id, urbalurbaIdName, organizationNumber, sbn_insightly, domain, web, existingMergeRecordArray[0].jobLog, dataSource);
                if (updateResult == "none") { // there is was an error
                    let errorMessage = "Error cannot update merge";
                    if (DISPLAYLOG) console.error("updateMergeOrganizations: ( " + (orgCounter + 1) + "/" + mergeOrganizationsArray.length + ")  idName:" + idName + " -> " + errorMessage);
                    logger.error(errorMessage, { "idName:": idName, "jobName": config.JOBNAME });
                    numError++;
                } else {
                    let okMessage = "Success updatig merge "
                    if (DISPLAYLOG) console.log("updateMergeOrganizations: ( " + (orgCounter + 1) + "/" + mergeOrganizationsArray.length + ")  idName:" + idName + " -> " + okMessage);
                    logger.info(okMessage, { "idName": idName, "jobName": config.JOBNAME });
                    numUpdated++;
                }

            }

        } else {
            let warningMessage = "Skipping. No idName for displayName=" + mergeOrganizationsArray[orgCounter].displayName;
            if (DISPLAYLOG) console.error("splitNetwork2organizations: ( " + (orgCounter + 1) + "/" + mergeOrganizationsArray.length + ")  " + warningMessage);
            logger.error(warningMessage, { "displayName": mergeOrganizationsArray[orgCounter].displayName, "jobName": config.JOBNAME });
            numError++;
            debugger;
        }

    }


    returnMsg = "Created: " + numCreated + " Updated: " + numUpdated + " Errors: " + numError;
    return returnMsg;


}

/** updateMergeOrganizationRecordWithInsightly
 Takes the existing existingMergeRecord and the insightlyRecord
 Returns a full merge record that can be written to merge
 */
export function updateMergeOrganizationRecordWithInsightly(existingMergeRecord, insightlyRecord, DATASOURCE, SOURCE, MEMBERSHIPS) {

    let insightlyMergeRecord = insightly2mergeRecord(insightlyRecord); // first create a mergeRecord that holds the insightly info
    // split the information about a member into two parts. One "source" part and one "membership" part
    let existingMergeData = existingMergeRecord.data;

    let updatedMergeData = member2mergeRecord(DATASOURCE, SOURCE, MEMBERSHIPS, insightlyMergeRecord, existingMergeData);

    // get all the top level ID's
    let urbalurbaIdName = "";
    if (existingMergeRecord.urbalurbaIdName) { //if there is a urbalurbaIdName
        urbalurbaIdName = existingMergeRecord.urbalurbaIdName; //keep the initial 
    } else {
        urbalurbaIdName = insightlyMergeRecord.urbalurbaIdName; //if not take the one from the new data
    }

    let organizationNumber = "";
    if (existingMergeRecord.organizationNumber) { // we have a organizationNumber
        organizationNumber = existingMergeRecord.organizationNumber; // keep the initial
    } else { // we take whatever is here
        organizationNumber = insightlyMergeRecord.organizationNumber;
    }

    let sbn_insightly = "";
    if (existingMergeRecord.sbn_insightly) { // we have a insightly ID
        sbn_insightly = existingMergeRecord.sbn_insightly; // keep the initial
    } else { // we take whatever is here
        sbn_insightly = insightlyMergeRecord.sbn_insightly;
    }

    let domain = "";
    if (existingMergeRecord.domain) { // we have a domain
        domain = existingMergeRecord.domain; // keep the initial
    } else { // we take whatever is here
        domain = insightlyMergeRecord.domain;
    }

    let web = "";
    if (existingMergeRecord.web) { // we have a domain
        web = existingMergeRecord.web; // keep the initial
    } else { // we take whatever is here
        web = insightlyMergeRecord.web;
    }
    web = addWebProtocol(web);

    let idName = "";
    if (existingMergeRecord.idName) { // we have a idname
        idName = existingMergeRecord.idName; // keep the initial
    } else { // we take whatever is here
        idName = insightlyMergeRecord.idName;
    }

    // now build the updatedMergeRecord that will be returned
    let updatedMergeRecord = existingMergeRecord;
    updatedMergeRecord.urbalurbaIdName = urbalurbaIdName;
    updatedMergeRecord.organizationNumber = organizationNumber;
    updatedMergeRecord.sbn_insightly = sbn_insightly;
    updatedMergeRecord.domain = domain;
    updatedMergeRecord.web = web;
    updatedMergeRecord.idName = idName;

    return updatedMergeRecord;

}


/** fieldsStartingWithFieldName
 takes a array of fields (fieldArray) and returns all fields in the array that starts with startFieldname
 returns an array with the ones found or an empty array if there are none.
 */
function fieldsStartingWithFieldName(startFieldname, fieldArray) {

    let returnArray = [];
    let lenStartFieldName = startFieldname.length;
    returnArray = fieldArray.filter(fieldName => fieldName.slice(0, lenStartFieldName) == startFieldname); // get the matching entries
    return returnArray;
}

/** findFirstField
 returns the value of a fieldName.  
 It searches all of the different sources in the .source for all to see if there is a field named fieldName.
 The source is done in a prioriticed way defined in mergePriorityArray. And the first field with the name of fieldName is returned.
 Sometimes a field on one .source is a better source of truth and we need to prioritice the search for a spessiffic field.
 If the field has a different search priority then it is defined in the mergeFieldPriority.
 */
function findFirstField(mergePriorityArray, mergeFieldPriority, fieldName, parent, currentData) {


    let priorityArray = []; // the array that defines the search order
    let fieldNameValue;
    let fieldValueFound = false;

    // first we must figure out if the field has a mergeFieldPriority
    if (mergeFieldPriority.hasOwnProperty(fieldName)) { // special priority for the field
        priorityArray = mergeFieldPriority[fieldName]; // use the array defined for this field for prioriticing the search 
    } else { // no special priority defined for the field
        priorityArray = mergePriorityArray; // use the normal priority
    }



    let currentDataInfoFieldsArray = Object.getOwnPropertyNames(currentData.source); // all field names in the source: attribute

    for (let priNum = 0; priNum < priorityArray.length; priNum++) { // we are looking for the fields in the info: section of the data. And we are doing it in a prioriticed order

        let startFieldname = priorityArray[priNum]; // get the field we are looking for 
        let fieldsArray = fieldsStartingWithFieldName(startFieldname, currentDataInfoFieldsArray); //return an array of all the fields that matches

        // we now have the info fields that we are going to check if has a field name named fieldName

        // this loop is looking for the fieldName in all matching attributes eg in insightly_something and insightly_somethingelse
        for (let sourceFieldNum = 0; sourceFieldNum < fieldsArray.length; sourceFieldNum++) { // looping the array of 
            let sourceDataFieldName = fieldsArray[sourceFieldNum]; // name of the attribute in the info:

            let sourceData = currentData.source[sourceDataFieldName]; //the record we are going to search eg insightly_something


            // now - if the field has a parent we need to include that in the getNested
            if (parent) {
                fieldNameValue = getNested(sourceData, parent, fieldName); // get the data stored in the fieldName
            } else {
                fieldNameValue = getNested(sourceData, fieldName); // get the data stored in the fieldName
            }



            if ((fieldNameValue != undefined) && (fieldNameValue != "")) { // there was a value there                
                fieldValueFound = true;
                break; // break out of the loop
            }




        } // end looping 

        if (fieldValueFound) { // if we already found a fieldValue then break out of tis loop
            break;
        }

    } // end loopin trugh all fields in the info:

    return fieldNameValue;
}


/** findAllArrayItems
 takes a fieldName and searches trugh all attributes inside the currentData.
 when found it stores all values found in an array. This array is returned.
 If the fieldName is not found an empty array is returned. 
 */
function findAllArrayItems(fieldName, parent, currentData) {

    let arrayValues = [];
    let fieldNameValue;

    let currentDataSourceFieldsArray = Object.getOwnPropertyNames(currentData.source); // all field names in the source: attribute


    for (let sourceFieldNum = 0; sourceFieldNum < currentDataSourceFieldsArray.length; sourceFieldNum++) { // looping the array of source: attributes
        let sourceDataFieldName = currentDataSourceFieldsArray[sourceFieldNum]; // name of the attribute in the source:
        let sourceData = currentData.source[sourceDataFieldName]; //the record we are going to search eg insightly_something

        // now - if the field has a parent we need to include that in the getNested
        if (parent) {
            fieldNameValue = getNested(sourceData, parent, fieldName); // get the data stored in the fieldName
        } else {
            fieldNameValue = getNested(sourceData, fieldName); // get the data stored in the fieldName
        }

        if (fieldNameValue != undefined) { // there was a value there                

            if (Array.isArray(fieldNameValue)) { // check if it is an array 

                for (let i = 0; i < fieldNameValue.length; i++) { // loop the array
                    arrayValues.push(fieldNameValue[i]);
                }

            } else {
                // thats a problem - we expect the field to be a array
            }

        }



    } // end looping the array of info: attributes

    arrayValues = removeDuplicatesInArray(arrayValues);
    return arrayValues;
}


/** findAllCategories
 looks at the "categories" attributes for all attributes in the source: section 
 returns "none" is there are no categories
 */
function findAllCategories(currentData) {

    let foundCategories = false;

    let mergedCategories = {}; // where we store all categories

    let currentDataSourceFieldsArray = Object.getOwnPropertyNames(currentData.source); // all field names in the source: attribute

    for (let sourceFieldNum = 0; sourceFieldNum < currentDataSourceFieldsArray.length; sourceFieldNum++) { // looping the array of source: attributes
        let sourceDataFieldName = currentDataSourceFieldsArray[sourceFieldNum]; // name of the attribute in the source:
        let sourceData = currentData.source[sourceDataFieldName]; //the record we are going to search eg insightly_something

        // now - if the field has a parent we need to include that in the getNested
        let categoriesData = getNested(sourceData, "categories"); // get the categories 


        if (categoriesData != undefined) { // there was a value there                

            let categoryNamesArray = Object.getOwnPropertyNames(categoriesData); // names of all categories
            for (let catCount = 0; catCount < categoryNamesArray.length; catCount++) { //loop all categories
                let categoryFieldName = categoryNamesArray[catCount]; // name of the category
                let categoryAnswers = categoriesData[categoryFieldName]; // the array with all answers

                if (mergedCategories.hasOwnProperty(categoryFieldName)) { // the categoryFieldName property is there
                    // next we loop categoryAnswers and add them to the categoryFieldName
                    for (let answerCount = 0; answerCount < categoryAnswers.length; answerCount++) {
                        mergedCategories[categoryFieldName].push(categoryAnswers[answerCount]);
                    }
                    mergedCategories[categoryFieldName] = removeDuplicatesInArray(mergedCategories[categoryFieldName]);
                    foundCategories = true;
                } else { // we need to add the categoryFieldName as well
                    mergedCategories[categoryFieldName] = []; // create it first
                    // next we loop categoryAnswers and add them to the categoryFieldName
                    for (let answerCount = 0; answerCount < categoryAnswers.length; answerCount++) {
                        mergedCategories[categoryFieldName].push(categoryAnswers[answerCount]);
                    }
                    mergedCategories[categoryFieldName] = removeDuplicatesInArray(mergedCategories[categoryFieldName]);
                    foundCategories = true;
                }

            } // end looping categories
        } else { // the attribute does not contain categories
            //just ignore it - keep searching
        }

    } // end looping the array of info: attributes

    if (foundCategories) {
        return mergedCategories;
    } else
        return "none";


}

/** findAllNetworkmemberships
 takes the data.memberships as parameter. For each property here it return the networkmemberships.
 This so that there is a unique list of networks in an array. Should always return items in the array
 
 In the cae that this is a network. Then it will not have memberships. We will then return an empty array
 */
function findAllNetworkmemberships(memberships) {

    let newNetworkmemberships = [];

    if (memberships) { // there are network memberships here
        let membershipFieldsArray = Object.getOwnPropertyNames(memberships); // all field names in the memberships: attribute    


        for (let membFieldNum = 0; membFieldNum < membershipFieldsArray.length; membFieldNum++) { // looping the array of memberships: attributes
            let membFieldName = membershipFieldsArray[membFieldNum]; // name of the attribute in the info:
            let memberData = memberships[membFieldName]; //the record we are going to search eg insightly_something

            let networkmemberships = getNested(memberData, "networkmemberships"); // get the networkmemberships array


            if (networkmemberships != undefined) { // there was a value there                

                // now loop an push the values to newNetworkmemberships
                for (let netCount = 0; netCount < networkmemberships.length; netCount++) { //loop all networks
                    newNetworkmemberships.push(networkmemberships[netCount]);
                }

            } else { // There was no networks
                if (DISPLAYLOG) console.log("findAllNetworkmemberships: membFieldName:" + membFieldName + " has no networkmembership!")
            }

        } // end looping the array of info: attributes


        newNetworkmemberships = removeDuplicatesInArray(newNetworkmemberships);

    }

    return newNetworkmemberships;


}

/** findAllDomains
 takes the data.source as parameter. For each property we look for the fields "domain" and "domains"
 This so that there is a unique list of domains in an array. 
 Should always return items in the array 
 */
function findAllDomains(allSourceData) {

    let newDomainsArray = [];

    let sourceFieldNamesArray = Object.getOwnPropertyNames(allSourceData); // all field names in the source


    for (let sourceFieldCounter = 0; sourceFieldCounter < sourceFieldNamesArray.length; sourceFieldCounter++) { // looping the array of source's eg insightly, brreg and so on
        let sourceFieldName = sourceFieldNamesArray[sourceFieldCounter]; // name of the attribute in the source
        let sourceRecord = allSourceData[sourceFieldName]; //the record we are going to search eg insightly_something

        let sourceDomain = getNested(sourceRecord, "domain"); // get the domain if its there

        if (sourceDomain != undefined) newDomainsArray.push(sourceDomain); // store it

        let sourceDomainsArray = getNested(sourceRecord, "domains"); // get the domains array if its there


        if (sourceDomainsArray != undefined) { // there was a value there                

            // now loop an push the domains in the array 
            for (let domainCounter = 0; domainCounter < sourceDomainsArray.length; domainCounter++) { //loop all domans in te array
                newDomainsArray.push(sourceDomainsArray[domainCounter]);
            }

        }

    } // end looping the array of all source records


    newDomainsArray = removeDuplicatesInArray(newDomainsArray);

    return newDomainsArray;


}



/** removeDuplicatesInArray
 takes an array and return an array with no duplicates
 */
function removeDuplicatesInArray(data) {
    return [...new Set(data)]
}


/** generateNewMasterRecord
takes the .data part (currentData) of a merge record and returns a masterRecord (that is a merge of the data)
all fields defined in masterRecordStructure is included in the returned in te new masterRecord
Called every time something is written to the merge record

returns "none" if the record is not converted;
 */
export function generateNewMasterRecord(currentData) {

    let newMasterRecord = {}; // "none" if smething is not 
    let masterRecordStructure = MERGECONFIG.masterRecord;
    let mergePriorityArray = MERGECONFIG.mergepriority;
    let mergeFieldPriority = MERGECONFIG.mergefieldpriority;

    let newOrganizationMasterRecord = {}; // where we store the default data we find on a organization
    let newNetworkmemberships = []; // where we store the networks the organization is member of


    // first we need to get all the fields we are going to use for merging
    let mergeRecordFieldNameArray = Object.getOwnPropertyNames(masterRecordStructure); //get list of all properties i the MERGERECORD

    for (let MergeRecordFieldNum = 0; MergeRecordFieldNum < mergeRecordFieldNameArray.length; MergeRecordFieldNum++) { //loop the fields in a MERGERECORD
        let fieldName = mergeRecordFieldNameArray[MergeRecordFieldNum];

        // now we have he field name, but we dont know if it has further properties.
        // a property can be A) Field (num og string) B) an array C) an object containing objects/arrays D) categories
        // we must use the fields on the jobs2processArray[readyJob].organizationNumber sbn_insighty and so on - and NOT from the attributes n the info:


        if (fieldName == "categories") { // special handling of categories
            let categories = findAllCategories(currentData);
            if (categories != "none") { // test if categories are empty
                newOrganizationMasterRecord.categories = categories;
            }


        } else { // it has to be one of the A) to C) cases

            //let mergerecordFieldValue = config.MERGERECORD[fieldName]; // the field we are looking at      
            let mergerecordFieldValue = masterRecordStructure[fieldName]; // the field we are looking at      
            let isItObject = typeof mergerecordFieldValue == "object";
            let isItArray = Array.isArray(mergerecordFieldValue);

            let fieldNameValue;

            if (isItObject && !isItArray) {


                // if it's an objet we must loop the object 
                // first note the parent
                let parentFieldname = mergeRecordFieldNameArray[MergeRecordFieldNum];
                // then loop it's children
                Object.entries(mergerecordFieldValue).forEach(([key, value]) => {

                    //console.log("parentFieldname=" + parentFieldname + " key=" + key + " value=" + value);

                    fieldNameValue = findFirstField(mergePriorityArray, mergeFieldPriority, key, parentFieldname, currentData);
                    if (newOrganizationMasterRecord.hasOwnProperty(parentFieldname)) { // the parentFieldname property is there
                        if (fieldNameValue != undefined) { // only store a value if there is a value to store
                            newOrganizationMasterRecord[parentFieldname][key] = fieldNameValue; // store the value we found
                        }
                    } else { // we need to add the parentFieldname as well
                        if (fieldNameValue != undefined) { // only store a value if there is a value to store
                            newOrganizationMasterRecord[parentFieldname] = {}; // create it first
                            newOrganizationMasterRecord[parentFieldname][key] = fieldNameValue; // store the value we found
                        }

                    }


                });
            } else {

                if (isItObject && isItArray) { // its an array

                    //console.log("its an array");
                    fieldNameValue = findAllArrayItems(fieldName, null, currentData);
                    if (fieldNameValue.length > 0) {
                        newOrganizationMasterRecord[fieldName] = fieldNameValue; // store the value(s) we found
                    }


                } else { // not object and not array - just copy the key and value

                    fieldNameValue = findFirstField(mergePriorityArray, mergeFieldPriority, fieldName, null, currentData);
                    // we can get a object or just a string here. 
                    //This means that it can also be an empty object or string - and that we do not want to store

                    let copyValue = true;
                    if (fieldNameValue) { // we have a velue - lets examine it

                        if (typeof fieldNameValue == "object") {
                            if (Object.entries(fieldNameValue).length === 0) {
                                copyValue = false; // its an empty object
                            }
                        } else {
                            if (!fieldNameValue) {
                                copyValue = false; // its an empty or null value
                            }
                        }
                    } else { // no value
                        copyValue = false; // its an empty or null value
                    }

                    if (copyValue) {
                        newOrganizationMasterRecord[fieldName] = fieldNameValue; // store the value we found
                    }

                }


            }


        }


    } // end looping trugh all fields in a MERGERECORD


    // loop all source data for domain and domains and return all of them in one array
    newOrganizationMasterRecord.domains = findAllDomains(currentData.source);

    // then we need to look at the netwok membership
    newNetworkmemberships = findAllNetworkmemberships(currentData.memberships);

    // then- before we write the update we need to put the parameters right
    newMasterRecord.organization = newOrganizationMasterRecord;
    newMasterRecord.networkmemberships = newNetworkmemberships
    newMasterRecord.urbalurbaScrapeDate = new Date().toISOString();




    return newMasterRecord;


}



/** canStartMergeJob
 If a jobName exists the status is updated. If it does not exist it is created 
 returns true if 
 */
export async function canStartMergeJob(config, jobName, newStatus, statusMessage) {

    let canStartJob = false;
    let resourceBlocked = await isMergeJobTypeBlocked(config); // check if the job is using resources that cannot run in paralell

    if (!resourceBlocked || newStatus == MERGEJOB_FINISHED) { // if it is a signal to stop it wedont care about the resourceBlocked

        let mergeJob = await getMergeJobStatus(config, jobName);
        if (mergeJob != "none") { // if there a status there
            if (mergeJob.jobStatus == MERGEJOB_RUNNING) { // process is already running
                if (newStatus == MERGEJOB_FINISHED) { // the job is finished - we need to mark it finished

                    let updateResult = await updateMergeJobStatus(config, jobName, newStatus, mergeJob.id, mergeJob.jobLog, statusMessage);
                    canStartJob = true; // indicating that we could stop it
                } else { // the job is running and we must not start it again
                    canStartJob = false;
                    // do nothing
                }

            } else { // job is not running - we can start it
                let updateResult = await updateMergeJobStatus(config, jobName, newStatus, mergeJob.id, mergeJob.jobLog, statusMessage);
                canStartJob = true;
            }

        } else { // there is no status there

            let createResult = await createMergeJobStatus(config, jobName, newStatus, statusMessage)
            canStartJob = true;

        }
    }

    return canStartJob;
}

/** getMergeJobStatus
 Returns the mergeJob record if the jobName exists.
 returns "none" if it does not exist. 
 */
async function getMergeJobStatus(config, jobName) {

    let strapiRequestURL = config.STRAPIURI + MERGEJOB_DATASET + "?jobName=" + jobName;
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
        let logTxt = "1.9 getMergeJobStatus catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    if (data.length == 0) {
        data = "none"; // no results
    } else {
        data = data[0]; // the first entry
    }
    return data;

}

/** updateMergeJobStatus
 Updates the status on a job
 */
async function updateMergeJobStatus(config, jobName, jobStatus, mergeJobID, jobLog, statusMessage) {


    let strapiRequestURL = config.STRAPIURI + MERGEJOB_DATASET + "/" + mergeJobID;

    jobLog = addJobLog(jobName, statusMessage, jobStatus, jobLog);

    let mergeJob = {
        jobName: jobName,
        statusTime: new Date().toISOString(),
        jobName: jobName,
        jobLog: jobLog,
        jobStatus: jobStatus,
        blockJobType: config.BLOCKJOBTYPE
    };

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
                data: JSON.stringify(mergeJob)
            }
        );
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 updateMergeJobStatus catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

}


/** createMergeJobStatus
 
 */
async function createMergeJobStatus(config, jobName, jobStatus, statusMessage) {

    let strapiRequestURL = config.STRAPIURI + MERGEJOB_DATASET;

    let jobLog = null;
    jobLog = addJobLog(jobName, statusMessage, jobStatus, jobLog);

    let mergeJob = {
        jobName: jobName,
        statusTime: new Date().toISOString(),
        jobLog: jobLog,
        jobStatus: jobStatus,
        blockJobType: config.BLOCKJOBTYPE
    };

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
                data: JSON.stringify(mergeJob)
            }
        );
        data = result.data;

    }
    catch (e) {
        let logTxt = "1.9 createMergeJobStatus catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;


}


/** isMergeJobTypeBlocked
 Some jobs use resources that cannot be used in paralell.
 Eg Apify that creates a directory named apify_storage 
 returns false if there is no blocking job and true it there is.
The field blockJobType is used to indicate that the job requires blocking.

 */
async function isMergeJobTypeBlocked(config) {

    let runningInParalell = false;

    if (config.BLOCKJOBTYPE) { // only do test if the job is using a resource that cannot run in paralell


        let strapiRequestURL = config.STRAPIURI + MERGEJOB_DATASET + "?blockJobType=" + config.BLOCKJOBTYPE + "&jobStatus=" + MERGEJOB_RUNNING;
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
            let logTxt = "1.9 isMergeJobTypeBlocked catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
            console.error(logTxt);
            debugger
        }

        if (data.length > 0) {
            runningInParalell = true;
        }


    }

    return runningInParalell;

}

/** getMergesByDomanANDentitytype
    simple and not complete version - sraches only in the domain field- it must also search the domains array
    
    takes a domain and its entitytype - returns an array with merge records
    if found it contains records - if not it is empty.
    if there is an API error "none" is returned
     */
export async function getMergesByDomanANDentitytype(config, domain, entitytype) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "?entitytype=" + entitytype + "&domain=" + domain;
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
        let logTxt = "1.9 getMergesByDomanANDentitytype catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

}

/** getMergesByUrbalurbaIdNameANDentitytype
    
    takes a urbalurbaIdName and its entitytype - returns an array with merge records
    if found it contains records - if not it is empty.
    if there is an API error "none" is returned
     */
export async function getMergesByUrbalurbaIdNameANDentitytype(config, urbalurbaIdName, entitytype) {

    let strapiRequestURL = config.STRAPIURI + MERGE_DATASET + "?entitytype=" + entitytype + "&urbalurbaIdName=" + urbalurbaIdName;
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
        let logTxt = "1.9 getMergesByUrbalurbaIdNameANDentitytype catch error :" + JSON.stringify(e) + " =>result is:" + JSON.stringify(result);
        console.error(logTxt);
        debugger
    }

    return data;

}


/** findMergesByDomains
 Takes an array of domains and search in merge for records that has these domain names
 a merge has its primary domain in the domain field and its asociated domains in domains array.
 Returns an array with the merge records that has the domains.
 If there are none, then a empty array is returned
 
duplicate merges are removed from the returned array -TODO
 
 */
export async function findMergesByDomains(searchDomainNameArray, config) {

    let returnMergeArray = [];


    for (let i = 0; i < searchDomainNameArray.length; i++) { // loop the domains
        let searchIdName = searchDomainNameArray[i];
        let existingMergeRecordArray = await getMergesByDomanANDentitytype(config, searchIdName, config.ENTITYTYPE_OUTPUT);
        if (existingMergeRecordArray.length > 0) { // we found one or more merge's
            // now we will store them in returnMergeArray
            for (let j = 0; j < existingMergeRecordArray.length; j++) { // loop the merges found
                returnMergeArray.push(existingMergeRecordArray[j]);
            }
        }
    }

    //TODO: remove duplicates
    return returnMergeArray;
}

