verificaAutenticado()

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })

  document.getElementById("btn_voltar_pr").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html';
});


const nameprofinp = document.getElementById("nameprof")
const faixa_etariainp = document.getElementById("faixa_etaria")
const data_atendinp = document.getElementById("data_atend")
const horario_atendinp = document.getElementById("horario_atend")
const especialidadeinp = document.getElementById("especialidade")
const reg_profissionalinp = document.getElementById("reg_profissional")


const list = document.getElementById("lista")

list.onchange = async function (e) {
   const response = await fetch(`/cadastro_prof/${e.target.value}`)
   const data = await response.json()
   if(data){
    nameprofinp.value = data.Nome
    faixa_etariainp.value  = data.Faixa_Etaria_de_Atendimento
    data_atendinp.value = data.Dias_de_Atendimento
    horario_atendinp.value = data.Horarios_de_Atendimento
    especialidadeinp.value = data.Especialidade
    reg_profissionalinp.value = data.Registro_do_Profissional

   }
   else {
    nameprofinp.value = ''
    faixa_etariainp.value  = ''
    data_atendinp.value = ''
    horario_atendinp.value = ''
    especialidadeinp.value = ''
    reg_profissionalinp.value = ''
   }

   
}


;(async () => {
    const token = localStorage.getItem(CHAVE)

    const response = await fetch('/verify', {
        body: JSON.stringify({ token }),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await response.json()
    Usuario = data.Usuario;
    const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Olá, ${Usuario}!`;

    // data = USUARIO DO BANCO LOGADO

// -----------------------------------

    const response2 = await fetch('/users')
    const consultores = await response2.json()


    if (data.Secretaria) {
        consultores.filter(arq=>!arq.Secretaria && arq.Nome !== "ADM").forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
        })
    } else {
        [data].forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
          
        })
    }
})().catch(console.error)

async function cadastro_prof(event) {
    event.preventDefault()

   const response = await fetch(`/cadastro_prof/${list.value}`)
   const data = await response.json()

    fetch("/cadastro_prof", {
        method: data===null?"POST":"PUT",
        body: JSON.stringify({

            Nome: nameprofinp.value,
            Faixa_Etaria_de_Atendimento: faixa_etariainp.value,
            Dias_de_Atendimento: data_atendinp.value,
            Horarios_de_Atendimento: horario_atendinp.value,
            Especialidade: especialidadeinp.value,
            Registro_do_Profissional: reg_profissionalinp.value, 
            Especialista: list.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Profissional cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}

const draggable = document.getElementById('draggable-container');
let isDraggable = true;
let mouseDown = false;

draggable.onmousedown = function (event){
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

window.addEventListener("message", (event)=>{
if (event.data === "desligamouse"){
draggable.width = "50" 
draggable.height = "50"
}

if (event.data === "ligamouse"){
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
  if (list.value === "-") {
        alert("Selecione o Especialista");
    } else {
  ajudaPopup.style.display = 'flex';
    }
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