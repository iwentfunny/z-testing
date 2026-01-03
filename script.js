// ===============================
// TIER POINTS CALC
// ===============================
const TIER_POINTS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 10, LT3: 6,
  HT4: 4,  LT4: 3,
  HT5: 2,  LT5: 1
};

function calculatePoints(player) {
  return Object.values(player.tiers)
    .reduce((total, tier) => total + (TIER_POINTS[tier] || 0), 0);
}

function getRankTitle(points) {
  if (points >= 400) return "Combat Grandmaster";
  if (points >= 250) return "Combat Master";
  if (points >= 100) return "Combat Ace";
  if (points >= 50)  return "Combat Specialist";
  if (points >= 20)  return "Combat Cadet";
  return "Combat Novice";
}

// ===============================
// LOAD PLAYERS
// ===============================
fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    // Precalculate points & overall
    players.forEach(p => {
      p.points = calculatePoints(p);
    });

    // Sort overall by points descending
    players.sort((a,b)=> b.points - a.points);
    players.forEach((p,i)=> p.overall = i+1);

    renderOverall(players);
    setupSearch(players);
  });

// ===============================
// OVERALL RENDER
// ===============================
function renderOverall(players) {
  const list = document.getElementById("overall-list");
  if (!list) return;

  players.slice(0,50).forEach(p => {
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <span>${p.overall}</span>
      <span>${p.name}</span>
      <span>${getRankTitle(p.points)} (${p.points} pts)</span>
      <span>${p.region}</span>
      <span>${Object.entries(p.tiers)
        .map(t=>`${t[1]}: ${t[0]}`).join(", ")}</span>
    `;
    div.addEventListener("click",()=>showModal(p));
    list.appendChild(div);
  });
}

// ===============================
// PLAYER MODAL
// ===============================
function showModal(p) {
  const modal = document.getElementById("player-modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <strong>${p.name}</strong><br>
    ${getRankTitle(p.points)}<br>
    ${p.region}<br>
    Overall: ${p.overall} (${p.points} points)<br><br>
    <strong>Tiers:</strong><br>
    ${Object.entries(p.tiers).map(t=>`${t[0]}: ${t[1]}`).join("<br>")}
  `;

  modal.classList.remove("hidden");
}

// Close modal
document.getElementById("close-modal").addEventListener("click",()=>{
  document.getElementById("player-modal").classList.add("hidden");
});

// Close modal when clicking outside content
document.getElementById("player-modal").addEventListener("click",(e)=>{
  if(e.target.id==="player-modal") e.target.classList.add("hidden");
});

// ===============================
// SEARCH
// ===============================
function setupSearch(players) {
  const input = document.getElementById("search");
  if(!input) return;

  input.addEventListener("change", e=>{
    const name = e.target.value.toLowerCase();
    const found = players.find(p=>p.name.toLowerCase()===name);
    if(found) showModal(found);
  });
}
