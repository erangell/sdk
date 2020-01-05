const SDK = require('./promise')
const test = require('tape')

const verbose = true // true = show details in the console log

const isBrowser = process.title === 'browser'
const storageLocation = isBrowser ? '/' : require('tmp').dirSync({
  prefix: 'universal-dat-storage-'
}).name

if (verbose) {
  console.log('isBrowser=' + isBrowser)
  console.log('storageLocation=' + storageLocation)
}

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

    if (verbose) {
      t.comment('P1.1 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
    }

    t.pass('loaded archive')

    const data = await drive.readFile('/dat.json', 'utf8')

    if (verbose) {
      t.comment('P1.2 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
      t.comment('data=' + JSON.stringify(data))
    }

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

    if (verbose) {
      t.comment('P2.1 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
    }

    await drive.writeFile('/example.txt', 'Hello World!')

    t.ok(drive.url, 'got url in new drive')

    if (verbose) {
      t.comment('P2.2 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
    }

    t.end()
  } catch (e) {
    t.error(e)
  }
})

test('P3.0 - DatArchive - get existing drive', async (t) => {
  try {
    const drive = await DatArchive.create()
    
    if (verbose) {
      t.comment('P3.1 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
    }

    const existing = await DatArchive.load(drive.url)

    if (verbose) {
      t.comment('P3.2 existing.key=' + JSON.stringify(existing.key))
      t.comment('existing.discoveryKey=' + JSON.stringify(existing.discoveryKey))
      t.comment('existing.live=' + JSON.stringify(existing.live))
      t.comment('existing.latest=' + JSON.stringify(existing.latest))
      t.comment('existing.url=' + JSON.stringify(existing.url))
    }

    t.equal(existing._archive, drive._archive, 'Got existing drive by reference')
    t.equal(existing.url, drive.url, 'got same URL')

    t.end()
  } catch (e) {
     t.error(e) 
  }
})

test('P4.0 - DatArchive - new drive created after close', async (t) => {
  try {
    const drive = await DatArchive.create()

    if (verbose) {
      t.comment('P4.1 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
    }

    drive.addEventListener('close', async () => {
      const existing = await DatArchive.load(drive.url)

      if (verbose) {
        t.comment('P4.2 existing.key=' + JSON.stringify(existing.key))
        t.comment('existing.discoveryKey=' + JSON.stringify(existing.discoveryKey))
        t.comment('existing.live=' + JSON.stringify(existing.live))
        t.comment('existing.latest=' + JSON.stringify(existing.latest))
        t.comment('existing.url=' + JSON.stringify(existing.url))
      }

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

    if (verbose) {
      t.comment('P5.1 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
    }

    t.pass('resolved archive')

    const data = await drive.readFile('/dat.json', 'utf8')


    if (verbose) {
      t.comment('P5.2 drive.key=' + JSON.stringify(drive.key))
      t.comment('drive.discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('drive.live=' + JSON.stringify(drive.live))
      t.comment('drive.latest=' + JSON.stringify(drive.latest))
      t.comment('drive.url=' + JSON.stringify(drive.url))
      t.comment('data=' + JSON.stringify(data))
    }

    t.ok(data, 'loaded data from archive')

    t.end()
  } catch (e) {
    t.error(e)
  }
})
