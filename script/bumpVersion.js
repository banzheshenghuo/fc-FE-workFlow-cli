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
    name: "prefix",
    type: "input",
    message: "请输入tag前缀（选填）"
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
  let cmdWithVersion;
  const tagPrefix = params.prefix ? `-t ${params.prefix}` : "";
  // * 自定义版本号
  if (params.customVersion) {
    cmdWithVersion = `--release-as ${params.customVersions}`;
  }

  switch (params.versionType) {
    case "alpha":
      cmdWithVersion = "--prerelease alpha";
      break;
    case "patch":
      cmdWithVersion = "--release";
      break;
    case "minor":
      cmdWithVersion = "--release minor";
      break;
    default:
      break;
  }

  if (!cmdWithVersion) {
    console.error("版本类型错误");
    return;
  }

  const cmd = `standard-version  ${cmdWithVersion} ${tagPrefix} --no-verify`;

  cp.exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log("操作失败");
    } else {
      console.log("操作成功");
    }
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
