import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const modules = (part: string, entries: [string, string][]) => ({
  text: part,
  collapsed: false,
  items: entries.map(([text, link]) => ({ text, link })),
})

// GitHub Pages serves the site from a repository subpath; Vercel serves it from
// the domain root. Getting this wrong 404s every asset, so it follows the host.
const onVercel = !!process.env.VERCEL
const base = onVercel ? '/' : '/ocpp-handbook/'
const hostname = onVercel
  ? 'https://ocpp-handbook.vercel.app/'
  : 'https://sepehr-safari.github.io/ocpp-handbook/'

export default withMermaid(
  defineConfig({
    title: 'OCPP Handbook',
    description:
      'A course on EV charging software: the industry, the hardware, the protocols, and the craft of debugging them.',
    lang: 'en-US',
    base,
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: false,

    // The README is the landing page, so the repo keeps one source of truth.
    rewrites: {
      'README.md': 'index.md',
      'GLOSSARY.md': 'glossary.md',
    },

    head: [
      ['meta', { name: 'author', content: 'Sepehr Safari' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'OCPP Handbook' }],
      [
        'meta',
        {
          property: 'og:description',
          content:
            'A course on EV charging software: the industry, the hardware, the protocols, and the craft of debugging them.',
        },
      ],
    ],

    themeConfig: {
      siteTitle: 'OCPP Handbook',

      nav: [
        { text: 'Start reading', link: '/modules/00-orientation' },
        { text: 'Glossary', link: '/glossary' },
        {
          text: 'Download',
          link: 'https://github.com/sepehr-safari/ocpp-handbook/releases',
        },
        {
          text: 'Parts',
          items: [
            { text: 'I. The industry', link: '/modules/01-the-industry' },
            { text: 'II. Protocol landscape', link: '/modules/04-the-protocol-map' },
            { text: 'III. OCPP', link: '/modules/05-ocpp-overview' },
            { text: 'IV. The field', link: '/modules/13-why-chargers-break' },
            { text: 'V. Mastery', link: '/modules/16-reading-specifications' },
          ],
        },
      ],

      sidebar: [
        modules('Orientation', [['0. The map and the conventions', '/modules/00-orientation']]),
        modules('I. The industry', [
          ["1. Who's who and how the money flows", '/modules/01-the-industry'],
          ['2. The hardware and the physical layer', '/modules/02-the-hardware'],
          ['3. Standards bodies and regulation', '/modules/03-standards-and-regulation'],
        ]),
        modules('II. Protocol landscape', [
          ['4. The protocol map', '/modules/04-the-protocol-map'],
        ]),
        modules('III. OCPP', [
          ['5. History, governance, versions', '/modules/05-ocpp-overview'],
          ['6. OCPP-J on the wire', '/modules/06-ocpp-j-on-the-wire'],
          ['7. The transaction lifecycle', '/modules/07-the-transaction-lifecycle'],
          ['8. CSMS-initiated operations', '/modules/08-csms-initiated-operations'],
          ['9. Smart charging', '/modules/09-smart-charging'],
          ['10. Security', '/modules/10-security'],
          ['11. OCPP 2.0.1 and beyond', '/modules/11-ocpp-201-and-beyond'],
          ['12. ISO 15118 and Plug and Charge', '/modules/12-iso-15118-and-plug-and-charge'],
        ]),
        modules('IV. The field', [
          ['13. Why chargers break', '/modules/13-why-chargers-break'],
          ['14. Tracing and observability', '/modules/14-tracing-and-observability'],
          ['15. The open-source ecosystem', '/modules/15-the-open-source-ecosystem'],
        ]),
        modules('V. Mastery', [
          ['16. Reading specifications', '/modules/16-reading-specifications'],
          ['17. Capstone: end to end', '/modules/17-capstone'],
        ]),
        modules('Appendix', [['Glossary', '/glossary']]),
      ],

      outline: { level: [2, 3], label: 'On this page' },

      search: { provider: 'local' },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/sepehr-safari/ocpp-handbook' },
      ],

      editLink: {
        pattern: 'https://github.com/sepehr-safari/ocpp-handbook/edit/main/:path',
        text: 'Suggest a correction',
      },

      docFooter: { prev: 'Previous', next: 'Next' },

      footer: {
        message:
          'Prose licensed under CC BY 4.0, code samples under Apache 2.0. Corrections welcome as issues.',
        copyright: 'Written by Sepehr Safari',
      },
    },

    sitemap: { hostname },
  })
)
