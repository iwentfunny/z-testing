const TIER_POINTS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 10, LT3: 6,
  HT4: 4,  LT4: 3,
  HT5: 2,  LT5: 1
};

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
    .sort((a, b) => a.overall - b.overall)
    .slice(0, 50)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "row";
      div.innerHTML = `
        <span>${p.overall}</span>
        <span>${p.name}</span>
        <span>${p.rank} (${p.points} pts)</span>
        <span>${p.region}</span>
        <span>${Object.entries(p.tiers).map(t => `${t[1]}: ${t[0]}`).join(", ")}</span>
      `;
      div.onclick = () => alertPlayer(p);
      list.appendChild(div);
    });
}

function alertPlayer(p) {
  alert(
`${p.name}
${p.rank}
${p.region}
Overall: ${p.overall} (${p.points} points)

Tiers:
${Object.entries(p.tiers).map(t => `${t[0]}: ${t[1]}`).join("\n")}`
  );
}

function setupSearch(players) {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("change", e => {
    const found = players.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
    if (found) alertPlayer(found);
  });
}
