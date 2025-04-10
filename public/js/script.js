// Seleciona os elementos do HTML
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const eventList = document.getElementById("event-list");
const addEventBtn = document.getElementById("add-event");
const timeInput = document.getElementById("event-time");
const titleInput = document.getElementById("event-title");
const noteInput = document.getElementById("event-note");
const temaSelect = document.getElementById("tema");


let tempos = []; // Array que vai armazenar os tempos-alvo para o cronômetro
let selectedDate = new Date(); // Data atualmente selecionada
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {}; // Eventos salvos no localStorage

function renderCalendar(date) {
  calendar.innerHTML = ""; // Limpa o calendário atual

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // Dia da semana do primeiro dia do mês
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total de dias do mês
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Atualiza o texto do mês/ano
  monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

  // Adiciona células vazias antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    calendar.appendChild(empty);
  }

  // Cria as células de cada dia com nome do dia dentro
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "day";
    const cellDate = new Date(year, month, d);
    const key = formatDate(cellDate);

    const dayName = diasSemana[cellDate.getDay()];
    cell.innerHTML = `
      <div class="day-label">${d}</div>
      <div class="day-name-inside">${dayName}</div>
    `;

    if (formatDate(new Date()) === key) {
      cell.classList.add("today"); // Destaque para o dia atual
    }

    if (events[key] && events[key].length > 0) {
      const indicators = document.createElement("div");
      indicators.className = "event-indicators";

      // Adiciona uma bolinha para cada evento
      events[key].forEach(evento => {
        const tema = evento.tema?.toLowerCase();
        if (tema) {
          const dot = document.createElement("span");
          dot.classList.add("event-dot", tema);
          indicators.appendChild(dot);
        }
      });

      cell.appendChild(indicators);
    }

    // Clique no dia
    cell.addEventListener("click", () => {
      selectedDate = cellDate;
      showEvents(key);
      highlightSelectedDay(cell);
    });

    // Destaque no dia selecionado
    function highlightSelectedDay(selectedCell) {
      document.querySelectorAll(".day").forEach(cell => {
        cell.classList.remove("selected");
      });
      selectedCell.classList.add("selected");
    }

    calendar.appendChild(cell);
  }
}


// Formata a data para o padrão YYYY-MM-DD
function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;
}

// Mostra os eventos de um determinado dia
function showEvents(dateKey) {
  eventList.innerHTML = "";
  const dayEvents = events[dateKey] || [];

  if (dayEvents.length === 0) {
    eventList.innerHTML = "<p>Sem eventos para este dia.</p>";
    return;
  }

  dayEvents.forEach((ev, index) => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `
    <strong>${ev.time}</strong> - ${ev.title}<br>
    <small>${ev.note}</small><br>
    <span><b>Tema:</b> ${ev.tema || "N/A"}</span><br>
    <button onclick="editEvent('${dateKey}', ${index})">Editar</button>
    <button class="delete" onclick="deleteEvent('${dateKey}', ${index})">Excluir</button>
  `;
  
    eventList.appendChild(div);
  });

  // Botão para excluir todos os eventos do dia
  const deleteAll = document.createElement("button");
  deleteAll.textContent = "🧹 Limpar todos os eventos do dia";
  deleteAll.className = "delete";
  deleteAll.style.marginTop = "10px";
  deleteAll.onclick = () => {
    if (confirm("Tem certeza que deseja deletar todos os eventos do dia?")) {
      delete events[dateKey];
      localStorage.setItem("calendarEvents", JSON.stringify(events));
      renderCalendar(selectedDate);
      showEvents(dateKey);
      showUpcomingEvents();
    }
  };
  eventList.appendChild(deleteAll);
}

// Adiciona novo evento ao clicar no botão "Adicionar"
addEventBtn.addEventListener("click", () => {
  const key = formatDate(selectedDate);
  const time = timeInput.value;
  const title = titleInput.value.trim();
  const note = noteInput.value.trim();

  if (!time || !title) return alert("Preencha o horário e título!");

  const newEvent = { time, title, note, tema: temaSelect.value };

  if (!events[key]) events[key] = [];
  events[key].push(newEvent);

  localStorage.setItem("calendarEvents", JSON.stringify(events));

  // Limpa os campos e atualiza visualmente
  timeInput.value = "";
  titleInput.value = "";
  noteInput.value = "";

  showEvents(key);
  renderCalendar(selectedDate);
  showUpcomingEvents();
});

// Botão de mês anterior
prevBtn.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  renderCalendar(selectedDate);
});

// Botão de próximo mês
nextBtn.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  renderCalendar(selectedDate);
});

// Inicializa o calendário na data atual
renderCalendar(selectedDate);

// Deleta um único evento
function deleteEvent(dateKey, index) {
  events[dateKey].splice(index, 1);
  if (events[dateKey].length === 0) delete events[dateKey];
  localStorage.setItem("calendarEvents", JSON.stringify(events));
  renderCalendar(selectedDate);
  showEvents(dateKey);
  showUpcomingEvents();
}

// Permite editar um evento (preenche os campos com os dados e deleta o evento atual)
function editEvent(dateKey, index) {
  const ev = events[dateKey][index];
  timeInput.value = ev.time;
  titleInput.value = ev.title;
  noteInput.value = ev.note;
  temaSelect.value = ev.tema || "outro";


  deleteEvent(dateKey, index);
  showUpcomingEvents();
}

function showUpcomingEvents() {
  const container = document.getElementById("upcoming-events");
  container.innerHTML = ""; // Limpa o conteúdo atual

  const allEvents = [];

  // Agrupa todos os eventos com suas datas convertidas
  for (const dateKey in events) {
    const [year, month, day] = dateKey.split("-").map(Number);
    const eventDate = new Date(year, month - 1, day);

    events[dateKey].forEach(event => {
      allEvents.push({
        ...event,
        date: eventDate,
        key: dateKey
      });
    });
  }

  // Ordena os eventos por data e hora
  allEvents.sort((a, b) => {
    const dateDiff = a.date - b.date;
    if (dateDiff !== 0) return dateDiff;
    return a.time.localeCompare(b.time);
  });

  const now = new Date();

  // Filtra todos os eventos futuros
  const futuros = allEvents.filter(event => {
    const [hours, minutes] = event.time.split(":").map(Number);
    const fullDate = new Date(event.date);
    fullDate.setHours(hours, minutes);
    return fullDate >= now;
  });

  // Exibe os eventos ou mensagem padrão
  if (futuros.length === 0) {
    container.innerHTML = "<p>Nenhum evento futuro próximo.</p>";
    return;
  }

  tempos = []; // Limpa os tempos antigos

  futuros.forEach((ev, index) => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `
      <strong>${ev.key}</strong> - ${ev.time}<br>
      Título: ${ev.title}<br>
      <small>Obs: ${ev.note}</small><br>
      <strong>Tema: ${ev.tema}</strong><br>
      <span id="cronometro${index}" class="cronometro-texto"></span>
    `;
    container.appendChild(div);

    const [ano, mes, dia] = ev.key.split("-").map(Number);
    const [hora, minuto] = ev.time.split(":").map(Number);
    const dataEvento = new Date(ano, mes - 1, dia, hora, minuto);
    tempos.push({ data: dataEvento, title: ev.title, notificado: false });
  });
}

// Pesquisa eventos pelo título ou observação
document.getElementById("search-event").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const dateKey = formatDate(selectedDate);
  const eventosFiltrados = (events[dateKey] || []).filter(ev =>
    ev.title.toLowerCase().includes(termo) || ev.note.toLowerCase().includes(termo)
  );

  eventList.innerHTML = "";
  eventosFiltrados.forEach((ev, index) => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `<strong>${ev.time}</strong> - ${ev.title}<br><small>${ev.note}</small>`;
    eventList.appendChild(div);
  });
});

const notificacoesEnviadas = new Set();

// Verifica se o evento já foi notificado (usando localStorage para persistência)
function jaFoiNotificado(id) {
  return localStorage.getItem(`notificado_${id}`) === "true";
}

function marcarComoNotificado(id) {
  localStorage.setItem(`notificado_${id}`, "true");
}

// Verifica eventos que vão acontecer nos próximos 5 minutos
function verificarNotificacoes() {
  const agora = new Date();

  for (const key in events) {
    events[key].forEach(ev => {
      const [ano, mes, dia] = key.split("-").map(Number);
      const [hora, minuto] = ev.time.split(":").map(Number);
      const evDate = new Date(ano, mes - 1, dia, hora, minuto);
      const idEvento = `${key}_${ev.time}_${ev.title}`;

      if (isNaN(evDate)) {
        console.warn("Data inválida para o evento:", ev);
        return;
      }

      const diff = evDate - agora;
      if (diff > 0 && diff < 300000 && !notificacoesEnviadas.has(idEvento)) {
        alert(`📅 Evento próximo: ${ev.title} às ${ev.time}`);
        notificacoesEnviadas.add(idEvento);
      }
    });
  }
}

// Atualiza cronômetro de todos os eventos
function atualizaCronometro() {
  tempos.forEach((evento, i) => {
    const [dias, horas, minutos, segundos] = calculaTempo(evento.data);
    const div = document.getElementById("cronometro" + i);

    if (div) {
      div.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s restantes`;
    }

    if (!evento.notificado && dias === 0 && horas === 0 && minutos === 0 && segundos === 0) {
      if (!jaFoiNotificado(evento.title)) {
        notificar(i);
        evento.notificado = true;
        marcarComoNotificado(evento.title);
      }
    }
  });
}

// Inicia o cronômetro e pede permissão de notificação
function comecaCronometro() {
  pedirPermissaoNotificacao();
  atualizaCronometro();
  setInterval(atualizaCronometro, 1000);
}

// Calcula o tempo restante até o objetivo
function calculaTempo(tempoObjetivo) {
  const tempoAtual = new Date();
  const tempoFinal = tempoObjetivo - tempoAtual;

  if (tempoFinal <= 0) return [0, 0, 0, 0];

  const segundosTotais = Math.floor(tempoFinal / 1000);
  const dias = Math.floor(segundosTotais / 86400);
  const horas = Math.floor((segundosTotais % 86400) / 3600);
  const minutos = Math.floor((segundosTotais % 3600) / 60);
  const segundos = segundosTotais % 60;

  return [dias, horas, minutos, segundos];
}

// Pede permissão ao usuário para notificações
function pedirPermissaoNotificacao() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// Envia notificação visual e sonora
function notificar(i) {
  const evento = tempos[i];

  // Tocar som
  const audio = new Audio("mp/notific.mp3");
  audio.play().catch(() => {
    console.warn("🔇 Erro ao tocar som. Dispositivo pode estar silenciado.");
    alert(`🔔 Evento: "${evento.title}" chegou ao horário!`);
  });

  // Enviar notificação visual
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⏰ Calendário", {
      body: `O Dia Marcado: "${evento.title}" chegou ao horário!`,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png"
    });
  }
}

// Inicializa tudo após o carregamento da página
document.addEventListener("DOMContentLoaded", () => {
  showUpcomingEvents();
  comecaCronometro();
  setInterval(verificarNotificacoes, 60000); // Verifica eventos próximos a cada minuto
});


function alternarPainel(id) {
  const painel = document.getElementById(id);
  painel.style.display = (painel.style.display === "none" || painel.style.display === "") ? "block" : "none";
}

//id class= Name class2= name + config-add

function mudarClass(id) {
  const elemento = document.getElementById(id);
  elemento.classList.toggle("config-add");
}

