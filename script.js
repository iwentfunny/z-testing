// Render gamemode tiers
fetch("data/players.json")
  .then(res => res.json())
  .then(players => {
    const select = document.getElementById("mode-select");
    function renderMode(mode) {
      for (let i = 1; i <= 5; i++) {
        document.querySelector(`#t${i} .tier-list`).innerHTML = "";
      }
      const modePlayers = players.filter(p => p.tiers[mode]);
      modePlayers.forEach(p => {
        const tier = p.tiers[mode];
        let tierNumber = parseInt(tier[1]);
        const badge = `<span class="badge ${tier}" onclick='showPlayerModal(${JSON.stringify(p)})'>${tier} ${p.name}</span>`;
        document.querySelector(`#t${tierNumber} .tier-list`).innerHTML += badge;
      });
    }
    renderMode(select.value);
    select.addEventListener("change", e => renderMode(e.target.value));
  });

// Modal function
function showPlayerModal(player) {
  const points = calculatePoints(player); // Make sure calculatePoints exists
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
      ${Object.entries(player.tiers).map(([mode, tier]) => `<span class="badge ${tier}">${tier} ${mode}</span>`).join("")}
    </div>
  `;

  modal.classList.remove("hidden");
  document.getElementById("close-modal").onclick = () => modal.classList.add("hidden");
  window.onclick = e => { if (e.target === modal) modal.classList.add("hidden"); };
}
