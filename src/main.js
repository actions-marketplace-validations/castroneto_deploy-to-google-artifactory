const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const credentialsJson = core.getInput('credentials_json');
    const gcpProject = core.getInput('gcp_project');
    const gcpRegistry = core.getInput('gcp_registry');
    const gcpRepository = core.getInput('gcp_repository');
    const imageName = core.getInput('image_name');
    const imageTag = core.getInput('image_tag');

    // Set up authentication
    await exec.exec(`echo "${credentialsJson}" > /tmp/keyfile.json`);
    await exec.exec(`gcloud auth activate-service-account --key-file=/tmp/keyfile.json`);
    await exec.exec(`gcloud auth configure-docker ${gcpRegistry}`);

    // Build and push the Docker image
    await exec.exec(`docker build -t ${imageName} .`);
    await exec.exec(`docker tag ${imageName} ${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName}:${imageTag}`);
    await exec.exec(`docker push ${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName}:${imageTag}`);

    // Get the URI of the Docker image in Google Container Registry
    let imageUri = '';
    const options = {
      listeners: {
        stdout: (data) => {
          imageUri += data.toString();
        },
      },
    };
    await exec.exec(`gcloud container images list-tags ${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName} --format='get(digest)'`, [], options);

    // Set the output
    core.setOutput('image_uri', `${gcpRegistry}/${gcpProject}/${gcpRepository}/${imageName}@${imageUri}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();