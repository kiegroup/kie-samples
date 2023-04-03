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
const Ajv = require("ajv");

const SAMPLE_SCHEMA_FILE_NAME = "schema.json";
const DEFINITION_FILE_NAME = "definition.json";
const SAMPLES_FOLDER_NAME = "samples";
const TEMPLATE_FOLDER_NAME = "template";

const ajv = new Ajv({ allErrors: true });

const schemaPath = path.join(__dirname, SAMPLE_SCHEMA_FILE_NAME);
const schema = JSON.parse(fs.readFileSync(schemaPath));

const samplesDir = path.join(__dirname, "..", "..", SAMPLES_FOLDER_NAME);
const subdirs = fs
  .readdirSync(samplesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== TEMPLATE_FOLDER_NAME)
  .map((d) => d.name);

for (const subdir of subdirs) {
  const definitionPath = path.join(samplesDir, subdir, DEFINITION_FILE_NAME);
  const definition = JSON.parse(fs.readFileSync(definitionPath));

  const isValid = ajv.validate(schema, definition);

  if (!isValid) {
    console.error(
      `Validation failed for definition in ${subdir}/${DEFINITION_FILE_NAME}`
    );
    console.error(ajv.errorsText());
    process.exit(1);
  }

  const coverPath = path.join(samplesDir, subdir, definition.cover);
  if (!fs.existsSync(coverPath)) {
    console.error(
      `Cover file specified in ${subdir}/${DEFINITION_FILE_NAME} does not exist: ${definition.cover}`
    );
    process.exit(1);
  }
}
