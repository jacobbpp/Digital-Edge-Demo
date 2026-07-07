# Writing Good Technical Notes

Good technical notes help people understand what happened, what matters, and what needs to happen next. They reduce confusion, protect context, and make work easier to continue when someone else picks it up.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Work habits</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Recording technical work</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Make action easier</strong>
  </div>
</div>

## Why Notes Matter

Technical work often involves decisions, assumptions, tests, errors, fixes, and small discoveries. If those stay in one person's head, the team loses time later.

<div class="de-callout-grid">
  <article>
    <h3>For your future self</h3>
    <p>Notes help you remember what you tried, why it mattered, and where to restart.</p>
  </article>
  <article>
    <h3>For your team</h3>
    <p>Notes help someone else review, support, test, or continue the work.</p>
  </article>
  <article>
    <h3>For accountability</h3>
    <p>Notes make decisions, risks, and next steps visible.</p>
  </article>
</div>

## The Basic Pattern

Use this structure when you are not sure how to write a note:

<div class="de-check-card">
  <h2>Context, action, evidence, next step</h2>
  <p><strong>Context:</strong> What is this about?</p>
  <p><strong>Action:</strong> What did you do or change?</p>
  <p><strong>Evidence:</strong> What did you observe, test, or confirm?</p>
  <p><strong>Next step:</strong> What should happen now?</p>
</div>

## Example: Weak Vs Useful

<div class="de-before-after">
  <article>
    <span>Before</span>
    <h3>Weak note</h3>
    <p>Fixed login issue. Seems fine now.</p>
  </article>
  <article>
    <span>After</span>
    <h3>Useful note</h3>
    <p>Users could not log in after password reset. I found the reset link was expiring immediately because the expiry value was set to 0. Updated it to 30 minutes and tested reset with a new account. Next step: ask support to monitor new reset tickets today.</p>
  </article>
</div>

## Notes For Common Situations

<div class="de-data-type-grid">
  <article>
    <span>Ticket</span>
    <h3>Problem note</h3>
    <p>Include expected behaviour, actual behaviour, steps to reproduce, impact, and evidence.</p>
  </article>
  <article>
    <span>Handover</span>
    <h3>Continuation note</h3>
    <p>Include current state, what has been tried, what is blocked, and where files or links are.</p>
  </article>
  <article>
    <span>Update</span>
    <h3>Progress note</h3>
    <p>Include what changed, what is still outstanding, and whether the timeline or risk has changed.</p>
  </article>
  <article>
    <span>Decision</span>
    <h3>Decision note</h3>
    <p>Include the options considered, the choice made, the reason, and any trade-offs accepted.</p>
  </article>
</div>

## A Useful Ticket Template

<details class="de-expand-box" open>
  <summary>Copy this structure into a ticket or support note</summary>
  <div class="de-type-grid">
    <article>
      <h3>Summary</h3>
      <p>One sentence describing the issue or task.</p>
    </article>
    <article>
      <h3>Impact</h3>
      <p>Who is affected and how serious it is.</p>
    </article>
    <article>
      <h3>Evidence</h3>
      <p>Links, screenshots, logs, examples, or steps to reproduce.</p>
    </article>
    <article>
      <h3>Next step</h3>
      <p>The action needed, owner if known, and any deadline.</p>
    </article>
  </div>
</details>

<section class="de-guide-activity" data-checklist-activity="technical-note-fix">
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>Before And After Notes</h2>
    <p>Improve a vague handover by choosing the details that make it useful for someone else.</p>
    <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
  </div>
</section>

## Mini Challenge

Rewrite this note:

> Dashboard broken. Needs fixing.

Turn it into a useful technical note with context, evidence, impact, and next step.

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
