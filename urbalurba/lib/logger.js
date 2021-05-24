/** logger 
 logger.error(errorMessage, { "idName": currentGeonorgeLookupRecord.idName ,"location": location, "organizationNumber": currentGeonorgeLookupRecord.organizationNumber ,"jobName": config.JOBNAME }); 
 
 winston is used for logging. https://www.npmjs.com/package/winston

 winston can use different cloud logging services. 
 Currently this one is using coralogix https://www.npmjs.com/package/coralogix-logger-winston
 If we need to change logging provider . then change it here and i will be used everywhere

env files contain config:
WINSTON_PRIVATEKEY=
These can be used. Use only to override default
WINSTON_APPLICATIONNAME=
WINSTON_SUBSYSTEMNAME=
 */

import dotenv from "dotenv";
dotenv.config();

const WINSTON_PRIVATEKEY = process.env.WINSTON_PRIVATEKEY || "helvete You must set it";
const WINSTON_APPLICATIONNAME = process.env.WINSTON_APPLICATIONNAME || "urbalurba-job";
const WINSTON_SUBSYSTEMNAME = process.env.WINSTON_SUBSYSTEMNAME || "backend";

import winston from "winston";
import {CoralogixTransport} from "coralogix-logger-winston";
 
const MESSAGE = Symbol.for('message');

const loggerConfig = {
    privateKey: WINSTON_PRIVATEKEY,
    applicationName: WINSTON_APPLICATIONNAME,
    subsystemName: WINSTON_SUBSYSTEMNAME
}
 
CoralogixTransport.configure(loggerConfig);
 

const jsonFormatter = (logEntry) => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry)
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
  }

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format(jsonFormatter)(),
    //transports: new winston.transports.Console(),
    transports:[new CoralogixTransport({
        category:"urbalurba"
    })]
  });

  
//examples
//  logger.error(errorMessage, { "idName": currentGeonorgeLookupRecord.idName ,"location": location, "organizationNumber": currentGeonorgeLookupRecord.organizationNumber ,"jobName": config.JOBNAME });
//logger.info('my message', { "jobName": "geonorge2merge", "idName": "ivar.no" })
//logger.warn('a warning', { "jobName": "geonorge2merge", "idName": "ivar.no" })
//logger.error('an error', { "jobName": "geonorge2merge", "idName": "ivar.no" })
