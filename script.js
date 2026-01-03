/* ===============================
   TIER POINT SYSTEM (ZEQA)
================================ */

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

/* ===============================
   LOAD PLAYER DATA
================================ */

fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    renderOverall(players);
    setupSearch(players);
  });

/* ===============================
   OVERALL LEADERBOARD
================================ */

function renderOverall(players) {
  const list = document.getElementById("overall-list");
  if (!list) return;

  list.innerHTML = "";

  players
    .sort((a, b) => a.overall - b.overall)
    .slice(0, 50)
    .forEach(player => {
      const points = calculatePoints(player);

      const div = document.createElement("div");
      div.className = "row";

      div.innerHTML = `
        <span>${player.overall}</span>
        <span>${player.name}</span>
        <span>${getRankTitle(points)} (${points} pts)</span>
        <span>${player.region}</span>
        <span>
          ${Object.entries(player.tiers)
            .map(([mode, tier]) =>
              `<span class="badge ${tier}">${tier} ${mode}</span>`
            ).join("")}
        </span>
      `;

      div.onclick = () => openPlayer(player);
      list.appendChild(div);
    });
}

/* ===============================
   PLAYER POPUP (TEMP ALERT)
================================ */

function openPlayer(player) {
  const points = calculatePoints(player);

  alert(
`${player.name}
${getRankTitle(points)}
Region: ${player.region}

Overall Rank: ${player.overall}
Total Points: ${points}

Tiers:
${Object.entries(player.tiers)
  .map(([mode, tier]) => `${mode}: ${tier}`)
  .join("\n")}`
  );
}

/* ===============================
   SEARCH PLAYER
================================ */

function setupSearch(players) {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("change", e => {
    const value = e.target.value.toLowerCase().trim();
    if (!value) return;

    const found = players.find(
      p => p.name.toLowerCase() === value
    );

    if (found) {
      openPlayer(found);
    } else {
      alert("Player not found");
    }
  });
}
