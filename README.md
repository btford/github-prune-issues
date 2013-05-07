# github-prune-issues

CLI for closing old Github issues.

## Installation

```shell
npm install -g github-prune-issues
```

## Usage

```shell
github-prune-issues <config-file.js>
```

## Config File

See [`./example-config.js`](https://github.com/btford/github-prune-issues/blob/master/example-config.js).

### Note:

To avoid hitting API limits, the comments of issues are cached in `issues.json`. Once cached, new issues an comments will not be taken into account when running this tool. To clear the cache, delete this file.
