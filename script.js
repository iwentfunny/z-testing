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

fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    renderOverall(players);
    setupSearch(players);
  });

function renderOverall(players) {
  const list = document.getElementById("overall-list");
  if (!list) return;

  players
    .sort((a,b) => calculatePoints(b) - calculatePoints(a))
    .slice(0, 50)
    .forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `
        <span>${i+1}</span>
        <span>${p.name}</span>
        <span>${getRankTitle(calculatePoints(p))} (${calculatePoints(p)} pts)</span>
        <span>${p.region || 'N/A'}</span>
        <span>${Object.entries(p.tiers).map(t => `${t[1]}: ${t[0]}`).join(", ")}</span>
      `;
      div.onclick = () => openPlayer(p);
      list.appendChild(div);
    });
}

function openPlayer(p) {
  const modal = document.getElementById("player-modal");
  const body = document.getElementById("modal-body");
  
  body.innerHTML = `
    <strong>${p.name}</strong><br>
    Rank: ${getRankTitle(calculatePoints(p))}<br>
    Region: ${p.region || 'N/A'}<br>
    Overall: ${calculatePoints(p)} pts<br><br>
    <strong>Tiers:</strong><br>
    ${Object.entries(p.tiers).map(t => `${t[0]}: ${t[1]}`).join("<br>")}
  `;
  
  modal.classList.remove("hidden");
}

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("player-modal").classList.add("hidden");
});

document.getElementById("player-modal").addEventListener("click", (e) => {
  if (e.target.id === "player-modal") {
    document.getElementById("player-modal").classList.add("hidden");
  }
});

function setupSearch(players) {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("change", e => {
    const found = players.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
    if (found) openPlayer(found);
  });
}

function getRankTitle(points) {
  if (points >= 400) return "Combat Grandmaster";
  if (points >= 250) return "Combat Master";
  if (points >= 100) return "Combat Ace";
  if (points >= 50)  return "Combat Specialist";
  if (points >= 20)  return "Combat Cadet";
  return "Combat Novice";
}
