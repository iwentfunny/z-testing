const TIER_POINTS = {
  HT1:60, LT1:45, HT2:30, LT2:20,
  HT3:10, LT3:6, HT4:4, LT4:3,
  HT5:2, LT5:1
};

// Modal setup
const modal = document.getElementById("player-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");
if (modal) modal.classList.add("hidden");
if (closeModal) closeModal.onclick = () => modal.classList.add("hidden");
if (modal) modal.onclick = e => { if(e.target===modal) modal.classList.add("hidden"); }

function calculatePoints(player){
  return Object.values(player.tiers).reduce((t,v)=>t+(TIER_POINTS[v]||0),0);
}

function alertPlayer(p){
  if(!modal||!modalBody) return;
  modalBody.innerHTML = `<h2>${p.name}</h2>
  <p><strong>Rank:</strong> ${p.rank}</p>
  <p><strong>Region:</strong> ${p.region}</p>
  <p><strong>Overall:</strong> ${p.overall} (${p.points} points)</p>
  <p><strong>Tiers:</strong> ${Object.entries(p.tiers).map(t=>`${t[0]}:${t[1]}`).join(", ")}</p>`;
  modal.classList.remove("hidden");
}

function setupSearch(players){
  const input=document.getElementById("search");
  if(!input) return;
  input.addEventListener("change",e=>{
    const found=players.find(p=>p.name.toLowerCase()===e.target.value.toLowerCase());
    if(found) alertPlayer(found);
  });
}

function renderOverall(players){
  const list=document.getElementById("overall-list");
  if(!list) return;
  players.sort((a,b)=>b.points-a.points).slice(0,50).forEach(p=>{
    const div=document.createElement("div");
    div.className="row";
    div.innerHTML=`<span>${p.overall}</span>
      <span>${p.name}</span>
      <span>${p.rank} (${p.points} pts)</span>
      <span>${p.region}</span>
      <span>${Object.entries(p.tiers).map(t=>`${t[1]}:${t[0]}`).join(", ")}</span>`;
    div.onclick=()=>alertPlayer(p);
    list.appendChild(div);
  });
}

fetch("data/players.json")
  .then(res=>res.json())
  .then(players=>{
    players.forEach(p=>p.points=calculatePoints(p));
    players.sort((a,b)=>b.points-a.points).forEach((p,i)=>p.overall=i+1);
    renderOverall(players);
    setupSearch(players);
  });
