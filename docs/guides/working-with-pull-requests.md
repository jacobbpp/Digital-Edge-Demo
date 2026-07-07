# Working With Pull Requests

A pull request gives a team a shared place to review a change before it is merged. It is part technical check, part communication tool, and part quality habit.

Good pull requests make it easier for other people to understand what changed, why it changed, how it was checked, and what kind of feedback is needed.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Collaboration</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Sharing changes</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Merge confidently</strong>
  </div>
</div>

## The Big Idea

A pull request is not just a button you press after finishing work. It is a short explanation of a change and an invitation for review.

The best pull requests reduce effort for the reviewer. They are focused, clearly described, and include enough evidence that the change has been checked.

<section class="de-key-term">
  <h2>Key Term</h2>
  <p><strong>Merge:</strong> bringing changes from one branch into another branch, often after review and automated checks have passed.</p>
</section>

## What A Pull Request Should Explain

<div class="de-check-card">
  <h2>Include:</h2>
  <label><input type="checkbox"> What changed</label>
  <label><input type="checkbox"> Why the change was needed</label>
  <label><input type="checkbox"> How the change was tested or checked</label>
  <label><input type="checkbox"> Any risks, limitations, or follow-up work</label>
  <label><input type="checkbox"> Screenshots or examples where they help</label>
  <label><input type="checkbox"> The ticket, issue, or request the work relates to</label>
</div>

## Keep Pull Requests Focused

Large pull requests are harder to review. They also make it harder to spot mistakes because unrelated changes are mixed together.

<div class="de-article-compare">
  <article>
    <h3>Hard to review</h3>
    <p>One pull request updates page content, changes navigation, rewrites styles, fixes a bug, and renames files.</p>
  </article>
  <article>
    <h3>Easier to review</h3>
    <p>One pull request updates the guide navigation. A second pull request adds the new content. Each has a clear purpose.</p>
  </article>
</div>

## A Simple Pull Request Template

Use a consistent structure when your team does not already have one.

```md
## Summary
- What changed?
- Why was it needed?

## Checks
- What did you test or inspect?
- Are there screenshots, logs, or build results?

## Notes for reviewer
- What should they focus on?
- Are there known limitations or follow-up tasks?
```

## Responding To Review Comments

Review comments are part of the work. They are not a sign that the pull request failed.

<div class="de-callout-grid">
  <article>
    <h3>Clarify</h3>
    <p>If a comment is unclear, ask what risk or improvement the reviewer has in mind.</p>
  </article>
  <article>
    <h3>Update</h3>
    <p>Make the change, then reply with what you changed so the reviewer can check quickly.</p>
  </article>
  <article>
    <h3>Discuss</h3>
    <p>If you disagree, explain the trade-off calmly and link it back to the goal of the work.</p>
  </article>
</div>

## Useful Reviewer Comments

Good review comments are specific and kind. They focus on the work, not the person.

| Less useful | More useful |
| --- | --- |
| This is wrong. | This condition may fail when the value is empty. Could we add a check for that case? |
| Bad naming. | Could this name describe the result rather than the process? I found it hard to follow later in the file. |
| Why did you do this? | What led to this approach? I expected the existing helper to be reused, so I may be missing some context. |

## Before You Request Review

Do a final self-review. Many issues are easier to fix before asking someone else to look.

<details class="de-check-understanding" open>
  <summary>Self-review checklist</summary>
  <ol>
    <li>Have I checked the changed files myself?</li>
    <li>Does the title explain the purpose of the change?</li>
    <li>Have I removed accidental edits, test notes, or debugging output?</li>
    <li>Have I explained how I tested it?</li>
    <li>Is the pull request small enough to review sensibly?</li>
  </ol>
</details>

<section class="de-guide-activity" data-checklist-activity="pr-readiness">
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>PR Readiness Check</h2>
    <p>Review a mock pull request and flag what should be added before asking for review.</p>
    <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
  </div>
</section>

## Mini Challenge

Write a pull request summary for this change: you updated a learner guide, fixed two broken links, and checked the site builds successfully.

## Reflection Prompt

Think about a change you have seen or made. What would help a reviewer understand it faster: a clearer title, a better summary, screenshots, test notes, or a smaller scope?

<div class="de-completion-card">
  <h2>Foundation outcome</h2>
  <p>You should now be able to prepare a focused pull request, explain what changed, respond constructively to review, and help a team merge work with confidence.</p>
</div>

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
