import { createJsonTranslator, createLanguageModel } from "typechat";
import { processRequests } from "typechat/interactive";
import { createTypeScriptJsonValidator } from "typechat/ts";
import assert from "assert";
import findConfig from "find-config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { ApexOptions } from "./ApexSchema";
const dotEnvPath = findConfig(".env");
assert(dotEnvPath, ".env file not found!");
dotenv.config({ path: dotEnvPath });

const model = createLanguageModel(process.env);
const viewSchema = fs.readFileSync(
  path.join(__dirname, "ApexSchema.ts"),
  "utf8"
);
console.log(viewSchema);
const validator = createTypeScriptJsonValidator<ApexOptions>(
  viewSchema,
  "ApexOptions"
);
const translator = createJsonTranslator(model, validator);

processRequests("🍕> ", process.argv[2], async (request) => {
  const response = await translator.translate(request);
  if (!response.success) {
    console.log(response.message);
    return;
  }
  const order = response.data;
  console.log(order);
});
