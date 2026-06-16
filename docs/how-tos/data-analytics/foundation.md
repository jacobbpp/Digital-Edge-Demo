# Data Analytics Foundation: Data Basics

Data analysis is not just making charts. It is the habit of asking a useful question, finding trustworthy data, checking what the data can and cannot say, and explaining the result clearly enough for someone to make a better decision.

<div class="de-path-summary">
  <div>
    <span>Level</span>
    <strong>Foundation</strong>
  </div>
  <div>
    <span>Time</span>
    <strong>45-60 minutes</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Build confident data habits</strong>
  </div>
</div>

## The Big Idea

Good analysis follows a simple pattern:

<div class="de-data-flow" aria-label="Data analysis process">
  <span>Question</span>
  <span>Source</span>
  <span>Quality</span>
  <span>Analyse</span>
  <span>Explain</span>
</div>

If one step is weak, the whole analysis becomes weaker. A beautiful chart built from poor data is still poor evidence.

## 1. Start With The Question

Before looking at numbers, write the decision you are trying to support.

<div class="de-callout-grid">
  <article>
    <h3>Weak question</h3>
    <p>How are we doing?</p>
  </article>
  <article>
    <h3>Better question</h3>
    <p>Which marketing channel produced the strongest conversion rate last month?</p>
  </article>
  <article>
    <h3>Decision</h3>
    <p>Where should we focus next month's campaign budget?</p>
  </article>
</div>

<p class="de-reflection"><strong>Reflection:</strong> What decision would be easier in your work if the question was written more clearly?</p>

## 2. Know Your Data Types

Different data types answer different kinds of questions. Mixing them up can lead to confused analysis.

<div class="de-data-type-grid">
  <article>
    <span>Category</span>
    <h3>Names or groups</h3>
    <p>Examples: channel, region, course, product, employer.</p>
  </article>
  <article>
    <span>Number</span>
    <h3>Counts or measures</h3>
    <p>Examples: clicks, revenue, completion rate, time spent.</p>
  </article>
  <article>
    <span>Date</span>
    <h3>Time-based values</h3>
    <p>Examples: enquiry date, start date, submission month.</p>
  </article>
  <article>
    <span>Text</span>
    <h3>Written feedback</h3>
    <p>Examples: survey comments, support notes, learner reflections.</p>
  </article>
</div>

### Example Dataset

<table>
  <thead>
    <tr>
      <th>Channel</th>
      <th>Month</th>
      <th>Visits</th>
      <th>Enquiries</th>
      <th>Conversion Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Email</td>
      <td>May</td>
      <td>1,200</td>
      <td>96</td>
      <td>8.0%</td>
    </tr>
    <tr>
      <td>Search</td>
      <td>May</td>
      <td>2,400</td>
      <td>144</td>
      <td>6.0%</td>
    </tr>
    <tr>
      <td>Social</td>
      <td>May</td>
      <td>1,800</td>
      <td>54</td>
      <td>3.0%</td>
    </tr>
  </tbody>
</table>

The table contains categories, dates, counts, and a calculated percentage. That mix lets you compare channels, track time, and spot performance differences.

## 3. Check The Source

Data does not become trustworthy just because it is in a spreadsheet.

<div class="de-data-quality-panel">
  <div>
    <h3>Source confidence</h3>
    <p>Use this mental model before you analyse.</p>
  </div>
  <div class="de-quality-bars" aria-label="Source quality example">
    <span style="--value: 92"><strong>CRM export</strong></span>
    <span style="--value: 74"><strong>Survey responses</strong></span>
    <span style="--value: 48"><strong>Copied notes</strong></span>
    <span style="--value: 28"><strong>Unknown spreadsheet</strong></span>
  </div>
</div>

Ask:

- Who collected this data?
- Why was it collected?
- When was it last updated?
- What is missing?
- Has anything been manually changed?

## 4. Look For Quality Issues

Most real datasets are a little messy. Your job is not to pretend they are perfect. Your job is to notice the mess before it misleads someone.

<div class="de-news-feature-grid">
  <article>
    <span class="de-card__label">Missing</span>
    <h3>Blank values</h3>
    <p>A missing date, score, or category can change totals and averages.</p>
  </article>
  <article>
    <span class="de-card__label">Duplicate</span>
    <h3>Repeated records</h3>
    <p>The same learner, customer, or enquiry may appear more than once.</p>
  </article>
  <article>
    <span class="de-card__label">Inconsistent</span>
    <h3>Mixed labels</h3>
    <p>"Email", "email", and "E-mail" may be treated as separate categories.</p>
  </article>
</div>

<details class="de-check-understanding">
  <summary>Quick quality check</summary>
  <ol>
    <li>Count the rows before and after cleaning.</li>
    <li>Look for blanks in important columns.</li>
    <li>Check whether categories are spelled consistently.</li>
    <li>Scan for unusually high or low values.</li>
    <li>Write down anything you changed.</li>
  </ol>
</details>

## 5. Use The Right Chart

Charts should make comparison easier. They should not decorate the page.

<div class="de-data-chart-grid">
  <article>
    <h3>Bar chart: compare categories</h3>
    <div class="de-bar-chart" aria-label="Enquiries by channel">
      <span style="--value: 67"><strong>Email</strong><em>96</em></span>
      <span style="--value: 100"><strong>Search</strong><em>144</em></span>
      <span style="--value: 38"><strong>Social</strong><em>54</em></span>
    </div>
    <p>Search produced the most enquiries, but that does not automatically mean it performed best.</p>
  </article>
  <article>
    <h3>Rate chart: compare efficiency</h3>
    <div class="de-bar-chart de-bar-chart--rate" aria-label="Conversion rate by channel">
      <span style="--value: 80"><strong>Email</strong><em>8.0%</em></span>
      <span style="--value: 60"><strong>Search</strong><em>6.0%</em></span>
      <span style="--value: 30"><strong>Social</strong><em>3.0%</em></span>
    </div>
    <p>Email had fewer enquiries than Search, but converted a higher share of visits.</p>
  </article>
</div>

### Why Two Charts Tell A Better Story

Search wins on volume. Email wins on efficiency. A useful insight names both.

> Search brought the highest number of enquiries, but Email converted visits more efficiently. If budget is limited, Email may deserve closer attention before scaling Search further.

## 6. Spot Trends Over Time

A trend chart helps you see whether something is rising, falling, or changing unevenly.

<div class="de-trend-card">
  <h3>Enquiries over four months</h3>
  <div class="de-trend-chart" aria-label="Simple enquiries trend">
    <span style="--height: 42"><strong>Feb</strong><em>84</em></span>
    <span style="--height: 58"><strong>Mar</strong><em>116</em></span>
    <span style="--height: 51"><strong>Apr</strong><em>102</em></span>
    <span style="--height: 72"><strong>May</strong><em>144</em></span>
  </div>
  <p>May looks stronger than the previous months, but you would still ask what changed before claiming success.</p>
</div>

Good follow-up questions:

- Did the campaign budget change?
- Did the audience change?
- Was there a seasonal effect?
- Did tracking change?
- Was the same definition used every month?

## 7. Write The Insight

An insight is not just a number. It connects evidence to meaning.

<div class="de-article-compare">
  <article>
    <h3>Observation</h3>
    <p>Email conversion rate was 8.0%.</p>
  </article>
  <article>
    <h3>Insight</h3>
    <p>Email converted more efficiently than Search and Social, so it may be worth testing a larger audience or stronger call to action.</p>
  </article>
</div>

<section class="de-scenario-task">
  <h2>Scenario Task</h2>
  <p>Your manager asks which campaign channel is “best”. Write one follow-up question before answering, then decide whether you would compare volume, conversion rate, cost, or audience quality.</p>
</section>

Use this sentence pattern:

<div class="de-check-card">
  <h2>Insight pattern</h2>
  <p><strong>What happened:</strong> Name the result.</p>
  <p><strong>Why it matters:</strong> Connect it to the decision.</p>
  <p><strong>What to do next:</strong> Suggest a cautious action or question.</p>
</div>

## Foundation Check

<div class="de-completion-card">
  <h2>You can now:</h2>
  <ul>
    <li>Start analysis with a clear question.</li>
    <li>Recognise common data types.</li>
    <li>Check whether a data source is trustworthy enough to use.</li>
    <li>Spot simple data quality issues.</li>
    <li>Choose a chart that matches the question.</li>
    <li>Turn an observation into a useful insight.</li>
  </ul>
</div>

## What To Learn Next

Once the basics feel comfortable, move into:

- Spreadsheet formulas.
- Pivot tables.
- Cleaning data.
- Writing chart titles.
- Building simple dashboards.
- Explaining recommendations clearly.
