# Git and Version Control

Git is a version control tool. It helps teams track changes, work safely on the same project, and recover when something goes wrong.

You do not need to memorise every Git command to be useful on a technical project. Start by understanding the workflow: change files, check what changed, save a clear snapshot, then share it with the team.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Collaboration</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Tracking changes</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Work safely</strong>
  </div>
</div>

## The Big Idea

Git records meaningful snapshots of a project. Each snapshot is called a commit.

Think of a commit as a named checkpoint. It should explain what changed and why the change matters. If a mistake appears later, the team can inspect the history and understand where it came from.

<section class="de-key-term">
  <h2>Key Term</h2>
  <p><strong>Repository:</strong> a project folder that Git is tracking. It usually contains code, documentation, assets, configuration, and a hidden <code>.git</code> folder that stores the project history.</p>
</section>

## The Everyday Workflow

<div class="de-process-steps">
  <article>
    <span>1</span>
    <h3>Check status</h3>
    <p>See what has changed before you save or share anything.</p>
    <pre><code>git status</code></pre>
  </article>
  <article>
    <span>2</span>
    <h3>Stage changes</h3>
    <p>Choose which files should be included in the next checkpoint.</p>
    <pre><code>git add docs/page.md</code></pre>
  </article>
  <article>
    <span>3</span>
    <h3>Commit clearly</h3>
    <p>Save the checkpoint with a short message.</p>
    <pre><code>git commit -m "Add Git foundations guide"</code></pre>
  </article>
  <article>
    <span>4</span>
    <h3>Push your work</h3>
    <p>Send your committed work to the shared remote repository.</p>
    <pre><code>git push</code></pre>
  </article>
</div>

## Local And Remote

Your local repository lives on your laptop. A remote repository lives somewhere shared, such as GitHub, GitLab, or Azure DevOps.

<div class="de-article-compare">
  <article>
    <h3>Local</h3>
    <p>Your working copy of the project. You edit files, run checks, and make commits here.</p>
  </article>
  <article>
    <h3>Remote</h3>
    <p>The shared copy of the project. Teams use it for collaboration, review, deployment, and backup.</p>
  </article>
</div>

## Branches

A branch lets you work on a change without disturbing the main version of the project.

For example, a learner might create a branch for a documentation update:

```bash
git switch -c add-git-guide
```

They can then make changes, commit them, push the branch, and ask for review.

<details class="de-check-understanding" open>
  <summary>Knowledge check</summary>
  <ol>
    <li>Why might a team use a branch instead of changing <code>main</code> directly?</li>
    <li>What is the difference between committing and pushing?</li>
    <li>Why should commit messages explain the purpose of a change?</li>
  </ol>
</details>

## Pull Requests

A pull request is a request to merge one branch into another. It gives the team a place to review the change, ask questions, run checks, and agree whether the work is ready.

Pull requests are not just for code. They can also be used for documentation, content, configuration, and data files.

## Before And After

<div class="de-article-compare">
  <article>
    <h3>Less useful commit</h3>
    <pre><code>git commit -m "updates"</code></pre>
    <p>This does not tell the team what changed or why.</p>
  </article>
  <article>
    <h3>More useful commit</h3>
    <pre><code>git commit -m "Add guide for Git basics"</code></pre>
    <p>This gives the team a clear clue when reading the project history.</p>
  </article>
</div>

## Common Commands

| Command | What it helps you do |
| --- | --- |
| <code>git status</code> | Check what has changed. |
| <code>git diff</code> | Inspect the actual changes before committing. |
| <code>git add file.md</code> | Stage a file for the next commit. |
| <code>git commit -m "Message"</code> | Save a snapshot with a message. |
| <code>git pull</code> | Bring down updates from the remote repository. |
| <code>git push</code> | Send your commits to the remote repository. |
| <code>git log --oneline</code> | View recent commit history. |

<section class="de-guide-activity" data-git-timeline>
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>Commit Timeline</h2>
    <p>Arrange a Git workflow and identify where the mistake happened.</p>
    <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
  </div>
</section>

## Scenario Task

<section class="de-scenario-task">
  <h2>Try this</h2>
  <p>You are asked to update a project README. Write the four Git commands you would use to check the change, stage the file, commit it, and push it to the shared repository.</p>
</section>

## Reflection Prompt

What could go wrong if a team had no version history for a project? Think about mistakes, accountability, collaboration, and confidence when making changes.

<div class="de-completion-card">
  <h2>Foundation outcome</h2>
  <p>You should now be able to explain what Git is for, describe the difference between local and remote repositories, and follow a simple status, add, commit, push workflow.</p>
</div>

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
