import fs from "node:fs";

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required.");
const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
const pr = event.pull_request;
if (!pr) throw new Error("The event does not contain a pull_request payload.");

const base = pr.base.ref;
const head = pr.head.ref;
const sameRepository = pr.head.repo.full_name === pr.base.repo.full_name;
const rules = {
  develop: [/^(feature|fix|chore|docs)\/.+$/, /^(release|master)$/],
  release: [/^develop$/, /^release-fix\/.+$/, /^master$/],
  master: [/^release$/, /^hotfix\/.+$/],
};
const sameRepositoryPatterns =
  /^(release|master|develop)$|^(hotfix|release-fix)\/.+$/;

if (!rules[base]) throw new Error(`Unsupported target branch: ${base}`);
if (!rules[base].some((pattern) => pattern.test(head))) {
  throw new Error(`Pull request policy rejected ${head} -> ${base}.`);
}
if (sameRepositoryPatterns.test(head) && !sameRepository) {
  throw new Error(
    `${head} -> ${base} must originate from the same repository.`,
  );
}
console.log(`Pull request policy accepted ${head} -> ${base}.`);
