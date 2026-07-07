# Testing Basics For Non-Testers

Testing is not only a specialist activity. Anyone who creates, changes, reviews, or supports digital work needs basic testing habits.

The aim is not to prove that something is perfect. The aim is to find important problems early, build confidence, and understand what risk remains.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Quality</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Checking work</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Reduce risk</strong>
  </div>
</div>

## The Big Idea

Testing is asking a product, page, process, or piece of code questions before users have to deal with the answers.

Good testing starts with the intended behaviour. What should happen? What should not happen? What would a user reasonably try? What might break if this change affects something nearby?

<section class="de-key-term">
  <h2>Key Term</h2>
  <p><strong>Acceptance criteria:</strong> clear conditions that describe what must be true for a piece of work to be accepted as complete.</p>
</section>

## Start With Expected Behaviour

Before checking a change, write what you expect to happen. This keeps testing focused and makes it easier to explain what passed or failed.

<div class="de-article-compare">
  <article>
    <h3>Weak check</h3>
    <p>I clicked around and it seemed fine.</p>
  </article>
  <article>
    <h3>Stronger check</h3>
    <p>I checked that the form saves valid entries, shows an error for missing required fields, and keeps the user's typed content after an error.</p>
  </article>
</div>

## Basic Test Types

<div class="de-callout-grid">
  <article>
    <h3>Happy path</h3>
    <p>Check the normal route where the user does what the system expects.</p>
  </article>
  <article>
    <h3>Edge cases</h3>
    <p>Check unusual but possible situations, such as empty fields, long text, or missing data.</p>
  </article>
  <article>
    <h3>Error cases</h3>
    <p>Check what happens when something goes wrong, such as invalid input or a failed upload.</p>
  </article>
  <article>
    <h3>Regression checks</h3>
    <p>Check that existing behaviour still works after the change.</p>
  </article>
</div>

## A Practical Testing Checklist

<div class="de-check-card">
  <h2>Before saying it is done, ask:</h2>
  <label><input type="checkbox"> What was supposed to change?</label>
  <label><input type="checkbox"> What should stay the same?</label>
  <label><input type="checkbox"> What is the most common user journey?</label>
  <label><input type="checkbox"> What could a user enter incorrectly?</label>
  <label><input type="checkbox"> What happens with missing, empty, or unusual data?</label>
  <label><input type="checkbox"> What evidence can I share that I checked it?</label>
</div>

<section class="de-guide-activity" data-checklist-activity="pick-test-cases">
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>Pick The Test Cases</h2>
    <p>Choose the checks that would give useful confidence before a feature reaches users.</p>
    <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
  </div>
</section>

## Evidence Matters

Testing notes do not need to be long, but they should be useful. Evidence helps reviewers, teammates, and future you understand what was checked.

| Evidence | Useful when |
| --- | --- |
| Short checklist | You checked several expected behaviours. |
| Screenshot | The change is visual or content-based. |
| Screen recording | A journey has several steps. |
| Log or error message | You investigated a technical failure. |
| Build or test output | You ran an automated check. |

## Scenario

You update a page so learners can download a resource. A basic test plan might include:

<div class="de-process-steps">
  <article>
    <span>1</span>
    <h3>Open the page</h3>
    <p>Confirm the new resource link is visible and labelled clearly.</p>
  </article>
  <article>
    <span>2</span>
    <h3>Use the link</h3>
    <p>Check that the file opens or downloads as expected.</p>
  </article>
  <article>
    <span>3</span>
    <h3>Check nearby content</h3>
    <p>Make sure existing links, headings, and layout still work.</p>
  </article>
  <article>
    <span>4</span>
    <h3>Record evidence</h3>
    <p>Note the browser, page, and result so someone else can understand the check.</p>
  </article>
</div>

## What Testing Cannot Do

Testing reduces uncertainty, but it does not remove all risk. A test can only check the cases you thought of, in the environment you used, with the data available at the time.

That is why good testing is paired with review, monitoring, feedback, and clear communication about what was and was not checked.

## Mini Challenge

Write three test checks for a login form: one happy path, one error case, and one edge case.

## Reflection Prompt

When you say something "works", what evidence would help another person trust that statement?

<div class="de-completion-card">
  <h2>Foundation outcome</h2>
  <p>You should now be able to create a simple test plan, check normal and unusual cases, record useful evidence, and explain remaining risk.</p>
</div>

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
