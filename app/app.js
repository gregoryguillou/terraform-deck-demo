const express = require('express')
const app = express()
const {version} = require('./models/version')

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  const workspace = req.params.workspace || 'staging'
  version(workspace, (err, stdout) => {
    if (err) {
      return res.render('index', { title: workspace, message: 'error', color: 'red' })
    }
    if (stdout === 'error') {
      return res.render('index', { title: workspace, message: stdout, color: 'red' })
    }
    if (stdout === 'v0.0.1' || stdout === 'v0.0.2') {
      return res.render('index', { title: workspace, message: stdout, color: 'purple' })
    }
    if (stdout === 'v0.0.3') {
      return res.render('index', { title: workspace, message: stdout, color: 'blue' })
    }
    return res.render('index', { title: workspace, message: stdout, color: 'green' })
  })
})

app.get('/status', function (req, res) {
  res.send('OK')
})

app.listen(8000, () => console.log('A consul application that listen on port 8000!'))
