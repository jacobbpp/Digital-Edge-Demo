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

    function render() {
      outputElement.textContent = logs.length ? logs.join("\n") : "Running...\n";
    }

    function capture(type, values) {
      logs.push(values.map((value) => {
        if (typeof value === "string") return value;
        return JSON.stringify(value, null, 2);
      }).join(" "));
      console[type](...values);
      render();
    }

    const sandboxConsole = {
      log: (...values) => capture("log", values),
      warn: (...values) => capture("warn", values),
      error: (...values) => capture("error", values)
    };

    outputElement.textContent = "Running...\n";

    try {
      const result = Function("console", `"use strict";\n${source}`)(sandboxConsole);
      if (result !== undefined) logs.push(String(result));
      render();
      window.setTimeout(() => {
        if (!logs.length) outputElement.textContent = "Done. No output.";
      }, 0);
    } catch (error) {
      outputElement.textContent = `${error.message || error}\n`;
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
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
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

      const dtStamp = formatIcsDate(new Date().toISOString());
      const dtStart = formatIcsDate(card.dataset.eventStart);
      const dtEnd = formatIcsDate(card.dataset.eventEnd);
      if (!dtStamp || !dtStart || !dtEnd) return "";

      const uid = `${card.dataset.eventStart}-${card.dataset.eventTitle || "digital-edge-event"}`.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      const content = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//BPP Digital Edge//Events//EN",
        "BEGIN:VEVENT",
        `UID:${uid}@digital-edge`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
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

  function prepareActivityAnnouncement(element) {
    if (!element) return;
    element.setAttribute("role", "status");
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    element.tabIndex = -1;
  }

  function showActivityFeedback(element, html) {
    if (!element) return;
    prepareActivityAnnouncement(element);
    element.hidden = false;
    element.innerHTML = html;
    window.setTimeout(() => element.focus({ preventScroll: false }), 0);
  }

  function focusActivityResult(container) {
    const result = container.querySelector(".de-guide-activity__result, .de-bias-game__result");
    if (!result) return;
    prepareActivityAnnouncement(result);
    window.setTimeout(() => result.focus({ preventScroll: false }), 0);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function renderActivityShell(activity, title, intro, badge, body, action = "") {
    activity.innerHTML = `
      <div class="de-guide-activity__shell">
        <div class="de-guide-activity__hero">
          <div>
            <span class="de-content-label">Practice</span>
            <h2>${title}</h2>
            <p>${intro}</p>
          </div>
          ${(badge || action) ? `
            <div class="de-guide-activity__hero-actions">
              ${badge ? `<span class="de-guide-activity__badge">${badge}</span>` : ""}
              ${action}
            </div>
          ` : ""}
        </div>
        ${body}
      </div>
    `;
  }

  function installDistinctGuideActivities() {
    function bindStart(selector, callback) {
      const activity = document.querySelector(selector);
      if (!activity) return;
      const start = activity.querySelector("[data-activity-start]");
      if (start) start.addEventListener("click", () => callback(activity));
    }

    function simpleChoiceButtons(items, className = "de-sim-choice") {
      return items.map((item) => `<button type="button" class="${className}" data-value="${escapeHTML(item.key)}">${escapeHTML(item.label)}</button>`).join("");
    }

    bindStart("[data-task-triage-board]", (activity) => {
      const cards = [
        { id: "criteria", text: "Find the assessment criteria", answer: "now" },
        { id: "examples", text: "Choose two work examples", answer: "now" },
        { id: "review", text: "Book review time with coach", answer: "schedule" },
        { id: "platform", text: "Ask where evidence is submitted", answer: "ask" },
        { id: "rewrite", text: "Rewrite every old note from scratch", answer: "defer" },
        { id: "calendar", text: "Block a 45-minute focus slot", answer: "schedule" }
      ];
      const columns = [
        { key: "now", label: "Do now" },
        { key: "schedule", label: "Schedule" },
        { key: "ask", label: "Ask for help" },
        { key: "defer", label: "Defer" }
      ];
      renderActivityShell(activity, "Task Triage Board", "Click a work card, then send it to the right lane.", "Priority board", `
        <div class="de-sim-layout">
          <div>
            <h3>Messy task: prepare for assessment</h3>
            <div class="de-sim-card-pile" data-card-pile>${cards.map((card) => `<button type="button" class="de-sim-card" data-card="${card.id}">${card.text}</button>`).join("")}</div>
          </div>
          <div class="de-sim-board">${columns.map((column) => `<section class="de-sim-lane" data-lane="${column.key}"><h3>${column.label}</h3><div></div></section>`).join("")}</div>
        </div>
        <div class="de-guide-activity__actions">${columns.map((column) => `<button type="button" class="de-guide-activity__secondary" data-send="${column.key}">${column.label}</button>`).join("")}<button type="button" class="de-guide-activity__primary" data-check>Check board</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      let activeCard = null;
      activity.querySelectorAll("[data-card]").forEach((button) => {
        button.addEventListener("click", () => {
          activeCard = button;
          activity.querySelectorAll("[data-card]").forEach((card) => card.classList.toggle("is-selected", card === button));
        });
      });
      activity.querySelectorAll("[data-send]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!activeCard) return;
          const target = activity.querySelector(`[data-lane="${button.dataset.send}"] div`);
          target.appendChild(activeCard);
          activeCard.classList.remove("is-selected");
          activeCard = null;
        });
      });
      activity.querySelector("[data-check]").addEventListener("click", () => {
        let correct = 0;
        cards.forEach((card) => {
          const button = activity.querySelector(`[data-card="${card.id}"]`);
          const lane = button.closest("[data-lane]");
          const isCorrect = lane && lane.dataset.lane === card.answer;
          button.classList.toggle("is-correct", isCorrect);
          button.classList.toggle("is-extra", lane && !isCorrect);
          if (isCorrect) correct += 1;
        });
        showActivityFeedback(activity.querySelector("[data-feedback]"), `
          <strong>${correct}/${cards.length} cards are in the strongest lane.</strong>
          <p>A useful plan separates immediate action, scheduled work, questions, and tempting but low-value effort.</p>
        `);
      });
    });

    bindStart("[data-note-rewrite]", (activity) => {
      const weakSpots = [
        { key: "broken", label: "Dashboard broken", replacement: "Users see a blank dashboard after applying the department filter." },
        { key: "weird", label: "Something weird happened", replacement: "The issue was reproduced in Chrome and Edge at 10:30." },
        { key: "soon", label: "Needs fixing soon", replacement: "Managers cannot view filtered progress reports before the weekly review." },
        { key: "backend", label: "Probably backend", replacement: "Next step: check the filter query and recent data changes." }
      ];
      renderActivityShell(activity, "Rewrite The Weak Spots", "Click vague phrases, then use the clearer replacements to rebuild the handover.", "Handover repair", `
        <div class="de-sim-note">
          <p><button type="button" data-weak="broken">Dashboard broken</button>. <button type="button" data-weak="weird">Something weird happened</button>. <button type="button" data-weak="soon">Needs fixing soon</button>. <button type="button" data-weak="backend">Probably backend</button>.</p>
        </div>
        <div class="de-sim-card-pile" data-replacements></div>
        <textarea class="de-sim-textarea" data-note-output rows="5" aria-label="Improved handover note" placeholder="Your improved note will build here."></textarea>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Check note</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      const replacements = activity.querySelector("[data-replacements]");
      const output = activity.querySelector("[data-note-output]");
      activity.querySelectorAll("[data-weak]").forEach((button) => {
        button.addEventListener("click", () => {
          const spot = weakSpots.find((item) => item.key === button.dataset.weak);
          if (!spot || activity.querySelector(`[data-replacement="${spot.key}"]`)) return;
          button.classList.add("is-selected");
          const card = document.createElement("button");
          card.type = "button";
          card.className = "de-sim-card";
          card.dataset.replacement = spot.key;
          card.textContent = spot.replacement;
          card.addEventListener("click", () => {
            output.value = `${output.value}${output.value ? "\n" : ""}${spot.replacement}`;
            card.classList.add("is-correct");
          });
          replacements.appendChild(card);
        });
      });
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const text = output.value.toLowerCase();
        const score = weakSpots.filter((spot) => text.includes(spot.replacement.toLowerCase().slice(0, 24))).length;
        showActivityFeedback(activity.querySelector("[data-feedback]"), `
          <strong>${score}/${weakSpots.length} weak spots have been replaced with useful detail.</strong>
          <p>The strongest handover gives context, evidence, impact, and a next step.</p>
        `);
      });
    });

    bindStart("[data-save-your-place]", (activity) => {
      const details = [
        "Updated the first three guide sections.",
        "Still need to check internal links.",
        "Next action: run the build check.",
        "Possible blocker: one linked page may have moved.",
        "Relevant file: guides/checking-ai-outputs.md."
      ];
      renderActivityShell(activity, "Save Your Place", "An interruption has arrived. Capture enough context to restart cleanly.", "Interruption", `
        <div class="de-sim-alert"><strong>Meeting starts soon</strong><span data-timer>45</span></div>
        <div class="de-sim-card-pile">${details.map((detail) => `<button type="button" class="de-sim-card" data-detail="${escapeHTML(detail)}">${escapeHTML(detail)}</button>`).join("")}</div>
        <textarea class="de-sim-textarea" data-note rows="5" aria-label="Restart note" placeholder="Build your restart note here."></textarea>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Save note</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      let seconds = 45;
      const timer = activity.querySelector("[data-timer]");
      const interval = window.setInterval(() => {
        if (!document.body.contains(timer)) {
          window.clearInterval(interval);
          return;
        }
        seconds = Math.max(0, seconds - 1);
        timer.textContent = seconds;
      }, 1000);
      const note = activity.querySelector("[data-note]");
      activity.querySelectorAll("[data-detail]").forEach((button) => {
        button.addEventListener("click", () => {
          note.value = `${note.value}${note.value ? "\n" : ""}- ${button.dataset.detail}`;
          button.classList.add("is-correct");
        });
      });
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const score = details.filter((detail) => note.value.includes(detail)).length;
        showActivityFeedback(activity.querySelector("[data-feedback]"), `
          <strong>${score >= 4 ? "Restart note saved." : "The note still needs more restart context."}</strong>
          <p>Future you needs current state, outstanding work, next action, blockers, and location.</p>
        `);
      });
    });

    bindStart("[data-reviewer-inbox]", (activity) => {
      const prs = [
        { title: "Fix typo", body: "Corrects two spelling errors in the Git guide. Checked page locally.", answer: "ready" },
        { title: "Updates", body: "Changed some guide stuff.", answer: "context" },
        { title: "Mega cleanup", body: "Refactors navigation, rewrites five guides, changes styles, and updates search.", answer: "broad" }
      ];
      const labels = [
        { key: "ready", label: "Ready" },
        { key: "context", label: "Needs context" },
        { key: "broad", label: "Too broad" }
      ];
      renderActivityShell(activity, "Reviewer Inbox", "Open each pull request and make the review-readiness call.", "3 pull requests", `
        <div class="de-sim-inbox">${prs.map((pr, index) => `
          <article class="de-sim-ticket" data-pr="${index}">
            <h3>${pr.title}</h3>
            <p>${pr.body}</p>
            <div>${simpleChoiceButtons(labels, "de-sim-choice")}</div>
          </article>`).join("")}</div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      let answered = 0;
      let correct = 0;
      activity.querySelectorAll("[data-pr]").forEach((card) => {
        card.querySelectorAll("[data-value]").forEach((button) => {
          button.addEventListener("click", () => {
            if (card.dataset.done) return;
            card.dataset.done = "true";
            answered += 1;
            const ok = prs[Number(card.dataset.pr)].answer === button.dataset.value;
            if (ok) correct += 1;
            button.classList.add(ok ? "is-correct" : "is-extra");
            if (answered === prs.length) {
              showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${correct}/${prs.length} review calls are right.</strong><p>Good PRs make purpose, scope, and checks easy to see.</p>`);
            }
          });
        });
      });
    });

    bindStart("[data-break-feature]", (activity) => {
      const actions = [
        { key: "pdf", label: "Upload valid PDF", result: "Pass: file appears in evidence list.", type: "happy" },
        { key: "exe", label: "Upload .exe", result: "Bug found: file is rejected, but the message says only 'failed'.", type: "error" },
        { key: "huge", label: "Upload huge PDF", result: "Bug found: spinner never stops after size limit.", type: "edge" },
        { key: "duplicate", label: "Upload duplicate", result: "Risk: duplicate file names are allowed without warning.", type: "edge" },
        { key: "old", label: "Check old files", result: "Pass: existing uploaded files still display.", type: "regression" },
        { key: "refresh", label: "Refresh page", result: "Bug found: success message disappears but file remains.", type: "regression" }
      ];
      renderActivityShell(activity, "Break The Feature", "Try actions in the fake upload console and collect useful evidence.", "Test console", `
        <div class="de-sim-upload"><span>Evidence upload</span><strong data-upload-status>No file tested yet</strong></div>
        <div class="de-sim-card-pile">${actions.map((action) => `<button type="button" class="de-sim-card" data-test="${action.key}">${action.label}</button>`).join("")}</div>
        <div class="de-sim-log" data-log aria-live="polite"></div>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Review evidence</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      const tried = new Set();
      const log = activity.querySelector("[data-log]");
      const status = activity.querySelector("[data-upload-status]");
      activity.querySelectorAll("[data-test]").forEach((button) => {
        button.addEventListener("click", () => {
          const action = actions.find((item) => item.key === button.dataset.test);
          tried.add(action.type);
          status.textContent = action.label;
          log.insertAdjacentHTML("beforeend", `<p><strong>${action.label}:</strong> ${action.result}</p>`);
          button.classList.add("is-correct");
        });
      });
      activity.querySelector("[data-check]").addEventListener("click", () => {
        showActivityFeedback(activity.querySelector("[data-feedback]"), `
          <strong>${tried.size}/4 risk types tested.</strong>
          <p>A useful test pass includes happy path, error cases, edge cases, and regression checks.</p>
        `);
      });
    });

    bindStart("[data-tool-claims]", (activity) => {
      const claims = [
        { text: "Saves every manager 10 hours a week", challenge: true },
        { text: "Secure by default with no setup", challenge: true },
        { text: "Exports notes to approved tools", challenge: false },
        { text: "Works with every meeting platform", challenge: true },
        { text: "No training or guidance needed", challenge: true }
      ];
      renderActivityShell(activity, "Vendor Claim Interrogator", "Tap the claims that need evidence before approval.", "Tool pitch", `
        <div class="de-sim-pitch"><h3>AI MeetingPilot</h3><p>Automatic notes, actions, summaries, and instant productivity gains.</p></div>
        <div class="de-sim-card-pile">${claims.map((claim, index) => `<button type="button" class="de-sim-card" data-claim="${index}">${claim.text}</button>`).join("")}</div>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Challenge pitch</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      activity.querySelectorAll("[data-claim]").forEach((button) => button.addEventListener("click", () => button.classList.toggle("is-selected")));
      activity.querySelector("[data-check]").addEventListener("click", () => {
        let correct = 0;
        claims.forEach((claim, index) => {
          const button = activity.querySelector(`[data-claim="${index}"]`);
          const selected = button.classList.contains("is-selected");
          const ok = selected === claim.challenge;
          button.classList.toggle("is-correct", ok);
          button.classList.toggle("is-extra", !ok);
          if (ok) correct += 1;
        });
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${correct}/${claims.length} calls are right.</strong><p>Challenge claims about savings, security, integration, and training before recommending a tool.</p>`);
      });
    });

    bindStart("[data-estimate-reveal]", (activity) => {
      const reveals = [
        "The export must respect learner data permissions.",
        "Managers need CSV and PDF formats.",
        "Large cohorts time out in the current dashboard.",
        "Guidance and release notes are needed before launch."
      ];
      renderActivityShell(activity, "Estimate Reveal", "Set an estimate, reveal complications, then adjust your confidence.", "Progressive reveal", `
        <div class="de-sim-estimate"><label>Estimate in days <input type="range" min="1" max="10" value="2" data-days></label><strong data-days-label>2 days</strong></div>
        <div class="de-sim-reveals" data-reveals></div>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__secondary" data-reveal>Reveal hidden work</button><button type="button" class="de-guide-activity__primary" data-check>Lock estimate</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      let index = 0;
      const days = activity.querySelector("[data-days]");
      const label = activity.querySelector("[data-days-label]");
      days.addEventListener("input", () => { label.textContent = `${days.value} day${days.value === "1" ? "" : "s"}`; });
      activity.querySelector("[data-reveal]").addEventListener("click", () => {
        if (index >= reveals.length) return;
        activity.querySelector("[data-reveals]").insertAdjacentHTML("beforeend", `<p>${reveals[index]}</p>`);
        index += 1;
      });
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const estimate = Number(days.value);
        const good = index >= 3 && estimate >= 5;
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${good ? "That estimate now reflects hidden work." : "The estimate may still be too optimistic."}</strong><p>As discovery reveals data, formats, performance, and communication work, both estimate and confidence should change.</p>`);
      });
    });

    bindStart("[data-prompt-surgery]", (activity) => {
      const weakPrompt = "Help me with time management.";
      const weakOutput = "Try making a to-do list, avoiding distractions, and taking regular breaks. You could also use a calendar and set priorities.";
      const criteria = [
        {
          key: "task",
          label: "Clear task",
          hint: "Say exactly what the AI should produce, such as a plan, checklist, explanation, or draft.",
          test: (text) => /\b(create|write|draft|produce|make|build|summari[sz]e|rewrite|explain|plan)\b/i.test(text)
        },
        {
          key: "audience",
          label: "Audience",
          hint: "Name who the answer is for so the level and tone are not guessed.",
          test: (text) => /\b(apprentice|learner|manager|team|colleague|student|new starter|line manager|audience)\b/i.test(text)
        },
        {
          key: "context",
          label: "Workplace context",
          hint: "Give the situation, source material, or real constraint behind the request.",
          test: (text) => /\b(project|study|meeting|workplace|assessment|deadline|support|notes|context|balancing|busy)\b/i.test(text)
        },
        {
          key: "format",
          label: "Output shape",
          hint: "Ask for a structure you can use and check, such as bullets, table, checklist, or sections.",
          test: (text) => /\b(bullet|table|checklist|sections?|headings?|template|format|list|weekly plan|action plan)\b/i.test(text)
        },
        {
          key: "constraints",
          label: "Constraints",
          hint: "Set boundaries like tone, length, reading level, plain English, or what to avoid.",
          test: (text) => /\b(plain english|short|concise|tone|professional|realistic|avoid|under \d+|no jargon|reading level|length)\b/i.test(text)
        },
        {
          key: "quality",
          label: "Checkability",
          hint: "Ask the AI to show assumptions, uncertainties, risks, or signs the answer is working.",
          test: (text) => /\b(assumption|uncertain|missing|check|risk|warning|evidence|quality|signs?|criteria|do not invent)\b/i.test(text)
        }
      ];

      function assessPrompt(text) {
        return criteria.map((criterion) => ({
          ...criterion,
          passed: criterion.test(text)
        }));
      }

      function restoreIntro() {
        activity.innerHTML = `
          <div class="de-guide-activity__intro">
            <span class="de-content-label">Practice</span>
            <h2>Prompt Repair Workshop</h2>
            <p>Diagnose a weak AI answer, rewrite the prompt, and test whether your changes would make the output easier to use.</p>
            <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
          </div>
          <noscript>
            <p>This activity needs JavaScript, but the prompt ingredients above still show what to include.</p>
          </noscript>
        `;
        activity.querySelector("[data-activity-start]").addEventListener("click", startWorkshop);
        window.setTimeout(() => activity.querySelector("[data-activity-start]").focus(), 0);
      }

      function previewOutput(results) {
        const passed = new Set(results.filter((result) => result.passed).map((result) => result.key));
        if (passed.size < 3) {
          return `
            <p>Try making a to-do list, setting reminders, and avoiding distractions. Prioritise important tasks and take breaks.</p>
            <p><strong>Why this is still weak:</strong> the answer is generic because the prompt still leaves too much for the AI to guess.</p>
          `;
        }

        const details = [];
        if (passed.has("audience")) details.push("written for a Level 4 digital apprentice");
        if (passed.has("context")) details.push("based on project work, study time, and meetings");
        if (passed.has("constraints")) details.push("kept realistic and plain English");
        const detailText = details.length ? ` This is ${details.join(", ")}.` : "";
        return `
          <ol>
            <li><strong>Protect study blocks:</strong> choose two fixed 45-minute slots this week and treat them like meetings.</li>
            <li><strong>Start from deadlines:</strong> list assessment, work, and meeting commitments before choosing daily priorities.</li>
            <li><strong>Use a shutdown note:</strong> end each work session with the next action and any question to ask.</li>
          </ol>
          <p><strong>Check before using:</strong> confirm the learner's actual deadlines and whether their manager can protect study time.${detailText}</p>
        `;
      }

      function startWorkshop() {
        renderActivityShell(activity, "Prompt Repair Workshop", "Diagnose the weak answer, repair the prompt, then test whether the likely output improves.", "Repair loop", `
        <div class="de-prompt-workshop">
          <section class="de-prompt-workshop__case">
            <div>
              <span>Weak prompt</span>
              <p>${weakPrompt}</p>
            </div>
            <div>
              <span>Likely AI answer</span>
              <p>${weakOutput}</p>
            </div>
          </section>
          <section class="de-prompt-workshop__diagnosis">
            <h3>What went wrong?</h3>
            <div class="de-prompt-workshop__issues" data-issues>
              <button type="button" data-issue="audience">Audience is guessed</button>
              <button type="button" data-issue="context">No workplace context</button>
              <button type="button" data-issue="format">No usable output shape</button>
              <button type="button" data-issue="quality">No way to check the answer</button>
            </div>
          </section>
          <section class="de-prompt-workshop__editor">
            <label for="prompt-repair-text">Repair the prompt</label>
            <textarea id="prompt-repair-text" class="de-sim-textarea" data-prompt rows="9">${weakPrompt}</textarea>
          </section>
          <section class="de-prompt-workshop__rubric" data-rubric aria-live="polite"></section>
          <section class="de-prompt-workshop__preview">
            <h3>Output preview</h3>
            <div data-preview>${previewOutput(assessPrompt(weakPrompt))}</div>
          </section>
          <section class="de-prompt-workshop__example" data-example-panel hidden>
            <h3>Strong example to compare against</h3>
            <p>Create a realistic one-week time management plan for a Level 4 digital apprentice who is balancing project work, study time, meetings, and assessment preparation. Use plain English. Return a table with three priority habits, when to use them, and one warning sign that the plan needs adjusting. Highlight any assumptions or missing information I should check before using it.</p>
          </section>
          <div class="de-guide-activity__actions">
            <button type="button" class="de-guide-activity__secondary" data-example>Compare with strong example</button>
            <button type="button" class="de-guide-activity__primary" data-run>Run repaired prompt</button>
            <button type="button" class="de-guide-activity__secondary" data-collapse>Collapse activity</button>
          </div>
          <div class="de-guide-activity__feedback" data-feedback hidden></div>
        </div>
      `);

        const prompt = activity.querySelector("[data-prompt]");
        const rubric = activity.querySelector("[data-rubric]");
        const preview = activity.querySelector("[data-preview]");
        const feedback = activity.querySelector("[data-feedback]");

        function renderRubric() {
          const results = assessPrompt(prompt.value);
          const passed = results.filter((result) => result.passed).length;
          rubric.innerHTML = `
          <div class="de-prompt-workshop__score"><strong>${passed}/${criteria.length}</strong><span>prompt repair signals present</span></div>
          <div class="de-prompt-workshop__checks">
            ${results.map((result) => `
              <article class="${result.passed ? "is-correct" : ""}">
                <span>${result.passed ? "Included" : "Missing"}</span>
                <h4>${result.label}</h4>
                <p>${result.hint}</p>
              </article>
            `).join("")}
          </div>
        `;
          return results;
        }

        prompt.addEventListener("input", () => {
          const results = renderRubric();
          preview.innerHTML = previewOutput(results);
        });

        activity.querySelectorAll("[data-issue]").forEach((button) => {
          button.addEventListener("click", () => button.classList.toggle("is-selected"));
        });

        activity.querySelector("[data-example]").addEventListener("click", () => {
          const panel = activity.querySelector("[data-example-panel]");
          panel.hidden = !panel.hidden;
          activity.querySelector("[data-example]").textContent = panel.hidden ? "Compare with strong example" : "Hide strong example";
        });

        activity.querySelector("[data-collapse]").addEventListener("click", restoreIntro);

        activity.querySelector("[data-run]").addEventListener("click", () => {
          const results = renderRubric();
          const passed = results.filter((result) => result.passed).length;
          const selectedIssues = activity.querySelectorAll("[data-issue].is-selected").length;
          const missing = results.filter((result) => !result.passed).map((result) => result.label.toLowerCase());
          preview.innerHTML = previewOutput(results);

          showActivityFeedback(feedback, `
          <strong>${passed >= 5 ? "This is a strong repaired prompt." : passed >= 3 ? "This is improving, but it still leaves some guessing." : "This still behaves like a weak prompt."}</strong>
          <p>${selectedIssues ? `You diagnosed ${selectedIssues} issue${selectedIssues === 1 ? "" : "s"} before repairing it. ` : "Start by diagnosing what the weak answer failed to do. "}${missing.length ? `Next improvement: add ${missing.join(", ")}.` : "It names the task, audience, context, shape, constraints, and checkability."}</p>
          <div class="de-guide-activity__draft">${escapeHTML(prompt.value)}</div>
        `);
        });

        renderRubric();
      }

      startWorkshop();
    });

    bindStart("[data-git-timeline]", (activity) => {
      const steps = ["git status", "git add README.md", "git push", "git diff", "git commit -m \"Update README\""];
      const correct = ["git status", "git diff", "git add README.md", "git commit -m \"Update README\"", "git push"];
      renderActivityShell(activity, "Commit Timeline", "Move the commands into a safer order, then mark the mistake in the original timeline.", "Git recovery", `
        <ol class="de-sim-timeline" data-timeline>${steps.map((step) => `<li><button type="button" class="de-sim-card" data-step>${escapeHTML(step)}</button></li>`).join("")}</ol>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__secondary" data-up>Move up</button><button type="button" class="de-guide-activity__secondary" data-down>Move down</button><button type="button" class="de-guide-activity__primary" data-check>Check timeline</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      let selected = null;
      activity.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => {
        selected = button.closest("li");
        activity.querySelectorAll("[data-step]").forEach((step) => step.classList.toggle("is-selected", step === button));
      }));
      activity.querySelector("[data-up]").addEventListener("click", () => { if (selected && selected.previousElementSibling) selected.parentNode.insertBefore(selected, selected.previousElementSibling); });
      activity.querySelector("[data-down]").addEventListener("click", () => { if (selected && selected.nextElementSibling) selected.parentNode.insertBefore(selected.nextElementSibling, selected); });
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const current = Array.from(activity.querySelectorAll("[data-step]")).map((button) => button.textContent);
        const score = current.filter((step, index) => step === correct[index]).length;
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${score}/${correct.length} commands are in safe order.</strong><p>The mistake was pushing before inspecting the diff and committing the staged work.</p>`);
      });
    });

    bindStart("[data-method-interview]", (activity) => {
      const questions = [
        { q: "Are requirements fixed?", a: "Some compliance parts are fixed, but the dashboard metrics are still emerging." },
        { q: "How often can users review?", a: "Managers can review a working slice every two weeks." },
        { q: "Are there formal approval gates?", a: "Yes, data protection and reporting sign-off are mandatory." }
      ];
      renderActivityShell(activity, "Project Method Matchmaker", "Ask up to three stakeholder questions, then recommend an approach.", "Stakeholder interview", `
        <div class="de-sim-chat" data-chat><p><strong>Stakeholder:</strong> We need a learner progress dashboard.</p></div>
        <div class="de-sim-card-pile">${questions.map((item, index) => `<button type="button" class="de-sim-card" data-question="${index}">${item.q}</button>`).join("")}</div>
        <div class="de-guide-activity__actions">${simpleChoiceButtons([{ key: "Agile", label: "Agile" }, { key: "Waterfall", label: "Waterfall" }, { key: "Hybrid", label: "Hybrid" }])}</div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      activity.querySelectorAll("[data-question]").forEach((button) => button.addEventListener("click", () => {
        const item = questions[Number(button.dataset.question)];
        activity.querySelector("[data-chat]").insertAdjacentHTML("beforeend", `<p><strong>You:</strong> ${item.q}</p><p><strong>Stakeholder:</strong> ${item.a}</p>`);
        button.disabled = true;
      }));
      activity.querySelectorAll("[data-value]").forEach((button) => button.addEventListener("click", () => {
        const ok = button.dataset.value === "Hybrid";
        button.classList.add(ok ? "is-correct" : "is-extra");
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${ok ? "Hybrid is the strongest recommendation." : "There is a better fit here."}</strong><p>Fixed approval gates plus iterative dashboard discovery points to a hybrid approach.</p>`);
      }));
    });

    bindStart("[data-tone-mixer]", (activity) => {
      renderActivityShell(activity, "Comment Tone Mixer", "Tune specificity, tone, and actionability until the review comment is useful.", "Review sliders", `
        <div class="de-sim-note"><p data-comment>This is confusing.</p></div>
        <label class="de-sim-slider">Specificity <input type="range" min="1" max="5" value="1" data-slider="specificity"></label>
        <label class="de-sim-slider">Kindness <input type="range" min="1" max="5" value="2" data-slider="kindness"></label>
        <label class="de-sim-slider">Actionability <input type="range" min="1" max="5" value="1" data-slider="action"></label>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Check comment</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      const comment = activity.querySelector("[data-comment]");
      activity.querySelectorAll("[data-slider]").forEach((slider) => slider.addEventListener("input", () => {
        const specificity = Number(activity.querySelector('[data-slider="specificity"]').value);
        const kindness = Number(activity.querySelector('[data-slider="kindness"]').value);
        const action = Number(activity.querySelector('[data-slider="action"]').value);
        comment.textContent = specificity > 3 && kindness > 3 && action > 3
          ? "Could this function name describe the result it returns? I found it hard to follow when reading the next step."
          : specificity > 3
            ? "This part is unclear around the function name."
            : "This is confusing.";
      }));
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const total = Array.from(activity.querySelectorAll("[data-slider]")).reduce((sum, slider) => sum + Number(slider.value), 0);
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${total >= 12 ? "Useful review comment." : "Keep tuning the comment."}</strong><p>Good review feedback is specific, respectful, and gives the author a next move.</p>`);
      });
    });

    bindStart("[data-risk-splitter]", (activity) => {
      const items = [
        { text: "Physical data centre security", answer: "provider" },
        { text: "User access and permissions", answer: "organisation" },
        { text: "Availability and recovery planning", answer: "shared" },
        { text: "Monitoring cost and usage", answer: "organisation" }
      ];
      const owners = [{ key: "provider", label: "Provider" }, { key: "organisation", label: "Organisation" }, { key: "shared", label: "Shared" }];
      renderActivityShell(activity, "Responsibility Split", "Assign each responsibility. Wrong ownership increases the risk meter.", "Cloud risk", `
        <div class="de-sim-meter"><span>Risk</span><strong data-risk>0</strong></div>
        <div class="de-sim-card-pile">${items.map((item, index) => `<button type="button" class="de-sim-card" data-risk-item="${index}">${item.text}</button>`).join("")}</div>
        <div class="de-guide-activity__actions">${simpleChoiceButtons(owners)}</div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      let selected = null;
      let answered = 0;
      let risk = 0;
      activity.querySelectorAll("[data-risk-item]").forEach((button) => button.addEventListener("click", () => { selected = button; activity.querySelectorAll("[data-risk-item]").forEach((card) => card.classList.toggle("is-selected", card === button)); }));
      activity.querySelectorAll("[data-value]").forEach((button) => button.addEventListener("click", () => {
        if (!selected || selected.dataset.done) return;
        const item = items[Number(selected.dataset.riskItem)];
        const ok = item.answer === button.dataset.value;
        selected.dataset.done = "true";
        selected.classList.add(ok ? "is-correct" : "is-extra");
        if (!ok) risk += 25;
        answered += 1;
        activity.querySelector("[data-risk]").textContent = risk;
        if (answered === items.length) showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>Risk meter: ${risk}</strong><p>Cloud shifts responsibility, but access, data, cost, and configuration still need organisational ownership.</p>`);
      }));
    });

    bindStart("[data-incident-desk]", (activity) => {
      const tickets = [
        { report: "Learners cannot access the platform this morning.", type: "Incident", response: "Post a service update and escalate restore work." },
        { report: "Export downloads an empty file when filters are applied.", type: "Bug", response: "Capture steps, expected result, actual result, and evidence." },
        { report: "The login issue has happened three times this month.", type: "Problem", response: "Start root cause investigation after immediate fixes." }
      ];
      const choices = ["Incident", "Bug", "Problem", "Request"].map((label) => ({ key: label, label }));
      let index = 0;
      let score = 0;
      function renderTicket() {
        const ticket = tickets[index];
        renderActivityShell(activity, "Incident Triage Desk", "Classify the report, then read the first response.", `${index + 1}/${tickets.length}`, `
          <article class="de-sim-ticket"><h3>Incoming report</h3><p>${ticket.report}</p></article>
          <div class="de-guide-activity__actions">${simpleChoiceButtons(choices)}</div>
          <div class="de-guide-activity__feedback" data-feedback hidden></div>
        `);
        activity.querySelectorAll("[data-value]").forEach((button) => button.addEventListener("click", () => {
          const ok = button.dataset.value === ticket.type;
          if (ok) score += 1;
          showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${ok ? "Correct triage." : `Best classification: ${ticket.type}.`}</strong><p>${ticket.response}</p><button type="button" class="de-guide-activity__secondary" data-next>${index === tickets.length - 1 ? "Show result" : "Next report"}</button>`);
          activity.querySelector("[data-next]").addEventListener("click", () => { if (index === tickets.length - 1) showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${score}/${tickets.length} triage calls correct.</strong><p>Clear language helps teams respond at the right speed.</p>`); else { index += 1; renderTicket(); } });
        }));
      }
      renderTicket();
    });

    bindStart("[data-decision-brief]", (activity) => {
      const questions = [
        {
          key: "problem",
          text: "What problem are we solving?",
          evidence: "Managers are not asking for a new tool. They are asking why weekly reports arrive late and contain conflicting learner numbers.",
          insight: "Problem clarity",
          weight: 24
        },
        {
          key: "users",
          text: "Who is affected by this decision?",
          evidence: "Managers need reliable summaries, coaches need detail they can trust, and learners could be affected if progress data is wrong.",
          insight: "User impact",
          weight: 18
        },
        {
          key: "risk",
          text: "What could go wrong?",
          evidence: "The new tool would process learner progress data, has not passed data protection review, and may duplicate existing reporting logic.",
          insight: "Risk",
          weight: 24
        },
        {
          key: "success",
          text: "How will we know it worked?",
          evidence: "No success measure has been agreed yet. The team could track report accuracy, production time, support tickets, and manager confidence.",
          insight: "Quality measure",
          weight: 16
        },
        {
          key: "maintain",
          text: "What will this be like to maintain later?",
          evidence: "The current dashboard is owned by the data team. The proposed tool would need a new owner, training, access controls, and ongoing licence review.",
          insight: "Maintainability",
          weight: 22
        },
        {
          key: "cost",
          text: "What will this cost now and later?",
          evidence: "The licence is affordable for a pilot, but full rollout adds training, support, integration, and exit costs.",
          insight: "Cost",
          weight: 12
        }
      ];
      const decisionOptions = [
        { key: "recommend", label: "Recommend the tool" },
        { key: "pause", label: "Pause the decision" },
        { key: "investigate", label: "Investigate first" }
      ];

      function restoreIntro() {
        activity.innerHTML = `
          <div class="de-guide-activity__intro">
            <span class="de-content-label">Practice</span>
            <h2>Decision Brief</h2>
            <p>Ask better questions before approving, pausing, or investigating a solution.</p>
            <button type="button" class="de-guide-activity__start" data-activity-start>Start the activity</button>
          </div>
        `;
        activity.querySelector("[data-activity-start]").addEventListener("click", startDecisionBrief);
        window.setTimeout(() => activity.querySelector("[data-activity-start]").focus(), 0);
      }

      function startDecisionBrief() {
        renderActivityShell(activity, "Ask Before You Advise", "You have three questions before making a recommendation. Choose the questions that expose the real trade-off.", "", `
          <div class="de-decision-brief">
            <article class="de-decision-brief__scenario">
              <span>Rushed recommendation</span>
              <h3>Replace the current reporting dashboard with a new AI analytics tool.</h3>
              <p>It looks faster, more modern, and the demo was impressive.</p>
            </article>
            <div class="de-decision-brief__status">
              <div>
                <span>Questions left</span>
                <strong data-question-count>3</strong>
              </div>
              <div>
                <span>Decision confidence</span>
                <strong data-confidence>0%</strong>
              </div>
            </div>
            <section>
              <h3>Choose your questions</h3>
              <div class="de-decision-brief__questions">${questions.map((question, index) => `<button type="button" data-question="${index}"><span>${question.insight}</span>${question.text}</button>`).join("")}</div>
            </section>
            <section class="de-decision-brief__evidence">
              <h3>Evidence revealed</h3>
              <div data-evidence><p>Ask a question to reveal what the recommendation is hiding.</p></div>
            </section>
            <section class="de-decision-brief__tradeoffs">
              <h3>Trade-off map</h3>
              <div data-tradeoffs>
                <span data-tradeoff="speed">Speed</span>
                <span data-tradeoff="cost">Cost</span>
                <span data-tradeoff="risk">Risk</span>
                <span data-tradeoff="quality">Quality</span>
                <span data-tradeoff="users">User needs</span>
                <span data-tradeoff="maintain">Maintainability</span>
              </div>
            </section>
            <section class="de-decision-brief__choice">
              <h3>What would you do?</h3>
              <div class="de-guide-activity__actions">${simpleChoiceButtons(decisionOptions)}</div>
            </section>
            <div class="de-guide-activity__actions">
              <button type="button" class="de-guide-activity__secondary" data-collapse>Hide activity</button>
            </div>
            <div class="de-guide-activity__feedback" data-feedback hidden></div>
          </div>
        `, `<button type="button" class="de-guide-activity__text-action" data-collapse>Hide activity</button>`);

        const selected = new Set();
        const evidence = activity.querySelector("[data-evidence]");
        const count = activity.querySelector("[data-question-count]");
        const confidence = activity.querySelector("[data-confidence]");
        const feedback = activity.querySelector("[data-feedback]");
        const tradeoffMap = {
          cost: "cost",
          risk: "risk",
          success: "quality",
          users: "users",
          maintain: "maintain"
        };

        function renderStatus() {
          const score = Array.from(selected).reduce((total, key) => total + questions.find((question) => question.key === key).weight, 0);
          const capped = Math.min(100, score);
          count.textContent = String(3 - selected.size);
          confidence.textContent = `${capped}%`;
          activity.querySelectorAll("[data-tradeoff]").forEach((item) => {
            const activeFromQuestion = Array.from(selected).some((key) => tradeoffMap[key] === item.dataset.tradeoff);
            item.classList.toggle("is-active", item.dataset.tradeoff === "speed" || activeFromQuestion);
          });
        }

        activity.querySelectorAll("[data-question]").forEach((button) => {
          button.addEventListener("click", () => {
            if (button.disabled || selected.size >= 3) return;
            const question = questions[Number(button.dataset.question)];
            selected.add(question.key);
            button.disabled = true;
            button.classList.add("is-selected");
            if (selected.size === 1) evidence.replaceChildren();
            evidence.insertAdjacentHTML("beforeend", `<article><span>${question.insight}</span><p>${question.evidence}</p></article>`);
            renderStatus();
          });
        });

        activity.querySelectorAll("[data-value]").forEach((button) => {
          button.addEventListener("click", () => {
            const asked = Array.from(selected);
            const hasCoreEvidence = selected.has("problem") && selected.has("risk") && (selected.has("maintain") || selected.has("users"));
            const decision = button.dataset.value;
            const isStrong = decision === "investigate" && hasCoreEvidence;
            const isReasonablePause = decision === "pause" && selected.size > 0 && !hasCoreEvidence;
            activity.querySelectorAll("[data-value]").forEach((choice) => choice.classList.remove("is-correct", "is-extra"));
            button.classList.add(isStrong || isReasonablePause ? "is-correct" : "is-extra");

            const missing = ["problem", "users", "risk", "success", "maintain"].filter((key) => !selected.has(key));
            const message = isStrong
              ? "Strong judgement. You resisted the shiny solution and gathered enough evidence to investigate properly."
              : isReasonablePause
                ? "Reasonable caution. Pausing is better than approving with thin evidence, but stronger judgement would ask sharper questions first."
                : "This decision is not ready. The guide asks you to understand the problem, affected people, risk, success, and maintainability before recommending a path.";

            showActivityFeedback(feedback, `
              <strong>${message}</strong>
              <p>${asked.length ? `You asked about ${asked.map((key) => questions.find((question) => question.key === key).insight.toLowerCase()).join(", ")}. ` : "You made a decision without asking anything. "}${missing.length ? `Still worth checking: ${missing.map((key) => questions.find((question) => question.key === key).insight.toLowerCase()).join(", ")}.` : "You covered the core judgement questions."}</p>
              <div class="de-guide-activity__draft">Suggested brief: investigate the reporting problem before replacing the dashboard. Confirm the real cause of late/conflicting reports, check learner data risk, agree success measures, and identify who would maintain any new tool.</div>
            `);
          });
        });

        activity.querySelectorAll("[data-collapse]").forEach((button) => {
          button.addEventListener("click", restoreIntro);
        });
        renderStatus();
      }

      startDecisionBrief();
    });

    bindStart("[data-api-flow]", (activity) => {
      const parts = ["Client", "Endpoint", "Method", "Authentication", "Payload", "Response"];
      renderActivityShell(activity, "API Conversation Builder", "Build the API flow in order from request to response.", "System flow", `
        <div class="de-sim-flow" data-flow></div>
        <div class="de-sim-card-pile">${parts.map((part) => `<button type="button" class="de-sim-card" data-part="${part}">${part}</button>`).join("")}</div>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Check flow</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      const flow = activity.querySelector("[data-flow]");
      activity.querySelectorAll("[data-part]").forEach((button) => button.addEventListener("click", () => {
        flow.insertAdjacentHTML("beforeend", `<span data-flow-part="${button.dataset.part}">${button.dataset.part}</span>`);
        button.disabled = true;
      }));
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const current = Array.from(activity.querySelectorAll("[data-flow-part]")).map((item) => item.dataset.flowPart);
        const score = current.filter((part, index) => part === parts[index]).length;
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${score}/${parts.length} flow parts are in order.</strong><p>An API conversation starts with a client calling an endpoint with a method, permission, data, and response.</p>`);
      });
    });

    bindStart("[data-bug-detective]", (activity) => {
      const clues = [
        { text: "Search returns no results for known article titles.", useful: true },
        { text: "It feels annoying.", useful: false },
        { text: "Chrome on desktop.", useful: true },
        { text: "Expected: searching Git shows the Git guide.", useful: true },
        { text: "Actual: no results found.", useful: true },
        { text: "Refreshed and tried private window.", useful: true }
      ];
      renderActivityShell(activity, "Bug Report Detective", "Select useful clues from messy notes, then assemble the report evidence.", "Evidence hunt", `
        <div class="de-sim-card-pile">${clues.map((clue, index) => `<button type="button" class="de-sim-card" data-clue="${index}">${clue.text}</button>`).join("")}</div>
        <textarea class="de-sim-textarea" data-report rows="5" aria-label="Bug report evidence" placeholder="Useful clues appear here."></textarea>
        <div class="de-guide-activity__actions"><button type="button" class="de-guide-activity__primary" data-check>Check report</button></div>
        <div class="de-guide-activity__feedback" data-feedback hidden></div>
      `);
      const report = activity.querySelector("[data-report]");
      activity.querySelectorAll("[data-clue]").forEach((button) => button.addEventListener("click", () => {
        const clue = clues[Number(button.dataset.clue)];
        button.classList.toggle("is-selected");
        if (clue.useful && !report.value.includes(clue.text)) report.value = `${report.value}${report.value ? "\n" : ""}- ${clue.text}`;
      }));
      activity.querySelector("[data-check]").addEventListener("click", () => {
        const useful = clues.filter((clue) => clue.useful && report.value.includes(clue.text)).length;
        showActivityFeedback(activity.querySelector("[data-feedback]"), `<strong>${useful}/5 useful clues captured.</strong><p>A good bug report uses evidence: what happened, where, expected result, actual result, and what was already tried.</p>`);
      });
    });
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

        showActivityFeedback(feedback, `
          <strong>${summary}</strong>
          <p>Your rebuilt prompt:</p>
          <div class="de-guide-activity__draft">${prompt}</div>
        `);
      });

      activity.querySelector("[data-prompt-reset]").addEventListener("click", startActivity);
    }

    const start = activity.querySelector("[data-prompt-builder-start]");
    if (start) start.addEventListener("click", startActivity);
  }

  function installHiddenWorkEstimator() {
    const activity = document.querySelector("[data-hidden-work-estimator]");
    if (!activity) return;

    const options = [
      { key: "requirements", text: "Clarify what data, format, filters, and permissions the export needs." },
      { key: "source", text: "Check where the dashboard data comes from and whether it is reliable." },
      { key: "build", text: "Build the export button, file generation, and download behaviour." },
      { key: "test", text: "Test normal, empty, filtered, large, and unauthorised data cases." },
      { key: "communicate", text: "Update guidance or release notes so users know how the export works." },
      { key: "confidence", text: "Give a medium-confidence estimate until data ownership and permissions are clear." }
    ];
    const fields = [
      { key: "requirements", label: "1. Clarify scope" },
      { key: "source", label: "2. Investigate data" },
      { key: "build", label: "3. Build the change" },
      { key: "test", label: "4. Check risk" },
      { key: "communicate", label: "5. Prepare handover" },
      { key: "confidence", label: "Estimate confidence" }
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
          <div class="de-guide-activity__field-grid" data-hidden-work-fields></div>
          <div class="de-guide-activity__actions">
            <button type="button" class="de-guide-activity__primary" data-hidden-work-check>Build estimate</button>
            <button type="button" class="de-guide-activity__secondary" data-hidden-work-reset>Reset</button>
          </div>
          <div class="de-guide-activity__feedback" data-hidden-work-feedback hidden></div>
        </div>
      `;

      const fieldGrid = activity.querySelector("[data-hidden-work-fields]");
      const feedback = activity.querySelector("[data-hidden-work-feedback]");

      fields.forEach((field, fieldIndex) => {
        const wrapper = document.createElement("div");
        wrapper.className = "de-guide-activity__field";
        const optionMarkup = options.map((option) => `<option value="${option.key}">${option.text}</option>`).join("");
        wrapper.innerHTML = `
          <label for="hidden-work-${fieldIndex}">${field.label}</label>
          <select id="hidden-work-${fieldIndex}" data-answer="${field.key}">
            <option value="">Choose the best fit</option>
            ${optionMarkup}
          </select>
        `;
        fieldGrid.appendChild(wrapper);
      });

      activity.querySelector("[data-hidden-work-check]").addEventListener("click", () => {
        let correct = 0;
        const draft = [];

        fieldGrid.querySelectorAll("select").forEach((select) => {
          const isCorrect = select.value === select.dataset.answer;
          select.classList.toggle("is-correct", isCorrect);
          select.classList.toggle("is-extra", !isCorrect && Boolean(select.value));
          if (isCorrect) correct += 1;
          const field = fields.find((item) => item.key === select.dataset.answer);
          const option = options.find((item) => item.key === select.value);
          draft.push(`${field.label}: ${option ? option.text : "Not chosen"}`);
        });

        const complete = correct === fields.length;

        showActivityFeedback(feedback, `
          <strong>${complete ? "Strong estimate plan. You made the hidden work visible." : `${correct}/${fields.length} estimate parts are in the right place.`}</strong>
          <p>${complete ? "This is the kind of breakdown that makes an estimate easier to defend." : "A stronger estimate separates discovery, build work, risk checks, communication, and confidence."}</p>
          <div class="de-guide-activity__draft">${draft.join("\n")}</div>
        `);
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
        showActivityFeedback(feedback, `
          <strong>${complete ? "Clear report. This gives someone enough to investigate." : `${correct}/${fields.length} sections are in the right place.`}</strong>
          <p>${complete ? "The report separates expected result, actual result, steps, and impact." : "Move details into the section that answers that specific question."}</p>
          <div class="de-guide-activity__draft">${draft.join("\n")}</div>
        `);
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
            prompt: "\"Could you make this clearer?\"",
            answer: "Too vague",
            feedback: "This is polite, but still too broad. The author needs to know what is unclear and where."
          },
          {
            prompt: "\"Could this function name describe the result it returns? I found it hard to follow when reading the next step.\"",
            answer: "Useful feedback",
            feedback: "This is specific, explains the impact, and suggests a direction without attacking the person."
          },
          {
            prompt: "\"This approach is careless and will cause problems later.\"",
            answer: "Too personal",
            feedback: "This may point toward risk, but the wording judges the person. Useful review comments focus on the work and the evidence."
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
              showActivityFeedback(feedback, `
                <strong>${isCorrect ? "Good choice." : `Best answer: ${scenario.answer}.`}</strong>
                <p>${scenario.feedback}</p>
              `);
              next.disabled = false;
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
              focusActivityResult(activity);
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
        type: "sequence",
        title: "Break It Down",
        intro: "Put the work into a sensible order so the vague goal becomes a plan.",
        badge: "Vague goal",
        prompt: "Prepare for assessment.",
        options: [
          { key: "criteria", text: "List the assessment criteria I need to evidence." },
          { key: "evidence", text: "Find two examples of work that match the criteria." },
          { key: "gaps", text: "Check what evidence or explanation is missing." },
          { key: "questions", text: "Write questions for anything I do not understand." },
          { key: "review", text: "Book time for review or feedback." }
        ],
        fields: [
          { key: "criteria", label: "1. Make the target clear" },
          { key: "evidence", label: "2. Gather evidence" },
          { key: "gaps", label: "3. Find gaps" },
          { key: "questions", label: "4. Unblock uncertainty" },
          { key: "review", label: "5. Get feedback" }
        ],
        success: "Good plan. You turned a vague goal into sequenced, reviewable work.",
        review: "A stronger plan clarifies the target, gathers evidence, finds gaps, asks questions, then gets feedback."
      },
      "technical-note-fix": {
        type: "builder",
        title: "Before And After Notes",
        intro: "Build a useful handover note from the messy starting point.",
        badge: "Weak note",
        prompt: "Dashboard broken. Needs fixing.",
        options: [
          { key: "context", text: "Users see a blank dashboard after applying the department filter." },
          { key: "evidence", text: "Issue reproduced in Chrome and Edge at 10:30." },
          { key: "scope", text: "Only the department filter appears affected." },
          { key: "impact", text: "Managers cannot view filtered progress reports." },
          { key: "next", text: "Next step: check the filter query and recent data changes." }
        ],
        fields: [
          { key: "context", label: "Context" },
          { key: "evidence", label: "Evidence" },
          { key: "scope", label: "Scope" },
          { key: "impact", label: "Impact" },
          { key: "next", label: "Next step" }
        ],
        success: "Useful note. Someone else could now understand the issue and continue the work.",
        review: "A stronger note separates context, evidence, scope, impact, and next step."
      },
      "restart-note": {
        type: "builder",
        title: "Restart Note Builder",
        intro: "Assemble a restart note that lets you return without rebuilding the context.",
        badge: "Interrupted task",
        prompt: "You are updating a guide and need to leave before checking the links.",
        options: [
          { key: "state", text: "Updated the first three sections." },
          { key: "remaining", text: "Still need to check internal links and build output." },
          { key: "next", text: "Next action: run the link/build check." },
          { key: "blocker", text: "Possible blocker: one linked page may have moved." },
          { key: "location", text: "Relevant file: guides/checking-ai-outputs.md." }
        ],
        fields: [
          { key: "state", label: "Current state" },
          { key: "remaining", label: "Still outstanding" },
          { key: "next", label: "Next action" },
          { key: "blocker", label: "Possible blocker" },
          { key: "location", label: "Where to restart" }
        ],
        success: "Good restart note. Future you has a clear route back into the task.",
        review: "A useful restart note captures current state, outstanding work, next action, blockers, and location."
      },
      "pr-readiness": {
        type: "builder",
        title: "PR Readiness Check",
        intro: "Build a stronger pull request description from a weak one.",
        badge: "Mock pull request",
        prompt: "Title: updates. Description: changed some guide stuff.",
        options: [
          { key: "summary", text: "Adds interactive guide activities to help learners practise key concepts." },
          { key: "why", text: "Needed to make guides more active and less like static reference pages." },
          { key: "checks", text: "Ran JS syntax check and MkDocs strict build." },
          { key: "scope", text: "Kept changes limited to guide activity markup, JS, and shared styling." },
          { key: "review", text: "Please focus review on activity wording, accessibility, and mobile layout." }
        ],
        fields: [
          { key: "summary", label: "Summary" },
          { key: "why", label: "Why it changed" },
          { key: "checks", label: "Checks run" },
          { key: "scope", label: "Scope boundary" },
          { key: "review", label: "Reviewer focus" }
        ],
        success: "Ready for review. This gives reviewers purpose, checks, scope, and focus.",
        review: "A useful pull request description explains what changed, why, checks, scope, and reviewer focus."
      },
      "pick-test-cases": {
        type: "classify",
        title: "Pick The Test Cases",
        intro: "Classify each check so the test plan covers different kinds of risk.",
        badge: "Feature check",
        prompt: "Learners can upload a PDF evidence file.",
        options: [
          { key: "happy", text: "Happy path" },
          { key: "error", text: "Error case" },
          { key: "edge", text: "Edge case" },
          { key: "regression", text: "Regression check" }
        ],
        fields: [
          { key: "happy", label: "Upload a valid PDF and confirm it appears." },
          { key: "error", label: "Try an unsupported file type." },
          { key: "edge", label: "Try a file larger than the allowed limit." },
          { key: "error", label: "Check the error message is understandable." },
          { key: "regression", label: "Confirm existing uploaded files still display." }
        ],
        success: "Good test plan. You covered normal use, failure, edge, and regression risk.",
        review: "A useful test plan separates happy path, error cases, edge cases, and regression checks."
      },
      "tool-fit-scorecard": {
        type: "builder",
        title: "Tool Fit Scorecard",
        intro: "Build a recommendation that starts with fit, risk, and ownership.",
        badge: "Tool request",
        prompt: "A team wants to buy a new AI note-taking tool.",
        options: [
          { key: "problem", text: "Problem: meeting actions are missed or rewritten inconsistently." },
          { key: "data", text: "Data risk: recordings and transcripts may include personal or confidential information." },
          { key: "users", text: "Users and support: confirm who will use it and who owns guidance." },
          { key: "integration", text: "Integration: check whether it works with approved calendar and meeting tools." },
          { key: "cost", text: "Cost: compare licence, setup, support, and exit costs." }
        ],
        fields: [
          { key: "problem", label: "Need" },
          { key: "data", label: "Data risk" },
          { key: "users", label: "Ownership" },
          { key: "integration", label: "Integration" },
          { key: "cost", label: "Cost" }
        ],
        success: "Strong recommendation. It starts with the problem and includes risk, ownership, integration, and cost.",
        review: "A tool recommendation should explain need, data risk, ownership, integration, and cost before moving to trial."
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
            <div class="de-guide-activity__field-grid" data-checklist-fields></div>
            <div class="de-guide-activity__actions">
              <button type="button" class="de-guide-activity__primary" data-checklist-check>Check activity</button>
              <button type="button" class="de-guide-activity__secondary" data-checklist-reset>Reset</button>
            </div>
            <div class="de-guide-activity__feedback" data-checklist-feedback hidden></div>
          </div>
        `;

        const fields = activity.querySelector("[data-checklist-fields]");
        const feedback = activity.querySelector("[data-checklist-feedback]");

        config.fields.forEach((field, index) => {
          const wrapper = document.createElement("div");
          wrapper.className = "de-guide-activity__field";
          const optionMarkup = config.options.map((option) => `<option value="${option.key}">${option.text}</option>`).join("");
          wrapper.innerHTML = `
            <label for="${activity.dataset.checklistActivity}-${index}">${field.label}</label>
            <select id="${activity.dataset.checklistActivity}-${index}" data-answer="${field.key}" data-label="${field.label}">
              <option value="">Choose the best fit</option>
              ${optionMarkup}
            </select>
          `;
          fields.appendChild(wrapper);
        });

        activity.querySelector("[data-checklist-check]").addEventListener("click", () => {
          let correct = 0;
          const draft = [];

          fields.querySelectorAll("select").forEach((select) => {
            const isCorrect = select.value === select.dataset.answer;
            select.classList.toggle("is-correct", isCorrect);
            select.classList.toggle("is-extra", !isCorrect && Boolean(select.value));
            if (isCorrect) correct += 1;
            const option = config.options.find((item) => item.key === select.value);
            draft.push(`${select.dataset.label}: ${option ? option.text : "Not chosen"}`);
          });

          const complete = correct === config.fields.length;

          showActivityFeedback(feedback, `
            <strong>${complete ? config.success : `${correct}/${config.fields.length} parts are in the right place.`}</strong>
            <p>${complete ? "This is a usable output, not just a recognition check." : config.review}</p>
            <div class="de-guide-activity__draft">${draft.join("\n")}</div>
          `);
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
          showActivityFeedback(feedback, `
            <strong>${complete ? config.success : `${correct}/${config.fields.length} matches are correct.`}</strong>
            <p>${complete ? "Nice. The pattern is in place." : config.review}</p>
          `);
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
      showActivityFeedback(feedback, `
        <strong>${isCorrect ? "Good spot." : `The strongest answer is ${scenario.answer}.`}</strong>
        <p>${scenario.feedback}</p>
      `);
      scoreText.textContent = `${score}/${activeScenarios.length}`;
      next.disabled = false;
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
      focusActivityResult(game);
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
    document.addEventListener("DOMContentLoaded", installDistinctGuideActivities);
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
    installDistinctGuideActivities();
    installBiasGame();
  }

  installSearchPolish(40);
})();
