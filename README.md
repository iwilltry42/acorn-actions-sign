# actions-sign

[![build-test](https://github.com/acorn-io/actions-sign/actions/workflows/test.yml/badge.svg)](https://github.com/acorn-io/actions-sign/actions/workflows/test.yml)

GitHub action to sign Acorn Images

# Usage

```yaml
steps:
- uses: actions/checkout@master
- uses: acorn-io/actions-setup@v1
- uses: acorn-io/actions-login@v1
  with:
    registry: ${{secrets.YOUR_REGISTRY}}
    username: ${{secrets.YOUR_USERNAME}}
    password: ${{secrets.YOUR_PASSWORD}}
- uses: acorn-io/actions-sign@v1
  with:
    image: ${{secrets.YOUR_REGISTRY}}/yourimage:v1
    digest: sha256:123abc
    key: ${{secrets.YOUR_PRIVATE_KEY}}
    annotations: |
      foo=bar
      approved=true
    push: true
```

# Options

| Key           | Default      | Description |
| ----------    | ------------ | ----------- |
| `image`       | **Required** | Name of the image to sign - by default, we put an annotation on the image recording this value for advanced security features in Acorn
| `key`         | **Required** | Private key to sign the image with
| `push`        | `true`       | Push the signature to the `image`'s registry - this is what we need the `acorn-io/actions-login` action for
| `digest`      | Optional     | If `image` is not a digest reference, you can optionally specify the digest here so we don't have to infer it from the `image` tag
| `annotations` | Optional     | Annotations to add to the signature payload - Multiline string with one key=value pair per line

# License

Copyright (c) 2023 Acorn Labs, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
