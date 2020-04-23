# manage-pushed-locales action

This action manages creating and closing PRs for each pushed branch for a translations target

1. Opens a new PR for the pushed branch
2. Closes all PRs matching the same branch pattern which are now superseded by this pr. A comment is created, linking to the new PR.

## Inputs

### `branch-pattern`

**Required** Pattern to match branches against when searching for related PRs e.g. 'track-fe-app-*'

Note: you should use the same pattern in your workflow, e.g.

```
on:
  push:
    branches:
      - 'track-fe-app-*'
```

### `pr-template-title`

**Required** Title of the created PR

### `pr-template-body`

**Required** Body of the created PR

## Outputs

### `closed-prs`

Comma delimited list of all PR numbers closed during this action run e.g. `10,11`

### `opened-pr`

PR number of the opened PR, e.g. `12`
