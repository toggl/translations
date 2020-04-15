# Actions

This repository uses GitHub actions to manage branches and PRs pushed from client repositories.

## Things worth knowing

#### Authentication

The actions are authenticated for write access via the token automatically added by GitHub. See [Authenticating with the GitHub token](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) for further reading.

#### Build

The javascript actions depend on some npm packages. The two options for running these actions are:
* Commit `node_modules` to the repository alongside the code
* Build the action to one file with all modules included. The default [recommendation](https://help.github.com/en/actions/building-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github) is to use [@zeit/ncc](https://github.com/zeit/ncc) for this.

We opted for the second option. After you make changes to an action, **you must build it** and commit the changes. They live in `actions/**/dist`. Maybe we can make this a commit hook at some point.
