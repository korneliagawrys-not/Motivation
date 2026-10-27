// Self-contained, low-fidelity review flow. No production APIs or user data.
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

const screens = {
  "question-explain-yourself": {
    title: "When things feel overwhelming, is it hard to explain what you need?",
    options: ["Often", "Sometimes", "Rarely"],
  },
  "transition-explain-yourself": {
    title: "You don't have to explain everything at once",
    text: "Support can start with one conversation and build from there.",
  },
  "question-support-system": {
    title: "Do you feel you have the support you need?",
    options: ["Not yet", "Some of the time", "Yes"],
  },
  "transition-feeling-understood": {
    title: "Feeling understood matters",
    text: "The right kind of support can make the next step feel easier.",
  },
  "question-self-care": {
    title: "What gets in the way of taking care of yourself?",
    options: ["Finding time", "Knowing where to start", "Sticking with it"],
  },
  "transition-loading-patterns": {
    title: "Looking at your patterns",
    text: "We're putting together a clearer picture of what support may fit.",
  },
  "info-therapy-data": {
    title: "Support can be tailored to you",
    text: "Therapy offers a space to work through everyday ADHD challenges with someone who understands them.",
  },
  "question-strategies": {
    title: "What would you most like help with?",
    options: ["Focus", "Emotions", "Relationships", "Daily routines"],
  },
  "transition-specialized-therapy": {
    title: "Care that meets you where you are",
    text: "Your next step can reflect what feels most relevant to your life.",
  },
  "question-better-future": {
    title: "What would a better day look like for you?",
    options: ["More focus", "Less stress", "More confidence"],
  },
  "transition-loading-plan": {
    title: "Bringing your plan together",
    text: "Here are the options you can explore next.",
  },
  "partnership-cerebral-2": {
    title: "More ways to get support",
    text: "Inflow and Cerebral can help you explore tools and care that fit your needs.",
  },
  "question-reason-care-2": {
    title: "What brings you here today?",
    options: ["I want to understand my options", "I have questions about care", "I'm ready for support"],
  },
  "info-therapy-benefits": {
    title: "What therapy could help with",
    text: "Talk through challenges, practice strategies, and find support that feels personal.",
  },
  "question-support-type-2": {
    title: "What kind of support sounds most useful?",
    options: ["A person to talk to", "Practical tools", "I'm not sure yet"],
  },
  "info-care-coordinator": {
    title: "You don't have to figure this out alone",
    text: "A Care Coordinator can answer questions and help you understand your next steps.",
  },
  "question-busy-journey": {
    title: "How busy are you on an average day?",
    options: ["Very busy, I have almost no downtime", "Busy, but I find moments to relax", "Not too busy, my schedule's flexible"],
  },
  "question-time-of-day-journey": {
    title: "What time of day do you usually feel most focused?",
    options: ["Morning", "Afternoon", "Evening"],
  },
  "question-make-progress-journey": {
    title: "How fast would you like to make progress?",
    options: ["As fast as possible", "Slow and steady", "Somewhere in between"],
  },
  "info-minutes-testimonial-journey": {
    title: "A few minutes can be a starting point",
    text: "Small, manageable steps can fit into a busy day.",
  },
  "question-see-yourself-journey": {
    title: "When you imagine taking control of your life, how do you see yourself?",
    hint: "Choose as many as you like",
    multiple: true,
    options: ["Getting things done with ease", "Building habits that stick", "Feeling confident in myself", "Focusing without distractions", "Having better relationships"],
  },
  "info-personalizing-journey": {
    title: "Personalizing your journey",
    text: "Let's choose a few topics to begin with.",
  },
  "question-pick-journey": {
    title: "Pick your journey",
    hint: "Choose any 3 to start. You can switch later.",
    multiple: true,
    required: 3,
    options: ["Emotional resilience", "Burnout recovery", "Healthy relationships", "Beat procrastination", "Time mastery", "Morning focus"],
  },
  "question-how-much-time-journey": {
    title: "How much time do you want to invest in yourself daily?",
    options: ["5 minutes", "10 minutes", "15 minutes or more"],
  },
};

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
  navigate(which === "results" ? beforeCall[0] : beforeCall.at(-1));
}

function nextScreen(id) {
  const path = beforeCall.includes(id) ? beforeCall : afterDecline;
  const index = path.indexOf(id);
  return path[index + 1] || "start";
}

function previousScreen(id) {
  if (id === "booking-reserve") return beforeCall.at(-1);
  if (id === "booking-confirmed") return "booking-reserve";
  if (id === afterDecline[0]) return beforeCall.at(-1);
  const path = beforeCall.includes(id) ? beforeCall : afterDecline;
  const index = path.indexOf(id);
  if (id === beforeCall.at(-1) && entry === "call") return "start";
  return index > 0 ? path[index - 1] : "start";
}

function button(label, action, variant = "primary", disabled = false) {
  return `<button class="${variant}" data-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>`;
}

function frame(id, inner, actions = "") {
  const path = beforeCall.includes(id) ? beforeCall : afterDecline;
  const position = path.indexOf(id);
  const progress = position >= 0 ? `Step ${position + 1} of ${path.length}` : "";
  return `<div class="shell">
    <header class="top"><button data-action="back" aria-label="Go back">← Back</button><span class="brand">${id === "insurance-prototype-inflow-app" || afterDecline.includes(id) ? "Inflow" : "Cerebral"}</span><button data-action="home">Main page</button></header>
    <div class="progress">${progress}</div>
    <main class="content">${inner}</main>
    ${actions ? `<footer class="actions">${actions}</footer>` : ""}
  </div>`;
}

function renderStart() {
  app.innerHTML = `<div class="shell start"><main class="content">
    <p class="eyebrow">Inflow app secondary flow</p>
    <h1>Choose where to start</h1>
    <div class="actions">
      ${button("Start from Results", "start-results")}
      ${button("Start from Your first step: a free 15-minute call", "start-call")}
    </div>
  </main></div>`;
}

function renderResults() {
  app.innerHTML = frame(beforeCall[0], `<p class="eyebrow">Your results</p>
    <h1>You show many ADHD-related traits.</h1>
    <div class="card"><div class="score">69%</div><p>Illustrative result for this prototype</p></div>
    <h2>How ADHD traits may be impacting your life</h2>
    <ul class="checks"><li>Productivity</li><li>Relationships</li><li>Mental health</li></ul>
    <p class="small">This prototype is for flow review and is not a medical assessment.</p>`,
    button("Discover your care options", "next"));
}

function renderCall() {
  app.innerHTML = frame(beforeCall.at(-1), `<p class="eyebrow">Your next step</p>
    <h1>Your first step: a free 15-minute call to get everything set up</h1>
    <p>A Care Coordinator can walk you through your options so you feel supported and confident about what comes next.</p>
    <div class="hero-placeholder">Call illustration placeholder</div>
    <ul class="checks"><li>Understand what your insurance covers</li><li>Ask questions about care</li><li>Decide if you want to continue</li></ul>
    <div class="card"><strong>No commitment to continue after the call.</strong></div>`,
    button("See available times", "book") + button("I'm not interested for now", "decline", "secondary"));
}

function renderAppExplainer() {
  app.innerHTML = frame(afterDecline[0], `<p class="eyebrow">Another way to start</p>
    <div class="hero-placeholder">Inflow app preview</div>
    <h1>Explore the Inflow app</h1>
    <p>Inflow has short ADHD lessons and practical tools you can explore at your own pace.</p>`,
    button("Continue", "next"));
}

function renderQuestion(id, screen) {
  const selected = answers[id] || [];
  const required = screen.required || 1;
  const choices = screen.options.map((label, index) =>
    `<button class="option" data-action="select" data-index="${index}" aria-pressed="${selected.includes(index)}">${label}</button>`).join("");
  app.innerHTML = frame(id, `<p class="eyebrow">${beforeCall.includes(id) ? "Your care options" : "Journey personalization"}</p>
    <h1>${screen.title}</h1>${screen.hint ? `<p>${screen.hint}</p>` : ""}
    <div class="options">${choices}</div>`,
    button("Continue", "next", "primary", selected.length < required));
}

function renderInfo(id, screen) {
  app.innerHTML = frame(id, `<p class="eyebrow">${beforeCall.includes(id) ? "Your care options" : "Your Inflow journey"}</p>
    <div class="hero-placeholder">Illustration placeholder</div>
    <h1>${screen.title}</h1><p>${screen.text}</p>`, button("Continue", "next"));
}

function renderCommitment() {
  const checked = answers["question-commitment"] === true;
  app.innerHTML = frame("question-commitment", `<p class="eyebrow">Journey personalization</p>
    <h1>Real change starts with a few minutes a day.</h1>
    <div class="hero-placeholder">Commitment illustration placeholder</div>
    <button class="option" data-action="commit" aria-pressed="${checked}">✓ I'll try Inflow for 5 days</button>`,
    button("Continue", "next", "primary", !checked));
}

function renderEnd() {
  app.innerHTML = frame("info-start-today", `<p class="eyebrow">Your Inflow journey</p>
    <div class="hero-placeholder">Journey illustration placeholder</div>
    <h1>Let's start your first journey today.</h1>
    <p>Just a few minutes can be a meaningful start. You've got this.</p>`,
    button("Back to start", "home"));
}

function renderBooking(id) {
  if (id === "booking-confirmed") {
    app.innerHTML = frame(id, `<p class="eyebrow">Call booked</p><h1>Your free 15-minute call is booked.</h1><p>This is a prototype confirmation. No appointment was created.</p>`, button("Back to start", "home"));
    return;
  }
  app.innerHTML = frame(id, `<p class="eyebrow">Choose a time</p><h1>Choose a date and time for your free 15-minute call</h1>
    <p class="small">Sample times for this prototype only.</p>
    <div class="options"><button class="option" data-action="confirm-booking">Tomorrow · 10:30 AM</button><button class="option" data-action="confirm-booking">Thursday · 2:00 PM</button></div>`);
}

function render() {
  const id = currentScreen();
  if (id === "start") renderStart();
  else if (id === beforeCall[0]) renderResults();
  else if (id === beforeCall.at(-1)) renderCall();
  else if (id === afterDecline[0]) renderAppExplainer();
  else if (id === "question-commitment") renderCommitment();
  else if (id === "info-start-today") renderEnd();
  else if (id === "booking-reserve" || id === "booking-confirmed") renderBooking(id);
  else if (screens[id]?.options) renderQuestion(id, screens[id]);
  else if (screens[id]) renderInfo(id, screens[id]);
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const id = currentScreen();
  if (action === "home") navigate("start");
  else if (action === "back") navigate(previousScreen(id));
  else if (action === "start-results") startFrom("results");
  else if (action === "start-call") startFrom("call");
  else if (action === "decline") navigate(afterDecline[0]);
  else if (action === "book") navigate("booking-reserve");
  else if (action === "confirm-booking") navigate("booking-confirmed");
  else if (action === "next") navigate(nextScreen(id));
  else if (action === "commit") { answers[id] = !answers[id]; render(); }
  else if (action === "select") {
    const index = Number(target.dataset.index);
    const selected = answers[id] || [];
    if (screens[id].multiple) {
      answers[id] = selected.includes(index)
        ? selected.filter((item) => item !== index)
        : selected.length < (screens[id].required || Infinity) ? [...selected, index] : selected;
    } else answers[id] = [index];
    render();
  }
});

window.addEventListener("hashchange", render);
render();
