const senhaAdmin = "landri26@";

/* RESET SEMANAL E AVISO */
function verificarSemana(){
  let hoje = new Date();
  let diaSemana = hoje.getDay(); // 0=domingo, 1=segunda...
  let semanaAtual = getNumeroSemana(hoje);
  let semanaSalva = localStorage.getItem("semanaAgenda");

  if(semanaSalva != semanaAtual){
    localStorage.removeItem("agenda");
    localStorage.setItem("semanaAgenda", semanaAtual);
    agenda = {}; // tabela limpa
    criarTabela();
    
    // Aviso verde igual o PDF / site
    let container = document.querySelector(".container");
    let aviso = document.createElement("div");
    aviso.innerText = "📢 Nova semana iniciada – agenda reiniciada automaticamente!";
    aviso.style.backgroundColor = "rgb(27,94,32)"; // verde do site/PDF
    aviso.style.color = "white";
    aviso.style.padding = "10px";
    aviso.style.borderRadius = "5px";
    aviso.style.textAlign = "center";
    aviso.style.marginBottom = "15px";
    container.prepend(aviso);
  }
}

// Função para calcular número da semana
function getNumeroSemana(data){
  let inicioAno = new Date(data.getFullYear(),0,1);
  let dias = Math.floor((data - inicioAno) / (24*60*60*1000));
  return Math.ceil((dias + inicioAno.getDay()+1)/7);
}

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

/* GERAR PDF ESTILIZADO COMO SITE */
function baixarPDF(){
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(16);
  doc.setTextColor(27,94,32); // verde igual ao site
  doc.text("Agenda do Laboratório", 105, 15, {align: "center"});
  doc.setFontSize(12);
  doc.setTextColor(0,0,0);
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
      fillColor: [27,94,32], // verde header site
      textColor: [255,255,255],
      halign: 'center'
    },
    bodyStyles: {
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [232,245,233] // verde clarinho alternado
    },
    tableLineWidth: 0.5
  });

  doc.save("agenda-laboratorio.pdf");
}

/* INICIALIZAÇÃO */
verificarSemana();
criarTabela();