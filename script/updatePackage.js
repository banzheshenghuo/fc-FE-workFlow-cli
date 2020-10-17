let resolve = require("path").resolve;
let fs = require("fs");

const PACKAGE_CONFIG = {
  commitizen: {
    path: "node_modules/cz-customizable"
  },
  "cz-customizable": {
    config: "node_modules/fc-fe-workflow-cli/script/commitMessageConfig.js"
  }
};

const PACKAGE_STANDARD_VERSION_CONFIG = {
  scripts: {
    postchangelog:
      "conventional-changelog  -i CHANGELOG.md -n node_modules/fc-fe-workflow-cli/script/generateChangelog.js  -s -r 0"
  }
};

const PACKAGE_SCRIPTS = {
  commit: "git-cz",
  bump: "node node_modules/fc-fe-workflow-cli/script/bumpVersion.js"
  // release: "standard-version",
  // prerelease: "standard-version --prerelease alpha && npm run init-changelog",
  // "init-changelog":
  //   "conventional-changelog  -i CHANGELOG.md -n node_modules/fc-fe-workflow-cli/script/generateChangelog.js  -s -r 0",
  // "update-changelog":
  // "conventional-changelog  -i CHANGELOG.md -n node_modules/fc-fe-workflow-cli/script/generateChangelog.js  -s -r 2"
};

fs.readFile(resolve(__dirname, "../../../package.json"), "utf8", (err, str) => {
  // console.log("read package.json data", str);
  const data = JSON.parse(str);

  // * 修改package.json config和script
  data.config = Object.assign({}, data.config, PACKAGE_CONFIG);
  data.scripts = Object.assign({}, data.scripts, PACKAGE_SCRIPTS);
  data["standard-version"] = Object.assign(
    {},
    data["standard-version"],
    PACKAGE_STANDARD_VERSION_CONFIG
  );

  fs.writeFileSync(
    resolve(__dirname, "../../../package.json"),
    JSON.stringify(data, "", "\t")
  );
});
