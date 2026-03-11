const senhaAdmin = "landri26@";

/* RESET TODO DOMINGO */
function verificarDomingo(){
  let hoje = new Date();
  let diaSemana = hoje.getDay(); // 0 = domingo
  let ultimaLimpeza = localStorage.getItem("ultimaLimpeza");
  let hojeTexto = hoje.toDateString();

  if(diaSemana === 0 && ultimaLimpeza !== hojeTexto){
    localStorage.removeItem("agenda");
    localStorage.setItem("ultimaLimpeza", hojeTexto);
  }
}

verificarDomingo();

/* HORÁRIOS */
const horarios = [
  "07:00",
  "08:00",
  "09:15",
  "10:15",
  "11:15",
  "13:00",
  "14:00",
  "15:15"
];

const dias = ["Seg","Ter","Qua","Qui","Sex"];

let agenda = JSON.parse(localStorage.getItem("agenda")) || {};

/* CRIAR TABELA */
function criarTabela(){
  const tabela = document.getElementById("tabelaAgenda");
  tabela.innerHTML = "";

  horarios.forEach(horario => {
    let linha = "<tr>";
    linha += `<td>${horario}</td>`;
    dias.forEach(dia => {
      let chave = dia + "-" + horario;
      if(agenda[chave]){
        linha += `<td class="agendamento">
          ${agenda[chave]}<br>
          <button class="excluir" onclick="excluir('${chave}')">Excluir</button>
        </td>`;
      } else {
        linha += "<td>-</td>";
      }
    });
    linha += "</tr>";
    tabela.innerHTML += linha;
  });
}

/* AGENDAR */
function agendar(){
  let professor = document.getElementById("professor").value;
  let turma = document.getElementById("turma").value;
  let dia = document.getElementById("dia").value;
  let horario = document.getElementById("horario").value;

  if(professor === "" || turma === ""){
    alert("Preencha todos os campos");
    return;
  }

  let diaCurto = dia.substring(0,3);
  let chave = diaCurto + "-" + horario;

  if(agenda[chave]){
    alert("Esse horário já está ocupado.");
    return;
  }

  agenda[chave] = professor + " (" + turma + ")";
  localStorage.setItem("agenda", JSON.stringify(agenda));
  criarTabela();

  document.getElementById("professor").value = "";
  document.getElementById("turma").value = "";
}

/* EXCLUIR */
function excluir(chave){
  let senha = prompt("Digite a senha para excluir:");
  if(senha !== senhaAdmin){
    alert("Senha incorreta");
    return;
  }

  delete agenda[chave];
  localStorage.setItem("agenda", JSON.stringify(agenda));
  criarTabela();
}

/* GERAR PDF ESTILIZADO */
function baixarPDF(){
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(16);
  doc.setTextColor(27, 94, 32); // verde header
  doc.text("Agenda do Laboratório", 105, 15, {align: "center"});
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("CETI Landri Sales", 105, 22, {align: "center"});

  // Montar dados
  let tabelaData = [];
  horarios.forEach(h => {
    let linha = [h];
    dias.forEach(d => {
      let chave = d + "-" + h;
      linha.push(agenda[chave] || "-");
    });
    tabelaData.push(linha);
  });

  // Criar tabela
  doc.autoTable({
    startY: 30,
    head: [["Horário","Seg","Ter","Qua","Qui","Sex"]],
    body: tabelaData,
    theme: "grid",
    headStyles: {
      fillColor: [27, 94, 32],
      textColor: [255, 255, 255],
      halign: 'center'
    },
    bodyStyles: {
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [232, 245, 233]
    },
    tableLineWidth: 0.5
  });

  doc.save("agenda-laboratorio.pdf");
}

/* INICIALIZAÇÃO */
criarTabela();