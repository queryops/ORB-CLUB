import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
// Skip these — they're used as icons and need specific formats
const SKIP = ['apple-icon.png', 'placeholder-logo.png', 'ORB.png', 'og-image.jpg']

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const images = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      images.push(...await findImages(fullPath))
    } else if (EXTENSIONS.includes(extname(entry.name))) {
      if (!SKIP.includes(entry.name)) {
        images.push(fullPath)
      }
    }
  }
  return images
}

async function convertToWebP(filePath) {
  const ext = extname(filePath)
  const webpPath = filePath.slice(0, -ext.length) + '.webp'
  try {
    const info = await sharp(filePath)
      .webp({ quality: 85, effort: 4 })
      .toFile(webpPath)
    const original = (await stat(filePath)).size
    const saved = original - info.size
    const pct = ((saved / original) * 100).toFixed(1)
    console.log(`✓ ${basename(filePath)} → .webp  (${(original/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB, -${pct}%)`)
    return { original: filePath, webp: webpPath }
  } catch (err) {
    console.error(`✗ ${basename(filePath)}: ${err.message}`)
    return null
  }
}

const images = await findImages(publicDir)
console.log(`Found ${images.length} images to convert...\n`)

const results = []
for (const img of images) {
  const result = await convertToWebP(img)
  if (result) results.push(result)
}

console.log(`\nConverted ${results.length}/${images.length} images to WebP.`)
console.log('\nWebP files created:')
results.forEach(r => {
  const rel = r.webp.replace(publicDir, '').replace(/\\/g, '/')
  console.log(`  ${rel}`)
})
