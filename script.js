// ===============================
// TIER POINTS & CALCULATION
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
// OVERALL RANKING
// ===============================
fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    // Pre-calculate points & rank
    players.forEach(p => {
      p.points = calculatePoints(p);
      p.rank = getRankTitle(p.points);
    });

    renderOverall(players);
    setupSearch(players);
    renderGamemode(players);
  });

function renderOverall(players) {
  const list = document.getElementById("overall-list");
  if (!list) return;

  list.innerHTML = "";

  players
    .sort((a, b) => b.points - a.points) // Highest points first
    .slice(0, 50)
    .forEach((p, index) => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `
        <span>${index + 1}</span>
        <span>${p.name}</span>
        <span>${p.rank} (${p.points} pts)</span>
        <span>${p.region}</span>
        <span>${Object.entries(p.tiers)
          .map(t => `${t[1]}: ${t[0]}`)
          .join(", ")}</span>
      `;
      div.onclick = () => openPlayer(p);
      list.appendChild(div);
    });
}

// ===============================
// PLAYER MODAL
// ===============================
function openPlayer(p) {
  const modal = document.getElementById("player-modal");
  const body = document.getElementById("modal-body");
  
  body.innerHTML = `
    <strong>${p.name}</strong><br>
    Rank: ${p.rank}<br>
    Region: ${p.region}<br>
    Overall: ${p.points} pts<br>
    <br>
    <strong>Tiers:</strong><br>
    ${Object.entries(p.tiers)
      .map(t => `${t[0]}: ${t[1]}`)
      .join("<br>")}
  `;
  
  modal.classList.remove("hidden"); // Show modal
}

// Close modal on X click
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("player-modal").classList.add("hidden");
});

// Close modal if clicking outside the modal content
document.getElementById("player-modal").addEventListener("click", (e) => {
  if (e.target.id === "player-modal") {
    document.getElementById("player-modal").classList.add("hidden");
  }
});

// ===============================
// SEARCH FUNCTIONALITY
// ===============================
function setupSearch(players) {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("change", e => {
    const found = players.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
    if (found) openPlayer(found);
  });
}

// ===============================
// GAMEMODE TIER LIST
// ===============================
function renderGamemode(players) {
  const select = document.getElementById("mode-select");
  if (!select) return;

  function renderMode(mode) {
    // Clear each tier list
    for (let i = 1; i <= 5; i++) {
      const tierContainer = document.querySelector(`#t${i} .tier-list`);
      if (tierContainer) tierContainer.innerHTML = "";
    }

    // Filter players who have this gamemode tier
    const modePlayers = players.filter(p => p.tiers[mode]);

    modePlayers.forEach(p => {
      const tier = p.tiers[mode];
      const tierNumber = parseInt(tier[1]); // "HT1" -> 1
      const container = document.querySelector(`#t${tierNumber} .tier-list`);
      if (container) {
        const badge = document.createElement("span");
        badge.className = `badge ${tier}`;
        badge.textContent = `${tier} ${p.name}`;
        badge.onclick = () => openPlayer(p);
        container.appendChild(badge);
      }
    });
  }

  // Initial render
  renderMode(select.value);

  // Change gamemode
  select.addEventListener("change", e => {
    renderMode(e.target.value);
  });
}
