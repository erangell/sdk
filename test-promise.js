const SDK = require('./promise')
const test = require('tape')

const isBrowser = process.title === 'browser'
const storageLocation = isBrowser ? '/' : require('tmp').dirSync({
  prefix: 'universal-dat-storage-'
}).name

const { DatArchive, destroy } = SDK({
  storageOpts: {
    storageLocation
  }
})

const DATPROJECT_KEY = 'dat://32d225818f3928d4f17ed4893108f630d59023ccbbda196262ecd936e4033421'
const DATPROJECT_URL = 'dat://beakerbrowser.com/'
const TEST_TIMEOUT = 10 * 1000

test.onFinish(destroy)

test('P1.0 - DatArchive - load drive', async (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  try {
    const drive = await DatArchive.load(DATPROJECT_KEY)

    t.pass('loaded archive')

    const data = await drive.readFile('/dat.json', 'utf8')

    t.ok(data, 'loaded data from archive')

    t.end()
  } catch (e) {
    t.error(e)
  }
})

test('P2.0 - DatArchive - create drive', async (t) => {
  t.timeoutAfter(TEST_TIMEOUT)
  try {
    const drive = new DatArchive()

    await drive.writeFile('/example.txt', 'Hello World!')

    t.ok(drive.url, 'got url in new drive')

    t.end()
  } catch (e) {
    t.error(e)
  }
})

test('P3.0 - DatArchive - get existing drive', async (t) => {
  try {
    const drive = await DatArchive.create()

    const existing = await DatArchive.load(drive.url)

    t.equal(existing._archive, drive._archive, 'Got existing drive by reference')
    t.equal(existing.url, drive.url, 'got same URL')

    t.end()
  } catch (e) { t.error(e) }
})

test('P4.0 - DatArchive - new drive created after close', async (t) => {
  try {
    const drive = await DatArchive.create()

    drive.addEventListener('close', async () => {
      const existing = await DatArchive.load(drive.url)

      t.notEqual(existing._archive, drive._archive, 'Got new drive by reference')
      t.equal(existing.url, drive.url, 'got same URL')

      t.end()
    })
    await drive.close()
  } catch (e) {
    t.error(e)
  }
})

test('P5.0 - DatArchive - resolve and load archive', async (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  try {
    const drive = await DatArchive.load(DATPROJECT_URL)

    t.pass('resolved archive')

    const data = await drive.readFile('/dat.json', 'utf8')

    t.ok(data, 'loaded data from archive')

    t.end()
  } catch (e) {
    t.error(e)
  }
})
