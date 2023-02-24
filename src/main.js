const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
  try {
    
    const credentialsJson = core.getInput('credentials_json');
    const gcpProject = core.getInput('gcp_project');
    const gcpRegistry = core.getInput('gcp_registry');
    const gcpRepository = core.getInput('gcp_repository');
    const imageName = core.getInput('image_name');
    const imageTag = core.getInput('image_tag');

    // Set up authentication
    // await exec.exec(`echo "${credentialsJson}" > keyfile.json`);

    await fs.writeFileSync('keyfile.json', credentialsJson);
    await exec.exec(`gcloud auth activate-service-account --key-file=./keyfile.json`);
    await exec.exec(`gcloud auth configure-docker --quiet ${gcpRegistry}`);
    await fs.unlinkSync('keyfile.json');

    // Build and push the Docker image
    await exec.exec(`docker build -t ${imageName} .`);
    await exec.exec(`docker tag ${imageName} ${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName}:${imageTag}`);
    await exec.exec(`docker push ${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName}:${imageTag}`);

    // Get the URI of the Docker image in Google Container Registry
    core.setOutput('image_uri', `${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName}@${imageTag}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();