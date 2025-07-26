//verificaAutenticado()

document.getElementById("btn_voltar_mp").addEventListener("click", () => {
  window.location.href = '../Login/Login.html'
})

const nameinp = document.getElementById("name")
const emailinp = document.getElementById("email")
const userinp = document.getElementById("user")


let id = " "
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

    nameinp.value = data.Nome
    emailinp.value = data.Email
    userinp.value = data.Usuario
    id = data.id
    const thumbnail = document.getElementById('thumbnail');
    thumbnail.src = data.foto
    thumbnail.style.display = 'block';



  })();


const fotinha = document.getElementById("fotinha")


const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});


async function cadastro_user(event) {
  event.preventDefault()
  const params = new URLSearchParams(window.location.search)

  let foto = null

  if (fotinha.files.length !== 0) {
    const arquivoFoto = fotinha.files[0]
    foto = await toBase64(arquivoFoto)
  }
  console.log(foto)

  fetch(`/cadastrar_user/${id}`, {
    method: "PUT",
    body: JSON.stringify({

      Nome: nameinp.value,
      Email: emailinp.value,
      Usuario: userinp.value,
      foto,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json()).then(data => {
    alert("Perfil Atualizado com sucesso!")
    window.location.reload()
  }).catch(() => alert("Erro ao atualizar"))
}

document.getElementById("ch-side").addEventListener("change", event => {
  const mainSide = document.getElementById("main-side")
  if (event.target.checked) {
    mainSide.classList.remove("off")
  }
  else {
    mainSide.classList.add("off")
  }
})

function displayThumbnail(event) {
  const input = event.target;
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const thumbnail = document.getElementById('thumbnail');
      thumbnail.src = e.target.result;
      thumbnail.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
}


//botao ajuda

const Nome = nameinp.value
const ajudaBtn = document.getElementById('ajudaBtn');
const ajudaPopup = document.getElementById('ajudaPopup');
const listaMensagens = document.getElementById('listaMensagens');
const especialista = Nome

// Fecha o popup ao carregar a página
window.addEventListener('load', () => {
  ajudaPopup.style.display = 'none';
});


// Abre o popup e carrega as solicitações do backend
ajudaBtn.addEventListener('click', async () => {
  ajudaPopup.style.display = 'flex';

  try {
    const resp = await fetch(`/ajuda?especialista=${encodeURIComponent(especialista)}`);
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
    const resp = await fetch(`/ajuda?especialista=${encodeURIComponent(especialista)}`);
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