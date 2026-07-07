# Estimating Technical Work

Estimating technical work is not guessing a number and hoping for the best. It is a way of making the work visible before the team commits to a plan.

Good estimates help people understand effort, risk, unknowns, review time, dependencies, and the difference between a simple change and a simple-looking change.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Delivery</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Planning work</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Make effort visible</strong>
  </div>
</div>

## The Big Idea

An estimate is a conversation about what needs to happen, not just a prediction of how long it will take.

When a task is vague, the estimate will usually be weak. Before estimating, clarify what the outcome is, what counts as done, who needs to review it, what systems are involved, and what might be unknown.

<section class="de-key-term">
  <h2>Key Term</h2>
  <p><strong>Uncertainty:</strong> anything that could change the size, risk, or direction of the work once you start. Uncertainty is not failure. It is information the team should see early.</p>
</section>

## Why Technical Tasks Are Often Underestimated

Technical work often includes hidden effort. A task may sound like one action, but it can involve reading existing work, checking assumptions, testing changes, updating documentation, asking for access, waiting for review, or dealing with unexpected behaviour.

<div class="de-article-compare">
  <article>
    <h3>Simple-sounding task</h3>
    <p>Add a field to the form.</p>
  </article>
  <article>
    <h3>Actual work</h3>
    <p>Check requirements, update the form, validate the field, store the value, test errors, update the admin view, ask for review, and document the change.</p>
  </article>
</div>

## Break The Work Down First

Do not estimate the whole task in one go if it still feels blurry. Split it into smaller parts that can be discussed.

<div class="de-process-steps">
  <article>
    <span>1</span>
    <h3>Understand the outcome</h3>
    <p>Write what the work should achieve in plain language.</p>
  </article>
  <article>
    <span>2</span>
    <h3>List the activities</h3>
    <p>Include research, build, testing, review, documentation, deployment, and communication.</p>
  </article>
  <article>
    <span>3</span>
    <h3>Name the unknowns</h3>
    <p>Call out anything that may need investigation before the estimate is reliable.</p>
  </article>
  <article>
    <span>4</span>
    <h3>Explain confidence</h3>
    <p>Say whether the estimate is high confidence, medium confidence, or still exploratory.</p>
  </article>
</div>

## Useful Estimate Language

Avoid pretending certainty when the work still has unknowns. Clear language helps the team plan without hiding risk.

| Less useful | More useful |
| --- | --- |
| This will take two hours. | If the existing form is straightforward, this is likely half a day including testing. |
| It should be quick. | The change is small, but I need to check where the data is saved before estimating properly. |
| I do not know. | I need a short investigation first, then I can give a more realistic estimate. |
| I can do it today. | I can start today, but it needs review before it should be treated as done. |

## Estimate The Whole Path To Done

Technical work is not done when the first version works on your machine. A stronger estimate includes the checks needed to make the work safe and usable.

<div class="de-check-card">
  <h2>Include time for:</h2>
  <label><input type="checkbox"> Reading the requirement or ticket</label>
  <label><input type="checkbox"> Checking existing code, content, data, or process</label>
  <label><input type="checkbox"> Asking clarifying questions</label>
  <label><input type="checkbox"> Making the change</label>
  <label><input type="checkbox"> Testing normal and edge cases</label>
  <label><input type="checkbox"> Fixing issues found during testing</label>
  <label><input type="checkbox"> Updating notes, documentation, or handover information</label>
  <label><input type="checkbox"> Review, feedback, and final changes</label>
</div>

<section class="de-guide-activity" data-hidden-work-estimator>
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>Hidden Work Estimator</h2>
    <p>Look at a simple-sounding task and spot the work that needs to be included before estimating.</p>
    <button type="button" class="de-guide-activity__start" data-hidden-work-start>Start the activity</button>
  </div>
  <noscript>
    <p>This activity needs JavaScript, but the checklist above still shows the hidden work to consider.</p>
  </noscript>
</section>

## Scenario

You are asked to update a report so it includes a new weekly metric. The data may already exist, but nobody is sure which system owns it.

<div class="de-article-compare">
  <article>
    <h3>Risky estimate</h3>
    <p>I can add that this afternoon.</p>
  </article>
  <article>
    <h3>Stronger estimate</h3>
    <p>I can spend an hour checking whether the metric already exists and where it comes from. If it is available, the report update is probably a small task. If the data needs cleaning or a new export, it will need a separate estimate.</p>
  </article>
</div>

## Mini Challenge

Take this vague task: "Update the onboarding page." Break it into at least six smaller tasks. Include one task for clarification, one for review, and one for testing.

## Reflection Prompt

Think of a time when something took longer than expected. Was the estimate wrong because the work was misunderstood, because something unexpected happened, or because review and testing were left out?

<div class="de-completion-card">
  <h2>Foundation outcome</h2>
  <p>You should now be able to break technical work into smaller parts, explain uncertainty, and give estimates that help a team plan more honestly.</p>
</div>

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
