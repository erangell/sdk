const SDK = require('./') //index.js
const test = require('tape')
const verbose = true //true = show details in the console log

const isBrowser = process.title === 'browser'

if (verbose) console.log("isBrowser="+isBrowser) 

const storageLocation = isBrowser ? '/' : require('tmp').dirSync({
  prefix: 'universal-dat-storage-'
}).name

if (verbose) console.log("storageLocation="+storageLocation) 

const { Hyperdrive, Hypercore, resolveName, destroy } = SDK({
  storageOpts: {
    storageLocation
  }
})

const DATPROJECT_KEY = 'dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330'
const TEST_TIMEOUT = 10 * 1000

test.onFinish(destroy)

test('Hyperdrive - load drive', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const drive = Hyperdrive(DATPROJECT_KEY)

  if (verbose) {
    console.log("key="+JSON.stringify(drive.key))
    console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
    console.log("live="+JSON.stringify(drive.live))
    console.log("latest="+JSON.stringify(drive.latest))
  }

  drive.readFile('/dat.json', 'utf8', (err, data) => {
    t.notOk(err, 'loaded file without error')

    if (verbose) console.log("data="+data)

    t.end()
  })
})

test('Hyperdrive - create drive, write and read a file', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const drive = Hyperdrive()

  if (verbose) {
    console.log("key="+JSON.stringify(drive.key))
    console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
    console.log("live="+JSON.stringify(drive.live))
    console.log("latest="+JSON.stringify(drive.latest))
    console.log("secretKey="+JSON.stringify(drive.metadata.secretKey))
    console.log("Note: Output from code below may be further down in the test results")
  }

  drive.writeFile('/example.txt', 'Hello World!', (err) => {
    t.notOk(err, 'Able to write to hyperdrive')

    if (verbose) {
    console.log("key="+JSON.stringify(drive.key))
    console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
    console.log("live="+JSON.stringify(drive.live))
    console.log("latest="+JSON.stringify(drive.latest))
    console.log("secretKey="+JSON.stringify(drive.metadata.secretKey))
    }

    drive.readFile('/notfound.txt', 'utf8', (err, data) => {
      t.ok(err, 'File not found error thrown when file does not exist')

      if (verbose) {
        console.log("key="+JSON.stringify(drive.key))
        console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
        console.log("live="+JSON.stringify(drive.live))
        console.log("latest="+JSON.stringify(drive.latest))
        console.log("secretKey="+JSON.stringify(drive.metadata.secretKey))
        console.log("data="+JSON.stringify(data))
      }

      t.equal(data, undefined, 'Data is undefined when file not found')
    
      drive.readFile('/example.txt', 'utf8', (err, data) => {
        t.notOk(err, 'Able to read file that was written to hyperdrive')

        if (verbose) {
          console.log("key="+JSON.stringify(drive.key))
          console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
          console.log("live="+JSON.stringify(drive.live))
          console.log("latest="+JSON.stringify(drive.latest))
          console.log("secretKey="+JSON.stringify(drive.metadata.secretKey))
          console.log("data="+JSON.stringify(data)) 
        }
        t.equal(data, "Hello World!", 'Read the same data that was previously written to the file')
      })
    })
  })

t.end()

})

test('Hyperdrive - get existing drive', (t) => {
  const drive = Hyperdrive()

  if (verbose) {
    console.log("key="+JSON.stringify(drive.key))
    console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
    console.log("live="+JSON.stringify(drive.live))
    console.log("latest="+JSON.stringify(drive.latest))
    console.log("secretKey="+JSON.stringify(drive.metadata.secretKey))
  }

  drive.ready(() => {
    if (verbose) console.log("The hyperdrive is ready.  Key="+JSON.stringify(drive.key))

    const existing = Hyperdrive(drive.key)

    if (verbose) {
      console.log("key="+JSON.stringify(existing.key))
      console.log("discoveryKey="+JSON.stringify(existing.discoveryKey))
      console.log("live="+JSON.stringify(existing.live))
      console.log("latest="+JSON.stringify(existing.latest))
      console.log("secretKey="+JSON.stringify(existing.metadata.secretKey))
    }

    t.equal(existing, drive, 'Got existing drive by reference')

    t.end()
  })
})

test('Hyperdrive - new drive created after close', (t) => {
  const drive = Hyperdrive()

  if (verbose)
  {
    console.log("key="+JSON.stringify(drive.key))
    console.log("discoveryKey="+JSON.stringify(drive.discoveryKey))
    console.log("live="+JSON.stringify(drive.live))
    console.log("latest="+JSON.stringify(drive.latest))
    console.log("secretKey="+JSON.stringify(drive.metadata.secretKey))
  }

  drive.ready(() => {
    drive.once('close', () => {
      const existing = Hyperdrive(drive.key)

      if (verbose)
      {
        console.log("key="+JSON.stringify(existing.key))
        console.log("discoveryKey="+JSON.stringify(existing.discoveryKey))
        console.log("live="+JSON.stringify(existing.live))
        console.log("latest="+JSON.stringify(existing.latest))
        console.log("secretKey="+JSON.stringify(existing.metadata.secretKey))
      }

      t.notEqual(existing, drive, 'Got new drive by reference')

      if (verbose)
      {
        console.log("key="+JSON.stringify(existing.key))
        console.log("discoveryKey="+JSON.stringify(existing.discoveryKey))
        console.log("live="+JSON.stringify(existing.live))
        console.log("latest="+JSON.stringify(existing.latest))
        console.log("secretKey="+JSON.stringify(existing.metadata.secretKey))
      }

      t.end()
    })
    drive.close()
  })
})

test('resolveName datfoundation - resolve and load archive', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  resolveName('dat://dat.foundation', (err, resolved) => {
    t.notOk(err, 'Resolved dat.foundation successfully')

    const drive = Hyperdrive(resolved)

    drive.readFile('/dat.json', 'utf8', (data, err2) => {
      t.notOk(err2, 'resolveName for datfoundation - loaded file without error')

      if (verbose) {
          console.log("data="+JSON.stringify(data))
      }
      t.equal(data.status,404,'Name resolved but site returns 404 error')
    })
  })
  t.end()
})

test('resolveName beakerbrowser - resolve and load archive', (t) => {

  resolveName('dat://beakerbrowser.com', (err3, resolved3) => {
    t.notOk(err3, 'Resolved beakerbrowser.com successfully')

    const drive3 = Hyperdrive(resolved3)

    drive3.readFile('/dat.json', 'utf8', (data3, err3) => {
      t.notOk(err3, 'resolveName for beakerbrowser - loaded file without error')

      if (verbose) {
          console.log("data3="+JSON.stringify(data3))
      }
    })
  })
  t.end()
})

test('Hypercore - create', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const core = Hypercore()

  if (verbose) {
    console.log("key="+JSON.stringify(core.key))
    console.log("discoveryKey="+JSON.stringify(core.discoveryKey))
  }

  core.append('Hello World', (err) => {
    t.notOk(err, 'able to write to hypercore')

    if (verbose) {
      console.log("key="+JSON.stringify(core.key))
      console.log("discoveryKey="+JSON.stringify(core.discoveryKey))
    }

    t.end()
  })
})

test('Hypercore - load', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const key = '60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330'

  const core = Hypercore(key)

  if (verbose) {
    console.log("key="+JSON.stringify(core.key))
    console.log("discoveryKey="+JSON.stringify(core.discoveryKey))
  }

  core.ready(() => {
    t.equal(core.key.toString('hex'), key, 'loaded key')

    if (verbose) {
      console.log("key="+JSON.stringify(core.key))
      console.log("discoveryKey="+JSON.stringify(core.discoveryKey))
    }

    t.end()
  })
})


test('Example1 - promises', (t) => {
    t.timeoutAfter(TEST_TIMEOUT)

    const myCore = Hypercore(null, {
      valueEncoding: 'json',
      persist: false,
      // storage can be set to an instance of `random-access-*`
      // const RAI = require('random-access-idb')
      // otherwise it defaults to `random-access-web` in the browser
      // and `random-access-file` in node
      storage: null  // storage: RAI
    })

    myCore.append(JSON.stringify({
      name: 'Alice'
    }), () => {
      // Use extension messages for sending extra data over the p2p connection
      const discoveryCoreKey = 'dat://bee80ff3a4ee5e727dc44197cb9d25bf8f19d50b0f3ad2984cfe5b7d14e75de7'
      const discoveryCore = new Hypercore(discoveryCoreKey, {
        extensions: ['discovery']
      })

      // When you find a new peer, tell them about your core
      discoveryCore.on('peer-add', (peer) => {
        console.log('Got a peer!')
        peer.extension('discovery', myCore.key)
      })

      // When a peer tells you about their core, load it
      discoveryCore.on('extension', (type, message) => {
        console.log('Got extension message', type, message)
        if (type !== 'discovery') return
        discoveryCore.close()

        const otherCore = new Hypercore(message, {
          valueEncoding: 'json',
          persist: false
        })

        // Render the peer's data from their core
        otherCore.get(0, console.log)
    })
  })
  t.end()
})

test ('Example2 - promises', (t) => {
  t.timeoutAfter(TEST_TIMEOUT)

  const hypertrie = require('hypertrie')

  // Pass in hypercores from the SDK into other dat data structures
  // Check out what you can do with hypertrie from there:
  // https://github.com/mafintosh/hypertrie
  const trie = hypertrie(null, {
    feed: new Hypercore(null, {
      persist: false
    })
  })

  trie.put('key', 'value', () => {
    trie.get('key', (err, node) => {
      console.log('Got key: ', node.key)
      console.log('Loaded value from trie (ascii for "value"):', node.value)
    })
  })

})
