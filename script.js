// ===============================
// TIER POINTS
// ===============================
const TIER_POINTS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 10, LT3: 6,
  HT4: 4,  LT4: 3,
  HT5: 2,  LT5: 1
};

// Calculate total points for a player
function calculatePoints(player) {
  return Object.values(player.tiers)
    .reduce((total, tier) => total + (TIER_POINTS[tier] || 0), 0);
}

// Get rank title based on points
function getRankTitle(points) {
  if (points >= 400) return "Combat Grandmaster";
  if (points >= 250) return "Combat Master";
  if (points >= 100) return "Combat Ace";
  if (points >= 50)  return "Combat Specialist";
  if (points >= 20)  return "Combat Cadet";
  return "Combat Novice";
}

// ===============================
// FETCH PLAYERS.JSON
// ===============================
fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    renderOverall(players);
    setupSearch(players);
    setupGamemode(players);
  });

// ===============================
// RENDER OVERALL LIST
// ===============================
function renderOverall(players) {
  const list = document.getElementById("overall-list");
  if (!list) return;

  // Sort by total points descending
  players
    .sort((a, b) => calculatePoints(b) - calculatePoints(a))
    .slice(0, 50)
    .forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `
        <span>${i + 1}</span>
        <span>${p.name}</span>
        <span>${getRankTitle(calculatePoints(p))} (${calculatePoints(p)} pts)</span>
        <span>${p.region || 'N/A'}</span>
        <span>${Object.entries(p.tiers).map(t => `${t[1]}: ${t[0]}`).join(", ")}</span>
      `;
      div.onclick = () => openPlayer(p); // openPlayer overridden below
      list.appendChild(div);
    });
}

// ===============================
// SEARCH FUNCTIONALITY
// ===============================
function setupSearch(players) {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("change", e => {
    const name = e.target.value.toLowerCase();
    const found = players.find(p => p.name.toLowerCase() === name);
    if (found) openPlayer(found); // openPlayer overridden below
  });
}

// ===============================
// GAMEMODE TIER RENDERING
// ===============================
function setupGamemode(players) {
  const select = document.getElementById("mode-select");
  if (!select) return;

  function renderMode(mode) {
    // Clear tier lists
    for (let i = 1; i <= 5; i++) {
      document.querySelector(`#t${i} .tier-list`).innerHTML = "";
    }

    // Filter players who have a tier for this gamemode
    const modePlayers = players.filter(p => p.tiers[mode]);

    modePlayers.forEach(p => {
      const tier = p.tiers[mode];          // e.g., "HT1"
      const tierNumber = parseInt(tier[1]); // 1-5
      const badge = `<span class="badge ${tier}">${tier} ${p.name}</span>`;
      const container = document.querySelector(`#t${tierNumber} .tier-list`);
      container.innerHTML += badge;
    });
  }

  // Initial render
  renderMode(select.value);

  // Change gamemode
  select.addEventListener("change", e => renderMode(e.target.value));
}

// ===============================
// REMOVE PLAYER MODAL COMPLETELY
// ===============================
const modal = document.getElementById("player-modal");
if (modal) modal.remove();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.id === "player-modal") node.remove();
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Override openPlayer function so it does nothing
function openPlayer() { /* modal disabled */ }
