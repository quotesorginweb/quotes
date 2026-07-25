import assert from "node:assert/strict";import test from "node:test";import {classifyKeyword,normalizeKeyword,opportunityScore} from "../scripts/keyword-classifier.mjs";
test("normalises case, punctuation and spaces",()=>assert.equal(normalizeKeyword("  “Love   Quotes!” "),"love quotes"));
for(const value of ["love quotes","quotes about life","random quote generator"])test(`accepts ${value}`,()=>assert.equal(classifyKeyword(value).status,"valid"));
for(const value of ["car insurance quotes","stock quote","quotation marks"])test(`excludes ${value}`,()=>assert.equal(classifyKeyword(value).status,"exclude"));
test("routes moving quotes to manual review",()=>assert.equal(classifyKeyword("moving quotes").status,"review"));
test("opportunity score stays transparent and bounded",()=>{const score=opportunityScore({volume:10000,difficulty:30,relevance:1,serp:1,seasonality:0,rightsRisk:0,coverage:0});assert.ok(score>50&&score<=100)});
