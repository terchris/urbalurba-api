/** githublib.js
 * we use github to store urbalurba configuration files.
 * The files are 
 *  entitytypes - defining what types of entities (organization, project, event) that can be stored
 *  categories - defining the categories that the entities can be caterorized in
 * 
 * The repository is https://github.com/terchris/urbalurba-data
 * 
 * when installing a new system these files are read using a simple fetch 
 * 
 * This lib (githublib.js) deals with how to update these configuration files
 * 
 * code borrowed from 
 * https://blog.dennisokeeffe.com/blog/2020-06-22-using-octokit-to-create-files
 * https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0
 * 
 * 
 */
import Octokit from '@octokit/rest'
//const { Octokit } = require("@octokit/rest"); //MUST RENAME THE FILE TO .cjs 

const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const GITHUB_OWNER = "terchris";
const GITHUB_REPO = "urbalurba-data";
const GITHUB_MESSAGE = "added programatically by urbalurba-api githublib.js";

const GITHUB_COMMITTER = {
  name: `urbalurba-api`,
  email: "terje@businessmodel.io",
};

const GITHUB_AUTHOR = {
  name: `urbalurba-api`,
  email: "terje@businessmodel.io",
};


const octokit = new Octokit({
  auth: GITHUB_ACCESS_TOKEN,
});






/** updateGithubConfigFile
 * takes a filename and the content i nthe filename and updates it in the github repository
 * Returns true if OK otherwise false
 * @param filename 
 * @param fileContent 
 * @returns 
 */
export async function updateGithubConfigFile(filename, fileContent) {
  let returnResult = true;

  try {
    let buff = Buffer.from(fileContent); // create buffer
    let contentEncoded = buff.toString('base64'); //encode to base64
    const sha = await getGithubSHA(filename);

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filename,
      message: GITHUB_MESSAGE,
      content: contentEncoded,
      committer: GITHUB_COMMITTER,
      author: GITHUB_AUTHOR,
      sha,
    });

    //console.log(data);
  } catch (err) {
    console.error(err);
    returnResult = false;
  }

  return returnResult;

}

/** getGithubSHA
 * gets the point where a file can be updated. 
 */
 async function getGithubSHA(path) {
  const result = await octokit.repos.getContent({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
  });

  const sha = result?.data?.sha;

  return sha;
}



//test_updateGithubConfigFile("testconfig3.json", ` { "content": "hello5", "message": "jalla5"} `);

/*
async function test_updateGithubConfigFile(filename, fileContent) {
  let returnResult = await updateGithubConfigFile(filename, fileContent);
  return returnResult;
}
*/

