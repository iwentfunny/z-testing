let players = {};
let currentMode = "crystal";

fetch("data/players.json")
  .then(res => res.json())
  .then(data => {
    players = data;
    loadGamemode(currentMode);
  });

function loadGamemode(mode) {
  currentMode = mode;
  const container = document.getElementById("tiersContainer");
  container.innerHTML = "";

  const tiers = {};

  for (const [player, data] of Object.entries(players)) {
    const tier = data.gamemodes[mode];
    if (!tier) continue;
    if (!tiers[tier]) tiers[tier] = [];
    tiers[tier].push(player);
  }

  Object.keys(tiers)
    .sort()
    .forEach(tier => {
      const tierNum = tier.replace(/\D/g, "");
      const div = document.createElement("div");
      div.className = `tier tier-${tierNum}`;

      const trophy =
        tier.endsWith("1") ? "🏆" :
        tier.endsWith("2") ? "🥈" :
        tier.endsWith("3") ? "🥉" : "";

      div.innerHTML = `
        <h3>${trophy} ${tier}</h3>
        <ul>
          ${tiers[tier].map(p => `<li>${p}</li>`).join("")}
        </ul>
      `;

      container.appendChild(div);
    });
}
