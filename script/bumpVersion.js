#!/usr/bin/env node

const cp = require("child_process");
const inquirer = require("inquirer");
const QUESTION_DEFAULT = [
  {
    name: "bumpVersion",
    type: "confirm",
    message: "是否升级版本号？"
  },
  {
    type: "list",
    name: "versionType",
    message: "请选择升级版本类型",
    choices: [
      {
        name: "alpha（开发测试）",
        value: "alpha"
      },
      {
        name: " 补丁号（bug修复）",
        value: "patch"
      },
      {
        name: "次版本号（兼容升级）",
        value: "minor"
      },
      new inquirer.Separator(),
      {
        name: "自定义版本号",
        value: "custom"
      }
    ]
  }
];

const QUESTION_CUSTOM = [
  {
    name: "customVersion",
    type: "input",
    message: "请输入指定版本号（示例：1.0.1）",
    validate: function(input) {
      var done = this.async();
      if (/\d+.\d+.\d+/.test(input)) {
        done(null, true);
      } else {
        done("请输入正确格式的版本号");
      }
    }
  }
];

function customFillVersion(params) {
  inquirer.prompt(QUESTION_CUSTOM).then(({ customVersion }) => {
    execShell({ ...params, customVersion });
  });
}

function execShell(params) {
  console.log("params==>", params);
  let cmd;
  // * 自定义版本号
  if (params.customVersion) {
    cmd = `--release-as ${params.customVersions}`;
  }

  switch (params.versionType) {
    case "alpha":
      cmd = "--prerelease alpha";
      break;
    case "patch":
      cmd = "--release";
      break;
    case "minor":
      cmd = "--release minor";
      break;
    default:
      break;
  }

  if (!cmd) {
    console.error("版本类型错误");
    return;
  }

  cp.exec(`standard-version ${cmd}`, (error, stdout, stderr) => {
    console.log("stdout", stdout);
  });
}

inquirer.prompt(QUESTION_DEFAULT).then(params => {
  // * 自定义版本号
  if (params.versionType == "custom") {
    customFillVersion(params);
  } else {
    execShell(params);
  }
});
