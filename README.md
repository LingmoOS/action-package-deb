# Build Deb in Github Actions

Build deb with ease in GitHub Actions.

> Currently, we only support building source packages.

## Usage

Below is an example of how to use this action in a GitHub Actions workflow:

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Run my Action
    id: run-action
    uses: LingmoOS/action-package-deb@0.0.1
    with:
      build-binary: false
      build-source: true
      output-dir: ./debian-deb-output
```
## Parameters

| Name | Description | Required |
| --- | --- | --- |
| `build-binary` | Build binary package | true |
| `build-source` | Build source package | true |
| `output-dir` | Output directory | false |
| `source-dir` | Source directory | false |
| `git-ref-name` | Git ref name to build deb | false |