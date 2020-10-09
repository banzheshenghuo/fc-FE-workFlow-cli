#!/usr/bin/env node

const process = require("child_process");

process.exec("node -v", (error, stdout, stderr) => {
  console.log(stdout);
});
