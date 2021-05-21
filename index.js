#!/usr/bin/env node

// Native
const fs = require('fs')
const path = require('path')

// Packages
const { prompt } = require('enquirer')

// Functions
const resolve = dir => path.join(__dirname, dir)
const parseCookies = require('./utils/parseCookies')
const httpClient = require('./utils/httpClient')
const writeFile = require('./utils/writeFile')

//
const cookiesFile = fs.readFileSync(resolve('./private/cookies.txt'), 'utf8')

const cookies = parseCookies(cookiesFile)
// 210923624119

  // console.log(cookies)
  // process.exit(1)

;(async () => {
  const { mallGoods } = require('./input/2.json')
  console.log(mallGoods)
  for (const goods of mallGoods) {
    const ret = await httpClient(cookies, 'goods', goods.goodsId)
    writeFile(ret, resolve('./output'), `${goods.goodsId}_${goods.goodsName}.png`)
  }
  // const ret = await httpClient(cookies, 'mall', '763852487')
  // writeFile(ret, resolve('./output'), '763852487-tongyou.png')
  // console.log('ret', ret)
  // const response = await prompt([
  //   {
  //     type: 'input',
  //     name: 'name',
  //     message: 'What is your name?'
  //   },
  //   {
  //     type: 'input',
  //     name: 'username',
  //     message: 'What is your username?'
  //   }
  // ])
  //
  // console.log(response)
})()


