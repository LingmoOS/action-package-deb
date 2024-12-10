const exec = require('@actions/exec')
const core = require('@actions/core')

async function build_deb_src() {
  try {
    await exec.exec('sudo apt-get update')

    await exec.exec('sudo apt install -y devscripts equivs')

    await exec.exec('debuild --preserve-env --no-lintian -d -S -us -uc')

    await exec.exec('rm -rf ./debian-src-tarball')
    await exec.exec('mkdir -p ./debian-src-tarball')

    await exec.exec('mv -f ../*.dsc ./debian-src-tarball')
    await exec.exec('mv -f ../*.changes ./debian-src-tarball')
    await exec.exec('mv -f ../*.tar.* ./debian-src-tarball')

    await exec.exec('realpath ./debian-src-tarball')
    await exec.exec('ls -l ./debian-src-tarbal')
  } catch (error) {
    // 如果发生错误，使工作流运行失败
    core.setFailed(error.message)
  }
}

module.exports = { build_deb_src }
