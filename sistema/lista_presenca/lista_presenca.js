verificaAutenticado();

let Usuario = "";
let Nome = "";
let consultores = [];

async function carregarConsultores() {
    const token = localStorage.getItem(CHAVE);
    const response = await fetch('/verify', {
        body: JSON.stringify({ token }),
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    Usuario = data.Usuario;
    Nome = data.Nome;

    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) userGreeting.textContent = `Olá, ${Nome}!`;

    const response2 = await fetch('/users');
    consultores = await response2.json();

    const list = document.getElementById("lista");
    if (!list) return;

    if (data.Secretaria) {
        consultores
            .filter(arq => !arq.Secretaria && arq.Nome !== "ADM")
            .forEach(({ Usuario, Nome }) => {
                list.innerHTML += `<option value="${Usuario}">${Nome}</option>`;
            });
    } else {
        [data].forEach(({ Usuario, Nome }) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
  

    const modPresenca = document.getElementById('mod-presenca');
    const tbodyPresenca = document.getElementById("tbodyPresenca");
    const list = document.getElementById("lista");
    const nameinppresenca = document.getElementById("age_name_presenca");

    let todosPacientes = [];
    let pacientesFiltradosPresenca = [];
    let itemsPresenca = [];

    async function carregarPacientes() {
        const response = await fetch('/pacientes');
        todosPacientes = await response.json();
    }

    async function getConsultasBD(valuePacienteFiltrado) {
        const response = await fetch("/agendamentos_filtrado?id=" + valuePacienteFiltrado, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        itemsPresenca = await response.json();
        itemsPresenca = itemsPresenca.filter(item => item.Status_da_Consulta === "Compareceu");

        const filtroData = document.getElementById("filtroData").value;
        const filtroMes = document.getElementById("filtroMes").value;
        const filtroAno = document.getElementById("filtroAno").value;

        itemsPresenca = itemsPresenca.filter(item => {
            const [ano, mes, dia] = item.Data_do_Atendimento.split("T")[0].split("-");
            const dataISO = `${ano}-${mes}-${dia}`;

            if (filtroData && filtroData !== dataISO) return false;
            if (filtroMes && filtroMes !== mes) return false;
            if (filtroAno && filtroAno !== ano) return false;

            return true;
        });

        itemsPresenca = itemsPresenca.map(arg => {
            arg.Nome = todosPacientes.find(({ id }) => id === arg.Nome)?.Nome || "Paciente não encontrado";
            return arg;
        });
    }

    function insertItemPresenca(item, index) {
        let tr = document.createElement("tr");
        const date = new Date(item.Data_do_Atendimento);
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const dataFormatada = adjustedDate.toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const especialistaNome = consultores.find(e => e.Usuario === item.Especialista)?.Nome || "Especialista não encontrado";

        tr.innerHTML = `
            <td id="${item.id}">${item.Nome}</td>
            <td>${dataFormatada}</td>
            <td>${item.Horario_da_consulta}</td>
            <td>${item.Horario_de_Termino_da_consulta}</td>
            <td>${item.Status_da_Consulta === "Compareceu" ? "Presente" : item.Status_da_Consulta}</td>
            <td class="columnAction">
                <button type="button" onclick='showModal(${JSON.stringify(item)})'></button>
            </td>
        `;

        tbodyPresenca.appendChild(tr);
    }

    function loadConsultas(event) {
        event.preventDefault();
        const pacienteFiltrado = document.getElementById("age_name_presenca");
        const valuePacienteFiltrado = pacienteFiltrado.value;

        getConsultasBD(valuePacienteFiltrado).then(() => {
            tbodyPresenca.innerHTML = "";
            itemsPresenca.forEach((item, index) => {
                insertItemPresenca(item, index);
            });
        }).catch(console.error);
    }

    list.addEventListener("change", () => {
        if (list.value === "-") return;

        pacientesFiltradosPresenca = todosPacientes.filter(({ Especialista }) => Especialista === list.value);
        nameinppresenca.innerHTML = '';
        pacientesFiltradosPresenca.forEach(item => {
            nameinppresenca.innerHTML += `<option value="${item.id}">${item.Nome}</option>`;
        });
    });

    const btnPresenca = document.getElementById('presenca');
    if (btnPresenca) {
        btnPresenca.addEventListener('click', () => {
            if (list.value === "-") return;

            pacientesFiltradosPresenca = todosPacientes.filter(({ Especialista }) => Especialista === list.value);
            nameinppresenca.innerHTML = '';
            pacientesFiltradosPresenca.forEach(item => {
                nameinppresenca.innerHTML += `<option value="${item.id}">${item.Nome}</option>`;
            });

            modPresenca.style.display = "block";
        });
    }

    const btnVoltar = document.getElementById('btn-voltar-presenca');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = '../Menu/menu.html';
        });
    }

    const buscarBtn = document.querySelector(".cancel-button[onclick='loadConsultas(event)']");
    if (buscarBtn) buscarBtn.addEventListener("click", loadConsultas);

    carregarPacientes().catch(console.error);
    carregarConsultores().catch(console.error);
});

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
        if (mouseDown) moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    draggable.onmouseup = function () {
        mouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
    };
};

window.addEventListener("message", (event) => {
    if (event.data === "desligamouse") {
        draggable.width = "50";
        draggable.height = "50";
    }
    if (event.data === "ligamouse") {
        draggable.width = "400";
        draggable.height = "500";
    }
});

const ajudaBtn = document.getElementById('ajudaBtn');
const ajudaPopup = document.getElementById('ajudaPopup');
const listaMensagens = document.getElementById('listaMensagens');

window.addEventListener('load', () => {
    ajudaPopup.style.display = 'none';
});

ajudaBtn.addEventListener('click', async () => {
    ajudaPopup.style.display = 'flex';

    try {
        const resp = await fetch(`/ajuda?especialista=${encodeURIComponent(Nome)}`);
        if (!resp.ok) throw new Error("Falha ao buscar ajudas");
        const dados = await resp.json();

        listaMensagens.innerHTML = "";

        dados.forEach(item => {
  if (item.status === "Concluído") return;
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
                especialista: Nome
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

        dados.forEach(item => {
            const cacheItem = ajudasCache.get(item.id);
            if (cacheItem && cacheItem.status !== item.status) {
                mostrarNotificacaoStatus(item);
            }
            ajudasCache.set(item.id, item);
        });
    } catch (err) {
        console.error("Erro ao buscar ajudas no polling:", err);
    }
}

function mostrarNotificacaoStatus(item) {
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });

    const ticket = item.id.split('-')[0];

    let statusClasse = '';
    if (item.status === 'Recebido') statusClasse = 'recebido';
    else if (item.status === 'Em Andamento') statusClasse = 'andamento';
    else if (item.status === 'Concluído') statusClasse = 'concluido';

    const notif = document.createElement('div');
    notif.className = `notificacao-status ${statusClasse}`;
    notif.innerHTML = `
    NsBaseTech informa: <br>
    <strong>Chamado #${ticket}</strong> <br>
    atualizado para <em>${item.status}</em><br>
    <small>${data} ${hora}</small><br>
    <button class="btn-ok" style="align-items:center">OK</button>
  `;

    const btnOk = notif.querySelector('.btn-ok');
   btnOk.addEventListener('click', () => {
  notif.remove();
  if (ajudaPopup.style.display !== 'none') {
    ajudaBtn.click(); // atualiza a lista de chamados se o popup estiver aberto
  }
    });

    document.body.prepend(notif);
}

setInterval(buscarAjudas, 5000);
buscarAjudas();

document.getElementById("ch-side").addEventListener("change", event => {
    const mainSide = document.getElementById("main-side");
    mainSide.classList.toggle("off", !event.target.checked);
});
