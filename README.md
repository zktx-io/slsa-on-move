# Move Builds for Generation of SLSA3+ provenance

This document explains how to generate SLSA provenance for Move artifact(s).

This can be done by adding a step to your GitHub Actions workflow to call a
[reusable workflow](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
to build the package and generate SLSA provenance. We’ll call this workflow the
**“Move builder”** from now on.

---

<!-- markdown-toc --bullets="-" -i README.md -->

<!-- toc -->

- [Move Builds for Generation of SLSA3+ provenance](#move-builds-for-generation-of-slsa3-provenance)
  - [Benefits of Provenance](#benefits-of-provenance)
  - [Development Status](#development-status)
  - [Limitations](#limitations)
  - [Generating Provenance](#generating-provenance)
    - [Getting Started](#getting-started)

<!-- tocstop -->

---

## Benefits of Provenance

Using the **Move builder** will generate a non-forgeable attestation to the Move
package using the identity of the GitHub workflow. This can be used to create a
positive attestation to a package coming from your repository.

That means that once your users verify the package they have downloaded, they
can be sure that it was created by your repository’s workflow and hasn’t been
tampered with.

## Development Status

The **Move builder** is currently in alpha. The API could change while
approaching a Generally Available (GA) release. You can track progress towards
General Availability via
[this milestone](https://github.com/slsa-framework/slsa-github-generator/milestone/17).

Please try it out and
[create an issue](https://github.com/slsa-framework/slsa-github-generator/issues/new)
to send us feedback!

## Limitations

The **Move builder** currently has the following limitations:

1. The project must be buildable using move builder. If you need options for
   flags, profiles, or something else to define more granular builds, please
   [open an issue](https://github.com/slsa-framework/slsa-github-generator/issues/new).
1. The **Move builder** is limited to projects that output artifacts in a build
   directory, which is the default for the vast majority of projects.

## Generating Provenance

The **Move builder** uses a GitHub Actions reusable workflow to build your
package and generate the provenance.

### Getting Started

Let’s say you have the following build setups [Link](https://docs.zktx.io/slsa/slsa-on-move/)
