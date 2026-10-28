const beforeCall = [
  "result-adhd-calculations",
  "question-explain-yourself",
  "transition-explain-yourself",
  "question-support-system",
  "transition-feeling-understood",
  "question-self-care",
  "transition-loading-patterns",
  "info-therapy-data",
  "question-strategies",
  "transition-specialized-therapy",
  "question-better-future",
  "transition-loading-plan",
  "partnership-cerebral-2",
  "question-reason-care-2",
  "info-therapy-benefits",
  "question-support-type-2",
  "info-care-coordinator",
  "info-cerebral-right-support-book-2",
];

const afterDecline = [
  "insurance-prototype-inflow-app",
  "question-busy-journey",
  "question-time-of-day-journey",
  "question-make-progress-journey",
  "info-minutes-testimonial-journey",
  "question-see-yourself-journey",
  "info-personalizing-journey",
  "question-pick-journey",
  "question-how-much-time-journey",
  "question-commitment",
  "info-start-today",
];

const resultsBranchScreen = "results-branch-choice";
const resultsDetailScreen = "result-adhd-challenges";
const originalScreens = window.originalScreens || {};
const multiSelectScreens = new Set([
  "question-better-future",
  "question-see-yourself-journey",
]);
const tapToContinueScreens = new Set([
  "transition-explain-yourself",
  "transition-feeling-understood",
  "transition-loading-patterns",
  "transition-specialized-therapy",
  "transition-loading-plan",
  "info-personalizing-journey",
]);
const app = document.querySelector("#app");
const answers = {};
let entry = sessionStorage.getItem("prototypeEntry") || "call";
let resultsBranchSelection = sessionStorage.getItem("resultsBranchSelection") || "therapy";

function currentScreen() {
  const id = decodeURIComponent(location.hash.slice(1));
  return id === "start" || id === resultsBranchScreen || id === resultsDetailScreen || beforeCall.includes(id) || afterDecline.includes(id) || id === "booking-reserve" || id === "booking-confirmed"
    ? id
    : "start";
}

function navigate(id) {
  location.hash = encodeURIComponent(id);
  render();
  window.scrollTo(0, 0);
}

function startFrom(which) {
  entry = which;
  sessionStorage.setItem("prototypeEntry", which);
  sessionStorage.removeItem("appExplainerReturn");
  if (which === "branch-results") {
    resultsBranchSelection = "therapy";
    sessionStorage.setItem("resultsBranchSelection", resultsBranchSelection);
  }
  navigate(which === "results" || which === "branch-results" ? beforeCall[0] : which === "app" ? afterDecline[0] : beforeCall.at(-1));
}

function nextScreen(id) {
  if (id === beforeCall[0] && entry === "branch-results") return resultsDetailScreen;
  if (id === resultsDetailScreen) return resultsBranchScreen;
  const path = beforeCall.includes(id) ? beforeCall : afterDecline;
  const index = path.indexOf(id);
  return path[index + 1] || "start";
}

function previousScreen(id) {
  if (id === resultsBranchScreen) return resultsDetailScreen;
  if (id === resultsDetailScreen) return beforeCall[0];
  if (id === "booking-reserve") return beforeCall.at(-1);
  if (id === "booking-confirmed") return "booking-reserve";
  if (id === afterDecline[0]) return sessionStorage.getItem("appExplainerReturn") || (entry === "app" ? "start" : beforeCall.at(-1));
  if (id === beforeCall.at(-1) && entry === "call") return "start";
  const path = beforeCall.includes(id) ? beforeCall : afterDecline;
  const index = path.indexOf(id);
  return index > 0 ? path[index - 1] : "start";
}

function button(label, action, variant = "primary") {
  return `<button class="${variant}" data-action="${action}">${label}</button>`;
}

function renderStart() {
  app.innerHTML = `<div class="shell start"><main class="content">
    <h1>A mismatch between users' initial intentions and the therapy-focused outcome</h1>
    <section class="start-section" aria-label="Giving a way out for not ready users">
      <p class="start-section-label">Giving a way out for not ready users at the info-cerebral-right-support-book</p>
      <div class="actions">
        ${button("Start from Results", "start-results")}
        ${button('Start from "Your first..."', "start-call")}
      </div>
    </section>
    <section class="start-section" aria-label="Branching after the results page">
      <p class="start-section-label">Branching after the results page</p>
      <div class="actions">${button("Start", "start-branch-results")}</div>
    </section>
    <section class="start-section" aria-label="Ways to engage users from the app">
      <p class="start-section-label">Ways to engage users from the app</p>
      <div class="actions"><button class="primary" type="button" disabled>See more</button></div>
    </section>
  </main></div>`;
}

function hotspot(control, pageHeight, id) {
  const selected = (answers[id] || []).includes(control.index);
  const style = `left:${(control.x / 478) * 100}%;top:${(control.y / pageHeight) * 100}%;width:${(control.w / 478) * 100}%;height:${(control.h / pageHeight) * 100}%`;
  return `<button class="snapshot-hit${selected ? " is-selected" : ""}" style="${style}" data-action="${control.action}" ${control.index == null ? "" : `data-index="${control.index}"`} aria-label="${control.label.replaceAll('"', '&quot;')}"></button>`;
}

function renderOriginal(id) {
  const screen = originalScreens[id];
  const pageHeight = screen.height;
  const bottom = screen.bottomOffset == null ? "" : `<img class="snapshot-image snapshot-bottom" style="top:${(screen.bottomOffset / pageHeight) * 100}%;clip-path:inset(${((865 - screen.bottomOffset) / 865) * 100}% 0 0 0)" src="assets/original-screens/${id}-bottom.jpg" alt="" aria-hidden="true">`;
  const advance = tapToContinueScreens.has(id)
    ? `<button class="snapshot-advance" data-action="next" aria-label="Continue to the next screen"></button>`
    : "";
  const skip = entry === "results" && beforeCall.includes(id) && id !== beforeCall.at(-1)
    ? `<button class="snapshot-skip" data-action="skip">Skip to the design</button>`
    : "";
  app.innerHTML = `<div class="snapshot-wrap">
    <main class="snapshot-stage" style="aspect-ratio:478 / ${pageHeight}" aria-label="Original ${id.replaceAll('-', ' ')} screen">
      <img class="snapshot-image" src="assets/original-screens/${id}.jpg" alt="" aria-hidden="true">
      ${bottom}${advance}
      ${screen.hotspots.map((control) => hotspot(control, pageHeight, id)).join("")}
      ${skip}
    </main>
  </div>`;
}

function resultsScreenHeader(battery) {
  const shared = "assets/figma/results-branch";
  const assets = "assets/figma/results-split";
  return `<div class="results-split-status" aria-hidden="true">
    <span>9:41</span><span class="results-split-island"></span>
    <span class="results-split-signals"><img src="${shared}/cellular.svg" alt=""><img src="${shared}/wifi.svg" alt=""><img src="${assets}/${battery}" alt=""></span>
  </div>
  <header class="results-split-header">
    <button class="results-split-back" data-action="back" aria-label="Go back"><img src="${assets}/first-back-chevron.svg" alt=""></button>
    <img class="results-split-logo" src="${assets}/first-logo.svg" alt="Inflow">
  </header>`;
}

function resultsSafariBar() {
  return `<div class="results-split-safari" aria-hidden="true">
    <div class="results-split-url"><span class="results-split-text-size">aA</span><span class="results-split-domain"><svg class="results-split-lock" viewBox="0 0 12 14" fill="currentColor"><path d="M3 5V3.5a3 3 0 0 1 6 0V5h.6A1.4 1.4 0 0 1 11 6.4v5.2A1.4 1.4 0 0 1 9.6 13H2.4A1.4 1.4 0 0 1 1 11.6V6.4A1.4 1.4 0 0 1 2.4 5H3Zm1.5 0h3V3.5a1.5 1.5 0 0 0-3 0V5Z"/></svg>getinflow.io</span><svg class="results-split-reload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6v5h-5"/><path d="M19 11a7 7 0 1 0 1 4"/></svg></div>
    <div class="results-split-toolbar">
      <span><svg viewBox="0 0 24 24"><path d="m15 3-9 9 9 9"/></svg></span>
      <span class="results-split-safari-forward"><svg viewBox="0 0 24 24"><path d="m9 3 9 9-9 9"/></svg></span>
      <span><svg viewBox="0 0 24 24"><path d="M5 10v10h14V10M12 16V2m0 0L8 6m4-4 4 4"/></svg></span>
      <span><svg viewBox="0 0 24 24"><path d="M12 21c-2.5-2-5.5-2.7-10-2V4c4.5-.7 7.5 0 10 2 2.5-2 5.5-2.7 10-2v15c-4.5-.7-7.5 0-10 2ZM12 6v15"/></svg></span>
      <span><svg viewBox="0 0 24 24"><rect x="3" y="2" width="15" height="17" rx="2"/><rect x="6" y="5" width="15" height="17" rx="2"/></svg></span>
    </div>
    <span class="results-split-home-indicator"></span>
  </div>`;
}

function renderResultsSummary() {
  const assets = "assets/figma/results-split";
  app.innerHTML = `<div class="results-split-screen results-split-summary">
    ${resultsScreenHeader("first-battery.svg")}
    <main class="results-split-summary-card">
      <h1>You show many traits<br><strong>related to ADHD</strong></h1>
      <div class="results-split-gauge"><img src="${assets}/first-gauge.svg" alt=""></div>
      <strong class="results-split-percent">86%</strong>
      <div class="results-split-legend" aria-label="Trait score ranges">
        <div class="results-split-legend-row"><span class="results-split-legend-chip"><i class="is-low"></i><b>Low</b><span>0–29%</span></span><span class="results-split-legend-chip"><i class="is-moderate"></i><b>Moderate</b><span>30–59%</span></span></div>
        <div class="results-split-legend-row"><span class="results-split-legend-chip"><i class="is-high"></i><b>High</b><span>60–79%</span></span><span class="results-split-legend-chip is-very-high"><i></i><b>Very High</b><span>80–100%</span></span></div>
      </div>
    </main>
    <button class="results-split-cta results-split-learn" data-action="next">Learn more</button>
    ${resultsSafariBar()}
  </div>`;
}

function resultsChallengeCard(icon, title, score, progress, description = "") {
  const assets = "assets/figma/results-split";
  return `<article class="results-split-challenge${description ? " is-primary" : ""}">
    <div class="results-split-challenge-heading"><span class="results-split-challenge-icon"><img src="${assets}/${icon}" alt=""></span><strong>${title}</strong><span class="results-split-challenge-score">${score}</span></div>
    <img class="results-split-progress" src="${assets}/${progress}" alt="">
    ${description ? `<p>${description}</p>` : ""}
  </article>`;
}

function renderResultsDetails() {
  app.innerHTML = `<div class="results-split-screen results-split-details">
    ${resultsScreenHeader("second-battery.svg")}
    <main class="results-split-detail-content">
      <h1>Your biggest challenge</h1>
      ${resultsChallengeCard("second-checklist.svg", "Everyday tasks", "80%", "second-everyday-progress.svg", "You may know what you want to do, but find it hard to start, stay focused or finish")}
      <p class="results-split-comparison">Here's how other areas compare:</p>
      ${resultsChallengeCard("second-relationships.svg", "Relationships", "40%", "second-relationships-progress.svg")}
      ${resultsChallengeCard("second-mental-health.svg", "Mental health", "10%", "second-mental-health-progress.svg")}
    </main>
    <div class="results-split-continue-wrap"><button class="results-split-cta" data-action="next">Continue</button></div>
    ${resultsSafariBar()}
  </div>`;
}

function renderResultsBranch() {
  const base = "assets/figma/results-branch";
  const newBase = "assets/figma/results-branch-v2";
  const therapySelected = resultsBranchSelection === "therapy";
  app.innerHTML = `<div class="results-branch-screen">
    <div class="results-branch-status" aria-hidden="true">
      <div class="results-branch-status-left">9:41</div>
      <div class="results-branch-status-island"></div>
      <div class="results-branch-status-right">
        <img src="${base}/cellular.svg" alt=""><img src="${base}/wifi.svg" alt=""><img src="${newBase}/battery.svg" alt="">
      </div>
    </div>
    <header class="results-branch-header">
      <button class="results-branch-back" data-action="back" aria-label="Go back"><img src="${base}/chevron.svg" alt=""></button>
    </header>
    <main class="results-branch-main">
      <h1>How would you like to<br>continue?</h1>
      <p class="results-branch-subtitle">Lorem</p>
      <div class="results-branch-options" role="group" aria-label="How to continue">
        <button class="results-branch-option${therapySelected ? " is-selected" : ""}" data-action="choose-therapy" aria-pressed="${therapySelected}">
          <span class="results-branch-media results-branch-media-therapy"><img src="${newBase}/therapy-illustration.svg" alt=""></span>
          <span class="results-branch-badge">${therapySelected ? `<img src="${base}/selected-check.svg" alt="">` : ""}</span>
          <span class="results-branch-copy"><strong>Therapy and the app</strong><span class="results-branch-insurance"><img src="${base}/insurance-check.svg" alt="">Accepts insurance</span></span>
        </button>
        <button class="results-branch-option${therapySelected ? "" : " is-selected"}" data-action="choose-app" aria-pressed="${!therapySelected}">
          <span class="results-branch-media results-branch-media-app">
            <span class="results-branch-app-wave results-branch-app-wave-top"><img src="${newBase}/app-wave-top.svg" alt=""></span>
            <img class="results-branch-app-phone" src="${newBase}/app-phone.svg" alt="">
            <img class="results-branch-app-star" src="${newBase}/app-star.svg" alt="">
            <img class="results-branch-app-shapes" src="${newBase}/app-shapes.svg" alt="">
            <span class="results-branch-app-screen"><img src="${newBase}/app-icon-source.png" alt=""></span>
            <span class="results-branch-app-wave results-branch-app-wave-bottom"><img src="${newBase}/app-wave-bottom.svg" alt=""></span>
          </span>
          <span class="results-branch-badge">${therapySelected ? "" : `<img src="${base}/selected-check.svg" alt="">`}</span>
          <span class="results-branch-copy"><strong>Start with the app</strong><span class="results-branch-app-caption">Lorem</span></span>
        </button>
      </div>
    </main>
    <footer class="results-branch-footer">
      ${button("Continue", "continue-results-branch")}
      <span class="results-branch-home-indicator" aria-hidden="true"></span>
    </footer>
  </div>`;
}

function renderAppExplainer() {
  app.innerHTML = `<div class="explainer-shell">
    <header class="explainer-header">
      <button class="explainer-back" data-action="back" aria-label="Go back"><img src="assets/inflow-app-explainer/chevron-left.svg" alt=""></button>
      <button class="explainer-home" data-action="home">Main page</button>
    </header>
    <main class="explainer-main">
      <div class="explainer-hero" aria-label="Screenshots of the Inflow app">
        <img class="explainer-screen" src="assets/inflow-app-explainer/screen-learn.png" alt="Inflow learning modules">
        <img class="explainer-screen explainer-screen-front" src="assets/inflow-app-explainer/screen-lessons.png" alt="Inflow lessons for daily life">
      </div>
      <div class="explainer-copy">
        <h1>Explore the Inflow app</h1>
        <p>Inflow has short ADHD lessons and practical tools you can explore at your own pace</p>
      </div>
    </main>
    <div class="explainer-action">${button("Continue", "next")}</div>
  </div>`;
}

function renderBookingConfirmation() {
  app.innerHTML = `<div class="shell start"><main class="content">
    <p class="eyebrow">Local prototype</p>
    <h1>Your free 15-minute call is booked.</h1>
    <p>No appointment was created.</p>
    <div class="actions">${button("Back to start", "home")}</div>
  </main></div>`;
}

function render() {
  const id = currentScreen();
  const splitResults = (id === beforeCall[0] && entry === "branch-results") || id === resultsDetailScreen;
  document.body.classList.toggle("original-preview", Boolean(originalScreens[id]) && !splitResults);
  document.body.classList.toggle("results-split-preview", splitResults);
  document.body.classList.toggle("results-branch-preview", id === resultsBranchScreen);
  if (id === "start") renderStart();
  else if (id === beforeCall[0] && entry === "branch-results") renderResultsSummary();
  else if (id === resultsDetailScreen) renderResultsDetails();
  else if (id === resultsBranchScreen) renderResultsBranch();
  else if (id === afterDecline[0]) renderAppExplainer();
  else if (id === "booking-confirmed") renderBookingConfirmation();
  else if (originalScreens[id]) renderOriginal(id);
  else renderStart();
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const id = currentScreen();
  if (action === "home") navigate("start");
  else if (action === "back") navigate(previousScreen(id));
  else if (action === "skip") navigate(beforeCall.at(-1));
  else if (action === "start-results") startFrom("results");
  else if (action === "start-call") startFrom("call");
  else if (action === "start-branch-results") startFrom("branch-results");
  else if (action === "choose-therapy" || action === "choose-app") {
    resultsBranchSelection = action === "choose-app" ? "app" : "therapy";
    sessionStorage.setItem("resultsBranchSelection", resultsBranchSelection);
    renderResultsBranch();
  }
  else if (action === "continue-results-branch") {
    if (resultsBranchSelection === "app") {
      sessionStorage.setItem("appExplainerReturn", resultsBranchScreen);
      navigate(afterDecline[0]);
    } else navigate(beforeCall[1]);
  }
  else if (action === "decline") {
    sessionStorage.setItem("appExplainerReturn", beforeCall.at(-1));
    navigate(afterDecline[0]);
  }
  else if (action === "book") navigate("booking-reserve");
  else if (action === "confirm-booking") navigate("booking-confirmed");
  else if (action === "next") navigate(nextScreen(id));
  else if (action === "select") {
    if (multiSelectScreens.has(id)) {
      const index = Number(target.dataset.index);
      const selected = answers[id] || [];
      answers[id] = selected.includes(index) ? selected.filter((item) => item !== index) : [...selected, index];
      render();
    } else navigate(nextScreen(id));
  }
});

window.addEventListener("hashchange", render);
render();
