const core = require('@actions/core')
const { build_deb_src } = require('./deb-src')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    // Get user input form workflow
    const addSuffix = core.getBooleanInput('add-suffix', { required: true })
    const buildBinary = core.getBooleanInput('build-binary', { required: true })
    const buildSource = core.getBooleanInput('build-source', { required: true })
    let sourceDir = core.getInput('source-dir')
    let outputDir = core.getInput('output-dir')
    let gitRefName = core.getInput('git-ref-name')

    // If source-dir is not set, use the default value
    if (!sourceDir) {
      sourceDir = `${process.env.GITHUB_WORKSPACE}`
    }
    // If output-dir is not set, use the default value
    if (!outputDir) {
      outputDir = `${process.env.GITHUB_WORKSPACE}/debian-src-tarball`
    }
    // If gir-ref-name is not set, use the default value
    if (!gitRefName) {
      gitRefName = `${process.env.GITHUB_REF}`
    }

    if (buildSource) {
      build_deb_src(sourceDir, outputDir, gitRefName, addSuffix)
    }

    if (buildBinary) {
      // TODO: Implement build_binary function
      core.info('Build binary not implemented yet')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
