verificaAutenticado()

let Usuario = ""

const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = []

btnNew.onclick = (event) => {
  if (descItem.value === "" || amount.value === "" || type.value === "" || date.value === "") {
    return alert("Preencha todos os campos!");
  }

  const Descricao = descItem.value
  const Valor = parseFloat(amount.value, 10);
  const Tipo = type.value
  const Data = date.value

  descItem.value = "";
  amount.value = "";
  date.value = "";



  fetch('/Fluxo_de_caixa', {
    method: 'POST',
    body: JSON.stringify({
      Descricao,
      Valor,
      Tipo,
      Data,
      Especialista: Usuario
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    location.reload();
  })

};


function deleteItem(index) {

  fetch('/Fluxo_de_caixa', {
    method: 'DELETE',
    body: JSON.stringify({
      id: items[index].id
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    loadItens()
  })
  location.reload();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Descricao}</td>
    <td>R$ ${item.Valor}</td>
    
    <td class="columnType">${item.Tipo === "Entrada"
      ? '<i class="bx bxs-chevron-up-circle"></i>'
      : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td>${item.Data}</td>
    <td class="columnAction">
      ${item.Descricao.startsWith('Atendimento: ') ? '' : `<button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>`
    }
      
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  const mes = document.getElementById('meses').value
  const selectedYear = document.getElementById('selected-year').value
  const selectedPaciente = document.getElementById('selected-Pacientes').value

  console.log(selectedPaciente)

  tbody.innerHTML = "";

  const itensFiltrados = items.filter(item => item.Especialista === Usuario
    && (mes === '' || item.Data.split('-')[1] === mes)
    && (selectedYear === '' || item.Data.split('-')[0] === selectedYear)
    && (selectedPaciente === '' || item.Descricao === selectedPaciente))
  console.log(itensFiltrados)
  itensFiltrados.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals(itensFiltrados);
}

function getTotals(itensFiltrados) {
  const amountIncomes = itensFiltrados
    .filter((item) => item.Tipo === "Entrada" && item.Especialista === Usuario)
    .map((transaction) => Number(transaction.Valor));

  const amountExpenses = itensFiltrados
    .filter((item) => item.Tipo === "Saída" && item.Especialista === Usuario)
    .map((transaction) => Number(transaction.Valor));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = async () => {
  const response = await fetch('/Fluxo_de_caixa')
  items = await response.json()


  const itensFiltrados = items.filter(item => item.Especialista === Usuario)
  const atendimentos = itensFiltrados.filter(items => items.Descricao.startsWith('Atendimento: ')).map(arg => arg.Descricao)


  let atendimentosDistintos = [...new Set(atendimentos)];

  document.getElementById('selected-Pacientes').innerHTML += atendimentosDistintos.map(arg => `
    <option value="${arg}">${arg.replace('Atendimento: ', '')}</option>  
  `)
}





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

    let NomeSaudacao = "";

if (data.Secretaria) {
  Usuario = "Sandra"; // Para filtrar os dados
  NomeSaudacao = "Secretária";

  const tituloFluxo = document.getElementById("tituloFluxo");
  if (tituloFluxo) {
    tituloFluxo.textContent = "Fluxo de Caixa de Dr(a). Sandra";
  }

} else {
  Usuario = data.Usuario;
  Nome = data.Nome;
  NomeSaudacao = data.Nome;

  const tituloFluxo = document.getElementById("tituloFluxo");
  if (tituloFluxo) {
    tituloFluxo.textContent = `Caixa de Dr(a). ${Nome}`;
  }
}

const userGreeting = document.getElementById('userGreeting');
userGreeting.textContent = `Olá, ${NomeSaudacao}!`;


    await getItensBD()

    loadItens();
  })().catch(console.error)

document.getElementById("ch-side").addEventListener("change", event => {
  const mainSide = document.getElementById("main-side")
  if (event.target.checked) {
    mainSide.classList.remove("off")
  }
  else {
    mainSide.classList.add("off")
  }
})



document.getElementById("btn_voltar_flx").addEventListener("click", () => {
  window.location.href = '../Menu/menu.html';
});

document.getElementById("open-chat-btn1").addEventListener("click", () => {
  window.location.href = '../chat/chat.html'
})

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
const Especialista = Usuario
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
  if (item.status === "Concluído") return;
      const agora = new Date(item.criadoEm);
      const data = agora.toLocaleDateString('pt-BR'); // ex: 21/07/2025
      const hora = agora.toLocaleTimeString('pt-BR', { hour12: false }); // ex: 20:35:12

      const div = document.createElement('div');
      div.classList.add('mensagem');
      div.dataset.id = item.id; // útil pra atualizações futuras

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
          // Aqui você pode enviar um PUT para atualizar o status no backend
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