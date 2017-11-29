#!/usr/bin/env node
'use strict'

const program = require('commander')
const chokidar = require('chokidar')
const spawn = require('child_process').spawn
const path = require('path')

program
  .usage('-f helloWorld -p ./ -n index.js')
  .option('-f, --functions <value>', 'functions name', (arg1, arg2) => {
    return arg1.split(',').map((f) => {
      return 'functions:' + f
    }).join(',')
  }, 'functions')
  .option('-p, --path <value>', 'watch path', toString, './')
  .option('-n, --filename <value>', 'watch filename', toString, '*.js')
  .parse(process.argv)

var pre_process

const watcher = chokidar.watch(path.join(program.path, program.filename), { })
watcher.on('all', (event, path) => {
  console.log(event, path)

  if (pre_process) {
    pre_process.kill()
  }

  const deploy = spawn('firebase', ['deploy', '--only', program.functions], { stdio: "inherit" })
  pre_process = deploy

  deploy.on('data', (data) => {
    process.stdout.write(data.toString())
  })
})
