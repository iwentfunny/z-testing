document.addEventListener("DOMContentLoaded", () => {
  const TIER_POINTS = {
    HT1: 60, LT1: 45,
    HT2: 30, LT2: 20,
    HT3: 10, LT3: 6,
    HT4: 4,  LT4: 3,
    HT5: 2,  LT5: 1
  };

  const modal = document.getElementById("player-modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementById("close-modal");

  if (modal) modal.classList.add("hidden");

  if (closeModal) closeModal.onclick = () => modal.classList.add("hidden");
  if (modal) modal.onclick = (e) => { if(e.target===modal) modal.classList.add("hidden"); }

  function calculatePoints(player) {
    return Object.values(player.tiers).reduce((total, tier) => total + (TIER_POINTS[tier] || 0), 0);
  }

  function getRankTitle(points) {
    if (points >= 400) return "Combat Grandmaster";
    if (points >= 250) return "Combat Master";
    if (points >= 100) return "Combat Ace";
    if (points >= 50)  return "Combat Specialist";
    if (points >= 20)  return "Combat Cadet";
    return "Combat Novice";
  }

  function alertPlayer(p) {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = `
      <p><strong>${p.name}</strong></p>
      <p>${getRankTitle(calculatePoints(p))} (${calculatePoints(p)} points)</p>
      <p>Region: ${p.region}</p>
      <p>Overall: ${p.overall}</p>
      <p>Tiers:</p>
      <ul>
        ${Object.entries(p.tiers).map(t => `<li>${t[0]}: ${t[1]}</li>`).join("")}
      </ul>
    `;
    modal.classList.remove("hidden");
  }

  fetch("data/players.json")
    .then(res => res.json())
    .then(players => {
      // Overall leaderboard
      const list = document.getElementById("overall-list");
      if (list) {
        players
          .sort((a,b) => a.overall - b.overall)
          .slice(0,50)
          .forEach(p => {
            const div = document.createElement("div");
            div.className = "row";
            div.innerHTML = `
              <span>${p.overall}</span>
              <span>${p.name}</span>
              <span>${getRankTitle(calculatePoints(p))} (${calculatePoints(p)} pts)</span>
              <span>${p.region}</span>
              <span>${Object.entries(p.tiers).map(t => `${t[1]}: ${t[0]}`).join(", ")}</span>
            `;
            div.onclick = () => alertPlayer(p);
            list.appendChild(div);
          });
      }

      // Search
      const input = document.getElementById("search");
      if (input) {
        input.addEventListener("change", e => {
          const found = players.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
          if (found) alertPlayer(found);
        });
      }

      // Expose alertPlayer for gamemode badges
      window.alertPlayer = alertPlayer;
    });
});
