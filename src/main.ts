import * as core from '@actions/core'
import {sign} from './sign'

async function setup(): Promise<void> {
  const image = core.getInput('image', {required: true})
  const digest = core.getInput('digest')
  const key = core.getInput('key', {required: true})
  const annotations = core.getMultilineInput('annotations')
  const push = core.getBooleanInput('push')

  // convert annotations from json to map
  const annotationsMap = new Map<string, string>()
  for (const annotation of annotations) {
    const [k, v] = annotation.split('=')
    annotationsMap.set(k, v)
  }

  await sign(image, key, push, digest, annotationsMap)
}

async function run(): Promise<void> {
  try {
    await setup()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
