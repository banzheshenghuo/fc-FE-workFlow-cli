let resolve = require("path").resolve;
let fs = require("fs");

const PACKAGE_CONFIG = {
  commitizen: {
    path: "node_modules/cz-customizable",
  },
  "cz-customizable": {
    config: "config/commitMessageConfig.js",
  },
  test: "test",
};

const PACKAGE_SCRIPT = {};

fs.readFile(resolve(__dirname, "../../../package.json"), "utf8", (err, str) => {
  // console.log("read package.json data", str);
  const data = JSON.parse(str);

  // * 修改package.json config和script
  data.config = Object.assign({}, data.config, PACKAGE_CONFIG);

  fs.writeFileSync(
    resolve(__dirname, "../../../package2.json"),
    JSON.stringify(data, "", "\t")
  );
});
