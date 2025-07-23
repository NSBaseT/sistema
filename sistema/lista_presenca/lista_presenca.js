document.addEventListener("DOMContentLoaded", () => {
    verificaAutenticado();

    const modPresenca = document.getElementById('mod-presenca');
    const tbodyPresenca = document.getElementById("tbodyPresenca");
    const list = document.getElementById("lista");
    const nameinppresenca = document.getElementById("age_name_presenca");

    let todosPacientes = [];
    let pacientesFiltradosPresenca = [];
    let consultores = [];
    let itemsPresenca = [];

    async function carregarPacientes() {
        const response = await fetch('/pacientes');
        todosPacientes = await response.json();
    }

    async function carregarConsultores() {
        const token = localStorage.getItem(CHAVE);
        const response = await fetch('/verify', {
            body: JSON.stringify({ token }),
            method: 'POST',
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        Usuario = data.Usuario;

        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) userGreeting.textContent = `Olá, ${Usuario}!`;

        const response2 = await fetch('/users');
        consultores = await response2.json();

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

    async function getConsultasBD(valuePacienteFiltrado) {
        const response = await fetch("/agendamentos_filtrado?id=" + valuePacienteFiltrado, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        itemsPresenca = await response.json();

        // Filtro: apenas status Confirmado
        itemsPresenca = itemsPresenca.filter(item => item.Status_da_Consulta === "Compareceu");

        // Filtros de data/mês/ano
        const filtroData = document.getElementById("filtroData").value;  // yyyy-mm-dd
        const filtroMes = document.getElementById("filtroMes").value;    // MM
        const filtroAno = document.getElementById("filtroAno").value;    // yyyy

        itemsPresenca = itemsPresenca.filter(item => {
            const [ano, mes, dia] = item.Data_do_Atendimento.split("T")[0].split("-");

            const dataISO = `${ano}-${mes}-${dia}`; // Formato ISO para comparar com input

            if (filtroData && filtroData !== dataISO) return false;
            if (filtroMes && filtroMes !== mes) return false;
            if (filtroAno && filtroAno !== ano) return false;

            return true;
        });

        // Substitui id do paciente pelo nome
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
                <button type="button" onclick='showModal(${JSON.stringify(item)})'>
           
                </button>
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
