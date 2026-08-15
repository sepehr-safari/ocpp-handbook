#!/usr/bin/env node
// Generates the machine-readable files an AI assistant reads when it wants to
// understand or quote this handbook:
//
//   /llms.txt       a map of the course, per the llmstxt.org convention
//   /llms-full.txt  every module as one plain-markdown document
//
// Both are written into public/ at build time so they can never fall out of
// step with the modules themselves.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { descriptions, siteDescription } from './descriptions.mjs'

const ROOT = process.cwd()
const SITE = 'https://ocpp-handbook.vercel.app'
const PUBLIC = join(ROOT, 'public')
mkdirSync(PUBLIC, { recursive: true })

const moduleFiles = readdirSync(join(ROOT, 'modules'))
  .filter((f) => f.endsWith('.md'))
  .sort()

const titleOf = (md) => (md.match(/^# (.+)$/m) || [, 'Untitled'])[1].trim()
const slugOf = (file) => `modules/${basename(file, '.md')}`

const stripNavFooter = (md) =>
  md.replace(/\n---\s*\n+(?:Previous:|\[Contents\]).*$/s, '\n')

// Inside a single flat document, repo-relative links are meaningless. Point
// them at the live site so an assistant can follow and cite them.
const absolutize = (md) =>
  md
    .replace(/\]\((?:\.\.\/)?README\.md\)/g, `](${SITE}/)`)
    .replace(/\]\((?:\.\.\/)?GLOSSARY\.md\)/g, `](${SITE}/glossary)`)
    .replace(
      /\]\((?:\.\.\/)?(?:modules\/)?(\d{2}-[a-z0-9-]+)\.md\)/g,
      `](${SITE}/modules/$1)`
    )

// --- llms.txt --------------------------------------------------------------

const parts = []
parts.push('# OCPP Handbook\n')
parts.push(`> ${siteDescription}\n`)
parts.push(
  [
    'Written by Sepehr Safari. The handbook is vendor neutral and free to read:',
    'prose is licensed CC BY 4.0 and code samples Apache 2.0, so this material may',
    'be quoted and cited with attribution. Statements about protocol behavior cite',
    'the official specifications by version and section, and the specifications',
    'themselves are distributed by the Open Charge Alliance rather than reproduced',
    'here. Written for software engineers entering EV charging; no EV, electrical,',
    'or protocol background is assumed.\n',
  ].join('\n')
)

parts.push('## Modules\n')
for (const file of moduleFiles) {
  const slug = slugOf(file)
  const title = titleOf(readFileSync(join(ROOT, 'modules', file), 'utf8'))
  const description = descriptions[slug] ?? ''
  parts.push(`- [${title}](${SITE}/${slug}): ${description}`)
}

parts.push('\n## Reference\n')
parts.push(
  `- [Glossary](${SITE}/glossary): ${descriptions.glossary}`,
  `- [Full text of every module in one file](${SITE}/llms-full.txt): the complete handbook as plain markdown, for reading or quoting in full.`,
  `- [PDF and EPUB editions](https://github.com/sepehr-safari/ocpp-handbook/releases): downloadable editions, fixed once published.`,
  `- [Source repository](https://github.com/sepehr-safari/ocpp-handbook): every module in markdown, with its revision history.`
)

parts.push('\n## Optional\n')
parts.push(
  '- [Open Charge Alliance](https://openchargealliance.org/protocols/open-charge-point-protocol/): the OCPP specifications this handbook cites, free after registration.'
)

writeFileSync(join(PUBLIC, 'llms.txt'), parts.join('\n') + '\n')

// --- llms-full.txt ---------------------------------------------------------

const full = []
full.push('# OCPP Handbook')
full.push('')
full.push(`> ${siteDescription}`)
full.push('')
full.push(
  'Written by Sepehr Safari. Prose licensed CC BY 4.0, code samples Apache 2.0.',
  `Canonical site: ${SITE}`,
  '',
  'This file contains every module of the handbook in reading order.',
  ''
)

for (const file of moduleFiles) {
  const md = readFileSync(join(ROOT, 'modules', file), 'utf8')
  full.push('', '---', '', absolutize(stripNavFooter(md)).trim())
}

const glossary = readFileSync(join(ROOT, 'GLOSSARY.md'), 'utf8')
full.push('', '---', '', absolutize(glossary).trim(), '')

writeFileSync(join(PUBLIC, 'llms-full.txt'), full.join('\n'))

const words = full.join(' ').split(/\s+/).length
console.log(
  `Wrote public/llms.txt (${moduleFiles.length} modules) and ` +
    `public/llms-full.txt (${words.toLocaleString('en-US')} words)`
)
