const core = require('@actions/core')
const { wait } = require('./wait')
const { build_deb_src } = require('./deb-src')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    build_deb_src()
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
