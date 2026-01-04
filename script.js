let players = {};

fetch("data/players.json")
  .then(res => res.json())
  .then(data => {
    players = data;
    if (document.getElementById("rankingTable")) loadLeaderboard();
    if (document.getElementById("tiersContainer")) loadGamemodePage();
  });

function loadLeaderboard() {
  const table = document.getElementById("rankingTable");
  let i = 1;

  for (const [name, data] of Object.entries(players)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i++}</td>
      <td>${name}</td>
      <td>${data.rank}</td>
      <td>${data.region}</td>
      <td>${Object.entries(data.gamemodes)
        .map(([g, t]) => `${g}: ${t}`)
        .join(", ")}</td>
    `;
    table.appendChild(tr);
  }

  document.getElementById("searchInput").addEventListener("input", e => {
    filterPlayers(e.target.value);
  });
}

function filterPlayers(query) {
  document.querySelectorAll("#rankingTable tr").forEach(row => {
    row.style.display = row.innerText
      .toLowerCase()
      .includes(query.toLowerCase())
      ? ""
      : "none";
  });
}

function goGamemode(mode) {
  window.location.href = `gamemode.html?mode=${mode}`;
}

function loadGamemodePage() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  document.getElementById("modeTitle").innerText =
    mode.replace("_", " ").toUpperCase();

  const tiers = {};

  for (const [player, data] of Object.entries(players)) {
    const tier = data.gamemodes[mode];
    if (!tier) continue;
    if (!tiers[tier]) tiers[tier] = [];
    tiers[tier].push(player);
  }

  const container = document.getElementById("tiersContainer");

  Object.keys(tiers)
    .sort()
    .forEach(tier => {
      const div = document.createElement("div");
      div.className = "tier";
      div.innerHTML = `<h3>${tier}</h3><ul>${tiers[tier]
        .map(p => `<li>${p}</li>`)
        .join("")}</ul>`;
      container.appendChild(div);
    });
}
