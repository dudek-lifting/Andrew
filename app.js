/* ============================
   PROGRAM DATA & COACH TIPS
============================ */
const programBlocks = {
  1: { label: "Foundation", days: { 
    1: { title: "Push & Quads (Seated)", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Cable Tricep Pushdowns"], tip: "Hey Andrew, on the Leg Press, place your feet higher on the platform. Being 6'5\", this will take the pressure off your knees and put it on your glutes/quads." }, 
    2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"], tip: "For the Lat Pulldowns, focus on pulling your elbows to your ribs, not pulling the bar with your hands. It’ll help grow that back width." }, 
    3: { title: "Stability & Full Body", lifts: ["Smith Machine Squats","Pec Deck Machine","Machine Assisted Row","DB Lateral Raises","Seated Calf Raises"], tip: "On the Smith Machine, walk your feet about 6 inches forward before you squat. It helps keep your back vertical so your frame stays supported." } 
  }},
  2: { label: "Consistency", days: { 
    1: { title: "Push & Quads", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Cable Tricep Pushdowns"], tip: "You're getting stronger. Try to increase the weight by just 5lbs on the Chest Press this week. Small wins add up." }, 
    2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"], tip: "Keep your chest tall on those Seated Rows. Don't let the weight pull your shoulders forward—stay in control." }, 
    3: { title: "Stability & Full Body", lifts: ["Smith Machine Squats","Pec Deck Machine","Machine Assisted Row","DB Lateral Raises","Seated Calf Raises"], tip: "Slow down the reps today. 3 seconds down, 1 second up. Control the weight, don't let it control you." } 
  }},
  3: { label: "Growth", days: { 
    1: { title: "Push & Quads", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Cable Tricep Pushdowns"], tip: "Foundation is built. Now we're just refining. Keep that intensity high on the incline walk!" }, 
    2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"], tip: "Focus on the squeeze at the back of the row. You've got this, big bro." }, 
    3: { title: "Stability & Full Body", lifts: ["Smith Machine Squats","Pec Deck Machine","Machine Assisted Row","DB Lateral Raises","Seated Calf Raises"], tip: "Last workout of the block. Finish strong and then let's talk about the next steps for your health." } 
  }}
};

/* ============================
   STATE MANAGEMENT
============================ */
let currentUser = "Andrew";
const phaseTabs = document.getElementById("phaseTabs");
const phaseContent = document.getElementById("phaseContent");

function getKey(block, day, lift) {
  return `${currentUser}-b${block}-d${day}-${lift}`;
}

/* ============================
   RENDER LOGIC
============================ */
function renderTabs() {
  phaseTabs.innerHTML = "";
  const lastBlock = localStorage.getItem(`${currentUser}-activeBlock`) || "1";

  Object.entries(programBlocks).forEach(([id, data]) => {
    const btn = document.createElement("button");
    btn.className = `nav-link ${id === lastBlock ? "active" : ""}`;
    btn.textContent = data.label;
    btn.onclick = () => {
      document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem(`${currentUser}-activeBlock`, id);
      renderBlock(id);
    };
    phaseTabs.appendChild(btn);
  });
  renderBlock(lastBlock);
}

function renderBlock(blockId) {
  phaseContent.innerHTML = "";
  const blockData = programBlocks[blockId];

  Object.entries(blockData.days).forEach(([dayNum, day]) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-4";
    
    const liftsHtml = day.lifts.map(lift => {
      const isDone = localStorage.getItem(getKey(blockId, dayNum, lift)) === "done";
      const weight = localStorage.getItem(getKey(blockId, dayNum, lift + '-weight')) || "";
      const reps = localStorage.getItem(getKey(blockId, dayNum, lift + '-reps')) || "";
      
      return `
        <div class="lift-row ${isDone ? 'completed' : ''}" data-lift="${lift}">
          <input type="checkbox" ${isDone ? 'checked' : ''}>
          <span>${lift}</span>
          <input type="number" class="weight-input" placeholder="lbs" value="${weight}">
          <input type="number" class="reps-input" placeholder="reps" value="${reps}">
        </div>
      `;
    }).join("");

    const finisherKey = getKey(blockId, dayNum, "InclineWalk");
    const finisherDone = localStorage.getItem(finisherKey) === "done";
    
    card.innerHTML = `
      <div class="card-title">Workout ${dayNum}: ${day.title}</div>
      ${liftsHtml}
      <div class="lift-row mt-3 pt-2 border-top border-secondary ${finisherDone ? 'completed' : ''}" data-lift="InclineWalk">
          <input type="checkbox" ${finisherDone ? 'checked' : ''}>
          <span style="color:var(--silver); font-weight:bold;">Incline Treadmill Walk (20 min)</span>
      </div>
      <div class="coach-tip-box mt-3">
        <strong>Brotherly Advice:</strong><br>
        <small>${day.tip}</small>
      </div>
    `;

    card.addEventListener('change', (e) => {
      const row = e.target.closest('.lift-row');
      if (!row) return;
      const liftName = row.dataset.lift;

      if (e.target.type === 'checkbox') {
        const isChecked = e.target.checked;
        isChecked ? localStorage.setItem(getKey(blockId, dayNum, liftName), "done") : localStorage.removeItem(getKey(blockId, dayNum, liftName));
        row.classList.toggle("completed", isChecked);
      } else {
        const type = e.target.classList.contains('weight-input') ? '-weight' : '-reps';
        localStorage.setItem(getKey(blockId, dayNum, liftName + type), e.target.value);
      }
    });

    phaseContent.appendChild(card);
  });
}

document.getElementById("resetBtn").onclick = () => { if(confirm("Reset all blueprint data?")) { localStorage.clear(); location.reload(); }};

renderTabs();

