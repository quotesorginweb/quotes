import assert from "node:assert/strict";import test from "node:test";import {readFile} from "node:fs/promises";
const schema=await readFile(new URL("../db/schema.ts",import.meta.url),"utf8");
test("schema contains traceable editorial entities",()=>{for(const entity of ["quotes","authors","sourceWorks","quoteReports","auditLog","dailySchedule","imageAssets"])assert.match(schema,new RegExp(`export const ${entity}`))});
test("quote publication records verification and rights state",()=>{for(const field of ["verificationStatus","rightsReviewStatus","publicationStatus","reviewerId","normalizedText"])assert.match(schema,new RegExp(field))});
test("admin route requires server-side identity",async()=>{const admin=await readFile(new URL("../app/admin/page.tsx",import.meta.url),"utf8");assert.match(admin,/requireChatGPTUser/);assert.match(admin,/force-dynamic/);assert.match(admin,/index:\s*false/)});
