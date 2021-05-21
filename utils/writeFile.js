const fs = require('fs')

module.exports = (content, filePath, fileName) => new Promise((resolve, reject) => {
  // const dataBuffer = new Buffer(content, 'base64')
  fs.writeFile(`${filePath}/${fileName}`, content, 'base64', function (err) {
    console.log(err)
  })
})
