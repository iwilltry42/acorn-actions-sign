import * as exec from '@actions/exec'
import {expect, jest, test} from '@jest/globals'
import * as path from 'path'
import {sign, useDigest} from '../src/sign'

process.env['RUNNER_TEMP'] = path.join(__dirname, 'runner')

test('signStandard calls exec', async () => {
  // @ts-ignore
  const execSpy = jest
    .spyOn(exec, 'getExecOutput')
    .mockImplementation(async () => {
      // @ts-ignore
      return {
        exitCode: expect.any(Number),
        stdout: expect.any(Function),
        stderr: expect.any(Function)
      } as exec.ExecOutput
    })

  const image = 'foo/bar:v1'
  const key = 'myprivatekey'
  const push = false
  const digest = 'sha256:1234567890abcdef'
  const annotations = new Map<string, string>()
  annotations.set('foo', 'bar')
  annotations.set('baz', 'qux')

  const imageRef = useDigest(image, digest)

  await sign(image, key, push, digest, annotations)

  expect(execSpy).toHaveBeenCalledWith(
    `acorn`,
    [
      'image',
      'sign',
      '--key',
      key,
      `--push=${push}`,
      '--annotation',
      `acorn.io/signed-name=${image}`,
      '--annotation',
      `foo=bar`,
      '--annotation',
      `baz=qux`,
      imageRef
    ],
    {
      silent: true,
      ignoreReturnCode: true
    }
  )
})
