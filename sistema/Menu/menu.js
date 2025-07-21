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

      const userGreeting = document.getElementById('userGreeting');
      userGreeting.textContent = `Olá, ${Nome}!`;

      const userGreeting1 = document.getElementById('userGreeting1');
      userGreeting1.textContent = `Bem-vindo(a) ${Nome}!`;

      const thumbnail = document.getElementById('thumbnail');
      thumbnail.src = data.foto
      thumbnail.style.display = 'block';


      // if (data.Secretaria) {
      //    const btnFluxo = document.getElementById("btn_fluxo");
      //    btnFluxo.parentNode.removeChild(btnFluxo);
      //    const backdrop3 = document.getElementById("backdrop3");
      //    backdrop3.parentNode.removeChild(backdrop3);
      //    const flxlateral = document.getElementById("flxLateral");
      //    flxlateral.parentNode.removeChild(flxLateral);

      // } else {
      //    // COISAS Q EU QUERO FAZER SE N FOR SECRETARIA
      // }

      // if (data.Profissional) {
      //    // COISAS Q EU QUERO FAZER SE FOR PROFISSIONAL
      // } else {
      //    // COISAS Q EU QUERO FAZER SE N FOR PROFISSIONAL
      // }
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
  ajudaPopup.style.display = 'flex';

  try {
    const resp = await fetch(`/ajuda?especialista=${encodeURIComponent(Nome)}`);

    if (!resp.ok) throw new Error("Falha ao buscar ajudas");
    const dados = await resp.json();

    listaMensagens.innerHTML = ""; // limpa a lista antes de renderizar

    dados.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('mensagem');
      div.dataset.id = item.id; // útil pra atualizações futuras

     div.innerHTML = `
  <p><strong>Chamado #${item.ticket}</strong> 
  <strong>Tela do problema: ${item.tela}</strong>
  <p>${item.descricao}</p>
  <div class="botoes-status">
    <button class="recebido ${item.status === 'Recebido' ? 'ativo' : ''}">Recebido</button>
    <button class="andamento ${item.status === 'Em Andamento' ? 'ativo' : ''}">Em Andamento</button>
    <button class="concluido ${item.status === 'Concluído' ? 'ativo' : ''}">Concluído</button>
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

    const inputFiltro = document.getElementById("filtroTicket");

    inputFiltro.addEventListener("input", () => {
      const termo = inputFiltro.value.trim().toLowerCase();

      document.querySelectorAll(".mensagem").forEach(div => {
        const ticket = div.querySelector("strong")?.innerText?.toLowerCase() || "";
        div.style.display = ticket.includes(termo) ? "block" : "none";
      });
    });

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


