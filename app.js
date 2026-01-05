/* ============================
   PROGRAM DATA & COACH TIPS
============================ */
const programBlocks = {
  1: { 
    label: "Foundation", 
    days: { 
      1: { title: "Push & Quads", lifts: ["Seated Chest Press","Seated Leg Press","Machine Overhead Press","Leg Extension Machine","Tricep Rope Pushdowns"], tip: "Hey Andrew, focus on seat height. Your hands should be level with your mid-chest on that press. Keep your back glued to the pad." }, 
      2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Wide)","Seated Cable Row","Seated Leg Curl","DB Bicep Curls","Cable Face Pulls"], tip: "On the Lat Pulldown, don't lean back too far. Stay tall and pull the bar to your upper chest. Think about pulling with your elbows." }, 
      3: { title: "Full Body Stability", lifts: ["Smith Machine Squat","Pec Deck Machine","Machine Row (Chest Supported)","DB Lateral Raise","Seated Calf Raise"], tip: "On the Smith Squat, keep your feet out in front of you so your knees don't go past your toes. This protects your joints at 6'5\"." } 
    } 
  },
  2: { 
    label: "Consistency", 
    days: { 
      1: { title: "Push & Quads", lifts: ["Machine Incline Press","Seated Leg Press","DB Shoulder Press (Seated)","Leg Extension Machine","Tricep Straight Bar Pushdowns"], tip: "The incline press hits the upper chest. At your height, a big upper chest helps fill out your frame. Control the weight on the way down." }, 
      2: { title: "Pull & Hamstrings", lifts: ["Machine Lat Pulldown (Neutral)","Seated Cable Row","Standing Leg Curl","Hammer Curls","Cable Face Pulls"], tip: "The Neutral Grip (palms facing each other) is easier on the shoulders. Squeeze your shoulder blades together at the bottom." }, 
      3: { title: "Full Body Stability", lifts: ["Smith Machine Squat","Pec Deck (Slow Tempo)","One-Arm Machine Row","DB Lateral Raise","Standing Calf Raise"], tip: "One-arm rows help even out any strength differences. Focus on a deep stretch in the lat before pulling back." } 
    } 
  },
  3: { 
    label: "Growth", 
    days: { 
      1: { title: "Push & Quads", lifts: ["Seated Chest Press","Smith Machine Split Squat","Machine Overhead Press","Leg Extension Machine","Tricep Overhead Extension (Cable)"], tip: "The split squat is tough but great for balance. Keep your front shin vertical and use the Smith Machine for stability." }, 
      2: { title: "Pull & Hamstrings", lifts: ["Lat Pulldown (Close Grip)","Seated Row (Wide Grip)","Seated Leg Curl","DB Incline Curls","Cable Face Pulls"], tip: "Incline curls stretch the bicep more—keep your elbows pinned to your sides and don't swing the weights." }, 
      3: { title: "Full Body Stability", lifts: ["Leg Press (Narrow Stance)","Pec Deck Machine","Lat Pulldown (Underhand)","DB Lateral Raise","Seated Calf Raise"], tip: "Underhand pulldowns use more biceps. Grip it like you're doing a chin-up and keep your chest facing the ceiling." } 
    } 
  }
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
        <strong>Brotherly Advice:</strong>
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


