verificaAutenticado()
verificaUsuarioLogado()

let isSecretaria = false; // global
let Usuario = '';
let Nome = '';

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


    if (data.Secretaria) {
      const dashboard = document.getElementById("modal-dashboard");
      dashboard.parentNode.removeChild(dashboard);
      abrirAniversariantes()

    } else {

      abrirDashboard()
    }


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

Usuario = "";
Nome = "";

async function verificaUsuarioLogado() {
  const token = localStorage.getItem(CHAVE);
  const response = await fetch('/verify', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
  if (!response.ok) throw new Error("Falha na autenticação");
  const data = await response.json();

  if (data.Secretaria) {
    isSecretaria = true; // importante: seta a flag global
    Usuario = null;
    Nome = null;
  } else {
    isSecretaria = false;
    Usuario = data.Usuario;
    Nome = data.Nome;
  }
}

function parseData(rawData) {
  if (!rawData) return null;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawData)) {
    const [dia, mes, ano] = rawData.split('/');
    return new Date(`${ano}-${mes}-${dia}T00:00:00`);
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(rawData)) {
    return new Date(rawData);
  }

  const dt = new Date(rawData);
  return isNaN(dt) ? null : dt;
}

function abrirDashboard() {
  const dashboard = document.getElementById("modal-dashboard");
  dashboard.style.display = "block";

  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
  inicioSemana.setHours(0, 0, 0, 0);

  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);

  fetch('/agendamentos')
    .then(res => res.json())
    .then(data => {
      const especialistaLogado = Usuario.toLowerCase();

      const agendamentosFiltrados = data.filter(a => {
        if (!a.Especialista) return false;
        const dt = parseData(a.Data_do_Atendimento);
        if (!dt) return false;

        const isEspecialista = a.Especialista.toLowerCase().includes(especialistaLogado);
        const isNaSemanaAtual = dt >= inicioSemana && dt <= fimSemana;

        return isEspecialista && isNaSemanaAtual;
      });

      const statusCount = {
        "Aguardando Confirmação": 0,
        "Confirmado": 0,
        "Compareceu": 0,
        "Cancelado": 0
      };

      agendamentosFiltrados.forEach(a => {
        if (statusCount[a.Status_da_Consulta] !== undefined) {
          statusCount[a.Status_da_Consulta]++;
        }
      });

      const total = Object.values(statusCount).reduce((a, b) => a + b, 0);
      const ctx = document.getElementById("statusPieChart").getContext("2d");
      if (window.statusChart) window.statusChart.destroy();

      if (total === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }

      const labels = Object.keys(statusCount);
      const values = labels.map(label => Number(((statusCount[label] / total) * 100).toFixed(1)));

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
            title: { display: true, text: 'Distribuição dos Agendamentos da Semana' }
          }
        }
      });
    });

  // Abre também aniversariantes junto com dashboard
  abrirAniversariantes();
}

function abrirAniversariantes() {
  const aniversarianteBox = document.getElementById("modal-aniversariantes");
  aniversarianteBox.style.display = "block";

  fetch("/pacientes")
    .then(res => res.json())
    .then(pacientes => {
      // Se for secretária, pega todos os pacientes
      const pacientesFiltrados = isSecretaria
        ? pacientes
        : pacientes.filter(p => p.Especialista && p.Especialista.toLowerCase() === Usuario.toLowerCase());

      const hoje = new Date();
      const diaHoje = hoje.getDate();
      const mesHoje = hoje.getMonth() + 1;

      const aniversariantes = pacientesFiltrados.filter(p => {
        if (!p.Data_de_Nascimento) return false;
        const [ano, mes, dia] = p.Data_de_Nascimento.split("-");
        return parseInt(dia) === diaHoje && parseInt(mes) === mesHoje;
      });

      const lista = document.getElementById("lista-aniversariantes");
      lista.innerHTML = "";

      if (aniversariantes.length > 0) {
        aniversariantes.forEach(p => {
          const item = document.createElement("li");
          item.textContent = isSecretaria
            ? `🎂 ${p.Nome} (${p.Idade} anos) — Espec.: ${p.Especialista}`
            : `🎂 ${p.Nome} (${p.Idade} anos)`;
          lista.appendChild(item);
        });
      } else {
        const item = document.createElement("li");
        item.textContent = "Nenhum aniversariante hoje 💤";
        lista.appendChild(item);
      }
    })
    .catch(err => console.error("Erro ao carregar pacientes:", err));
}

async function iniciarDashboard() {
  try {
    await verificaUsuarioLogado();
    abrirDashboard();
  } catch (error) {
    console.error("Erro ao iniciar dashboard:", error);
  }
}

// Chama a função para carregar tudo quando precisar
iniciarDashboard();


function abrirDashboardPrincipal() {
  // Fecha outros modais
  const modalDashboard = document.getElementById("modal-dashboard");
  const modalaniversariantes = document.getElementById("modal-aniversariantes");
  if (modalDashboard) modalDashboard.style.display = "none";
  if (modalaniversariantes) modalaniversariantes.style.display = "none";

  // Abre o modal principal
  const dashboard = document.getElementById("modal-dashboard-principal");
  dashboard.style.display = "block";

  // Carrega dados iniciais
  carregarDashboard();
}


// ---------------- 1) PACIENTES ----------------
async function carregarPacientes() {
  // 🔎 Primeiro garante usuário logado
  await verificaUsuarioLogado();

  fetch("/pacientes")
    .then(res => res.json())
    .then(pacientes => {
      const pacientesFiltrados = isSecretaria
        ? pacientes
        : pacientes.filter(p =>
          p.Especialista &&
          p.Especialista.toLowerCase().includes(Usuario.toLowerCase())
        );

      const sexoCount = { Masculino: 0, Feminino: 0, Outro: 0 };
      const idadeBuckets = { '0-18': 0, '19-30': 0, '31-45': 0, '46-60': 0, '60+': 0 };
      let totalPacientes = pacientesFiltrados.length;

      pacientes.forEach(paciente => {
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

      document.getElementById("cardTotalPacientes").textContent = totalPacientes;

      const totalSexo = sexoCount.Masculino + sexoCount.Feminino + sexoCount.Outro;
      const percMasc = totalSexo ? parseFloat(((sexoCount.Masculino / totalSexo) * 100).toFixed(1)) : 0;
      const percFem = totalSexo ? parseFloat(((sexoCount.Feminino / totalSexo) * 100).toFixed(1)) : 0;
      const percOutro = totalSexo ? parseFloat(((sexoCount.Outro / totalSexo) * 100).toFixed(1)) : 0;
      const alturaMasc = percMasc * 2; // 5px por unidade percentual
      const alturaFem = percFem * 2;
      const alturaOutro = percOutro * 2;

      document.getElementById("cardSexoComparativo").innerHTML = `
  <div class="sexo-item has-tooltip" title="Masculino">
    <span class="icon">👦</span> ${percMasc}%
  </div>
  <div class="sexo-item has-tooltip" title="Feminino">
    <span class="icon">👧</span> ${percFem}%
  </div>
  <div class="sexo-item has-tooltip" title="Outro">
    <span class="icon">❓</span> ${percOutro}%
  </div>
`;


      const grafico = document.getElementById("grafico-barras-sexo");

      grafico.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="barra masculino" style="height:${alturaMasc}px">
            <span class="porcentagem-label">${percMasc}%</span>
          </div>
          <div class="barra-label">Masculino</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="barra feminino" style="height:${alturaFem}px">
            <span class="porcentagem-label">${percFem}%</span>
          </div>
          <div class="barra-label">Feminino</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="barra outro" style="height:${alturaOutro}px">
            <span class="porcentagem-label">${percOutro}%</span>
          </div>
          <div class="barra-label">Outro</div>
        </div>
      `;

      // Faixa etária mais comum
      const idadePredominante = Object.entries(idadeBuckets).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      document.getElementById("cardIdadeComparativo").innerHTML =
        `${idadePredominante}`;
      atualizarGrafico(idadeBuckets);


      function atualizarGrafico(idadeBuckets) {
        const idadePredominante = Object.entries(idadeBuckets).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        document.getElementById("cardIdadeComparativo").textContent = idadePredominante;

        const barraContainer = document.getElementById("barraContainer");
        barraContainer.innerHTML = '';

        const maxValor = Math.max(...Object.values(idadeBuckets));

        Object.entries(idadeBuckets).forEach(([faixa, valor]) => {
          const barraWrapper = document.createElement("div");
          barraWrapper.style.display = "flex";
          barraWrapper.style.alignItems = "center";
          barraWrapper.style.gap = "20px";

          // Label faixa etária (fixo largura)
          const label = document.createElement("div");
          label.style.width = "120px";
          label.style.fontWeight = "600";
          label.textContent = faixa;

          // Barra - flexível, cresce de acordo com o valor
          const barra = document.createElement("div");
          barra.style.height = "20px";
          barra.style.backgroundColor = "#f89c23ff";
          barra.style.borderRadius = "8px";
          const larguraPercentual = (valor / maxValor) * 100;
          barra.style.width = larguraPercentual + "%";
          barra.style.minWidth = valor > 0 ? "35px" : "0"; //       // não ultrapassa o container


          // Valor numérico (fixo largura)
          const valorLabel = document.createElement("div");
          valorLabel.style.width = "20px";
          valorLabel.style.fontWeight = "700";
          valorLabel.textContent = valor;

          barraWrapper.appendChild(label);
          barraWrapper.appendChild(barra);
          barraWrapper.appendChild(valorLabel);

          barraContainer.appendChild(barraWrapper);
        });

      }



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
}

carregarPacientes();



//filtro....................................................................
async function carregarDashboard() {
  const filtroMesAno = document.getElementById("filtroMesAno")?.value; // ex.: "2025-08"

  try {
    const res = await fetch('/agendamentos');
    if (!res.ok) throw new Error('Erro ao buscar agendamentos: ' + res.status);
    const data = await res.json();

    // 1) Filtra pelo especialista logado
    const especialistaLogado = Usuario.toLowerCase();
    let agendamentosFiltrados = data.filter(a => {
      if (!a.Especialista || !a.Data_do_Atendimento) return false;
      return a.Especialista.toLowerCase().includes(especialistaLogado);
    });

    // 2) Filtra pelo mês/ano selecionado (YYYY-MM)
    if (filtroMesAno) {
      agendamentosFiltrados = agendamentosFiltrados.filter(a => {
        const dataItem = a.Data_do_Atendimento.slice(0, 7); // pega "YYYY-MM"
        return dataItem === filtroMesAno;
      });
    }

    // 3) Conta status
    const statusCount = {
      "Aguardando Confirmação": 0,
      "Confirmado": 0,
      "Compareceu": 0,
      "Cancelado": 0
    };

    agendamentosFiltrados.forEach(a => {
      if (statusCount[a.Status_da_Consulta] !== undefined) {
        statusCount[a.Status_da_Consulta]++;
      }
    });

    // 4) Atualiza cards
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("cardConfirmado", statusCount["Confirmado"] || 0);
    setText("cardCompareceu", statusCount["Compareceu"] || 0);
    setText("cardAguardando", statusCount["Aguardando Confirmação"] || 0);
    setText("cardCancelado", statusCount["Cancelado"] || 0);

    // 5) Atualiza gráfico
    const total = Object.values(statusCount).reduce((a, b) => a + b, 0);
    const labels = Object.keys(statusCount);
    const values = labels.map(label =>
      total > 0 ? ((statusCount[label] / total) * 100).toFixed(1) : 0
    );

    const canvas = document.getElementById("statusPieChartPrincipal");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");

      if (window.statusChartPrincipal) window.statusChartPrincipal.destroy();

      if (total > 0) {
        window.statusChartPrincipal = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels.map(label => `${label} (${statusCount[label]})`),
            datasets: [{ data: values, backgroundColor: ['#f39c12', '#2ecc71', '#3498db', '#e74c3c'] }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
                }
              },
              title: { display: true, text: 'Distribuição dos Agendamentos' }
            }
          }
        });
      }
    }

  } catch (err) {
    console.error("Erro carregarDashboard -> agendamentos:", err);
  }
}


// 7) Fecha dashboard
function fecharDashboardPrincipal() {
  const dashboardprincipal = document.getElementById("modal-dashboard-principal");
  if (dashboardprincipal) dashboardprincipal.style.display = "none";
}

// 8) Atualiza dashboard ao trocar o mês
document.addEventListener("DOMContentLoaded", () => {
  const selectMes = document.getElementById("mesFiltroCompacto");
  if (selectMes) {
    selectMes.addEventListener("change", carregarDashboard);
  }
  carregarDashboard(); // carrega inicialmente
});

async function gerarPDFDashboard() {
  await verificaUsuarioLogado(); // garante Usuario e isSecretaria

  // Cria container temporário invisível
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.width = "800px";
  tempContainer.style.background = "#fff";
  tempContainer.style.padding = "20px";
  tempContainer.style.boxSizing = "border-box";
  tempContainer.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(tempContainer);

  // ----------------- TÍTULO E ESPECIALISTA -----------------
  const titulo = document.createElement("h2");
  titulo.textContent = "Relatório Resumido do Dashboard";
  titulo.style.textAlign = "center";
  titulo.style.marginBottom = "10px";
  titulo.style.fontSize = "18pt";
  tempContainer.appendChild(titulo);

  const dataAtual = document.createElement("p");
  dataAtual.textContent = `Dr.(a) ${Usuario} - ${new Date().toLocaleDateString()}`;
  dataAtual.style.textAlign = "center";
  dataAtual.style.marginBottom = "20px";
  dataAtual.style.fontSize = "12pt";
  tempContainer.appendChild(dataAtual);

  // ----------------- TABELA RESUMO -----------------
  const tabela = document.createElement("table");
  tabela.style.width = "100%";
  tabela.style.borderCollapse = "collapse";
  tabela.style.marginBottom = "20px";
  tabela.style.fontSize = "11pt";

  const addRow = (label, value) => {
    const tr = document.createElement("tr");

    const tdLabel = document.createElement("td");
    tdLabel.textContent = label;
    tdLabel.style.borderBottom = "1px solid #000";
    tdLabel.style.padding = "6px 10px";
    tdLabel.style.fontWeight = "600";
    tdLabel.style.textAlign = "left";

    const tdValue = document.createElement("td");
    tdValue.textContent = value;
    tdValue.style.borderBottom = "1px solid #000";
    tdValue.style.padding = "6px 10px";
    tdValue.style.textAlign = "right";

    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    tabela.appendChild(tr);
  };

  const totalPacientes = document.getElementById("cardTotalPacientes")?.textContent || "0";
  const sexoComparativo = document.getElementById("cardSexoComparativo")?.textContent || "";
  const idadePredominante = document.getElementById("cardIdadeComparativo")?.textContent || "";

  const cardConfirmado = document.getElementById("cardConfirmado")?.textContent || "0";
  const cardCompareceu = document.getElementById("cardCompareceu")?.textContent || "0";
  const cardAguardando = document.getElementById("cardAguardando")?.textContent || "0";
  const cardCancelado = document.getElementById("cardCancelado")?.textContent || "0";

  addRow("Total de Pacientes", totalPacientes);
  addRow("Distribuição por Sexo", sexoComparativo);
  addRow("Faixa Etária Predominante", idadePredominante);
  addRow("Agendamentos Confirmados", cardConfirmado);
  addRow("Agendamentos Compareceu", cardCompareceu);
  addRow("Agendamentos Aguardando Confirmação", cardAguardando);
  addRow("Agendamentos Cancelados", cardCancelado);

  tempContainer.appendChild(tabela);

  // ----------------- GRÁFICOS PIZZA -----------------
  const canvasList = [
    { canvas: document.getElementById("sexoChart"), titulo: "Distribuição por Sexo" },
    { canvas: document.getElementById("statusPieChartPrincipal"), titulo: "Status dos Agendamentos" }
  ];

  canvasList.forEach(({ canvas, titulo }) => {
    if (canvas) {
      const tituloGraf = document.createElement("p");
      tituloGraf.textContent = titulo;
      tituloGraf.style.fontWeight = "600";
      tituloGraf.style.textAlign = "center";
      tituloGraf.style.margin = "10px 0 5px 0";
      tempContainer.appendChild(tituloGraf);

      const imgData = canvas.toDataURL("image/png");
      const img = document.createElement("img");
      img.src = imgData;
      img.style.width = "300px";
      img.style.display = "block";
      img.style.margin = "0 auto 20px auto";
      tempContainer.appendChild(img);
    }
  });

  // ----------------- GERAR PDF -----------------
  const canvasFinal = await html2canvas(tempContainer, { scale: 2 });
  const imgFinal = canvasFinal.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  const imgProps = pdf.getImageProperties(imgFinal);
  const pdfWidth = pageWidth - 40;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgFinal, 'PNG', 20, 20, pdfWidth, pdfHeight);
  pdf.save("relatorio_dashboard_clean.pdf");
  alert("Documento gerado com sucesso!");
  // Remove container temporário
  document.body.removeChild(tempContainer);
}


let agendamentosChart;

async function carregarAgendamentosComparativo(periodos) {
  await verificaUsuarioLogado(); // garante Usuario e isSecretaria

  // Busca os agendamentos
  const res = await fetch('/agendamentos');
  const data = await res.json();

  // Filtra pelo especialista logado
  const especialistaLogado = Usuario.toLowerCase();
  let agendamentosFiltrados = data.filter(a =>
    a.Especialista &&
    a.Especialista.toLowerCase().includes(especialistaLogado)
  );

  // Define meses do período selecionado
  const hoje = new Date();
  let meses = [];
  for (let i = periodos - 1; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    meses.push(d);
  }

  const labels = meses.map(m => `${m.toLocaleString('pt-BR', { month: 'short' })}/${m.getFullYear()}`);
  const statusTipos = ["Confirmado", "Compareceu", "Aguardando Confirmação", "Cancelado"];
  const cores = ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c"];

  const datasets = statusTipos.map((status, index) => {
    const valores = meses.map(m => {
      const mesStr = m.toISOString().slice(0, 7);
      return agendamentosFiltrados.filter(a =>
        a.Data_do_Atendimento.slice(0, 7) === mesStr && a.Status_da_Consulta === status
      ).length;
    });

    return {
      label: status,
      data: valores,
      backgroundColor: cores[index],
      barThickness: 20,  // deixa a barra fina
      maxBarThickness: 25
    };
  });

  const ctx = document.getElementById("agendamentosChart").getContext("2d");
  if (agendamentosChart) agendamentosChart.destroy();

  agendamentosChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Agendamentos por Status - Últimos ${periodos} Meses`
        },
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          stacked: false,
          ticks: { maxRotation: 0 },
          grid: { display: false }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}

// Atualiza gráfico ao mudar o select
document.getElementById("periodoSelect").addEventListener("change", (e) => {
  const periodos = parseInt(e.target.value);
  carregarAgendamentosComparativo(periodos);
});

// Carrega gráfico inicialmente (trimestral)
carregarAgendamentosComparativo(3);


