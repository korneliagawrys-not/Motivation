# Inflow secondary flow prototype

A standalone clickthrough of the secondary path from the free 15-minute call invitation. The Results, care, and journey screens use visual captures from the original Insurance project. The “Explore the Inflow app” screen follows the supplied Figma design. The start page groups three active entry points and a disabled app engagement option:

- **Start from Results:** walk through the care-option screens before reaching the call invitation.
- **Start from "Your first...":** begin at the call invitation.
- **Start** under “Branching after the results page”: begin at Results, then choose “Therapy and the app” or “Start with the app” on the Figma-based choice screen. Therapy continues through the existing care screens; the app option opens “Explore the Inflow app” and then the journey questions.
- **See more:** currently disabled under “Ways to engage users from the app.”

On the call page, **I'm not interested for now** opens the Inflow app explanation. **Continue** then follows the journey questions from `question-busy-journey` through `info-start-today`. The internal main-page control on each captured screen returns to the start page.

The Results path includes **Skip to the design** on its pre-call screens. It jumps directly to the free 15-minute call invitation.

Open `index.html` in a browser to review the flow. Clickable areas are placed over the captured screens to preserve the prototype navigation. Animated and long screens are represented by still captures. The booking confirmation remains a local mock; no appointment is created. There is no build step, backend call, private app source, or production data in this repository.
