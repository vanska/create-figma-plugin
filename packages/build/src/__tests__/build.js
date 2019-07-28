import test from 'ava'
import { exists } from 'fs-extra'
import { join } from 'path'
import rimraf from 'rimraf'
import { build } from '../build'

function changeDirectory (directory) {
  process.chdir(join(__dirname, '__fixtures__', directory))
}

async function cleanUp () {
  return new Promise(function (resolve, reject) {
    rimraf(join(process.cwd(), '{manifest.json,build}'), function (error) {
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}
test.afterEach.always(cleanUp)

test.serial('no config', async function (t) {
  t.plan(3)
  changeDirectory('1-no-config')
  await cleanUp()
  await build()
  const manifestJsonPath = join(process.cwd(), 'manifest.json')
  t.deepEqual(require(manifestJsonPath), {
    name: 'figma-plugin',
    api: '0.6.0',
    main: 'build/main.js'
  })
  t.true(await exists('build/main.js'))
  t.false(await exists('build/ui.js'))
})

test.serial('basic command', async function (t) {
  t.plan(3)
  changeDirectory('2-basic-command')
  await cleanUp()
  await build()
  const manifestJsonPath = join(process.cwd(), 'manifest.json')
  t.deepEqual(require(manifestJsonPath), {
    name: 'foo',
    api: '0.6.0',
    main: 'build/main.js'
  })
  t.true(await exists('build/main.js'))
  t.false(await exists('build/ui.js'))
})

test.serial('multiple menu commands', async function (t) {
  t.plan(3)
  changeDirectory('3-multiple-menu-commands')
  await cleanUp()
  await build()
  const manifestJsonPath = join(process.cwd(), 'manifest.json')
  t.deepEqual(require(manifestJsonPath), {
    name: 'foo',
    api: '0.6.0',
    main: 'build/main.js',
    ui: 'build/ui.js',
    menu: [
      {
        name: 'bar',
        command: 'baz'
      },
      {
        separator: true
      },
      {
        name: 'qux',
        command: 'quux'
      }
    ]
  })
  t.true(await exists('build/main.js'))
  t.true(await exists('build/ui.js'))
})