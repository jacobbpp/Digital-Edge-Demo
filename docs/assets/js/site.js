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
      searchIntro.textContent = "Search articles, guides, events, and newsletters.";
    }

    const footerText = document.querySelector("footer p");
    if (footerText) {
      footerText.replaceChildren("BPP Digital Edge", " · ");
      const privacyLink = document.createElement("a");
      const siteBase = typeof base_url === "string" ? base_url : "";
      privacyLink.href = typeof joinUrl === "function"
        ? joinUrl(siteBase, "privacy/")
        : `${siteBase.replace(/\/?$/, "/")}privacy/`;
      privacyLink.textContent = "Privacy and analytics";
      footerText.appendChild(privacyLink);
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
            <div><span>Date</span><strong data-event-modal-date></strong></div>
            <div><span>Time</span><strong data-event-modal-time></strong></div>
            <div><span>Location</span><strong data-event-modal-location></strong></div>
          </div>
          <p data-event-modal-description></p>
          <p class="de-event-modal__audience"><strong>Best for: </strong><span data-event-modal-audience></span></p>
          <a class="de-event-modal__register" href="#" target="_blank" rel="noopener noreferrer" data-event-modal-register>Register</a>
        </div>
      </section>
    `;
    document.body.appendChild(modal);

    const title = modal.querySelector("#de-event-modal-title");
    const date = modal.querySelector("[data-event-modal-date]");
    const time = modal.querySelector("[data-event-modal-time]");
    const location = modal.querySelector("[data-event-modal-location]");
    const description = modal.querySelector("[data-event-modal-description]");
    const audience = modal.querySelector("[data-event-modal-audience]");
    const register = modal.querySelector("[data-event-modal-register]");
    let activeCard = null;

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("de-modal-open");
      if (activeCard) activeCard.focus();
    }

    function openModal(card) {
      activeCard = card;
      title.textContent = card.dataset.eventTitle || "Event details";
      date.textContent = card.dataset.eventDate || "To be confirmed";
      time.textContent = card.dataset.eventTime || "To be confirmed";
      location.textContent = card.dataset.eventLocation || "Online";
      description.textContent = card.dataset.eventDescription || "";
      audience.textContent = card.dataset.eventAudience || "Anyone interested in practical digital skills.";
      const registrationUrl = card.dataset.eventRegister || "";
      const eventStatus = (card.dataset.eventStatus || "").toLowerCase();

      if (registrationUrl) {
        register.href = registrationUrl;
        register.target = "_blank";
        register.rel = "noopener noreferrer";
        register.textContent = "Register";
        register.removeAttribute("aria-disabled");
        register.classList.remove("de-event-modal__register--disabled");
      } else {
        register.removeAttribute("href");
        register.removeAttribute("target");
        register.removeAttribute("rel");
        register.textContent = eventStatus === "complete" ? "Complete" : "Registration link coming soon";
        register.setAttribute("aria-disabled", "true");
        register.classList.add("de-event-modal__register--disabled");
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installCodeCopyButtons);
    document.addEventListener("DOMContentLoaded", installInlineGuidedPractice);
    document.addEventListener("DOMContentLoaded", installEventCards);
    document.addEventListener("DOMContentLoaded", installArticleTagFilters);
  } else {
    installCodeCopyButtons();
    installInlineGuidedPractice();
    installEventCards();
    installArticleTagFilters();
  }

  installSearchPolish(40);
})();
