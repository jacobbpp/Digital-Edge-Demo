# Writing A Good Bug Report

A good bug report helps someone else understand, reproduce, and investigate a problem. It saves time because it separates what happened from what was expected, where it happened, and why it matters.

Bug reports do not need to be long. They need to be clear enough that another person can take the next useful step.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Support</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Reporting issues</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Speed up investigation</strong>
  </div>
</div>

## The Big Idea

A weak bug report makes the investigator start from zero. A strong bug report gives them the context needed to reproduce the issue, assess the impact, and decide what to do next.

<section class="de-key-term">
  <h2>Key Term</h2>
  <p><strong>Reproduce:</strong> to make the same issue happen again by following clear steps. If an issue can be reproduced, it is usually easier to investigate and fix.</p>
</section>

## What To Include

<div class="de-check-card">
  <h2>A useful bug report includes:</h2>
  <label><input type="checkbox"> A clear title</label>
  <label><input type="checkbox"> Where the issue happened</label>
  <label><input type="checkbox"> What you expected to happen</label>
  <label><input type="checkbox"> What actually happened</label>
  <label><input type="checkbox"> Steps to reproduce it</label>
  <label><input type="checkbox"> Evidence, such as screenshots or error messages</label>
  <label><input type="checkbox"> Impact on users, work, or deadlines</label>
  <label><input type="checkbox"> Anything you have already tried</label>
</div>

## Before And After

<div class="de-article-compare">
  <article>
    <h3>Less useful</h3>
    <p>The page is broken. Please fix ASAP.</p>
  </article>
  <article>
    <h3>More useful</h3>
    <p>The event registration button on the Events page opens a blank page in Chrome. I expected it to open the registration guidance. It happened at 10:20 today after refreshing the page. Screenshot attached.</p>
  </article>
</div>

## Steps To Reproduce

Steps to reproduce should be short, numbered, and specific. They should describe what a person did, not what you think the code did.

```md
1. Open the Events page.
2. Find "Imposter Syndrome and Building Confidence".
3. Select the registration button.
4. Observe that a blank page opens instead of the registration guidance.
```

If the issue does not happen every time, say that. Intermittent problems are still real, but they need different investigation.

## Explain Impact

Impact helps people prioritise. A typo, a broken download, and a failed login may all be bugs, but they do not carry the same urgency.

| Impact detail | Why it helps |
| --- | --- |
| Who is affected | Shows whether the issue affects one person, a team, or many users. |
| What is blocked | Explains whether people can continue with a workaround. |
| When it started | Helps connect the issue to recent changes or incidents. |
| Deadline or event risk | Helps the team prioritise time-sensitive issues. |

## Evidence Is Better Than Interpretation

Try to share what you observed before jumping to a cause.

<div class="de-article-compare">
  <article>
    <h3>Interpretation first</h3>
    <p>The database is broken.</p>
  </article>
  <article>
    <h3>Observation first</h3>
    <p>When I save the form, I see "Unable to save record". The same form saved correctly yesterday. I have attached the error message and the time it happened.</p>
  </article>
</div>

## A Simple Bug Report Template

```md
## Summary
Brief title or description of the issue.

## Where it happened
Page, system, device, browser, account type, or environment.

## Expected result
What should have happened?

## Actual result
What happened instead?

## Steps to reproduce
1.
2.
3.

## Impact
Who is affected and what is blocked?

## Evidence
Screenshots, error messages, links, timestamps, logs, or examples.

## Tried already
Refresh, different browser, repeated steps, checked another account, or anything else useful.
```

<section class="de-guide-activity" data-bug-detective>
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>Bug Report Detective</h2>
    <p>Pick useful clues from messy evidence and assemble a report.</p>
    <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
  </div>
  <noscript>
    <p>This activity needs JavaScript, but the template above still shows the structure to follow.</p>
  </noscript>
</section>

## Mini Challenge

Rewrite this bug report: "Search does not work." Add expected result, actual result, steps to reproduce, and impact.

## Reflection Prompt

What information would you want before trying to fix a problem that someone else reported to you?

<div class="de-completion-card">
  <h2>Foundation outcome</h2>
  <p>You should now be able to report bugs with clear evidence, reproduction steps, and impact so the next person can investigate faster.</p>
</div>

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
