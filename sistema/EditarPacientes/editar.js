verificaAutenticado()

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

document.getElementById("btn_voltar_ed").addEventListener("click", () => {
  window.location.href = '../Cadastro_pacientes/lista_pacientes.html'
})


document.getElementById('btn_cadastrar').addEventListener('click', cadastrar_paciente);


const list = document.getElementById("lista")

const nameinp = document.getElementById("name")
const phoneinp = document.getElementById("phone")
const emailinp = document.getElementById("email")
const nascinp = document.getElementById("nasc")
const idadeinp = document.getElementById("idade")
const geninp = document.getElementById("gen")
const cpf_cnpjinp = document.getElementById("cpf_cnpj")
const addressinp = document.getElementById("address")
const numberinp = document.getElementById("number")
const cepinp = document.getElementById("cep");
const cidadeinp = document.getElementById("cidade")
const estadoinp = document.getElementById("estado")
const isehcrianca = document.getElementById("mostrarSubformi")
const namepaiinp = document.getElementById("namepai")
const phonepaiinp = document.getElementById("phonepai")
const namemaeinp = document.getElementById("namemae")
const phonemaeinp = document.getElementById("phonemae")
nascinp.addEventListener('change', () => {
  const hoje = new Date();
  const nascimento = new Date(nascinp.value);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  idadeinp.value = idade >= 0 ? idade : '';
});
  ; (async () => {
    const params = new URLSearchParams(window.location.search)
    const response = await fetch(`/pacientes/${params.get('id')}`)
    const data = await response.json()

    nameinp.value = data.Nome
    phoneinp.value = data.Telefone
    emailinp.value = data.Email
    nascinp.value = data.Data_de_Nascimento
    idadeinp.value = data.Idade
    geninp.value = data.Genero
    cpf_cnpjinp.value = data.CPF_CNPJ
    addressinp.value = data.Endereco
    numberinp.value = data.Numero
    cepinp.value = data.CEP
    cidadeinp.value = data.Cidade
    estadoinp.value = data.Estado
    isehcrianca.checked = data.Eh_Crianca
    namepaiinp.value = data.Nome_do_Pai_ou_Responsavel
    phonepaiinp.value = data.Telefone_Pai
    namemaeinp.value = data.Nome_da_Mae_ou_Responsavel
    phonemaeinp.value = data.Telefone_Mae

  })();

// Adicione um evento de clique ao botão

function cadastrar_paciente(event) {
  event.preventDefault();
  const params = new URLSearchParams(window.location.search);
  fetch(`/cadastrar_paciente/${params.get('id')}`, {
    method: "PUT",
    body: JSON.stringify({
      Nome: nameinp.value,
      Telefone: phoneinp.value,
      Email: emailinp.value,
      Data_de_Nascimento: nascinp.value,
      Idade: idadeinp.value,
      Genero: geninp.value,
      CPF_CNPJ: cpf_cnpjinp.value,
      Endereco: addressinp.value,
      Numero: numberinp.value,
      CEP: cepinp.value,
      Estado: estadoinp.value,
      Cidade: cidadeinp.value,
      Eh_Crianca: isehcrianca.checked,
      Nome_do_Pai_ou_Responsavel: namepaiinp.value,
      Telefone_Pai: phonepaiinp.value,
      Nome_da_Mae_ou_Responsavel: namemaeinp.value,
      Telefone_Mae: phonemaeinp.value,
      Especialista: lista.value,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json()).then(data => {
    if (lista.value === "-") {
      alert("Selecione o Especialista");
      return;
    } else {
      alert("Paciente atualizado com sucesso!");
      window.location.reload();
    }
  }).catch(() => alert("Erro ao atualizar"));
}




document.getElementById('mostrarSubformi').addEventListener('change', function () {
  var subformi = document.getElementById('subformi');
  subformi.style.display = this.checked ? 'block' : 'none';
});




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
  const userGreeting = document.getElementById('userGreeting');
  userGreeting.textContent = `Olá, ${Nome}!`;


  // data = USUARIO DO BANCO LOGADO

  // -----------------------------------

  const response2 = await fetch('/users')
  const consultores = await response2.json()


  if (data.Secretaria) {
    consultores.filter(arq => !arq.Secretaria && arq.Nome !== "ADM").forEach(({ Usuario, Nome }) => {
      list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
    })
  } else {
    [data].forEach(({ Usuario, Nome }) => {
      list.innerHTML += `<option value="${Usuario}">${Nome}</option>`

    })
  }
})().catch(console.error)


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

//cep

// Função para consultar o CEP e preencher os campos de endereço
async function consultarCEP(cep) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;

    // Preencher os campos de endereço com os dados recebidos da API
    document.getElementById('address').value = data.logradouro;
    document.getElementById('cidade').value = data.localidade;
    document.getElementById('estado').value = data.uf;
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    alert('CEP não encontrado. Verifique o número e tente novamente.');
  }
}

// Função para capturar o evento de mudança no campo de CEP
document.getElementById('cep').addEventListener('change', function () {
  const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cep.length === 8) { // Verifica se o CEP possui 8 dígitos
    consultarCEP(cep);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const numberInput = document.getElementById('number');

  // Seleciona todos os inputs relevantes exceto o campo de número
  const inputs = Array.from(document.querySelectorAll('input.input, input.inputnasc'))
    .filter(input => input.id !== 'number');

  inputs.forEach((input) => {
    input.addEventListener('keydown', (event) => {
      console.log('Tecla pressionada:', event.key); // Log para verificar a tecla pressionada
      if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // Evita o envio do formulário
        console.log('Enter detectado no input:', input.id); // Log para verificar o input atual

        // Foco específico no campo de número
        if (numberInput) {
          setTimeout(() => {
            numberInput.focus(); // Move o foco para o campo de número
            console.log('Foco movido para o campo número:', numberInput.id); // Log para verificar o campo de número
          }, 10); // Adiciona um pequeno atraso
        }
      }
    });
  });
});



//botao ajuda
let Usuario = ""
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
      if (item.status === "Concluído") return; // pula chamados concluídos
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