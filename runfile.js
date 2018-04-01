const { run, help } = require('runjs')
const dotenv = require('dotenv')
const fs = require('fs')
const os = require('os')
const request = require('request-promise')
const unzip = require('unzip')

const containers = {
  demo: {
    name: 'gregoryguillou/terraform-stacks',
    version: 'latest',
    path: 'demo'
  }
}

const terraformVersion = '0.11.5'

function build () {
  dotenv.config()
  process.chdir(containers.demo.path)
  run(`docker build --build-arg CACHEBUST=$(date +%s) -t ${containers.demo.name}:${containers.demo.version} .`)
}

function clean () {
  run(`docker rmi ${containers.demo.name}:${containers.demo.version}`)
}

function terraform () {
  const zipFile = `terraform_${terraformVersion}_${os.platform()}_amd64.zip`
  const target = {
    zipFile: zipFile,
    zipUrl: `https://releases.hashicorp.com/terraform/${terraformVersion}/${zipFile}`,
    zipContent: 'terraform',
    file: `terraform_${terraformVersion}`,
    alias: 'terraform'
  }
  tool(target)
}

function tool (target) {
  if (!fs.existsSync('tools')) {
    fs.mkdirSync('tools', 0o755)
  }

  if (!fs.existsSync(`tools/${target.file}`)) {
    const options = {
      url: target.zipUrl,
      encoding: null
    }

    request.get(options)
      .then(function (res) {
        const buffer = Buffer.from(res, 'utf8')
        const tempfile = `tools/${target.file}.download`
        fs.writeFileSync(tempfile, buffer)

        fs.createReadStream(`${tempfile}`)
          .pipe(unzip.Parse())
          .on('entry', function (entry) {
            var fileName = entry.path
            if (fileName === target.zipContent) {
              entry.pipe(fs.createWriteStream(`tools/${target.file}`, { mode: 0o755 }))
            }
          })
          .on('finish', function () {
            fs.unlinkSync(`${tempfile}`)
            fs.symlinkSync(fs.realpathSync(`tools/${target.file}`), `tools/${target.alias}`)
          })
      })
  }
}

help(build, {
  description: 'Build the docker containers',
  examples: `
    npx run build
  `
})

module.exports = {
  build,
  clean,
  terraform
}
