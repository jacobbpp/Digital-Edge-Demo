# Python Pathway

Python is a friendly language for learning how to think with code. It is widely used for automation, data analysis, web development, scripting, AI workflows, testing, and small everyday tools.

This pathway keeps the first steps clean: write output, store information, make decisions, work with lists, and build a tiny useful script using the examples on the page.

<div class="de-path-summary">
  <div>
    <span>Time</span>
    <strong>5 short sessions</strong>
  </div>
  <div>
    <span>Goal</span>
    <strong>Build practical Python confidence</strong>
  </div>
  <div>
    <span>Practice</span>
    <strong>Follow each guided example</strong>
  </div>
</div>

## The Learning Path

<div class="de-learning-path">
  <section>
    <span class="de-step">1</span>
    <div>
      <h2>Meet Output</h2>
      <p>Start with <code>print()</code>. It lets your code speak back to you.</p>
      <pre><code class="language-python">print("Hello, Digital Edge")</code></pre>
      <p><strong>Mini challenge:</strong> print your name, your learning goal, and one task you would like Python to help with.</p>
    </div>
  </section>
  <section>
    <span class="de-step">2</span>
    <div>
      <h2>Store Useful Information</h2>
      <p>Variables help you name values so your code is easier to read and change.</p>
      <pre><code class="language-python">channel = "Email"
clicks = 984

print(f"{channel} produced {clicks} clicks")</code></pre>
      <p><strong>Mini challenge:</strong> create variables for a campaign name, impressions, and clicks.</p>
    </div>
  </section>
  <section>
    <span class="de-step">3</span>
    <div>
      <h2>Make Decisions</h2>
      <p>Use <code>if</code> statements when your script needs to choose between outcomes.</p>
      <pre><code class="language-python">title_length = 48

if 35 <= title_length <= 60:
    print("Title length looks good")
else:
    print("Review the title length")</code></pre>
      <p><strong>Mini challenge:</strong> change the number and make both messages appear.</p>
    </div>
  </section>
  <section>
    <span class="de-step">4</span>
    <div>
      <h2>Work with Lists</h2>
      <p>Lists let you handle groups of values: tasks, keywords, scores, campaigns, names, or files.</p>
      <pre><code class="language-python">tasks = ["Plan", "Create", "Measure"]

for task in tasks:
    print(f"Next step: {task}")</code></pre>
      <p><strong>Mini challenge:</strong> make a list of three digital tasks and print them one by one.</p>
    </div>
  </section>
  <section>
    <span class="de-step">5</span>
    <div>
      <h2>Build a Tiny Tool</h2>
      <p>Bring the pieces together with a small CTR calculator.</p>
      <pre><code class="language-python">campaign = {
    "name": "Search launch",
    "impressions": 42000,
    "clicks": 1680
}

ctr = campaign["clicks"] / campaign["impressions"] * 100
print(f'{campaign["name"]}: {ctr:.2f}% CTR')</code></pre>
      <p><strong>Mini challenge:</strong> duplicate the campaign, change the numbers, and compare the results.</p>
    </div>
  </section>
</div>

## Your Practice Routine

1. Read the starter example once without changing it.
2. Predict what the output should be.
3. Change one value in your own notes or local editor.
4. Explain what would change in the output.
5. Write one sentence describing the pattern you noticed.

## What to Learn Next

Once this feels comfortable, move into:

- Functions.
- Reading files.
- Cleaning simple data.
- Working with dates.
- Using packages.
- Automating repetitive tasks.
