var express = require('express')

var app = express()

app.use(express.static(__dirname))
app.get('/*', function(req, res) {
  res.sendFile('./index.html', {root: __dirname})
})

var ips  = '0.0.0.0'
var port = process.env.PORT || 3000
app.listen(port, ips)
console.log(''.concat('Server listening on http://'+ips+':'+port))
