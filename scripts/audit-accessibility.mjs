#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files=[];
function walk(dir){for(const name of fs.readdirSync(dir)){if(["node_modules",".next",".git"].includes(name))continue;const p=path.join(dir,name);const st=fs.statSync(p);if(st.isDirectory())walk(p);else if(/\.(tsx|ts|html|css)$/.test(name))files.push(p)}}
walk(root);
const text=files.map(p=>fs.readFileSync(p,"utf8")).join("\n");
const checks=[
 ["No dangerouslySetInnerHTML", !text.includes("dangerouslySetInnerHTML")],
 ["Interactive controls have explicit button/input semantics", /<button\b|<input\b/.test(text)],
 ["Live status uses aria-live", text.includes('aria-live="polite"')],
 ["Recognition image has an accessible label", text.includes('htmlFor="recognition-image"')],
 ["Sign visuals provide alt text", text.includes('alt={`${sign.language} visual reference for ${sign.label}`}')],
 ["Reduced motion CSS present", text.includes("prefers-reduced-motion")],
 ["High contrast accessibility mode present", text.includes("high-contrast")],
 ["Large text accessibility mode present", text.includes("large-text")],
];
let fail=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++}process.exit(fail?1:0);
