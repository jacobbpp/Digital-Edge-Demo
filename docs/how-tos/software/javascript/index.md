# JavaScript Pathway

JavaScript is the language of interaction on the web. Buttons, forms, filters, calculators, dashboards, little “aha” moments on a page: JavaScript is usually somewhere nearby, sleeves rolled up.

This path keeps things simple. You will learn enough to write small scripts, understand what is happening, and use the guided practice panels in each step as you go.

<div class="de-path-summary">
  <div>
    <span>Time</span>
    <strong>1 hour</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Build useful browser confidence</strong>
  </div>
  <div>
    <span>Practice</span>
    <strong>Use guided practice each step</strong>
  </div>
</div>

<div class="de-progress-card">
  <h2>Progress checklist</h2>
  <label><input type="checkbox"> I can use the console to inspect output.</label>
  <label><input type="checkbox"> I can create useful variables with <code>const</code> and <code>let</code>.</label>
  <label><input type="checkbox"> I can use <code>if</code> statements to make decisions.</label>
  <label><input type="checkbox"> I can loop through an array.</label>
  <label><input type="checkbox"> I can combine objects, calculations, and decisions in a tiny tool.</label>
</div>

<div class="de-glossary-strip">
  <details>
    <summary>Variable</summary>
    <p>A named place to store a value, such as <code>const clicks = 984;</code>.</p>
  </details>
  <details>
    <summary>Function</summary>
    <p>A reusable block of code that performs a task. You will meet these properly after this pathway.</p>
  </details>
  <details>
    <summary>Object</summary>
    <p>A group of related values with names, such as campaign name, clicks, and impressions.</p>
  </details>
  <details>
    <summary>API</summary>
    <p>A way for software systems to talk to each other and exchange data.</p>
  </details>
</div>

## The Learning Path

<div class="de-learning-path">
  <section>
    <span class="de-step">1</span>
    <div>
      <span class="de-difficulty">Foundation</span>
      <h2>Meet the Console</h2>
      <p>The console is where JavaScript can show messages, results, warnings, and errors. Developers use it constantly because it gives quick feedback while they are building and testing code.</p>
      <p>In a browser, the console lives inside Developer Tools. In the Digital Edge playground, the output panel acts like a simple console, so you can see what your code does straight away.</p>
      <pre><code class="language-javascript">console.log("Hello, Digital Edge");
console.log("I am learning JavaScript");
console.log(2 + 3);</code></pre>
      <p><strong>What to notice:</strong> text goes inside quote marks, numbers do not need quote marks, and JavaScript runs each line in order.</p>
      <a class="de-inline-button" href="#" data-guided-practice-link>Try this in guided practice</a>
      <details class="de-expand-box">
        <summary>Useful JavaScript data types</summary>
        <p>JavaScript values come in different types. The type tells JavaScript what kind of thing it is working with.</p>
        <div class="de-type-grid">
          <article>
            <h3>String</h3>
            <pre><code class="language-javascript">const name = "Digital Edge";</code></pre>
            <p>Text. Strings go inside quote marks.</p>
          </article>
          <article>
            <h3>Number</h3>
            <pre><code class="language-javascript">const clicks = 984;</code></pre>
            <p>Whole numbers and decimals. Useful for calculations.</p>
          </article>
          <article>
            <h3>Boolean</h3>
            <pre><code class="language-javascript">const isPublished = true;</code></pre>
            <p>A true or false value. Useful for decisions.</p>
          </article>
          <article>
            <h3>Array</h3>
            <pre><code class="language-javascript">const channels = ["Email", "Search", "Social"];</code></pre>
            <p>A list of values. Useful when you have more than one item.</p>
          </article>
          <article>
            <h3>Object</h3>
            <pre><code class="language-javascript">const campaign = {
  name: "Launch",
  clicks: 984
};</code></pre>
            <p>A grouped set of related values with names.</p>
          </article>
          <article>
            <h3>Null</h3>
            <pre><code class="language-javascript">const selectedCampaign = null;</code></pre>
            <p>An intentional empty value. It means “nothing selected yet”.</p>
          </article>
          <article>
            <h3>Undefined</h3>
            <pre><code class="language-javascript">let reportTitle;</code></pre>
            <p>A value that has not been assigned yet.</p>
          </article>
        </div>
      </details>
      <details class="de-check-understanding">
        <summary>Check your understanding</summary>
        <ol>
          <li><strong>What does <code>console.log()</code> do?</strong><br>It prints a value to the console so you can inspect what your code is doing.</li>
          <li><strong>Why does <code>"Hello"</code> use quotes but <code>2 + 3</code> does not?</strong><br>Quotes mark text. Numbers and calculations can be written directly.</li>
          <li><strong>Why is output useful while learning?</strong><br>It gives immediate feedback, which makes mistakes easier to spot.</li>
        </ol>
      </details>
      <div class="de-mistake-box">
        <h3>Common mistake</h3>
        <p><code>ReferenceError: consle is not defined</code> usually means a typo. JavaScript needs <code>console.log()</code>, not <code>consle.log()</code>.</p>
      </div>
      <p class="de-reflection"><strong>Reflection:</strong> Where could quick output help you check whether a digital task is working?</p>
      <p><strong>Mini challenge:</strong> print your name, one skill you want to learn, and the result of a simple sum.</p>
    </div>
  </section>
  <section>
    <span class="de-step">2</span>
    <div>
      <span class="de-difficulty">Foundation</span>
      <h2>Store Useful Information</h2>
      <p>Variables are named containers for values. They make code easier to read because you can give meaning to the data you are using.</p>
      <p>Use <code>const</code> when a value should stay the same. Use <code>let</code> when a value may change later.</p>
      <pre><code class="language-javascript">const campaignName = "Spring launch";
const channel = "Email";
const clicks = 984;
let status = "draft";

console.log(`${campaignName} is a ${channel} campaign`);
console.log(`It produced ${clicks} clicks`);
console.log(`Current status: ${status}`);</code></pre>
      <p><strong>What to notice:</strong> template strings use backticks and <code>${...}</code> to place variable values inside a sentence.</p>
      <a class="de-inline-button" href="#" data-guided-practice-link>Try this in guided practice</a>
      <details class="de-expand-box">
        <summary>When should I use const or let?</summary>
        <p>Most beginner JavaScript becomes easier when you use <code>const</code> by default and only use <code>let</code> when a value needs to change.</p>
        <div class="de-type-grid">
          <article>
            <h3>Use const for stable values</h3>
            <pre><code class="language-javascript">const campaignName = "Spring launch";
const channel = "Email";</code></pre>
            <p>The value is assigned once and should not be replaced later.</p>
          </article>
          <article>
            <h3>Use let for changing values</h3>
            <pre><code class="language-javascript">let clicks = 0;
clicks = clicks + 1;</code></pre>
            <p>The value changes as the program runs.</p>
          </article>
          <article>
            <h3>Avoid var for now</h3>
            <pre><code class="language-javascript">var oldStyle = "avoid this for now";</code></pre>
            <p><code>var</code> exists in older JavaScript, but <code>const</code> and <code>let</code> are clearer for learning.</p>
          </article>
          <article>
            <h3>Naming tip</h3>
            <pre><code class="language-javascript">const emailOpenRate = 42.5;</code></pre>
            <p>Use clear names. Future-you should understand the value without decoding a puzzle.</p>
          </article>
        </div>
      </details>
      <details class="de-check-understanding">
        <summary>Check your understanding</summary>
        <ol>
          <li><strong>What is a variable?</strong><br>A name for a stored value.</li>
          <li><strong>When should you use <code>const</code>?</strong><br>When the value should not be reassigned.</li>
          <li><strong>What does <code>${campaignName}</code> do?</strong><br>It inserts the variable value into a template string.</li>
        </ol>
      </details>
      <div class="de-mistake-box">
        <h3>Common mistake</h3>
        <p><code>SyntaxError: Identifier has already been declared</code> can happen when you create the same <code>const</code> twice in the same script. Rename it or reuse the existing variable.</p>
      </div>
      <p class="de-reflection"><strong>Reflection:</strong> What real workplace value would be clearer if you gave it a good variable name?</p>
      <p><strong>Mini challenge:</strong> create variables for a campaign name, impressions, clicks, and status. Print one clear sentence using all four.</p>
    </div>
  </section>
  <section>
    <span class="de-step">3</span>
    <div>
      <span class="de-difficulty de-difficulty--intermediate">Intermediate</span>
      <h2>Make Decisions</h2>
      <p>Programs become useful when they can make decisions. An <code>if</code> statement checks whether something is true and then chooses what to do.</p>
      <p>This is how code starts to behave differently depending on the situation: a title can pass or fail, a budget can be too high, a campaign can need review.</p>
      <pre><code class="language-javascript">const title = "JavaScript Pathway for Beginners";
const titleLength = title.length;

if (titleLength >= 35 && titleLength <= 60) {
  console.log(`Good title length: ${titleLength} characters`);
} else {
  console.log(`Review title length: ${titleLength} characters`);
}</code></pre>
      <p><strong>What to notice:</strong> <code>&amp;&amp;</code> means “and”. Both checks must be true for the first message to run.</p>
      <a class="de-inline-button" href="#" data-guided-practice-link>Try this in guided practice</a>
      <details class="de-expand-box">
        <summary>Useful comparison and logic operators</summary>
        <p>Decision-making in JavaScript depends on comparisons. These operators help your code ask better questions.</p>
        <div class="de-type-grid">
          <article>
            <h3>Strict equality</h3>
            <pre><code class="language-javascript">score === 10</code></pre>
            <p>Checks whether two values are exactly the same.</p>
          </article>
          <article>
            <h3>Not equal</h3>
            <pre><code class="language-javascript">status !== "published"</code></pre>
            <p>Checks whether two values are different.</p>
          </article>
          <article>
            <h3>Greater or less than</h3>
            <pre><code class="language-javascript">clicks >= 100</code></pre>
            <p>Useful for thresholds, scores, budgets, and targets.</p>
          </article>
          <article>
            <h3>And</h3>
            <pre><code class="language-javascript">ctr >= 3 && ctr <= 8</code></pre>
            <p>Both conditions must be true.</p>
          </article>
          <article>
            <h3>Or</h3>
            <pre><code class="language-javascript">channel === "Email" || channel === "Search"</code></pre>
            <p>At least one condition must be true.</p>
          </article>
          <article>
            <h3>Not</h3>
            <pre><code class="language-javascript">!isPublished</code></pre>
            <p>Flips a boolean value from true to false, or false to true.</p>
          </article>
        </div>
      </details>
      <details class="de-check-understanding">
        <summary>Check your understanding</summary>
        <ol>
          <li><strong>What does an <code>if</code> statement do?</strong><br>It runs code only when a condition is true.</li>
          <li><strong>What does <code>&amp;&amp;</code> mean?</strong><br>Both conditions must be true.</li>
          <li><strong>Why use decisions in marketing tools?</strong><br>They let a script classify, flag, score, or recommend based on data.</li>
        </ol>
      </details>
      <div class="de-mistake-box">
        <h3>Common mistake</h3>
        <p><code>Unexpected token else</code> often means the braces around the <code>if</code> block are missing or mismatched.</p>
      </div>
      <p class="de-reflection"><strong>Reflection:</strong> What is one rule you could turn into an <code>if</code> statement at work?</p>
      <p><strong>Mini challenge:</strong> change the title so it is too short, then too long, then just right.</p>
    </div>
  </section>
  <section>
    <span class="de-step">4</span>
    <div>
      <span class="de-difficulty de-difficulty--intermediate">Intermediate</span>
      <h2>Work with Lists</h2>
      <p>Arrays are lists. They help you work with groups of things instead of writing the same line of code again and again.</p>
      <p>You can loop through an array with <code>forEach()</code>. For every item in the list, JavaScript runs the code inside the brackets.</p>
      <pre><code class="language-javascript">const tasks = ["Plan campaign", "Create content", "Measure results"];

tasks.forEach((task, index) => {
  console.log(`${index + 1}. ${task}`);
});</code></pre>
      <p><strong>What to notice:</strong> arrays start counting from zero, so <code>index + 1</code> makes the output easier for humans to read.</p>
      <a class="de-inline-button" href="#" data-guided-practice-link>Try this in guided practice</a>
      <details class="de-expand-box">
        <summary>Useful array actions</summary>
        <p>Arrays become powerful when you can add, find, filter, and transform values.</p>
        <div class="de-type-grid">
          <article>
            <h3>Add an item</h3>
            <pre><code class="language-javascript">tasks.push("Report results");</code></pre>
            <p>Adds a new value to the end of the array.</p>
          </article>
          <article>
            <h3>Get one item</h3>
            <pre><code class="language-javascript">const firstTask = tasks[0];</code></pre>
            <p>Gets the first item. Arrays start counting from zero.</p>
          </article>
          <article>
            <h3>Count items</h3>
            <pre><code class="language-javascript">console.log(tasks.length);</code></pre>
            <p>Shows how many items are in the array.</p>
          </article>
          <article>
            <h3>Filter items</h3>
            <pre><code class="language-javascript">const longTasks = tasks.filter((task) => task.length > 10);</code></pre>
            <p>Creates a new array containing only items that match a condition.</p>
          </article>
          <article>
            <h3>Transform items</h3>
            <pre><code class="language-javascript">const upperTasks = tasks.map((task) => task.toUpperCase());</code></pre>
            <p>Creates a new array by changing every item.</p>
          </article>
          <article>
            <h3>Loop through items</h3>
            <pre><code class="language-javascript">tasks.forEach((task) => console.log(task));</code></pre>
            <p>Runs code once for each item in the array.</p>
          </article>
        </div>
      </details>
      <details class="de-check-understanding">
        <summary>Check your understanding</summary>
        <ol>
          <li><strong>What is an array?</strong><br>A list of values.</li>
          <li><strong>Why does the first item use index <code>0</code>?</strong><br>JavaScript arrays are zero-indexed.</li>
          <li><strong>What does <code>forEach()</code> do?</strong><br>It runs code once for each item in an array.</li>
        </ol>
      </details>
      <div class="de-mistake-box">
        <h3>Common mistake</h3>
        <p><code>Cannot read properties of undefined</code> can happen when you ask for an item that is not in the array, such as <code>tasks[99]</code>.</p>
      </div>
      <p class="de-reflection"><strong>Reflection:</strong> What repeated checklist, task list, or campaign list could be represented as an array?</p>
      <p><strong>Mini challenge:</strong> create a list of five useful website checks, then print them as a numbered checklist.</p>
    </div>
  </section>
  <section>
    <span class="de-step">5</span>
    <div>
      <span class="de-difficulty de-difficulty--stretch">Stretch</span>
      <h2>Build a Tiny Tool</h2>
      <p>Now combine variables, calculations, decisions, and output. This tiny tool calculates click-through rate, then gives a simple judgement.</p>
      <p>CTR stands for click-through rate. It shows what percentage of impressions became clicks.</p>
      <pre><code class="language-javascript">const campaign = {
  name: "Search launch",
  impressions: 42000,
  clicks: 1680
};

const ctr = (campaign.clicks / campaign.impressions) * 100;
const roundedCtr = ctr.toFixed(2);

console.log(`${campaign.name}: ${roundedCtr}% CTR`);

if (ctr >= 3) {
  console.log("Strong performance");
} else {
  console.log("Needs review");
}</code></pre>
      <p><strong>What to notice:</strong> objects group related information together. <code>campaign.clicks</code> means “get the clicks value from the campaign object”.</p>
      <a class="de-inline-button" href="#" data-guided-practice-link>Try this in guided practice</a>
      <details class="de-expand-box">
        <summary>How this tiny tool works</summary>
        <p>This example combines several beginner ideas into one useful script.</p>
        <div class="de-type-grid">
          <article>
            <h3>Object</h3>
            <pre><code class="language-javascript">campaign.clicks</code></pre>
            <p>Gets one named value from the campaign object.</p>
          </article>
          <article>
            <h3>Calculation</h3>
            <pre><code class="language-javascript">(clicks / impressions) * 100</code></pre>
            <p>Turns clicks and impressions into a percentage.</p>
          </article>
          <article>
            <h3>Formatting</h3>
            <pre><code class="language-javascript">ctr.toFixed(2)</code></pre>
            <p>Rounds the number to two decimal places for cleaner output.</p>
          </article>
          <article>
            <h3>Decision</h3>
            <pre><code class="language-javascript">if (ctr >= 3)</code></pre>
            <p>Checks whether performance meets the chosen threshold.</p>
          </article>
        </div>
        <p>Once you understand this pattern, you can build small tools for budgets, conversion rates, title checks, scores, and simple reports.</p>
      </details>
      <details class="de-check-understanding">
        <summary>Check your understanding</summary>
        <ol>
          <li><strong>What does the campaign object store?</strong><br>Related information about one campaign: name, impressions, and clicks.</li>
          <li><strong>Why multiply by <code>100</code>?</strong><br>To turn the click/impression ratio into a percentage.</li>
          <li><strong>Why use <code>toFixed(2)</code>?</strong><br>To make the output easier to read by limiting decimal places.</li>
        </ol>
      </details>
      <div class="de-mistake-box">
        <h3>Common mistake</h3>
        <p><code>NaN</code> means “Not a Number”. It often appears when a calculation uses missing data, text instead of a number, or division by something unexpected.</p>
      </div>
      <p class="de-reflection"><strong>Reflection:</strong> What small calculator or checker would be useful in your own work?</p>
      <p><strong>Mini challenge:</strong> create two more campaign objects, calculate their CTRs, and decide which one performed best.</p>
    </div>
  </section>
</div>

## Mini Projects

<div class="de-project-grid">
  <article>
    <span class="de-difficulty">Foundation</span>
    <h3>Build a Title Checker</h3>
    <p>Create a script that checks whether a page title is too short, too long, or just right.</p>
  </article>
  <article>
    <span class="de-difficulty de-difficulty--intermediate">Intermediate</span>
    <h3>Create a Campaign Scorecard</h3>
    <p>Store three campaigns in an array and print each campaign&apos;s CTR with a simple performance label.</p>
  </article>
  <article>
    <span class="de-difficulty de-difficulty--stretch">Stretch</span>
    <h3>Make a Website Checklist</h3>
    <p>Build a checklist array, loop through it, and print a numbered pre-launch review list.</p>
  </article>
</div>

## Pathway Completion

<div class="de-completion-card">
  <h2>You can now:</h2>
  <ul>
    <li>Explain what the console is for.</li>
    <li>Use common JavaScript data types.</li>
    <li>Create variables with clear names.</li>
    <li>Use decisions to classify results.</li>
    <li>Loop through arrays.</li>
    <li>Build a small JavaScript tool using an object and a calculation.</li>
  </ul>
</div>

## Your Practice Routine

1. Use the guided practice panel in each step.
2. Run the starter example once without changing it.
3. Change one thing and run it again.
4. Break it on purpose, read the error, and fix it.
5. Write one sentence explaining what changed.

## What to Learn Next

Once this path feels comfortable, move into browser work:

- Selecting page elements with <code>document.querySelector()</code>.
- Responding to clicks with <code>addEventListener()</code>.
- Updating text and classes on the page.
- Reading form input.
- Fetching data from an API.

The trick is to keep each experiment small. Small scripts are friendly. They tell you what went wrong without turning the whole afternoon into a fog machine.
