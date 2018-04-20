const express = require('express')
const app = express()
const {version} = require('./models/version')
const env = require('common-env')()
const config = env.getOrElseAll({
  workspaces: ['staging', 'qa']
})

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  const workspaces = config.workspaces
  const size = config.workspaces.length
  let versions = []
  let i = 0
  workspaces.forEach((element) => {
    version(element, (err, stdout) => {
      i = i + 1
      let color = 'green'
      let message = stdout
      if (err || stdout === 'error') {
        color = 'red'
        message = 'error'
      } else if (stdout === 'v0.0.1' || stdout === 'v0.0.2') {
        color = 'purple'
      } else if (stdout === 'v0.0.3' || stdout === 'v0.1.0' || stdout === 'v0.1.1') {
        color = 'blue'
      }
      versions[element] = {message, color}
      if (i === size) {
        let mytable = '<table>'
        mytable = mytable.concat('<tr><th>Workspace</th><th>Version</th></tr>')
        Object.keys(versions).sort().forEach((k) => {
          mytable = mytable.concat(`<tr bgcolor="${versions[k].color}"><td>${k}</td><td>${versions[k].message}</td></tr>`)
        })
        mytable = mytable.concat('</table>')
        return res.render('index', {mytable})
      }
    })
  })
})

app.get('/status', function (req, res) {
  res.send('OK')
})

app.listen(8000, () => console.log('A consul application that listen on port 8000!'))
