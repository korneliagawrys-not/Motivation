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

function currentScreen() {
  const id = decodeURIComponent(location.hash.slice(1));
  return id === "start" || beforeCall.includes(id) || afterDecline.includes(id) || id === "booking-reserve" || id === "booking-confirmed"
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
  navigate(which === "results" ? beforeCall[0] : which === "app" ? afterDecline[0] : beforeCall.at(-1));
}

function nextScreen(id) {
  const path = beforeCall.includes(id) ? beforeCall : afterDecline;
  const index = path.indexOf(id);
  return path[index + 1] || "start";
}

function previousScreen(id) {
  if (id === "booking-reserve") return beforeCall.at(-1);
  if (id === "booking-confirmed") return "booking-reserve";
  if (id === afterDecline[0]) return entry === "app" ? "start" : beforeCall.at(-1);
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
    <p class="eyebrow">Inflow app secondary flow</p>
    <h1>A mismatch between users' initial intentions and the therapy-focused outcome</h1>
    <section class="start-section" aria-label="Giving a way out for not ready users">
      <p class="start-section-label">Giving a way out for not ready users at the info-cerebral-right-support-book</p>
      <div class="actions">
        ${button("Start from Results", "start-results")}
        ${button('Start from "Your first step: a free 15-minute call"', "start-call")}
      </div>
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
  document.body.classList.toggle("original-preview", Boolean(originalScreens[id]));
  if (id === "start") renderStart();
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
  else if (action === "decline") navigate(afterDecline[0]);
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
