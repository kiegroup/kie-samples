/*
 * Copyright 2023 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require("fs");
const path = require("path");

const SAMPLES_FOLDER_NAME = "samples";
const DEFINITION_FILE_NAME = "definition.json";
const TEMPLATE_FOLDER_NAME = "template";
const SAMPLE_DEFINITIONS_FILE_NAME = "sample-definitions.json";

const samplesDir = path.join(__dirname, "..", "..", SAMPLES_FOLDER_NAME);
const subdirs = fs
  .readdirSync(samplesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== TEMPLATE_FOLDER_NAME)
  .map((d) => d.name);

const definitions = subdirs.flatMap((sample) => {
  const definitionPath = path.join(samplesDir, sample, DEFINITION_FILE_NAME);
  if (!fs.existsSync(definitionPath)) {
    console.error(`${definitionPath} does not exist.`);
    process.exit(1);
  }
  const contents = fs.readFileSync(definitionPath);
  const sampleRelativePath = path.join(SAMPLES_FOLDER_NAME, sample);
  return { ...JSON.parse(contents), sample_path: sampleRelativePath };
});

const outputFilePath = path.join(__dirname, SAMPLE_DEFINITIONS_FILE_NAME);
fs.writeFileSync(outputFilePath, JSON.stringify(definitions, null, 2));
console.log(
  `Merged ${definitions.length} definition files into ${outputFilePath}`
);
