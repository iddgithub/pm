import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium, devices } from '/Users/hugaopeng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const outputDir = path.resolve('.omx/artifacts/visual-ralph/add-application-form')
const url = 'https://m.imavine.com/share/pages/addApplicationForm/index'
const device = devices['iPhone 14 Pro']
const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

const page = await browser.newPage({
  ...device,
  locale: 'zh-CN',
  timezoneId: 'Asia/Shanghai',
})

await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForTimeout(2500)

const pageState = await page.evaluate(() => {
  const clean = (value) => value.replace(/\s+/g, ' ').trim()
  const fields = Array.from(
    document.querySelectorAll('button, a, input, textarea, select, [role="button"]'),
  )
    .slice(0, 80)
    .map((node, index) => ({
      index: index + 1,
      tag: node.tagName.toLowerCase(),
      type: node.getAttribute('type') || null,
      text: clean(node.textContent || ''),
      placeholder: node.getAttribute('placeholder'),
      disabled: node.hasAttribute('disabled'),
    }))
    .filter((item) => item.text || item.placeholder || item.tag === 'input' || item.tag === 'textarea')

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, .title, .header, .nav-title'))
    .slice(0, 30)
    .map((node) => clean(node.textContent || ''))
    .filter(Boolean)

  const textBlocks = Array.from(document.querySelectorAll('body *'))
    .map((node) => clean(node.textContent || ''))
    .filter(Boolean)
    .filter((text, index, arr) => arr.indexOf(text) === index)
    .slice(0, 80)

  return {
    title: document.title,
    href: location.href,
    viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
    bodyWidth: document.body.scrollWidth,
    bodyHeight: document.body.scrollHeight,
    headings,
    fields,
    textBlocks,
  }
})

const screenshotViewportPath = path.join(outputDir, 'reference-viewport.png')
const screenshotFullPath = path.join(outputDir, 'reference-full.png')
const htmlPath = path.join(outputDir, 'page.html')
const metaPath = path.join(outputDir, 'page-meta.json')

await page.screenshot({ path: screenshotViewportPath, fullPage: false })
await page.screenshot({ path: screenshotFullPath, fullPage: true })
await fs.writeFile(htmlPath, await page.content(), 'utf8')
await fs.writeFile(metaPath, JSON.stringify(pageState, null, 2), 'utf8')

await browser.close()

console.log(
  JSON.stringify(
    {
      url,
      device: device.name,
      viewport: device.viewport,
      screenshotViewportPath,
      screenshotFullPath,
      htmlPath,
      metaPath,
    },
    null,
    2,
  ),
)
