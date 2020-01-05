const SDK = require('./') // index.js
const test = require('tape')
const verbose = false // true = show details in the console log

const isBrowser = process.title === 'browser'

if (verbose) console.log('isBrowser=' + isBrowser)

const storageLocation = isBrowser ? '/' : require('tmp').dirSync({
  prefix: 'universal-dat-storage-'
}).name

if (verbose) console.log('storageLocation=' + storageLocation)

const { Hyperdrive, Hypercore, resolveName, destroy } = SDK({
  storageOpts: {
    storageLocation
  }
})

const BEAKER_URL = 'dat://32d225818f3928d4f17ed4893108f630d59023ccbbda196262ecd936e4033421'  //'dat://beakerbrowser.com/'
const BEAKER_KEY = '32d225818f3928d4f17ed4893108f630d59023ccbbda196262ecd936e4033421'

//Pick a key to a hypercore that you know is live
const HYPERCORE_KEY = '7f4520154a9cc9b69ce98f864e6bbe0e361ce2ea6485e0228203d497ea330034'

const TEST_TIMEOUT = 10 * 1000

test.onFinish(destroy)

test.skip('1.0 Hyperdrive - load drive', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const drive = Hyperdrive(BEAKER_URL)

  if (verbose) {
    t.comment('1.0 key=' + JSON.stringify(drive.key))
    t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
    t.comment('live=' + JSON.stringify(drive.live))
    t.comment('latest=' + JSON.stringify(drive.latest))
  }

  drive.readFile('/dat.json', 'utf8', (err, data) => {
    if (verbose) t.comment("1.1")
    t.notOk(err, 'loaded file without error')

    if (verbose) {
      t.comment('1.0 data=' + data)
      t.comment('----------')
    }
    t.end()
  })
})

test.skip('2.0 Hyperdrive - create drive, write and read a file', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const drive = Hyperdrive()

  if (verbose) {
    t.comment('2.0 key=' + JSON.stringify(drive.key))
    t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
    t.comment('live=' + JSON.stringify(drive.live))
    t.comment('latest=' + JSON.stringify(drive.latest))
    t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
    t.comment('Note: Output from code below may be further down in the test results')
    t.comment('----------')
  }

  drive.writeFile('/example.txt', 'Hello World!', (err) => {
    if (verbose) t.comment("2.1")
    t.notOk(err, 'Able to write to hyperdrive')

    if (verbose) {
      t.comment('2.0 key=' + JSON.stringify(drive.key))
      t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
      t.comment('live=' + JSON.stringify(drive.live))
      t.comment('latest=' + JSON.stringify(drive.latest))
      t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
    }

    drive.readFile('/notfound.txt', 'utf8', (err, data) => {

      if (verbose) t.comment("2.2")
      t.ok(err, 'File not found error thrown when file does not exist')

      if (verbose) {
        t.comment('2.0 key=' + JSON.stringify(drive.key))
        t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
        t.comment('live=' + JSON.stringify(drive.live))
        t.comment('latest=' + JSON.stringify(drive.latest))
        t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
        t.comment('data=' + JSON.stringify(data))
      }

      t.equal(data, undefined, 'Data is undefined when file not found')

      drive.readFile('/example.txt', 'utf8', (err, data) => {

        if (verbose) t.comment("2.3")
        t.notOk(err, 'Able to read file that was written to hyperdrive')

        if (verbose) {
          t.comment('2.0 key=' + JSON.stringify(drive.key))
          t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
          t.comment('live=' + JSON.stringify(drive.live))
          t.comment('latest=' + JSON.stringify(drive.latest))
          t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
          t.comment('data=' + JSON.stringify(data))
          t.comment('----------')
        }

        if (verbose) t.comment("2.4")
        t.equal(data, 'Hello World!', 'Read the same data that was previously written to the file')
        t.end()
      })
    })
  })
})

test.skip('3.0 Hyperdrive - get existing drive', (t) => {
  const drive = Hyperdrive()

  if (verbose) {
    t.comment('3.0 key=' + JSON.stringify(drive.key))
    t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
    t.comment('live=' + JSON.stringify(drive.live))
    t.comment('latest=' + JSON.stringify(drive.latest))
    t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
  }

  drive.ready(() => {
    if (verbose) t.comment('3.0 The hyperdrive is ready.  Key=' + JSON.stringify(drive.key))

    const existing = Hyperdrive(drive.key)

    if (verbose) {
      t.comment('3.0 key=' + JSON.stringify(existing.key))
      t.comment('discoveryKey=' + JSON.stringify(existing.discoveryKey))
      t.comment('live=' + JSON.stringify(existing.live))
      t.comment('latest=' + JSON.stringify(existing.latest))
      t.comment('secretKey=' + JSON.stringify(existing.metadata.secretKey))
      t.comment('----------')
    }

    if (verbose) t.comment("3.1")
    t.equal(existing, drive, 'Got existing drive by reference')

    t.end()
  })
})

test.skip('4.0 Hyperdrive - new drive created after close', (t) => {
  const drive = Hyperdrive()

  if (verbose) {
    t.comment('4.0 key=' + JSON.stringify(drive.key))
    t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
    t.comment('live=' + JSON.stringify(drive.live))
    t.comment('latest=' + JSON.stringify(drive.latest))
    t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
  }

  drive.ready(() => {
    drive.writeFile('/test.txt', 'Test file in new hyperdrive', (err) => {
      
      if (verbose) t.comment("4.1")
      t.notOk(err, 'Wrote test file to new hyperdrive')

      if (verbose) {
        t.comment('4.0 key=' + JSON.stringify(drive.key))
        t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
        t.comment('live=' + JSON.stringify(drive.live))
        t.comment('latest=' + JSON.stringify(drive.latest))
        t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
      }

      drive.once('close', () => {
        const existing = Hyperdrive(drive.key)

        if (verbose) {
          t.comment('4.0 drive.key=' + JSON.stringify(drive.key))
          t.comment('discoveryKey=' + JSON.stringify(drive.discoveryKey))
          t.comment('live=' + JSON.stringify(drive.live))
          t.comment('latest=' + JSON.stringify(drive.latest))
          t.comment('secretKey=' + JSON.stringify(drive.metadata.secretKey))
          t.comment('existing.key=' + JSON.stringify(existing.key))
          t.comment('discoveryKey=' + JSON.stringify(existing.discoveryKey))
          t.comment('live=' + JSON.stringify(existing.live))
          t.comment('latest=' + JSON.stringify(existing.latest))
          t.comment('secretKey=' + JSON.stringify(existing.metadata.secretKey))
        }

        // Test that old drive is no longer referenced by SDK
        if (verbose) t.comment("4.2")
        t.notEqual(existing, drive, 'Got new drive by reference')

        existing.readFile('/test.txt', 'utf8', (err2, data2) => {

          if (verbose) t.comment("4.3")
          t.notOk(err2, 'Read test file that was written to original hyperdrive')

          if (verbose) {
            t.comment('4.0 key=' + JSON.stringify(existing.key))
            t.comment('discoveryKey=' + JSON.stringify(existing.discoveryKey))
            t.comment('live=' + JSON.stringify(existing.live))
            t.comment('latest=' + JSON.stringify(existing.latest))
            t.comment('secretKey=' + JSON.stringify(existing.metadata.secretKey))
            t.comment('data=' + JSON.stringify(data2))
            t.comment('----------')
          }

          if (verbose) t.comment("4.4")
          t.equal(data2, 'Test file in new hyperdrive', 'Read the same data that was previously written to the test file')
          t.end()

        }) // existing.readFile
      }) // drive.once('close')
      drive.close()
    }) // drive.writefile
  }) // drive.ready
})

test.skip('5.0 resolveName beakerbrowser - resolve and load archive', (t) => {
  resolveName('dat://beakerbrowser.com', (err3, resolved3) => {
    t.notOk(err3, 'Resolved beakerbrowser.com successfully')

    if (verbose) {
      t.comment('5.0 resolved=' + JSON.stringify(resolved3))
    }
    // const drive3 = Hyperdrive(resolved3)
    const drive3 = Hyperdrive(BEAKER_KEY)

    drive3.readFile('/dat.json', 'utf8', (err3, data3) => {
      t.notOk(err3, 'resolveName for beakerbrowser - loaded file without error')

      if (verbose) {
        t.comment('data3=' + JSON.stringify(data3))
        t.comment('----------')
      }
      t.end()
    })
  })
})

test.skip('6.0 Hypercore - create', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const core = Hypercore()

  if (verbose) {
    t.comment('6.0 key=' + JSON.stringify(core.key))
    t.comment('discoveryKey=' + JSON.stringify(core.discoveryKey))
  }

  core.append('Hello Hypercore', (err) => {

    if (verbose) t.comment("6.1")
    t.notOk(err, 'able to write to hypercore')

    if (verbose) {
      t.comment('6.0 key=' + JSON.stringify(core.key))
      t.comment('discoveryKey=' + JSON.stringify(core.discoveryKey))
      t.comment('----------')
    }

    core.get(0, (err, data) => {

      if (verbose) t.comment("6.2")
      t.notOk(err, 'Able to read data from hypercore')

      if (verbose) t.comment('6.0 data=' + data)
      t.equal(data.toString(), "Hello Hypercore", 'Data read from hypercore matches what was written')
    
      t.end()
    
    })
  })
})


test.skip('7.0 Hypercore - load', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const core2 = Hypercore(HYPERCORE_KEY)

  if (verbose) {
    t.comment('7.0 key=' + JSON.stringify(core2.key))
    t.comment('discoveryKey=' + JSON.stringify(core2.discoveryKey))
  }

  core2.ready(() => {

    if (verbose) t.comment("7.1 core.key="+core2.key.toString('hex'))
    t.equal(core2.key.toString('hex'), HYPERCORE_KEY, 'loaded key matches BEAKER_KEY')

    if (verbose) {
      t.comment('7.0 key=' + JSON.stringify(core2.key))
      t.comment('discoveryKey=' + JSON.stringify(core2.discoveryKey))
      t.comment('----------')
    }

    core2.get(0, (err, metadata) => {

      if (verbose) t.comment("7.2")
      t.notOk(err, 'Able to read metadata from hypercore')

      if (verbose) t.comment('7.0 data=' + JSON.stringify(metadata))

      t.end()
    })
  })
})
