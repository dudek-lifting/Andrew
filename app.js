const programBlocks = {
  1: { 
    label: "Foundation", 
    days: { 
      1: { title: "Push & Quads (Seated)", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Cable Tricep Pushdowns"] }, 
      2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"] }, 
      3: { title: "Stability & Full Body", lifts: ["Smith Machine Squats","Pec Deck Machine","Machine Assisted Row","DB Lateral Raises","Seated Calf Raises"] } 
    } 
  },
  2: { 
    label: "Consistency", 
    days: { 
      1: { title: "Push & Quads", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Cable Tricep Pushdowns"] }, 
      2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"] }, 
      3: { title: "Stability & Full Body", lifts: ["Smith Machine Squats","Pec Deck Machine","Machine Assisted Row","DB Lateral Raises","Seated Calf Raises"] } 
    } 
  },
  3: { 
    label: "Growth", 
    days: { 
      1: { title: "Push & Quads", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Cable Tricep Pushdowns"] }, 
      2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"] }, 
      3: { title: "Stability & Full Body", lifts: ["Smith Machine Squats","Pec Deck Machine","Machine Assisted Row","DB Lateral Raises","Seated Calf Raises"] } 
    } 
  }
};

let currentUser = "Andrew";
const phaseTabs = document.getElementById("phaseTabs");
const phaseContent = document.getElementById("phaseContent");

function getKey(block, day, lift) {
  return `${currentUser}-b${block}-d${day}-${lift}`;
}

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
    card.className = "card p-3 mb-3";
    
    const liftsHtml = day.lifts.map(lift => {
      const isDone = localStorage.getItem(getKey(blockId, dayNum, lift)) === "done";
      return `
        <div class="lift-row ${isDone ? 'completed' : ''}" data-lift="${lift}">
          <input type="checkbox" ${isDone ? 'checked' : ''}>
          <span>${lift}</span>
          <input type="number" class="weight-input" placeholder="lbs" value="${localStorage.getItem(getKey(blockId, dayNum, lift + '-weight')) || ''}">
          <input type="number" class="reps-input" placeholder="reps" value="${localStorage.getItem(getKey(blockId, dayNum, lift + '-reps')) || ''}">
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
          <span style="color:var(--silver);">Incline Treadmill Walk (20 min)</span>
      </div>
    `;

    card.addEventListener('change', (e) => {
      const row = e.target.closest('.lift-row');
      if (!row) return;
      const liftName = row.dataset.lift;
      if (e.target.type === 'checkbox') {
        e.target.checked ? localStorage.setItem(getKey(blockId, dayNum, liftName), "done") : localStorage.removeItem(getKey(blockId, dayNum, liftName));
        row.classList.toggle("completed", e.target.checked);
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

