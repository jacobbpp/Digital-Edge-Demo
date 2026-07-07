(function () {
  function installSearchPolish(attemptsLeft) {
    if (typeof window.displayResults !== "function") {
      if (attemptsLeft > 0) {
        window.setTimeout(() => installSearchPolish(attemptsLeft - 1), 40);
      }
      return;
    }

    if (window.digitalEdgeSearchPolished) return;
    window.digitalEdgeSearchPolished = true;

    window.displayResults = function displayDedupedResults(results) {
      const searchResults = document.getElementById("mkdocs-search-results");
      if (!searchResults) return;

      searchResults.replaceChildren();

      const pages = new Map();
      (results || []).forEach((result) => {
        const pageLocation = (result.location || "").split("#")[0] || "";
        const key = pageLocation.replace(/\/$/, "") || "home";
        if (key === "home") return;

        const existing = pages.get(key);
        const isPageResult = !(result.location || "").includes("#");

        if (!existing || isPageResult || result.summary.length > existing.summary.length) {
          pages.set(key, {
            location: pageLocation,
            title: result.title || "Untitled",
            summary: result.summary || ""
          });
        }
      });

      const deduped = Array.from(pages.values()).slice(0, 8);

      if (!deduped.length) {
        const noResultsText = searchResults.getAttribute("data-no-results-text") || "No results found";
        const empty = document.createElement("p");
        empty.textContent = noResultsText;
        searchResults.appendChild(empty);
        return;
      }

      deduped.forEach((result) => {
        const article = document.createElement("article");
        const heading = document.createElement("h3");
        const link = document.createElement("a");
        const summary = document.createElement("p");

        link.href = joinUrl(base_url, result.location);
        link.textContent = result.title;
        heading.appendChild(link);
        summary.textContent = result.summary;
        article.append(heading, summary);
        searchResults.appendChild(article);
      });
    };
  }

  function polishMkDocsChrome() {
    document.querySelectorAll(".bs-sidebar").forEach((sidebar) => {
      const column = sidebar.closest(".col-md-3");
      if (column) column.remove();
    });

    document.querySelectorAll('[role="main"].col-md-9').forEach((main) => {
      main.classList.remove("col-md-9");
      main.classList.add("col-md-12");
    });

    const searchIntro = document.querySelector("#mkdocs_search_modal .modal-body > p");
    if (searchIntro) {
      searchIntro.textContent = "Search articles, events, community news, podcast episodes, and people.";
    }

    const footerText = document.querySelector("footer p");
    if (footerText) {
      footerText.textContent = "BPP Digital Edge";
    }

    document.querySelectorAll('a[href^="https://open.spotify.com/"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", polishMkDocsChrome);
  } else {
    polishMkDocsChrome();
  }

  function installCodeCopyButtons() {
    document.querySelectorAll("pre > code").forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.querySelector(".de-code-copy")) return;

      pre.classList.add("de-copy-ready");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "de-code-copy";
      button.textContent = "Copy";
      button.addEventListener("click", async () => {
        const text = codeBlock.textContent || "";

        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Copied";
        } catch (error) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(codeBlock);
          selection.removeAllRanges();
          selection.addRange(range);
          button.textContent = "Selected";
        }

        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1600);
      });

      pre.appendChild(button);
    });
  }

  function executeJavaScript(source, outputElement) {
    const logs = [];
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    outputElement.textContent = "Running...\n";

    function capture(type, values) {
      logs.push(values.map((value) => {
        if (typeof value === "string") return value;
        return JSON.stringify(value, null, 2);
      }).join(" "));
      originalConsole[type](...values);
    }

    console.log = (...values) => capture("log", values);
    console.warn = (...values) => capture("warn", values);
    console.error = (...values) => capture("error", values);

    try {
      const result = Function(`"use strict";\n${source}`)();
      if (result !== undefined) logs.push(String(result));
      outputElement.textContent = logs.length ? logs.join("\n") : "Done. No output.";
    } catch (error) {
      outputElement.textContent = `${error.message || error}\n`;
    } finally {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    }
  }

  function installInlineGuidedPractice() {
    document.querySelectorAll("[data-guided-practice-link]").forEach((link) => {
      const section = link.closest("section");
      const codeBlock = section ? section.querySelector("pre > code") : null;
      if (!codeBlock) return;

      const initialCode = codeBlock.textContent || "";
      const playground = document.createElement("div");
      playground.className = "de-inline-playground";
      playground.innerHTML = `
        <div class="de-inline-playground__toolbar">
          <button type="button" data-inline-run>Run</button>
          <button type="button" data-inline-reset>Reset</button>
        </div>
        <textarea class="de-inline-playground__editor" spellcheck="false" aria-label="Inline JavaScript editor"></textarea>
        <div class="de-inline-playground__output-title">Console</div>
        <pre class="de-inline-playground__output">Ready.</pre>
      `;

      const editor = playground.querySelector(".de-inline-playground__editor");
      const output = playground.querySelector(".de-inline-playground__output");
      const run = playground.querySelector("[data-inline-run]");
      const reset = playground.querySelector("[data-inline-reset]");

      editor.value = initialCode;
      run.addEventListener("click", () => executeJavaScript(editor.value, output));
      reset.addEventListener("click", () => {
        editor.value = initialCode;
        output.textContent = "Ready.";
      });

      link.replaceWith(playground);
    });
  }

  function installEventCards() {
    const cards = document.querySelectorAll(".de-event-card");
    if (!cards.length) return;

    const modal = document.createElement("div");
    modal.className = "de-event-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="de-event-modal__backdrop" data-event-close></div>
      <section class="de-event-modal__panel" role="dialog" aria-modal="true" aria-labelledby="de-event-modal-title">
        <div class="de-event-modal__header">
          <h2 id="de-event-modal-title"></h2>
          <button class="de-event-modal__close" type="button" aria-label="Close event details" data-event-close>&times;</button>
        </div>
        <div class="de-event-modal__body">
          <div class="de-event-modal__meta">
            <div><span>Type</span><strong data-event-modal-type></strong></div>
            <div><span>Date</span><strong data-event-modal-date></strong></div>
            <div><span>Time</span><strong data-event-modal-time></strong></div>
            <div><span>Location</span><strong data-event-modal-location></strong></div>
          </div>
          <p data-event-modal-description></p>
          <div class="de-event-modal__takeaways" hidden>
            <strong>Key takeaways</strong>
            <ul data-event-modal-takeaways></ul>
          </div>
          <p class="de-event-modal__audience"><strong>Best for: </strong><span data-event-modal-audience></span></p>
          <div class="de-event-modal__actions">
            <a class="de-event-modal__register" href="#" target="_blank" rel="noopener noreferrer" data-event-modal-register>Register via Hub, eLMS, or OneFile</a>
            <a class="de-event-modal__calendar" href="#" download data-event-modal-calendar>Add to calendar</a>
          </div>
        </div>
      </section>
    `;
    document.body.appendChild(modal);

    const title = modal.querySelector("#de-event-modal-title");
    const type = modal.querySelector("[data-event-modal-type]");
    const date = modal.querySelector("[data-event-modal-date]");
    const time = modal.querySelector("[data-event-modal-time]");
    const location = modal.querySelector("[data-event-modal-location]");
    const description = modal.querySelector("[data-event-modal-description]");
    const audience = modal.querySelector("[data-event-modal-audience]");
    const takeawayPanel = modal.querySelector(".de-event-modal__takeaways");
    const takeaways = modal.querySelector("[data-event-modal-takeaways]");
    const register = modal.querySelector("[data-event-modal-register]");
    const calendar = modal.querySelector("[data-event-modal-calendar]");
    let activeCard = null;
    let activeCalendarUrl = "";

    function formatIcsDate(value) {
      return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    }

    function escapeIcsText(value) {
      return (value || "")
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    }

    function buildCalendarUrl(card) {
      if (!card.dataset.eventStart || !card.dataset.eventEnd) return "";

      const uid = `${card.dataset.eventStart}-${card.dataset.eventTitle || "digital-edge-event"}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      const content = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//BPP Digital Edge//Events//EN",
        "BEGIN:VEVENT",
        `UID:${uid}@digital-edge`,
        `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
        `DTSTART:${formatIcsDate(card.dataset.eventStart)}`,
        `DTEND:${formatIcsDate(card.dataset.eventEnd)}`,
        `SUMMARY:${escapeIcsText(card.dataset.eventTitle || "Digital Edge event")}`,
        `DESCRIPTION:${escapeIcsText(card.dataset.eventDescription || "Digital Edge event")}`,
        `LOCATION:${escapeIcsText(card.dataset.eventLocation || "Online")}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      return URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    }

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("de-modal-open");
      if (activeCalendarUrl) {
        URL.revokeObjectURL(activeCalendarUrl);
        activeCalendarUrl = "";
      }
      if (activeCard) activeCard.focus();
    }

    function openModal(card) {
      activeCard = card;
      title.textContent = card.dataset.eventTitle || "Event details";
      type.textContent = card.dataset.eventType || "Digital Edge event";
      date.textContent = card.dataset.eventDate || "To be confirmed";
      time.textContent = card.dataset.eventTime || "To be confirmed";
      location.textContent = card.dataset.eventLocation || "Online";
      description.textContent = card.dataset.eventDescription || "";
      audience.textContent = card.dataset.eventAudience || "Anyone interested in practical digital skills.";
      takeaways.replaceChildren();
      const takeawayItems = (card.dataset.eventTakeaways || "").split("|").map((item) => item.trim()).filter(Boolean);
      takeawayPanel.hidden = !takeawayItems.length;
      takeawayItems.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        takeaways.appendChild(listItem);
      });
      const registrationUrl = card.dataset.eventRegister || "";
      const eventStatus = (card.dataset.eventStatus || "").toLowerCase();

      if (registrationUrl) {
        register.href = registrationUrl;
        register.target = "_blank";
        register.rel = "noopener noreferrer";
        register.textContent = "Register via Hub, eLMS, or OneFile";
        register.removeAttribute("aria-disabled");
        register.classList.remove("de-event-modal__register--disabled");
      } else {
        register.removeAttribute("href");
        register.removeAttribute("target");
        register.removeAttribute("rel");
        register.textContent = eventStatus === "past" ? "Past" : "Register via Hub, eLMS, or OneFile";
        register.setAttribute("aria-disabled", "true");
        register.classList.add("de-event-modal__register--disabled");
      }

      if (activeCalendarUrl) URL.revokeObjectURL(activeCalendarUrl);
      activeCalendarUrl = eventStatus === "upcoming" ? buildCalendarUrl(card) : "";
      if (activeCalendarUrl) {
        calendar.href = activeCalendarUrl;
        calendar.download = `${(card.dataset.eventTitle || "digital-edge-event").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
        calendar.hidden = false;
      } else {
        calendar.removeAttribute("href");
        calendar.hidden = true;
      }

      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("de-modal-open");
      modal.querySelector(".de-event-modal__close").focus();
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => openModal(card));
    });

    modal.querySelectorAll("[data-event-close]").forEach((closeControl) => {
      closeControl.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });
  }

  function installEventFilters() {
    const filterButtons = Array.from(document.querySelectorAll("[data-event-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-event-filter-key]"));
    if (!filterButtons.length || !cards.length) return;

    function setFilter(filterKey) {
      const activeFilter = filterKey || "all";
      filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.eventFilter === activeFilter));
      });

      cards.forEach((card) => {
        card.hidden = activeFilter !== "all" && card.dataset.eventFilterKey !== activeFilter;
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => setFilter(button.dataset.eventFilter));
    });
  }

  function installArticleTagFilters() {
    const cards = Array.from(document.querySelectorAll("[data-article-tags]"));
    if (!cards.length) return;

    const tagButtons = Array.from(document.querySelectorAll("[data-article-tag]"));
    const status = document.querySelector("[data-article-filter-status]");
    const statusText = document.querySelector("[data-article-filter-text]");
    const clearButton = document.querySelector("[data-clear-article-filter]");

    function normalise(value) {
      return (value || "").trim().toLowerCase();
    }

    function setFilter(tag, updateUrl) {
      const activeTag = tag || "";
      const activeKey = normalise(activeTag);
      const activeAuthor = normalise(new URLSearchParams(window.location.search).get("author") || "");

      cards.forEach((card) => {
        const tags = (card.dataset.articleTags || "").split(",").map(normalise);
        const author = normalise(card.dataset.articleAuthor);
        card.hidden = (Boolean(activeKey) && !tags.includes(activeKey)) || (Boolean(activeAuthor) && author !== activeAuthor);
      });

      tagButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(normalise(button.dataset.articleTag) === activeKey));
      });

      if (status && statusText) {
        status.hidden = !activeKey && !activeAuthor;
        if (activeAuthor) {
          statusText.textContent = `Showing articles by ${new URLSearchParams(window.location.search).get("author")}`;
        } else {
          statusText.textContent = activeKey ? `Showing articles tagged ${activeTag}` : "";
        }
      }

      if (updateUrl) {
        const url = new URL(window.location.href);
        if (activeKey) {
          url.searchParams.set("tag", activeTag);
        } else {
          url.searchParams.delete("tag");
        }
        url.searchParams.delete("author");
        window.history.replaceState({}, "", url);
      }
    }

    tagButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const isActive = button.getAttribute("aria-pressed") === "true";
        setFilter(isActive ? "" : button.dataset.articleTag, true);
      });
    });

    if (clearButton) {
      clearButton.addEventListener("click", () => setFilter("", true));
    }

    setFilter(new URLSearchParams(window.location.search).get("tag") || "", false);
  }

  function installPromptBuilder() {
    const activity = document.querySelector("[data-prompt-builder]");
    if (!activity) return;

    const ingredients = [
      { key: "task", label: "Ask for a practical plan", text: "Create a practical time management plan" },
      { key: "audience", label: "Name the audience", text: "for a Level 4 digital apprentice" },
      { key: "context", label: "Give workplace context", text: "who is balancing project work, study time, and meetings" },
      { key: "format", label: "Set the output format", text: "Return it as a weekly checklist with three priority habits" },
      { key: "constraints", label: "Set useful constraints", text: "Use plain English and keep each action realistic for a busy workday" },
      { key: "quality", label: "Ask for checking criteria", text: "Include two signs the plan is working and two warning signs it needs adjusting" }
    ];

    function startActivity() {
      activity.innerHTML = `
        <div class="de-guide-activity__shell">
          <div class="de-guide-activity__hero">
            <div>
              <span class="de-content-label">Practice</span>
              <h2>Prompt Builder</h2>
              <p>Select the ingredients that turn a vague request into a clearer workplace prompt.</p>
            </div>
            <span class="de-guide-activity__badge">Weak prompt</span>
          </div>
          <div class="de-guide-activity__panel">
            <span>Starting point</span>
            <p>Help me with time management.</p>
          </div>
          <div class="de-guide-activity__options" data-prompt-options></div>
          <div class="de-guide-activity__actions">
            <button type="button" class="de-guide-activity__primary" data-prompt-build>Build prompt</button>
            <button type="button" class="de-guide-activity__secondary" data-prompt-reset>Reset</button>
          </div>
          <div class="de-guide-activity__feedback" data-prompt-feedback hidden></div>
        </div>
      `;

      const options = activity.querySelector("[data-prompt-options]");
      const feedback = activity.querySelector("[data-prompt-feedback]");

      ingredients.forEach((ingredient) => {
        const label = document.createElement("label");
        label.className = "de-guide-activity__option";
        label.innerHTML = `<input type="checkbox" value="${ingredient.key}"><span>${ingredient.label}</span>`;
        options.appendChild(label);
      });

      activity.querySelector("[data-prompt-build]").addEventListener("click", () => {
        const selectedKeys = Array.from(options.querySelectorAll("input:checked")).map((input) => input.value);
        options.querySelectorAll(".de-guide-activity__option").forEach((label) => {
          label.classList.toggle("is-correct", label.querySelector("input").checked);
        });

        const selected = ingredients.filter((ingredient) => selectedKeys.includes(ingredient.key));
        const missing = ingredients.length - selected.length;
        const prompt = selected.length
          ? `${selected.map((ingredient) => ingredient.text).join(". ")}.`
          : "Help me with time management.";
        const summary = missing === 0
          ? "Strong prompt. It gives the AI task, audience, context, format, constraints, and a way to judge quality."
          : `Good start. Add ${missing} more ingredient${missing === 1 ? "" : "s"} to reduce guessing.`;

        feedback.hidden = false;
        feedback.innerHTML = `
          <strong>${summary}</strong>
          <p>Your rebuilt prompt:</p>
          <div class="de-guide-activity__draft">${prompt}</div>
        `;
      });

      activity.querySelector("[data-prompt-reset]").addEventListener("click", startActivity);
    }

    const start = activity.querySelector("[data-prompt-builder-start]");
    if (start) start.addEventListener("click", startActivity);
  }

  function installHiddenWorkEstimator() {
    const activity = document.querySelector("[data-hidden-work-estimator]");
    if (!activity) return;

    const items = [
      { label: "Clarify what the export must include", correct: true },
      { label: "Check where the dashboard data comes from", correct: true },
      { label: "Confirm who can access exported data", correct: true },
      { label: "Build the export button and file output", correct: true },
      { label: "Test normal, empty, and large data sets", correct: true },
      { label: "Update user guidance or release notes", correct: true },
      { label: "Assume the data is already clean", correct: false },
      { label: "Skip review because the button is small", correct: false }
    ];

    function startActivity() {
      activity.innerHTML = `
        <div class="de-guide-activity__shell">
          <div class="de-guide-activity__hero">
            <div>
              <span class="de-content-label">Practice</span>
              <h2>Hidden Work Estimator</h2>
              <p>Spot the hidden work behind a task before giving an estimate.</p>
            </div>
            <span class="de-guide-activity__badge">Simple-looking task</span>
          </div>
          <div class="de-guide-activity__panel">
            <span>Request</span>
            <p>Add an export button to the learner progress dashboard.</p>
          </div>
          <div class="de-guide-activity__options" data-hidden-work-options></div>
          <div class="de-guide-activity__actions">
            <button type="button" class="de-guide-activity__primary" data-hidden-work-check>Check estimate</button>
            <button type="button" class="de-guide-activity__secondary" data-hidden-work-reset>Reset</button>
          </div>
          <div class="de-guide-activity__feedback" data-hidden-work-feedback hidden></div>
        </div>
      `;

      const options = activity.querySelector("[data-hidden-work-options]");
      const feedback = activity.querySelector("[data-hidden-work-feedback]");

      items.forEach((item, itemIndex) => {
        const label = document.createElement("label");
        label.className = "de-guide-activity__option";
        label.innerHTML = `<input type="checkbox" value="${itemIndex}"><span>${item.label}</span>`;
        options.appendChild(label);
      });

      activity.querySelector("[data-hidden-work-check]").addEventListener("click", () => {
        let correctChosen = 0;
        let missed = 0;
        let extras = 0;

        options.querySelectorAll(".de-guide-activity__option").forEach((label) => {
          const input = label.querySelector("input");
          const item = items[Number(input.value)];
          label.classList.remove("is-correct", "is-missed", "is-extra");

          if (item.correct && input.checked) {
            correctChosen += 1;
            label.classList.add("is-correct");
          } else if (item.correct) {
            missed += 1;
            label.classList.add("is-missed");
          } else if (input.checked) {
            extras += 1;
            label.classList.add("is-extra");
          }
        });

        const message = missed === 0 && extras === 0
          ? "Strong estimate thinking. You included the work that usually disappears from the first guess."
          : "There is still some hidden work to account for before the estimate is reliable.";

        feedback.hidden = false;
        feedback.innerHTML = `
          <strong>${message}</strong>
          <p>You found ${correctChosen} useful work item${correctChosen === 1 ? "" : "s"}. ${missed ? `${missed} useful item${missed === 1 ? "" : "s"} still need to be included. ` : ""}${extras ? `${extras} selected item${extras === 1 ? "" : "s"} would make the estimate weaker.` : ""}</p>
          <div class="de-guide-activity__draft">A stronger estimate would mention discovery, data checks, access, build time, testing, review, and documentation. Confidence should stay medium until the data source and permissions are clear.</div>
        `;
      });

      activity.querySelector("[data-hidden-work-reset]").addEventListener("click", startActivity);
    }

    const start = activity.querySelector("[data-hidden-work-start]");
    if (start) start.addEventListener("click", startActivity);
  }

  function installBugReportBuilder() {
    const activity = document.querySelector("[data-bug-report-builder]");
    if (!activity) return;

    const snippets = [
      { key: "summary", text: "Search returns no results for known article titles." },
      { key: "where", text: "Digital Edge search modal in Chrome on desktop." },
      { key: "expected", text: "Searching for \"Git\" should show the Git and Version Control guide." },
      { key: "actual", text: "The search modal says no results found." },
      { key: "steps", text: "Open search, type \"Git\", press Enter." },
      { key: "impact", text: "Learners may not find guides unless they browse manually." },
      { key: "evidence", text: "Screenshot attached showing the query and empty result." },
      { key: "tried", text: "Refreshed the page and repeated the search in a private window." }
    ];
    const fields = [
      { key: "summary", label: "Summary" },
      { key: "where", label: "Where it happened" },
      { key: "expected", label: "Expected result" },
      { key: "actual", label: "Actual result" },
      { key: "steps", label: "Steps to reproduce" },
      { key: "impact", label: "Impact" }
    ];

    function startActivity() {
      activity.innerHTML = `
        <div class="de-guide-activity__shell">
          <div class="de-guide-activity__hero">
            <div>
              <span class="de-content-label">Practice</span>
              <h2>Bug Report Builder</h2>
              <p>Choose the right detail for each bug report section.</p>
            </div>
            <span class="de-guide-activity__badge">Messy notes</span>
          </div>
          <div class="de-guide-activity__panel">
            <span>Notes collected</span>
            <p>Search is not showing the Git guide. It happened in Chrome. Screenshot taken. Refresh did not fix it. Learners may have to browse manually.</p>
          </div>
          <div class="de-guide-activity__field-grid" data-bug-fields></div>
          <div class="de-guide-activity__actions">
            <button type="button" class="de-guide-activity__primary" data-bug-check>Check report</button>
            <button type="button" class="de-guide-activity__secondary" data-bug-reset>Reset</button>
          </div>
          <div class="de-guide-activity__feedback" data-bug-feedback hidden></div>
        </div>
      `;

      const fieldGrid = activity.querySelector("[data-bug-fields]");
      const feedback = activity.querySelector("[data-bug-feedback]");

      fields.forEach((field) => {
        const wrapper = document.createElement("div");
        wrapper.className = "de-guide-activity__field";
        const options = snippets.map((snippet) => `<option value="${snippet.key}">${snippet.text}</option>`).join("");
        wrapper.innerHTML = `
          <label for="bug-${field.key}">${field.label}</label>
          <select id="bug-${field.key}" data-bug-field="${field.key}">
            <option value="">Choose a detail</option>
            ${options}
          </select>
        `;
        fieldGrid.appendChild(wrapper);
      });

      activity.querySelector("[data-bug-check]").addEventListener("click", () => {
        let correct = 0;
        const draft = [];

        fieldGrid.querySelectorAll("select").forEach((select) => {
          const isCorrect = select.value === select.dataset.bugField;
          select.classList.toggle("is-correct", isCorrect);
          select.classList.toggle("is-extra", !isCorrect && Boolean(select.value));
          if (isCorrect) correct += 1;
          const field = fields.find((item) => item.key === select.dataset.bugField);
          const snippet = snippets.find((item) => item.key === select.value);
          draft.push(`${field.label}: ${snippet ? snippet.text : "Not chosen"}`);
        });

        const complete = correct === fields.length;
        feedback.hidden = false;
        feedback.innerHTML = `
          <strong>${complete ? "Clear report. This gives someone enough to investigate." : `${correct}/${fields.length} sections are in the right place.`}</strong>
          <p>${complete ? "The report separates expected result, actual result, steps, and impact." : "Move details into the section that answers that specific question."}</p>
          <div class="de-guide-activity__draft">${draft.join("\n")}</div>
        `;
      });

      activity.querySelector("[data-bug-reset]").addEventListener("click", startActivity);
    }

    const start = activity.querySelector("[data-bug-builder-start]");
    if (start) start.addEventListener("click", startActivity);
  }

  function installChoiceActivities() {
    const configs = {
      "delivery-approach": {
        title: "Choose the Delivery Approach",
        intro: "Choose the delivery style that best fits each situation.",
        badge: "Scenario choice",
        options: ["Agile", "Waterfall", "Hybrid"],
        scenarios: [
          {
            prompt: "A compliance report has fixed legal requirements, formal approval stages, and a deadline that cannot move.",
            answer: "Waterfall",
            feedback: "Waterfall thinking helps when requirements are stable, approval is formal, and late changes would be expensive."
          },
          {
            prompt: "A team is building a dashboard, but stakeholders are still discovering which metrics are most useful.",
            answer: "Agile",
            feedback: "Agile suits discovery because the team can build a small version, gather feedback, and adapt."
          },
          {
            prompt: "A platform migration has fixed governance gates, but each team needs short cycles to test and improve its part.",
            answer: "Hybrid",
            feedback: "Many real projects blend a planned structure with Agile habits inside the work."
          }
        ]
      },
      "review-comment": {
        title: "Rewrite The Review Comment",
        intro: "Pick the review comment that is specific, kind, and useful enough to act on.",
        badge: "Feedback practice",
        options: ["Too vague", "Useful feedback", "Too personal"],
        scenarios: [
          {
            prompt: "\"This is confusing.\"",
            answer: "Too vague",
            feedback: "It names a feeling but not the specific issue. The author will not know what to change."
          },
          {
            prompt: "\"Could this function name describe the result it returns? I found it hard to follow when reading the next step.\"",
            answer: "Useful feedback",
            feedback: "This is specific, explains the impact, and suggests a direction without attacking the person."
          },
          {
            prompt: "\"You clearly did not think this through.\"",
            answer: "Too personal",
            feedback: "This targets the person rather than the work. Useful review comments focus on risk, clarity, and improvement."
          }
        ]
      },
      "issue-classifier": {
        title: "Classify The Issue",
        intro: "Decide whether each example is an incident, bug, problem, or request.",
        badge: "Support language",
        options: ["Incident", "Bug", "Problem", "Request"],
        scenarios: [
          {
            prompt: "Learners cannot access the assessment platform this morning.",
            answer: "Incident",
            feedback: "This disrupts service for users now, so it should be treated as an incident."
          },
          {
            prompt: "The export button always downloads an empty file when filters are applied.",
            answer: "Bug",
            feedback: "This is incorrect product behaviour that can be reproduced."
          },
          {
            prompt: "The same login issue has happened three times this month and the team needs to understand the underlying cause.",
            answer: "Problem",
            feedback: "A repeated pattern points to problem investigation and root cause analysis."
          },
          {
            prompt: "A manager asks for a new column to be added to a weekly report.",
            answer: "Request",
            feedback: "This is a request for a change or addition, not something currently broken."
          }
        ]
      },
      "trade-off-cards": {
        title: "Trade-Off Cards",
        intro: "Identify what each recommendation is mostly optimising for.",
        badge: "Judgement practice",
        options: ["Speed", "Cost", "Quality", "Maintainability", "Risk reduction"],
        scenarios: [
          {
            prompt: "Patch the issue manually today, then schedule a proper fix after the event.",
            answer: "Speed",
            feedback: "This prioritises immediate progress, while accepting that more maintainable work is still needed."
          },
          {
            prompt: "Use the existing approved platform even though it has fewer advanced features.",
            answer: "Risk reduction",
            feedback: "This reduces governance, security, and support risk by staying inside known controls."
          },
          {
            prompt: "Refactor the repeated logic before adding more features to this area.",
            answer: "Maintainability",
            feedback: "This may slow delivery now, but it should make future changes easier and safer."
          }
        ]
      }
    };

    function shuffled(items) {
      const result = [...items];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }

    document.querySelectorAll("[data-choice-activity]").forEach((activity) => {
      const config = configs[activity.dataset.choiceActivity];
      const start = activity.querySelector("[data-activity-start]");
      if (!config || !start) return;

      start.addEventListener("click", () => {
        let index = 0;
        let score = 0;
        const scenarios = shuffled(config.scenarios);

        function renderScenario() {
          const scenario = scenarios[index];
          activity.innerHTML = `
            <div class="de-guide-activity__shell">
              <div class="de-guide-activity__hero">
                <div>
                  <span class="de-content-label">Practice</span>
                  <h2>${config.title}</h2>
                  <p>${config.intro}</p>
                </div>
                <span class="de-guide-activity__badge">${index + 1}/${scenarios.length}</span>
              </div>
              <div class="de-guide-activity__panel">
                <span>${config.badge}</span>
                <p>${scenario.prompt}</p>
              </div>
              <div class="de-guide-activity__options" data-choice-options></div>
              <div class="de-guide-activity__feedback" data-choice-feedback hidden></div>
              <div class="de-guide-activity__actions">
                <button type="button" class="de-guide-activity__primary" data-choice-next disabled>${index === scenarios.length - 1 ? "Show result" : "Next scenario"}</button>
                <button type="button" class="de-guide-activity__secondary" data-choice-reset>Reset</button>
              </div>
            </div>
          `;

          const options = activity.querySelector("[data-choice-options]");
          const feedback = activity.querySelector("[data-choice-feedback]");
          const next = activity.querySelector("[data-choice-next]");

          shuffled(config.options).forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "de-guide-activity__option";
            button.textContent = option;
            button.addEventListener("click", () => {
              const isCorrect = option === scenario.answer;
              if (isCorrect) score += 1;
              options.querySelectorAll("button").forEach((item) => {
                item.disabled = true;
                if (item.textContent === scenario.answer) item.classList.add("is-correct");
              });
              if (!isCorrect) button.classList.add("is-extra");
              feedback.hidden = false;
              feedback.innerHTML = `
                <strong>${isCorrect ? "Good choice." : `Best answer: ${scenario.answer}.`}</strong>
                <p>${scenario.feedback}</p>
              `;
              next.disabled = false;
              next.focus();
            });
            options.appendChild(button);
          });

          next.addEventListener("click", () => {
            if (index === scenarios.length - 1) {
              activity.querySelector(".de-guide-activity__shell").innerHTML = `
                <div class="de-guide-activity__result">
                  <span class="de-content-label">Complete</span>
                  <h2>${config.title}</h2>
                  <strong>${score}/${scenarios.length}</strong>
                  <p>${score === scenarios.length ? "Strong judgement. You matched each scenario to the right idea." : "Good practice. Review the feedback and try again when you want to strengthen the pattern."}</p>
                  <button type="button" class="de-guide-activity__secondary" data-choice-retry>Try again</button>
                </div>
              `;
              activity.querySelector("[data-choice-retry]").addEventListener("click", () => start.click());
            } else {
              index += 1;
              renderScenario();
            }
          });
          activity.querySelector("[data-choice-reset]").addEventListener("click", () => start.click());
        }

        renderScenario();
      });
    });
  }

  function installChecklistActivities() {
    const configs = {
      "break-it-down": {
        title: "Break It Down",
        intro: "Choose the actions that turn \"prepare for assessment\" into practical work.",
        badge: "Vague goal",
        prompt: "Prepare for assessment.",
        success: "Good breakdown. You chose actions that make progress visible and reviewable.",
        review: "The strongest breakdown includes concrete actions, evidence, review, and blockers.",
        items: [
          { label: "List the assessment criteria I need to evidence", correct: true },
          { label: "Find two examples of work that match the criteria", correct: true },
          { label: "Write questions for anything I do not understand", correct: true },
          { label: "Book time for review or feedback", correct: true },
          { label: "Check what evidence is missing", correct: true },
          { label: "Try to finish everything in one long session", correct: false },
          { label: "Wait until I feel ready before starting", correct: false }
        ]
      },
      "technical-note-fix": {
        title: "Before And After Notes",
        intro: "Choose the details that make this handover useful.",
        badge: "Weak note",
        prompt: "Dashboard broken. Needs fixing.",
        success: "Useful note. You added context, evidence, impact, and a next step.",
        review: "A stronger note helps another person understand what happened and what to do next.",
        items: [
          { label: "Users see a blank dashboard after applying the department filter", correct: true },
          { label: "Issue reproduced in Chrome and Edge at 10:30", correct: true },
          { label: "Only the department filter appears affected", correct: true },
          { label: "Next step: check the filter query and recent data changes", correct: true },
          { label: "Impact: managers cannot view filtered progress reports", correct: true },
          { label: "Something is weird", correct: false },
          { label: "Probably a backend thing", correct: false }
        ]
      },
      "restart-note": {
        title: "Restart Note Builder",
        intro: "Choose what belongs in a restart note before stepping away.",
        badge: "Interrupted task",
        prompt: "You are updating a guide and need to leave before checking the links.",
        success: "Good restart note. Future you can return without rebuilding all the context.",
        review: "A useful restart note captures current state, next action, blockers, and evidence.",
        items: [
          { label: "Updated the first three sections", correct: true },
          { label: "Still need to check internal links and build output", correct: true },
          { label: "Next action: run the link/build check", correct: true },
          { label: "Possible blocker: one linked page may have moved", correct: true },
          { label: "Relevant file: guides/checking-ai-outputs.md", correct: true },
          { label: "Will remember where I got to", correct: false },
          { label: "Basically done", correct: false }
        ]
      },
      "pr-readiness": {
        title: "PR Readiness Check",
        intro: "Flag what this pull request still needs before review.",
        badge: "Mock pull request",
        prompt: "Title: updates. Description: changed some guide stuff.",
        success: "Ready for review. You spotted the gaps that slow reviewers down.",
        review: "A useful pull request explains purpose, checks, scope, and reviewer focus.",
        items: [
          { label: "Clear summary of what changed", correct: true },
          { label: "Why the change was needed", correct: true },
          { label: "What checks were run", correct: true },
          { label: "Screenshots or examples if the change is visual", correct: true },
          { label: "Anything reviewers should focus on", correct: true },
          { label: "A bigger unrelated refactor", correct: false },
          { label: "A vague note saying \"looks fine\"", correct: false }
        ]
      },
      "pick-test-cases": {
        title: "Pick The Test Cases",
        intro: "Choose useful checks for a new file upload button.",
        badge: "Feature check",
        prompt: "Learners can upload a PDF evidence file.",
        success: "Good coverage. You included happy path, error, edge, and regression thinking.",
        review: "Useful testing checks normal use, failures, unusual cases, and nearby behaviour.",
        items: [
          { label: "Upload a valid PDF and confirm it appears", correct: true },
          { label: "Try an unsupported file type", correct: true },
          { label: "Try a file larger than the allowed limit", correct: true },
          { label: "Check the error message is understandable", correct: true },
          { label: "Confirm existing uploaded files still display", correct: true },
          { label: "Only test once with my favourite file", correct: false },
          { label: "Skip error cases if the happy path works", correct: false }
        ]
      },
      "tool-fit-scorecard": {
        title: "Tool Fit Scorecard",
        intro: "Choose the criteria that matter before recommending a new tool.",
        badge: "Tool request",
        prompt: "A team wants to buy a new AI note-taking tool.",
        success: "Strong scorecard. You considered fit, people, data, cost, support, and accessibility.",
        review: "Tool decisions should start with the problem and include risk, maintenance, and users.",
        items: [
          { label: "What problem are we solving?", correct: true },
          { label: "What data will the tool capture or store?", correct: true },
          { label: "Who will use and support it?", correct: true },
          { label: "Does it integrate with approved systems?", correct: true },
          { label: "What are the setup, licence, and exit costs?", correct: true },
          { label: "Is it popular on social media?", correct: false },
          { label: "Does the demo look impressive?", correct: false }
        ]
      }
    };

    document.querySelectorAll("[data-checklist-activity]").forEach((activity) => {
      const config = configs[activity.dataset.checklistActivity];
      const start = activity.querySelector("[data-activity-start]");
      if (!config || !start) return;

      start.addEventListener("click", () => {
        activity.innerHTML = `
          <div class="de-guide-activity__shell">
            <div class="de-guide-activity__hero">
              <div>
                <span class="de-content-label">Practice</span>
                <h2>${config.title}</h2>
                <p>${config.intro}</p>
              </div>
              <span class="de-guide-activity__badge">${config.badge}</span>
            </div>
            <div class="de-guide-activity__panel">
              <span>Scenario</span>
              <p>${config.prompt}</p>
            </div>
            <div class="de-guide-activity__options" data-checklist-options></div>
            <div class="de-guide-activity__actions">
              <button type="button" class="de-guide-activity__primary" data-checklist-check>Check choices</button>
              <button type="button" class="de-guide-activity__secondary" data-checklist-reset>Reset</button>
            </div>
            <div class="de-guide-activity__feedback" data-checklist-feedback hidden></div>
          </div>
        `;

        const options = activity.querySelector("[data-checklist-options]");
        const feedback = activity.querySelector("[data-checklist-feedback]");

        config.items.forEach((item, index) => {
          const label = document.createElement("label");
          label.className = "de-guide-activity__option";
          label.innerHTML = `<input type="checkbox" value="${index}"><span>${item.label}</span>`;
          options.appendChild(label);
        });

        activity.querySelector("[data-checklist-check]").addEventListener("click", () => {
          let found = 0;
          let missed = 0;
          let extra = 0;

          options.querySelectorAll(".de-guide-activity__option").forEach((label) => {
            const input = label.querySelector("input");
            const item = config.items[Number(input.value)];
            label.classList.remove("is-correct", "is-missed", "is-extra");
            if (item.correct && input.checked) {
              found += 1;
              label.classList.add("is-correct");
            } else if (item.correct) {
              missed += 1;
              label.classList.add("is-missed");
            } else if (input.checked) {
              extra += 1;
              label.classList.add("is-extra");
            }
          });

          feedback.hidden = false;
          feedback.innerHTML = `
            <strong>${missed === 0 && extra === 0 ? config.success : config.review}</strong>
            <p>You selected ${found} useful item${found === 1 ? "" : "s"}.${missed ? ` ${missed} useful item${missed === 1 ? "" : "s"} still need attention.` : ""}${extra ? ` ${extra} selected item${extra === 1 ? "" : "s"} would weaken the answer.` : ""}</p>
          `;
        });

        activity.querySelector("[data-checklist-reset]").addEventListener("click", () => start.click());
      });
    });
  }

  function installMatchingActivities() {
    const configs = {
      "git-command-sequence": {
        title: "Command Sequence Challenge",
        intro: "Choose the command that fits each step in the workflow.",
        badge: "README update",
        prompt: "You changed a README and want to share the update safely.",
        options: [
          { key: "status", text: "git status" },
          { key: "diff", text: "git diff" },
          { key: "add", text: "git add README.md" },
          { key: "commit", text: "git commit -m \"Update README\"" },
          { key: "push", text: "git push" }
        ],
        fields: [
          { key: "status", label: "1. Check what changed" },
          { key: "diff", label: "2. Inspect the actual edit" },
          { key: "add", label: "3. Stage the file" },
          { key: "commit", label: "4. Save the checkpoint" },
          { key: "push", label: "5. Share the commit" }
        ],
        success: "Correct sequence. This is the everyday safe workflow.",
        review: "Some steps are out of order. Check, inspect, stage, commit, then push."
      },
      "responsibility-sorter": {
        title: "Responsibility Sorter",
        intro: "Sort each responsibility in a cloud setup.",
        badge: "Shared responsibility",
        prompt: "A team is moving a reporting tool to the cloud.",
        options: [
          { key: "provider", text: "Cloud provider" },
          { key: "organisation", text: "Organisation" },
          { key: "shared", text: "Shared responsibility" }
        ],
        fields: [
          { key: "provider", label: "Physical data centre security" },
          { key: "organisation", label: "User access and permissions" },
          { key: "organisation", label: "Checking what data can be uploaded" },
          { key: "shared", label: "Availability and recovery planning" },
          { key: "organisation", label: "Monitoring cost and usage" }
        ],
        success: "Good sorting. Cloud changes responsibility, but it does not remove it.",
        review: "Cloud providers manage the platform, but organisations still own access, data, cost, and configuration choices."
      },
      "api-request-builder": {
        title: "Request And Response Builder",
        intro: "Match the API term to what it does.",
        badge: "API parts",
        prompt: "A dashboard asks another system for learner progress data.",
        options: [
          { key: "endpoint", text: "Endpoint" },
          { key: "method", text: "Method" },
          { key: "auth", text: "Authentication" },
          { key: "payload", text: "Payload" },
          { key: "response", text: "Response" }
        ],
        fields: [
          { key: "endpoint", label: "The specific API address being called" },
          { key: "method", label: "The action type, such as reading or updating" },
          { key: "auth", label: "Proof the system is allowed to make the request" },
          { key: "payload", label: "Data sent with the request or returned by it" },
          { key: "response", label: "What the API sends back" }
        ],
        success: "Good match. You can identify the main parts of an API conversation.",
        review: "Some terms are mixed up. Think request, permission, data, and reply."
      }
    };

    document.querySelectorAll("[data-matching-activity]").forEach((activity) => {
      const config = configs[activity.dataset.matchingActivity];
      const start = activity.querySelector("[data-activity-start]");
      if (!config || !start) return;

      start.addEventListener("click", () => {
        activity.innerHTML = `
          <div class="de-guide-activity__shell">
            <div class="de-guide-activity__hero">
              <div>
                <span class="de-content-label">Practice</span>
                <h2>${config.title}</h2>
                <p>${config.intro}</p>
              </div>
              <span class="de-guide-activity__badge">${config.badge}</span>
            </div>
            <div class="de-guide-activity__panel">
              <span>Scenario</span>
              <p>${config.prompt}</p>
            </div>
            <div class="de-guide-activity__field-grid" data-matching-fields></div>
            <div class="de-guide-activity__actions">
              <button type="button" class="de-guide-activity__primary" data-matching-check>Check matches</button>
              <button type="button" class="de-guide-activity__secondary" data-matching-reset>Reset</button>
            </div>
            <div class="de-guide-activity__feedback" data-matching-feedback hidden></div>
          </div>
        `;

        const fields = activity.querySelector("[data-matching-fields]");
        const feedback = activity.querySelector("[data-matching-feedback]");

        config.fields.forEach((field, index) => {
          const wrapper = document.createElement("div");
          wrapper.className = "de-guide-activity__field";
          const options = config.options.map((option) => `<option value="${option.key}">${option.text}</option>`).join("");
          wrapper.innerHTML = `
            <label for="${activity.dataset.matchingActivity}-${index}">${field.label}</label>
            <select id="${activity.dataset.matchingActivity}-${index}" data-answer="${field.key}">
              <option value="">Choose an answer</option>
              ${options}
            </select>
          `;
          fields.appendChild(wrapper);
        });

        activity.querySelector("[data-matching-check]").addEventListener("click", () => {
          let correct = 0;
          fields.querySelectorAll("select").forEach((select) => {
            const isCorrect = select.value === select.dataset.answer;
            select.classList.toggle("is-correct", isCorrect);
            select.classList.toggle("is-extra", !isCorrect && Boolean(select.value));
            if (isCorrect) correct += 1;
          });

          const complete = correct === config.fields.length;
          feedback.hidden = false;
          feedback.innerHTML = `
            <strong>${complete ? config.success : `${correct}/${config.fields.length} matches are correct.`}</strong>
            <p>${complete ? "Nice. The pattern is in place." : config.review}</p>
          `;
        });

        activity.querySelector("[data-matching-reset]").addEventListener("click", () => start.click());
      });
    });
  }

  function installBiasGame() {
    const game = document.querySelector("[data-bias-game]");
    if (!game) return;

    const scenarios = [
      {
        output: "The ideal candidate will be young, energetic, and able to keep up with a fast-paced tech team.",
        answer: "Exclusion",
        feedback: "This wording may exclude people by implying that age or physical stamina is part of suitability. A safer version would describe the actual work requirements."
      },
      {
        output: "Ask the developer to explain his technical decision clearly before the client meeting.",
        answer: "Assumption",
        feedback: "The output assumes the developer is male. Neutral language such as \"the developer\" and \"their decision\" would avoid that assumption."
      },
      {
        output: "This guide is simple enough for elderly users because it avoids complicated technical language.",
        answer: "Stereotype",
        feedback: "The wording links age with low technical ability. Plain language helps many people, so the reason should focus on accessibility and clarity rather than age."
      },
      {
        output: "Use colour-coded labels only: red for urgent, amber for watch, and green for complete.",
        answer: "Accessibility issue",
        feedback: "Colour alone can exclude people who cannot distinguish those colours or who use assistive technology. Add text labels, icons, or status words."
      },
      {
        output: "Before sharing the summary, check it against the original notes and remove any personal details that are not needed.",
        answer: "Looks okay",
        feedback: "This is a reasonable output. It encourages verification and data minimisation without making assumptions about people or groups."
      }
    ];
    const choices = ["Assumption", "Stereotype", "Exclusion", "Accessibility issue", "Looks okay"];
    let activeScenarios = [];
    let index = 0;
    let score = 0;
    let answered = false;
    let progress = null;
    let scoreText = null;
    let output = null;
    let choicesWrap = null;
    let feedback = null;
    let next = null;

    function shuffled(items) {
      const result = [...items];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }

    function startActivity() {
      index = 0;
      score = 0;
      activeScenarios = shuffled(scenarios);

      game.innerHTML = `
        <div class="de-bias-game__shell">
          <div class="de-bias-game__topline">
            <span class="de-content-label">Practice</span>
            <span class="de-bias-game__progress" data-bias-progress></span>
          </div>
          <div class="de-bias-game__hero">
            <div>
              <h2>Test Your Bias Radar</h2>
              <p>Read each AI output and choose the risk you would check before reusing it.</p>
            </div>
            <strong data-bias-score>0/5</strong>
          </div>
          <article class="de-bias-game__scenario">
            <span>AI output</span>
            <p data-bias-output></p>
          </article>
          <div class="de-bias-game__choices" data-bias-choices></div>
          <div class="de-bias-game__feedback" data-bias-feedback hidden></div>
          <div class="de-bias-game__actions">
            <button type="button" class="de-bias-game__next" data-bias-next disabled>Next scenario</button>
            <button type="button" class="de-bias-game__reset" data-bias-reset>Reset</button>
          </div>
        </div>
      `;

      progress = game.querySelector("[data-bias-progress]");
      scoreText = game.querySelector("[data-bias-score]");
      output = game.querySelector("[data-bias-output]");
      choicesWrap = game.querySelector("[data-bias-choices]");
      feedback = game.querySelector("[data-bias-feedback]");
      next = game.querySelector("[data-bias-next]");
      const reset = game.querySelector("[data-bias-reset]");

      next.addEventListener("click", () => {
        if (index >= activeScenarios.length - 1) {
          renderResult();
        } else {
          index += 1;
          renderScenario();
        }
      });
      reset.addEventListener("click", restart);

      renderScenario();
    }

    function renderScenario() {
      const scenario = activeScenarios[index];
      answered = false;
      progress.textContent = `Scenario ${index + 1} of ${activeScenarios.length}`;
      scoreText.textContent = `${score}/${activeScenarios.length}`;
      output.textContent = scenario.output;
      feedback.hidden = true;
      feedback.textContent = "";
      next.disabled = true;
      next.textContent = index === activeScenarios.length - 1 ? "Show result" : "Next scenario";
      choicesWrap.replaceChildren();

      shuffled(choices).forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "de-bias-game__choice";
        button.textContent = choice;
        button.addEventListener("click", () => chooseAnswer(button, choice));
        choicesWrap.appendChild(button);
      });
    }

    function chooseAnswer(selectedButton, choice) {
      if (answered) return;
      answered = true;
      const scenario = activeScenarios[index];
      const isCorrect = choice === scenario.answer;
      if (isCorrect) score += 1;

      choicesWrap.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
        if (button.textContent === scenario.answer) button.classList.add("is-correct");
      });

      if (!isCorrect) selectedButton.classList.add("is-incorrect");
      feedback.hidden = false;
      feedback.innerHTML = `
        <strong>${isCorrect ? "Good spot." : `The strongest answer is ${scenario.answer}.`}</strong>
        <p>${scenario.feedback}</p>
      `;
      scoreText.textContent = `${score}/${activeScenarios.length}`;
      next.disabled = false;
      next.focus();
    }

    function renderResult() {
      const message = score >= 4
        ? "Strong bias radar. You spotted most of the risks."
        : score >= 2
          ? "Good start. The checklist can help you slow down and spot more risks."
          : "This is exactly why the pause matters. AI output can sound fluent while still needing careful review.";

      game.querySelector(".de-bias-game__shell").innerHTML = `
        <div class="de-bias-game__result">
          <span class="de-content-label">Complete</span>
          <h2>Your Bias Radar Score</h2>
          <strong>${score}/${activeScenarios.length}</strong>
          <p>${message}</p>
          <p>Before reusing AI output, check assumptions, stereotypes, exclusion, accessibility, and whether the wording fits the full audience.</p>
          <button type="button" class="de-bias-game__reset" data-bias-reset>Try again</button>
        </div>
      `;
      game.querySelector("[data-bias-reset]").addEventListener("click", restart);
    }

    function restart() {
      startActivity();
    }

    const start = game.querySelector("[data-bias-start]");
    if (start) start.addEventListener("click", startActivity);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installCodeCopyButtons);
    document.addEventListener("DOMContentLoaded", installInlineGuidedPractice);
    document.addEventListener("DOMContentLoaded", installEventCards);
    document.addEventListener("DOMContentLoaded", installEventFilters);
    document.addEventListener("DOMContentLoaded", installArticleTagFilters);
    document.addEventListener("DOMContentLoaded", installPromptBuilder);
    document.addEventListener("DOMContentLoaded", installHiddenWorkEstimator);
    document.addEventListener("DOMContentLoaded", installBugReportBuilder);
    document.addEventListener("DOMContentLoaded", installChoiceActivities);
    document.addEventListener("DOMContentLoaded", installChecklistActivities);
    document.addEventListener("DOMContentLoaded", installMatchingActivities);
    document.addEventListener("DOMContentLoaded", installBiasGame);
  } else {
    installCodeCopyButtons();
    installInlineGuidedPractice();
    installEventCards();
    installEventFilters();
    installArticleTagFilters();
    installPromptBuilder();
    installHiddenWorkEstimator();
    installBugReportBuilder();
    installChoiceActivities();
    installChecklistActivities();
    installMatchingActivities();
    installBiasGame();
  }

  installSearchPolish(40);
})();
