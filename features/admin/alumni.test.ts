// Run: node features/admin/alumni.test.ts
import assert from "node:assert/strict";
import { validateAlumnus, type AlumnusInput } from "./alumni.ts";

const badges = ["teacher", "researcher"];
const ok: AlumnusInput = {
  name: "Ada",
  dept: "CSE",
  series: "2019",
  optional: "",
  address: "Dhaka",
  country: "Bangladesh",
  badges: ["teacher"],
  linkedinurl: "https://www.linkedin.com/in/ada",
  longitude: "90.4",
  latitude: "23.8",
};
const check = (patch: Partial<AlumnusInput>) => validateAlumnus({ ...ok, ...patch }, badges);

assert.equal(check({}), null);
assert.equal(check({ linkedinurl: "" }), null);
assert.match(check({ name: " " })!, /Name/);
assert.match(check({ dept: "XYZ" })!, /department/);
assert.match(check({ badges: ["hacker"] })!, /badge/);
assert.match(check({ linkedinurl: "javascript:alert(1)" })!, /LinkedIn/);
assert.match(check({ linkedinurl: "https://evil.com/linkedin.com/" })!, /LinkedIn/);
assert.match(check({ longitude: "" })!, /numbers/);
assert.match(check({ latitude: "abc" })!, /numbers/);
assert.match(check({ longitude: "181" })!, /range/);
assert.match(check({ latitude: "-91" })!, /range/);
console.log("alumni validation: all checks passed");
