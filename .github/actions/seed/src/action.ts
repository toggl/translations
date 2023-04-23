import * as github from '@actions/github'

/* XXX
- Find other open PRs with branches following the same pattern (e.g. track-fe-app-*) that were created before now
- Create PR for pushed branch (with standard format / template / whatnot)
- For all found open PRs in (1),
  - post a comment that it is superseded with link to the shiny new PR
  - close the PR
*/

export default async function run(context = github.context) {
}
