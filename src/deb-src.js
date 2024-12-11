const exec = require('@actions/exec')
const core = require('@actions/core')
const io = require('@actions/io')

async function build_deb_src(sourceDir, outputDir, gitRefName) {
  try {
    await exec.exec('sudo DEBIAN_FRONTEND=noninteractive apt-get update')

    await exec.exec(
      'sudo DEBIAN_FRONTEND=noninteractive apt install -y devscripts equivs git-buildpackage'
    )

    let options = {}
    options.cwd = sourceDir
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

    // Making dir
    await io.mkdirP(realOutputPath)

    // Move files to the output directory
    options = {}
    options.cwd = sourceDir

    await exec.exec(
      'bash',
      ['-c', `"mv -f ../*.dsc ${realOutputPath}"`],
      options
    )
    await exec.exec(
      'bash',
      ['-c', `"mv -f ../*.changes ${realOutputPath}"`],
      options
    )
    await exec.exec(
      'bash',
      ['-c', `"mv -f ../*.tar.* ${realOutputPath}"`],
      options
    )

    await exec.exec(`ls -l ${realOutputPath}`)
  } catch (error) {
    // 如果发生错误，使工作流运行失败
    core.setFailed(error.message)
  }
}

module.exports = { build_deb_src }
