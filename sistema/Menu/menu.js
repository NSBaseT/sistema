verificaAutenticado()

document.getElementById("btn_cadastro").addEventListener("click", () => {
  window.location.href = '../Cadastro_pacientes/Cadastro.html'
})
document.getElementById("btn_agendamento").addEventListener("click", () => {
  window.location.href = '../calendario/calendario.html'
})

document.getElementById("ch-side").addEventListener("change", event => {
  const mainSide = document.getElementById("main-side")
  if (event.target.checked) {
    mainSide.classList.remove("off")
  }
  else {
    mainSide.classList.add("off")
  }
})

document.getElementById("open-chat-btn1").addEventListener("click", () => {
  window.location.href = '../chat/chat.html'
})

let Nome = '';
let Usuario = ''


  ; (async () => {
    const token = localStorage.getItem(CHAVE)

    const response = await fetch('/verify', {
      body: JSON.stringify({ token }),
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })




    const data = await response.json()
    Nome = data.Nome;
    Usuario = data.Usuario;

    const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Olá, ${Nome}!`;

    const userGreeting1 = document.getElementById('userGreeting1');
    userGreeting1.textContent = `Bem-vindo(a) ${Nome}!`;

    const thumbnail = document.getElementById('thumbnail');
    thumbnail.src = data.foto
    thumbnail.style.display = 'block';

    abrirDashboard()

  })().catch(console.error)

function redirecionaCadUser() {


  if (Nome == 'ADM NSBaseTech') {
    location.href = '../cadastro_user/cadastro_user.html'
  } else {
    alert('Entrar em contato com Administrativo')
  }
}

const draggable = document.getElementById('draggable-container');
let isDraggable = true;
let mouseDown = false;

draggable.onmousedown = function (event) {
  if (!isDraggable) return;

  mouseDown = true;
  event.preventDefault();

  let shiftX = event.clientX - draggable.getBoundingClientRect().left;
  let shiftY = event.clientY - draggable.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    draggable.style.left = pageX - shiftX + 'px';
    draggable.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    if (mouseDown) {
      moveAt(event.pageX, event.pageY);
    }
  }

  document.addEventListener('mousemove', onMouseMove);

  draggable.onmouseup = function () {
    mouseDown = false;
    document.removeEventListener('mousemove', onMouseMove);
  };
};

window.addEventListener("message", (event) => {
  if (event.data === "desligamouse") {
    draggable.width = "50"
    draggable.height = "50"
  }

  if (event.data === "ligamouse") {
    draggable.width = "400"
    draggable.height = "500"
  }

})

document.getElementById("open-chat-btn1").addEventListener("click", () => {
  window.location.href = '../chat/chat.html'
})






//botao ajuda

const ajudaBtn = document.getElementById('ajudaBtn');
const ajudaPopup = document.getElementById('ajudaPopup');
const listaMensagens = document.getElementById('listaMensagens');

// Fecha o popup ao carregar a página
window.addEventListener('load', () => {
  ajudaPopup.style.display = 'none';
});

// Abre o popup e carrega as solicitações do backend
ajudaBtn.addEventListener('click', async () => {
  ajudaPopup.style.display = 'flex';

  try {
    const resp = await fetch(`/ajuda?especialista=${encodeURIComponent(Nome)}`);
    if (!resp.ok) throw new Error("Falha ao buscar ajudas");
    const dados = await resp.json();

    listaMensagens.innerHTML = ""; // limpa a lista antes de renderizar

    dados.forEach(item => {
      if (item.status === "Concluído") return; // <-- NÃO mostra chamados concluídos

      const agora = new Date(item.criadoEm);
      const data = agora.toLocaleDateString('pt-BR');
      const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });

      const div = document.createElement('div');
      div.classList.add('mensagem');
      div.dataset.id = item.id;

      div.innerHTML = `
    <p><strong>Chamado #${item.ticket}</strong>
       <strong> Data: ${data} Hora: ${hora}</strong>
      <strong>Local da ocorrência: ${item.tela}</strong>
    <p>${item.descricao}</p>
    <div class="botoes-status">
      <button type="button" disabled class="recebido ${item.status === 'Recebido' ? 'ativo' : ''}">Recebido</button>
      <button type="button" disabled class="andamento ${item.status === 'Em Andamento' ? 'ativo' : ''}">Em Andamento</button>
      <button type="button" disabled class="concluido ${item.status === 'Concluído' ? 'ativo' : ''}">Concluído</button>
    </div>
  `;

      div.querySelectorAll('.botoes-status button').forEach(botao => {
        botao.addEventListener('click', () => {
          div.querySelectorAll('.botoes-status button').forEach(b => b.classList.remove('ativo'));
          botao.classList.add('ativo');
        });
      });

      listaMensagens.appendChild(div);
    });

    const inputFiltroTicket = document.getElementById("filtroTicket");
    const inputFiltroData = document.getElementById("filtroData");
    const inputFiltroTela = document.getElementById("filtroTela");

    function aplicarFiltros() {
      const termoTicket = inputFiltroTicket.value.trim().toLowerCase();
      const termoData = inputFiltroData.value.trim().toLowerCase();
      const termoTela = inputFiltroTela.value.trim().toLowerCase();

      document.querySelectorAll(".mensagem").forEach(div => {
        const texto = div.innerText.toLowerCase();

        const matchTicket = !termoTicket || texto.includes(termoTicket);
        const matchData = !termoData || texto.includes(termoData);
        const matchTela = !termoTela || texto.includes(termoTela);

        div.style.display = matchTicket && matchData && matchTela ? "block" : "none";
      });
    }

    inputFiltroTicket.addEventListener("input", aplicarFiltros);
    inputFiltroData.addEventListener("input", aplicarFiltros);
    inputFiltroTela.addEventListener("input", aplicarFiltros);


  } catch (err) {
    console.error(err);
    alert("Erro ao carregar solicitações de ajuda.");
  }
});


function fecharAjuda() {
  ajudaPopup.style.display = 'none';
}

async function enviarAjuda() {
  const tela = document.getElementById('tela').value;
  const descricao = document.getElementById('descricao').value;

  if (!tela || !descricao.trim()) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const response = await fetch("/ajuda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tela,
        descricao,
        especialista: Nome // <-- enviar nome do especialista logado
      })
    });

    if (!response.ok) throw new Error("Erro ao enviar ajuda");

    ajudaBtn.click();
    document.getElementById('descricao').value = '';
    document.getElementById('tela').selectedIndex = 0;

    alert('Ajuda enviada com sucesso!');
    fecharAjuda();
  } catch (error) {
    console.error(error);
    alert('Erro ao enviar ajuda. Tente novamente.');
  }
}

let ajudasCache = new Map();

async function buscarAjudas() {
  try {
    const resp = await fetch(`/ajuda?especialista=${encodeURIComponent(Nome)}`);
    if (!resp.ok) throw new Error("Erro ao buscar ajudas");
    const dados = await resp.json();

    // Verifica mudanças de status comparando com cache local
    dados.forEach(item => {
      const cacheItem = ajudasCache.get(item.id);

      if (cacheItem && cacheItem.status !== item.status) {
        // Status mudou! Mostrar notificação
        mostrarNotificacaoStatus(item);
      }

      // Atualiza cache
      ajudasCache.set(item.id, item);
    });

    // Atualiza a lista visível (se quiser)
    // atualizarListaAjudaNaTela(dados);

  } catch (err) {
    console.error("Erro ao buscar ajudas no polling:", err);
  }
}

function mostrarNotificacaoStatus(item) {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });

  const ticket = item.id.split('-')[0];

  // Mapeia o status para a classe correta
  let statusClasse = '';
  if (item.status === 'Recebido') statusClasse = 'recebido';
  else if (item.status === 'Em Andamento') statusClasse = 'andamento';
  else if (item.status === 'Concluído') statusClasse = 'concluido';

  // Cria a notificação
  const notif = document.createElement('div');
  notif.className = `notificacao-status ${statusClasse}`;
  notif.innerHTML = `
    NsBaseTech informa: <br>
    <strong>Chamado #${ticket}</strong> <br>
    atualizado para <em>${item.status}</em><br>
    <small>${data} ${hora}</small><br>

    <button class="btn-ok" style="align-items:center";>OK</button>
  `;

  // Adiciona evento ao botão OK para remover a notificação
  const btnOk = notif.querySelector('.btn-ok');
  btnOk.addEventListener('click', () => {
    notif.remove();
    if (ajudaPopup.style.display !== 'none') {
      ajudaBtn.click(); // atualiza a lista de chamados se o popup estiver aberto
    }
  });

  document.body.prepend(notif);

}

// Começa o polling a cada 10 segundos
setInterval(buscarAjudas, 5000);
buscarAjudas(); // chama imediatamente ao carregar






// JavaScript atualizado

function abrirDashboard() {
  const dashboard = document.getElementById("modal-dashboard");
  dashboard.style.display = "block";

  const Nome = "Especialista";

  fetch(`/agendamentos?especialista=${encodeURIComponent(Nome)}`)
    .then(res => res.json())
    .then(data => {
      const statusCount = {
        "Aguardando Confirmação": 0,
        "Confirmado": 0,
        "Compareceu": 0,
        "Cancelado": 0
      };

      data.forEach(a => {
        if (statusCount[a.Status_da_Consulta] !== undefined) {
          statusCount[a.Status_da_Consulta]++;
        }
      });

      const total = Object.values(statusCount).reduce((a, b) => a + b, 0);
      const labels = Object.keys(statusCount);
      const values = labels.map(label =>
        ((statusCount[label] / total) * 100).toFixed(1)
      );

      const ctx = document.getElementById("statusPieChart").getContext("2d");

      if (window.statusChart) window.statusChart.destroy();

      window.statusChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels.map(label => `${label} (${statusCount[label]})`),
          datasets: [{
            data: values,
            backgroundColor: ['#f39c12', '#2ecc71', '#3498db', '#e74c3c']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label;
                  const value = tooltipItem.raw;
                  return `${label}: ${value}%`;
                }
              }
            },
            title: { display: true, text: 'Distribuição dos Agendamentos' }
          }
        }
      });
    });
}

function fecharDashboard() {
  const dashboard = document.getElementById("modal-dashboard");
  dashboard.style.display = "none";
}

function abrirDashboardPrincipal() {
  // Fecha modal inicial se aberto
  const modalDashboard = document.getElementById("modal-dashboard");
  if (modalDashboard) modalDashboard.style.display = "none";

  // Abre o principal
  const dashboard = document.getElementById("modal-dashboard-principal");
  dashboard.style.display = "block";

  // 1) PACIENTES
  fetch("/pacientes")
    .then(res => res.json())
    .then(data => {
      const sexoCount = { Masculino: 0, Feminino: 0, Outro: 0 };
      const idadeBuckets = { '0-18': 0, '19-30': 0, '31-45': 0, '46-60': 0, '60+': 0 };

      let totalPacientes = data.length;

    data.forEach(paciente => {
  const sexo = paciente.Genero || "Outro";
  const idade = parseInt(paciente.Idade) || 0;

        if (sexoCount[sexo] !== undefined) sexoCount[sexo]++;
        else sexoCount["Outro"]++;

        if (idade <= 18) idadeBuckets['0-18']++;
        else if (idade <= 30) idadeBuckets['19-30']++;
        else if (idade <= 45) idadeBuckets['31-45']++;
        else if (idade <= 60) idadeBuckets['46-60']++;
        else idadeBuckets['60+']++;
      });

      document.getElementById("cardTotalPacientes").textContent = `Total de Pacientes: ${totalPacientes}`;

      // Montar comparativo por sexo com ícones e porcentagens
      const totalSexo = sexoCount.Masculino + sexoCount.Feminino + sexoCount.Outro;
      const percMasc = totalSexo ? ((sexoCount.Masculino / totalSexo) * 100).toFixed(1) : 0;
      const percFem = totalSexo ? ((sexoCount.Feminino / totalSexo) * 100).toFixed(1) : 0;
      const percOutro = totalSexo ? ((sexoCount.Outro / totalSexo) * 100).toFixed(1) : 0;

      // Coloca no card com ícones
      document.getElementById("cardSexoComparativo").innerHTML = `
        <div class="sexo-item"><span class="icon">👦</span> ${percMasc}%</div>
        <div class="sexo-item"><span class="icon">👧</span> ${percFem}%</div>
        <div class="sexo-item"><span class="icon">❓</span> ${percOutro}%</div>
      `;

      // Faixa etária mais comum
      const idadePredominante = Object.entries(idadeBuckets).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      document.getElementById("cardIdadeComparativo").textContent = `Faixa Etária mais comum: ${idadePredominante}`;

      // Gráfico sexo
      const sexoCtx = document.getElementById("sexoChart").getContext("2d");
      if (window.sexoChart) window.sexoChart.destroy();
      window.sexoChart = new Chart(sexoCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(sexoCount),
          datasets: [{
            data: Object.values(sexoCount),
            backgroundColor: ['#3498db', '#e74c3c', '#9b59b6']
          }]
        },
        options: {
          plugins: {
            title: { display: true, text: 'Distribuição por Sexo' },
            legend: { position: 'bottom' }
          }
        }
      });

      // Gráfico idade
      const idadeCtx = document.getElementById("idadeChart").getContext("2d");
      if (window.idadeChart) window.idadeChart.destroy();
      window.idadeChart = new Chart(idadeCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(idadeBuckets),
          datasets: [{
            label: 'Pacientes',
            data: Object.values(idadeBuckets),
            backgroundColor: '#2ecc71'
          }]
        },
        options: {
          plugins: {
            title: { display: true, text: 'Distribuição por Faixa Etária' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });

  // 2) AGENDAMENTOS
  const Nome = "Especialista";
  fetch(`/agendamentos?especialista=${encodeURIComponent(Nome)}`)
    .then(res => res.json())
    .then(data => {
      const statusCount = {
        "Aguardando Confirmação": 0,
        "Confirmado": 0,
        "Compareceu": 0,
        "Cancelado": 0
      };

      data.forEach(a => {
        if (statusCount[a.Status_da_Consulta] !== undefined) {
          statusCount[a.Status_da_Consulta]++;
        }
      });

      // Preenche os cards de agendamento
      document.getElementById("cardConfirmado").textContent = `Confirmados: ${statusCount["Confirmado"]}`;
      document.getElementById("cardCompareceu").textContent = `Compareceram: ${statusCount["Compareceu"]}`;
      document.getElementById("cardAguardando").textContent = `Aguardando: ${statusCount["Aguardando Confirmação"]}`;
      document.getElementById("cardCancelado").textContent = `Cancelados: ${statusCount["Cancelado"]}`;

      // Gráfico de pizza agendamento
      const total = Object.values(statusCount).reduce((a, b) => a + b, 0);
      const labels = Object.keys(statusCount);
      const values = labels.map(label =>
        ((statusCount[label] / total) * 100).toFixed(1)
      );

      const ctx = document.getElementById("statusPieChartPrincipal").getContext("2d");
      if (window.statusChartPrincipal) window.statusChartPrincipal.destroy();
      window.statusChartPrincipal = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels.map(label => `${label} (${statusCount[label]})`),
          datasets: [{
            data: values,
            backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#e74c3c']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.label;
                  const value = tooltipItem.raw;
                  return `${label}: ${value}%`;
                }
              }
            },
            title: { display: true, text: 'Distribuição dos Agendamentos' }
          }
        }
      });
    });
}

function fecharDashboardPrincipal() {
  const dashboard = document.getElementById("modal-dashboard-principal");
  dashboard.style.display = "none";
}
