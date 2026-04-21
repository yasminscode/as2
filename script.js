
const storageKey = "yasmin-checklist-as";
const data = window.CHECKLIST_DATA || [];
const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

const container = document.getElementById("checklistContainer");
const toc = document.getElementById("toc");
const totalCountEl = document.getElementById("totalCount");
const doneCountEl = document.getElementById("doneCount");
const globalPercentEl = document.getElementById("globalPercent");

function slugify(text){
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function saveState(){
  localStorage.setItem(storageKey, JSON.stringify(saved));
}

function createTopicCard(topic, topicIndex){
  const id = slugify(topic.title);
  const details = document.createElement("details");
  details.className = "topic-card";
  details.id = id;
  if(topicIndex < 3) details.open = true;

  const summary = document.createElement("summary");
  summary.className = "topic-summary";

  const icon = document.createElement("div");
  icon.className = "topic-icon";
  icon.textContent = topic.icon;

  const head = document.createElement("div");
  head.className = "topic-head";
  head.innerHTML = `<h3>${topic.title}</h3><p>${topic.subtitle}</p>`;

  const progress = document.createElement("div");
  progress.className = "topic-progress";
  progress.innerHTML = `
    <strong id="${id}-count">0/${topic.items.length}</strong>
    <span id="${id}-percent">0%</span>
    <div class="progress-bar"><div class="progress-fill" id="${id}-fill"></div></div>
  `;

  summary.append(icon, head, progress);

  const body = document.createElement("div");
  body.className = "topic-body";

  const list = document.createElement("div");
  list.className = "checklist";

  topic.items.forEach((item, itemIndex) => {
    const key = `${id}-${itemIndex}`;
    const wrapper = document.createElement("div");
    wrapper.className = "check-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = key;
    input.checked = Boolean(saved[key]);

    const label = document.createElement("label");
    label.htmlFor = key;
    label.textContent = item;

    if(input.checked) wrapper.classList.add("done");

    input.addEventListener("change", () => {
      saved[key] = input.checked;
      wrapper.classList.toggle("done", input.checked);
      saveState();
      updateTopicProgress(topic, id);
      updateGlobalStats();
    });

    wrapper.append(input, label);
    list.appendChild(wrapper);
  });

  body.appendChild(list);
  details.append(summary, body);
  container.appendChild(details);

  const tocLink = document.createElement("a");
  tocLink.href = `#${id}`;
  tocLink.textContent = `${topic.icon} ${topic.title}`;
  toc.appendChild(tocLink);

  updateTopicProgress(topic, id);
}

function updateTopicProgress(topic, id){
  const done = topic.items.filter((_, itemIndex) => saved[`${id}-${itemIndex}`]).length;
  const total = topic.items.length;
  const percent = Math.round((done / total) * 100);
  document.getElementById(`${id}-count`).textContent = `${done}/${total}`;
  document.getElementById(`${id}-percent`).textContent = `${percent}%`;
  document.getElementById(`${id}-fill`).style.width = `${percent}%`;
}

function updateGlobalStats(){
  let done = 0;
  let total = 0;

  data.forEach(topic => {
    const id = slugify(topic.title);
    topic.items.forEach((_, itemIndex) => {
      total += 1;
      if(saved[`${id}-${itemIndex}`]) done += 1;
    });
  });

  totalCountEl.textContent = total;
  doneCountEl.textContent = done;
  globalPercentEl.textContent = `${Math.round((done / total) * 100 || 0)}%`;
}

data.forEach(createTopicCard);
updateGlobalStats();

document.getElementById("expandAll").addEventListener("click", () => {
  document.querySelectorAll(".topic-card").forEach(card => card.open = true);
});

document.getElementById("collapseAll").addEventListener("click", () => {
  document.querySelectorAll(".topic-card").forEach(card => card.open = false);
});

document.getElementById("resetProgress").addEventListener("click", () => {
  if(!confirm("Quer mesmo zerar todo o progresso?")){
    return;
  }

  Object.keys(saved).forEach(key => delete saved[key]);
  saveState();
  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = false;
    input.closest(".check-item")?.classList.remove("done");
  });
  data.forEach(topic => updateTopicProgress(topic, slugify(topic.title)));
  updateGlobalStats();
});
