import * as core from '@actions/core'
import * as github from '@actions/github'
import { Context } from '@actions/github/lib/context'

/* XXX
- Find other open PRs with branches following the same pattern (e.g. track-fe-app-*) that were created before now
- Create PR for pushed branch (with standard format / template / whatnot)
- For all found open PRs in (1),
  - post a comment that it is superseded with link to the shiny new PR
  - close the PR
*/

export default async function run(context: Context = github.context) {
  try {
    // https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token
    const octokit = new github.GitHub(process.env.GITHUB_TOKEN)
    const base = core.getInput('baseBranch')
    const branchPattern = core.getInput('branchPattern', { required: true })
    const prTemplateTitle = core.getInput('prTemplateTitle', { required: true })
    const prTemplateBody = core.getInput('prTemplateBody', { required: true })

    const branch = context.ref
    const owner = context.repo.owner
    const repo = context.repo.repo

    const { data: pullRequests } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      base
    });

    const relatedPullRequests = pullRequests.filter((pr) => {
      return pr.head.ref.match(branchPattern)
    })

    console.log(`🤖 Creating PR for ${branch}`)
    const { data: newPullRequest } = await octokit.pulls.create({
      owner,
      repo,
      head: branch,
      base,
      title: prTemplateTitle,
      body: prTemplateBody.replace('{CLOSED_PRS}', relatedPullRequests.map(pr => `* ${pr.html_url}`).join('\n'))
    })

    for (let pullRequestToClose of relatedPullRequests) {
      console.log(`🤖 Closing branch ${pullRequestToClose.head.ref} for PR #${pullRequestToClose.number}`)
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pullRequestToClose.number,
        body: `This PR is superseded by ${newPullRequest.html_url}. Please head there to review the latest changes pushed from the client.`
      });
      await octokit.git.deleteRef({
        owner,
        repo,
        // https://developer.github.com/v3/git/refs/#delete-a-reference, https://github.com/octokit/rest.js/issues/1039#issuecomment-427456142
        ref: `heads/${pullRequestToClose.head.ref}`
      });
    }

    core.setOutput('closed-prs', relatedPullRequests.map(pr => pr.number).join(','));
    core.setOutput('opened-pr', String(newPullRequest.number));
    console.log(`🤖 All done ✨`)
  } catch (error) {
    core.setFailed(error.message);
  }
}
