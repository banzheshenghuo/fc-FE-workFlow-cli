"use strict";

let conventionalChangelogAngularPromise = require("conventional-changelog-angular");
let compareFunc = require("compare-func");
let Q = require("q");
let readFile = Q.denodeify(require("fs").readFile);
let resolve = require("path").resolve;

let parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
  headerCorrespondence: ["type", "scope", "subject"],
  noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
  revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ["header", "hash"]
};

let writerOpts = {
  transform: function(commit, context) {
    // * 排除scope不规范的commit
    if (!/\w+-\d+/.test(commit.scope)) return null;

    let discard = true;
    let issues = [];

    commit.notes.forEach(function(note) {
      note.title = "BREAKING CHANGES";
      discard = false;
    });

    if (typeof commit.hash === "string") {
      commit.hash = commit.hash.substring(0, 7);
    }

    const issueUrl = context.packageData.bugs && context.packageData.bugs.url;

    commit.references = commit.references
      .filter(reference => issues.indexOf(reference.issue) === -1)
      .map(reference => formatIssue(issueUrl, reference.issue))
      .join(", ");
    console.log("commit===>", commit);
    return commit;
  },
  groupBy: "scope",
  // commitGroupsSort: "version",
  // commitsSort: "committerDate:",
  // commitsSort: ["scope", "subject"],
  noteGroupsSort: "title",
  notesSort: compareFunc
};

module.exports = Q.all([
  readFile(resolve(__dirname, "../templates/template.hbs"), "utf-8"),
  readFile(resolve(__dirname, "../templates/header.hbs"), "utf-8"),
  readFile(resolve(__dirname, "../templates/commit.hbs"), "utf-8"),
  readFile(resolve(__dirname, "../templates/footer.hbs"), "utf-8"),
  conventionalChangelogAngularPromise
]).spread(function(
  template,
  header,
  commit,
  footer,
  conventionalChangelogAngular
) {
  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return {
    recommendedBumpOpts: conventionalChangelogAngular.recommendedBumpOpts,
    parserOpts: parserOpts,
    writerOpts: writerOpts,
    conventionalChangelog: {
      parserOpts: parserOpts,
      writerOpts: writerOpts
    }
  };
});

/**
 * Formats issues using the issueURL as the prefix of the complete issue URL
 * @param {string} issueUrl - if the issueURL is falsy, then the issue will be printed as-is. Otherwise, it will be printed as a link
 * @param {string} issue - the issue reference (without the # in-front of it)
 * @return {string} - Either the issue or a Markdown-formatted link to the issue.
 */
function formatIssue(issueUrl, issue) {
  if (issueUrl) {
    return "[#" + issue + "](" + issueUrl + "/" + issue + ")";
  } else {
    return "#" + issue;
  }
}
