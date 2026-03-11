/* SENHA PARA EXCLUIR */

const senhaAdmin = "landri26@";


/* RESET AUTOMÁTICO SEMANAL */

function numeroSemana(){

let hoje = new Date();
let inicioAno = new Date(hoje.getFullYear(),0,1);

let dias = Math.floor((hoje - inicioAno) / (24*60*60*1000));

return Math.ceil((dias + inicioAno.getDay()+1)/7);

}

let semanaAtual = numeroSemana();
let semanaSalva = localStorage.getItem("semanaAgenda");

if(semanaSalva != semanaAtual){

localStorage.removeItem("agenda");
localStorage.setItem("semanaAgenda", semanaAtual);

}


/* HORÁRIOS (apenas início) */

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


/* DIAS */

const dias = ["Seg","Ter","Qua","Qui","Sex"];


/* CARREGAR AGENDA */

let agenda = JSON.parse(localStorage.getItem("agenda")) || {};


/* CRIAR TABELA */

function criarTabela(){

const tabela = document.getElementById("tabelaAgenda");

tabela.innerHTML="";

horarios.forEach(horario => {

let linha = "<tr>";

linha += `<td>${horario}</td>`;

dias.forEach(dia => {

let chave = dia+"-"+horario;

if(agenda[chave]){

linha += `<td class="agendamento">

${agenda[chave]}

<br>

<button class="excluir" onclick="excluir('${chave}')">Excluir</button>

</td>`;

}else{

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

if(professor=="" || turma==""){
alert("Preencha todos os campos");
return;
}

let diaCurto = dia.substring(0,3);

let chave = diaCurto+"-"+horario;

if(agenda[chave]){
alert("Esse horário já está ocupado.");
return;
}

agenda[chave] = professor+" ("+turma+")";

localStorage.setItem("agenda",JSON.stringify(agenda));

criarTabela();

document.getElementById("professor").value="";
document.getElementById("turma").value="";

}


/* EXCLUIR */

function excluir(chave){

let senha = prompt("Digite a senha para excluir:");

if(senha !== senhaAdmin){
alert("Senha incorreta!");
return;
}

delete agenda[chave];

localStorage.setItem("agenda",JSON.stringify(agenda));

criarTabela();

}


/* GERAR PDF */

function baixarPDF(){

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

let ag=agenda[chave];

linha.push(ag ? ag : "-");

});

tabelaData.push(linha);

});

doc.autoTable({

startY:30,

head:[["Horário","Segunda","Terça","Quarta","Quinta","Sexta"]],

body:tabelaData,

theme:"grid",

headStyles:{fillColor:[27,94,32]},

styles:{halign:"center"}

});

doc.save("agenda-laboratorio.pdf");

}


/* INICIAR */

criarTabela();