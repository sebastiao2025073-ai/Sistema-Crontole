/* RESET AUTOMÁTICO DA SEMANA */

function getSemana(){

let hoje = new Date();

let inicio = new Date(hoje.getFullYear(),0,1);

let dias = Math.floor((hoje - inicio) / (24*60*60*1000));

return Math.ceil((dias + inicio.getDay()+1)/7);

}

let semanaAtual = getSemana();

let semanaSalva = localStorage.getItem("semana");

if(semanaSalva != semanaAtual){

localStorage.clear();

localStorage.setItem("semana", semanaAtual);

}

/* CONFIGURAÇÕES */

const dias=["Segunda","Terça","Quarta","Quinta","Sexta"];

const horarios=["07:00","08:00","09:15","10:15","11:15","13:00","14:00","15:15"];


/* CARREGAR TABELA */

window.onload=function(){

let tabela=document.getElementById("tabela");

horarios.forEach(h=>{

let linha="<tr>";

linha+=`<td>⏰ ${h}</td>`;

dias.forEach(d=>{

let chave=d+"-"+h;

let ag=localStorage.getItem(chave);

if(ag){

linha+=`<td class="agendamento">📚 ${ag}<br><button class="excluir" onclick="remover('${chave}')">❌ Excluir</button></td>`;

}else{

linha+="<td>—</td>";

}

});

linha+="</tr>";

tabela.innerHTML+=linha;

});

}


/* AGENDAR */

function agendar(){

let professor=document.getElementById("professor").value;

let turma=document.getElementById("turma").value;

let dia=document.getElementById("dia").value;

let horario=document.getElementById("horario").value;

let chave=dia+"-"+horario;

/* VERIFICAR SE JÁ EXISTE AGENDAMENTO */

let existente = localStorage.getItem(chave);

if(existente){

alert("⚠️ Este horário já está ocupado!\n\nExclua o agendamento atual para cadastrar outro.");

return;

}

/* SALVAR */

localStorage.setItem(chave,professor+" ("+turma+")");

location.reload();

}


/* REMOVER */

function remover(chave){

localStorage.removeItem(chave);

location.reload();

}


/* GERAR PDF */

function gerarPDF(){

const { jsPDF } = window.jspdf;

let doc = new jsPDF();

doc.setFontSize(18);

doc.text("Agenda Semanal do Laboratório",14,15);

doc.setFontSize(12);

doc.text("CETI Landri Sales",14,22);

let tabelaData=[];

horarios.forEach(h=>{

let linha=[h];

dias.forEach(d=>{

let chave=d+"-"+h;

let ag=localStorage.getItem(chave);

linha.push(ag ? ag : "-");

});

tabelaData.push(linha);

});

doc.autoTable({

startY:30,

head:[["Horário","Segunda","Terça","Quarta","Quinta","Sex"]],

body:tabelaData,

theme:"grid",

headStyles:{fillColor:[27,94,32]},

styles:{halign:"center"}

});

doc.save("agenda-laboratorio.pdf");

}