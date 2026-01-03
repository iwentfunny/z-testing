// ===============================
// TIER POINTS & RANKS
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
// RENDER OVERALL PAGE
// ===============================
fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    renderOverall(players);
    setupSearch(players);
    renderGamemode(players);
  });

function renderOverall(players) {
  const list = document.getElementById("overall-list");
  if (!list) return;

  players
    .sort((a, b) => a.overall - b.overall)
    .slice(0, 50)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `
        <span>${p.overall}</span>
        <span>${p.name}</span>
        <span>${getRankTitle(calculatePoints(p))} (${calculatePoints(p)} pts)</span>
        <span>${p.region}</span>
        <span>${Object.entries(p.tiers)
          .map(t => `${t[1]}: ${t[0]}`)
          .join(", ")}</span>
      `;
      div.onclick = () => showPlayerModal(p);
      list.appendChild(div);
    });
}

// ===============================
// SEARCH
// ===============================
function setupSearch(players) {
  const input = document.getElementById("search");
  if (!input) return;
  input.addEventListener("change", e => {
    const found = players.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
    if (found) showPlayerModal(found);
  });
}

// ===============================
// GAMEMODE TIERS
// ===============================
function renderGamemode(players) {
  const select = document.getElementById("mode-select");
  if (!select) return;

  function renderMode(mode) {
    for (let i = 1; i <= 5; i++)
      document.querySelector(`#t${i} .tier-list`).innerHTML = "";

    const modePlayers = players.filter(p => p.tiers[mode]);
    modePlayers.forEach(p => {
      const tier = p.tiers[mode];
      const tierNumber = parseInt(tier[1]);
      const badge = `<span class="badge ${tier}" onclick='showPlayerModal(${JSON.stringify(p)})'>${tier} ${p.name}</span>`;
      document.querySelector(`#t${tierNumber} .tier-list`).innerHTML += badge;
    });
  }

  renderMode(select.value);
  select.addEventListener("change", e => renderMode(e.target.value));
}

// ===============================
// PLAYER MODAL
// ===============================
function showPlayerModal(player) {
  const points = calculatePoints(player);
  const modal = document.getElementById("player-modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <h2>${player.name}</h2>
    <p><strong>Rank:</strong> ${getRankTitle(points)}</p>
    <p><strong>Region:</strong> ${player.region}</p>
    <p><strong>Overall:</strong> ${player.overall}</p>
    <p><strong>Total Points:</strong> ${points}</p>
    <p><strong>Tiers:</strong></p>
    <div>
      ${Object.entries(player.tiers)
        .map(([mode, tier]) => `<span class="badge ${tier}">${tier} ${mode}</span>`)
        .join("")}
    </div>
  `;

  modal.classList.remove("hidden");
  document.getElementById("close-modal").onclick = () => modal.classList.add("hidden");
  window.onclick = e => { if (e.target === modal) modal.classList.add("hidden"); };
}
