# What Is An API?

An API is a way for systems to talk to each other. APIs help websites, apps, reports, automations, and platforms request information or trigger actions without a person manually copying data between places.

You do not need to be a developer to understand why APIs matter. They sit behind many everyday digital services.

<div class="de-path-summary">
  <div>
    <span>Topic</span>
    <strong>Infrastructure</strong>
  </div>
  <div>
    <span>Use when</span>
    <strong>Connecting systems</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Understand integration</strong>
  </div>
</div>

## The Big Idea

API stands for Application Programming Interface. In plain English, it is an agreed way for one system to ask another system for something.

For example, a booking page might ask a calendar system for available slots. A dashboard might ask a data platform for the latest figures. An app might ask a payment provider to confirm whether a payment succeeded.

<section class="de-key-term">
  <h2>Key Term</h2>
  <p><strong>Integration:</strong> a connection between systems that allows data, actions, or events to move from one place to another.</p>
</section>

## Requests And Responses

Most API conversations involve a request and a response.

<div class="de-process-steps">
  <article>
    <span>1</span>
    <h3>Client sends request</h3>
    <p>One system asks for data or asks another system to do something.</p>
  </article>
  <article>
    <span>2</span>
    <h3>API receives request</h3>
    <p>The receiving system checks the request, permissions, and format.</p>
  </article>
  <article>
    <span>3</span>
    <h3>Server processes it</h3>
    <p>The system finds data, updates something, or rejects the request if it is not allowed.</p>
  </article>
  <article>
    <span>4</span>
    <h3>Response comes back</h3>
    <p>The requesting system receives a result, such as data, confirmation, or an error message.</p>
  </article>
</div>

## A Simple Example

Imagine a learning platform that needs to show upcoming events.

<div class="de-article-compare">
  <article>
    <h3>Without an API</h3>
    <p>Someone manually copies event details from one system into another. Updates can be missed, duplicated, or delayed.</p>
  </article>
  <article>
    <h3>With an API</h3>
    <p>The site requests event information from the source system and displays the latest available details automatically.</p>
  </article>
</div>

## Common API Words

| Word | Meaning |
| --- | --- |
| Endpoint | A specific API address used for a particular request. |
| Request | The message sent to the API. |
| Response | The message sent back by the API. |
| Method | The type of action, such as reading, creating, updating, or deleting data. |
| Authentication | A way to prove the requesting system is allowed to use the API. |
| Payload | The data sent with a request or returned in a response. |

<section class="de-guide-activity" data-api-flow>
  <div class="de-guide-activity__intro">
    <span class="de-content-label">Practice</span>
    <h2>API Conversation Builder</h2>
    <p>Build the request and response flow between two systems.</p>
    <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
  </div>
</section>

## Why APIs Matter At Work

APIs are useful because they reduce manual effort and allow systems to work together.

<div class="de-callout-grid">
  <article>
    <h3>Automation</h3>
    <p>APIs can move data or trigger actions without repeated manual steps.</p>
  </article>
  <article>
    <h3>Reporting</h3>
    <p>Dashboards can use APIs to collect fresh data from different systems.</p>
  </article>
  <article>
    <h3>User experience</h3>
    <p>Apps can show live information, such as availability, progress, or payment status.</p>
  </article>
  <article>
    <h3>Consistency</h3>
    <p>Teams can reduce duplicated data entry and keep systems closer to the same source of truth.</p>
  </article>
</div>

## API Risks

APIs need careful design and management. A poor integration can leak data, fail silently, overload a system, or create confusion about which system owns the truth.

<div class="de-check-card">
  <h2>Before using an API, ask:</h2>
  <label><input type="checkbox"> What data is being shared?</label>
  <label><input type="checkbox"> Which system is the source of truth?</label>
  <label><input type="checkbox"> Who or what is allowed to access it?</label>
  <label><input type="checkbox"> What happens if the API is unavailable?</label>
  <label><input type="checkbox"> How will errors be logged or reported?</label>
  <label><input type="checkbox"> Is personal or sensitive data involved?</label>
</div>

## Mini Challenge

Choose an app or service you use. What information might it request from another system? For example, maps, payments, messages, calendar availability, learning records, or account details.

## Reflection Prompt

Where in your workplace might manual copying between systems be replaced by a safer integration? What would need to be checked before that happened?

<div class="de-completion-card">
  <h2>Foundation outcome</h2>
  <p>You should now be able to explain APIs as system-to-system communication, describe requests and responses, and identify basic benefits and risks of integrations.</p>
</div>

<p><a class="de-inline-button" href="../">Back to Guides</a></p>
