import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function sign(
  image: string,
  key: string,
  push = true,
  digest?: string,
  annotations?: Map<string, string>
): Promise<void> {
  if (!image || !key) {
    throw new Error('Image and Key required')
  }

  const args = ['image', 'sign', '--key', key, `--push=${push}`]

  const imageRef = useDigest(image, digest)
  core.info(`Signing image ${imageRef}`)

  // Ensure that we use the original image name here, even though we (potentially) overrode the imageRef above
  args.push('--annotation', `acorn.io/signed-name=${image}`)

  for (const [k, v] of annotations ?? []) {
    args.push('--annotation', `${k}=${v}`)
  }

  args.push(imageRef)

  const res = await exec.getExecOutput('acorn', args, {
    ignoreReturnCode: true,
    silent: true
  })

  if (res.stderr.length > 0 && res.exitCode !== 0) {
    throw new Error(res.stderr.trim())
  }

  core.info(`Successfully signed image ${imageRef} (as name ${image})`)
}

export function useDigest(image: string, digest?: string): string {
  // If the digest is not provided, return the original image
  if (!digest) {
    return image
  }

  // Regular expression to match:
  // - imageName (everything up to the last colon or '@' symbol)
  // - optional tag (after the last colon and before '@', if present)
  // - optional digest (after the '@' symbol, if present)
  const imageRegex = /^(.*?)(?::([^@]+))?(@[^@]+)?$/

  const matches = RegExp(imageRegex).exec(image)

  // If no matches found, return the original image
  if (!matches) {
    return image
  }

  const imageName = matches[1]
  // const imageTag = matches[2]
  const imageDigest = matches[3]?.replace('@', '')

  // If the image already has a digest, return the original image
  if (imageDigest) {
    // ... but error out if there's a digest mismatch
    if (digest && imageDigest !== digest) {
      throw new Error(
        `Defined conflicting digests: ${imageDigest} and ${digest}`
      )
    }
    return image
  }

  // Use provided digest
  core.info(
    `Using provided digest ${digest} instead of original reference ${image}`
  )
  return `${imageName}@${digest}`
}
