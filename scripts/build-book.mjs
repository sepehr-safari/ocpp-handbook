#!/usr/bin/env node
// Assembles the handbook into a single Pandoc-ready markdown file.
//
// The web and GitHub versions of this course are a set of linked files. A book
// is one linear document, so this script does four things the site does not
// need: it strips the per-module navigation footers, rewrites cross-module
// links into internal anchors, renders every mermaid fence to an image, and
// prepends a metadata block for the title page.
//
// Usage:
//   node scripts/build-book.mjs --version v1.0            full build
//   node scripts/build-book.mjs --version v1.0 --skip-diagrams   assembly only

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1] ?? true
}

const ROOT = process.cwd()
const OUT = join(ROOT, 'build')
const DIAGRAMS = join(OUT, 'diagrams')
const version = flag('version', 'dev')
const skipDiagrams = args.includes('--skip-diagrams')
const mmdc = process.env.MMDC_CMD || 'mmdc'

rmSync(OUT, { recursive: true, force: true })
mkdirSync(DIAGRAMS, { recursive: true })

// --- transforms ------------------------------------------------------------

// Modules end with "---\n\nPrevious: ... | [Contents](...) | Next: ...".
// That is site navigation; in a book it is noise.
const stripNavFooter = (md) =>
  md.replace(/\n---\s*\n+(?:Previous:|\[Contents\]).*$/s, '\n')

// Cross-references become internal anchors so the PDF and EPUB are navigable.
const rewriteLinks = (md) =>
  md
    .replace(/\]\((?:\.\.\/)?README\.md\)/g, '](#preface)')
    .replace(/\]\((?:\.\.\/)?GLOSSARY\.md\)/g, '](#glossary)')
    .replace(/\]\((?:\.\.\/)?(?:modules\/)?(\d{2})-[a-z0-9-]+\.md\)/g, '](#module-$1)')

// Pandoc reads image size from pixels and --dpi; mermaid renders at scale 3,
// so diagrams keep their intended size instead of being blown up to full width.
let diagramCount = 0
const extractDiagrams = (md, sourceName) =>
  md.replace(/```mermaid\n([\s\S]*?)```/g, (_match, code) => {
    diagramCount += 1
    const id = String(diagramCount).padStart(2, '0')
    const mmdPath = join(DIAGRAMS, `diagram-${id}.mmd`)
    writeFileSync(mmdPath, code.trimEnd() + '\n')
    if (!skipDiagrams) {
      execFileSync(
        mmdc,
        [
          '--input', mmdPath,
          '--output', join(DIAGRAMS, `diagram-${id}.png`),
          '--scale', '3',
          '--backgroundColor', 'white',
          ...(process.env.PUPPETEER_CONFIG_FILE
            ? ['--puppeteerConfigFile', process.env.PUPPETEER_CONFIG_FILE]
            : []),
        ],
        { stdio: 'inherit' }
      )
    }
    process.stderr.write(`  diagram ${id} from ${sourceName}\n`)
    return `![](diagrams/diagram-${id}.png)`
  })

const prepare = (md, sourceName) =>
  extractDiagrams(rewriteLinks(stripNavFooter(md)), sourceName)

// --- assembly --------------------------------------------------------------

const parts = []

const metadata = `---
title: "OCPP Handbook"
subtitle: "A course on EV charging software: the industry, the hardware, the protocols, and the craft of debugging them"
author: "Sepehr Safari"
date: "${version}"
lang: en-US
documentclass: book
classoption:
  - oneside
geometry:
  - margin=2.5cm
mainfont: "DejaVu Serif"
sansfont: "DejaVu Sans"
monofont: "DejaVu Sans Mono"
fontsize: 11pt
linkcolor: black
urlcolor: black
toc-title: "Contents"
rights: "Prose licensed CC BY 4.0. Code samples licensed Apache 2.0."
---
`
parts.push(metadata)

// The README is the preface. Its syllabus table is dropped: the generated
// table of contents does that job, and a stale copy would drift.
let readme = readFileSync(join(ROOT, 'README.md'), 'utf8')
readme = readme.replace(/^# .*$/m, '# Preface {#preface}')
readme = readme.replace(/\n## Syllabus\n[\s\S]*?(?=\n## )/, '\n')
parts.push(prepare(readme, 'README.md'))

const moduleFiles = readdirSync(join(ROOT, 'modules'))
  .filter((f) => f.endsWith('.md'))
  .sort()

for (const file of moduleFiles) {
  const number = basename(file).slice(0, 2)
  let md = readFileSync(join(ROOT, 'modules', file), 'utf8')
  md = md.replace(/^# (.*)$/m, `# $1 {#module-${number}}`)
  parts.push(prepare(md, file))
}

let glossary = readFileSync(join(ROOT, 'GLOSSARY.md'), 'utf8')
glossary = glossary.replace(/^# (.*)$/m, '# $1 {#glossary}')
parts.push(prepare(glossary, 'GLOSSARY.md'))

const book = parts.join('\n\n\\newpage\n\n')
writeFileSync(join(OUT, 'book.md'), book)

// --- report ----------------------------------------------------------------

const expectedDiagrams = [join(ROOT, 'README.md'), join(ROOT, 'GLOSSARY.md')]
  .concat(moduleFiles.map((f) => join(ROOT, 'modules', f)))
  .reduce((n, p) => n + (readFileSync(p, 'utf8').match(/```mermaid/g) || []).length, 0)

if (diagramCount !== expectedDiagrams) {
  console.error(`Diagram count mismatch: extracted ${diagramCount}, source has ${expectedDiagrams}`)
  process.exit(1)
}

// Absolute URLs that happen to end in .md are fine; only unresolved
// repo-relative links would break in a single-file book.
const leftoverLinks = book.match(/\]\((?!https?:)[^)]*\.md\)/g) || []
if (leftoverLinks.length) {
  console.error(`Unrewritten local links remain: ${[...new Set(leftoverLinks)].join(', ')}`)
  process.exit(1)
}

console.log(
  `Assembled build/book.md: ${moduleFiles.length} modules, ${diagramCount} diagrams, ` +
    `${book.split(/\s+/).length.toLocaleString('en-US')} words`
)
