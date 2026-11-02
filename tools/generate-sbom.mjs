import fs from "node:fs";
import path from "node:path";

const manifest = JSON.parse(
  fs.readFileSync("dist/libs/angular/package.json", "utf8"),
);
const dependencies = {
  ...(manifest.dependencies ?? {}),
  ...(manifest.peerDependencies ?? {}),
};
const document = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  name: `${manifest.name}-${manifest.version}`,
  documentNamespace: `https://spdx.org/spdxdocs/${manifest.name.replace(/[^a-z0-9]/gi, "-")}-${manifest.version}`,
  creationInfo: {
    created: new Date().toISOString(),
    creators: ["Tool: Atralume SBOM generator"],
  },
  packages: [
    {
      SPDXID: "SPDXRef-Package",
      name: manifest.name,
      versionInfo: manifest.version,
      downloadLocation: "NOASSERTION",
      licenseConcluded: manifest.license ?? "NOASSERTION",
    },
    ...Object.entries(dependencies).map(([name, version]) => ({
      SPDXID: `SPDXRef-${name.replace(/[^a-z0-9]/gi, "-")}`,
      name,
      versionInfo: version,
      downloadLocation: "NOASSERTION",
      licenseConcluded: "NOASSERTION",
    })),
  ],
  relationships: Object.keys(dependencies).map((name) => ({
    spdxElementId: "SPDXRef-Package",
    relationshipType: "DEPENDS_ON",
    relatedSpdxElement: `SPDXRef-${name.replace(/[^a-z0-9]/gi, "-")}`,
  })),
};
fs.mkdirSync("dist/release", { recursive: true });
fs.writeFileSync(
  "dist/release/atralume-angular.spdx.json",
  JSON.stringify(document, null, 2) + "\n",
);
console.log("SPDX SBOM generated for " + manifest.name + ".");
