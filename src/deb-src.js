const exec = require('@actions/exec')
const core = require('@actions/core')
const io = require('@actions/io')

async function build_deb_src(sourceDir, outputDir, gitRefName) {
  try {
    let options = {}

    await exec.exec('sudo DEBIAN_FRONTEND=noninteractive apt-get update')

    await exec.exec(
      'sudo DEBIAN_FRONTEND=noninteractive apt install -y devscripts equivs git-buildpackage'
    )

    // Get realpath of the output directory
    // Assuming relative to the workspace dir.
    let realOutputPath = ''
    options = {}
    options.cwd = `${process.env.GITHUB_WORKSPACE}`
    options.listeners = {
      stdout: data => {
        realOutputPath = data.toString().replace(/[\r\n]/g, '')
      }
    }
    await exec.exec('realpath', [outputDir], options)

    // Get realpath of the source directory
    // Assuming relative to the workspace dir.
    let realSourcePath = ''
    options = {}
    options.cwd = `${process.env.GITHUB_WORKSPACE}`
    options.listeners = {
      stdout: data => {
        realSourcePath = data.toString().replace(/[\r\n]/g, '')
      }
    }
    await exec.exec('realpath', [sourceDir], options)

    options = {}
    options.cwd = realSourcePath
    await exec.exec(
      'gbp',
      [
        'buildpackage',
        '--git-ignore-new',
        '--git-no-pbuilder',
        `--git-upstream-tree=${gitRefName}`,
        '--git-force-create',
        '--git-builder=dpkg-buildpackage',
        '-d',
        '-S',
        '-us',
        '-uc'
      ],
      options
    )

    // Making dir
    await io.mkdirP(realOutputPath)

    await exec.exec(
      'bash',
      ['-c', `"mv -f ${realSourcePath}/*.dsc ${realOutputPath}"`],
      options
    )
    await exec.exec(
      'bash',
      ['-c', `"mv -f ${realSourcePath}/*.changes ${realOutputPath}"`],
      options
    )
    await exec.exec(
      'bash',
      ['-c', `"mv -f ${realSourcePath}/*.tar.* ${realOutputPath}"`],
      options
    )

    await exec.exec(`ls -l ${realOutputPath}`)
  } catch (error) {
    // 如果发生错误，使工作流运行失败
    core.setFailed(error.message)
  }
}

module.exports = { build_deb_src }
