// Configuração do Firebase
var config = {
    apiKey: "AIzaSyDayv8_M_jNUwigisneCBxu_O1eRjTO7B8",
    authDomain: "presencateste-77a47.firebaseapp.com",
    projectId: "presencateste-77a47",
    storageBucket: "presencateste-77a47.appspot.com",
    messagingSenderId: "568981214936",
    appId: "1:568981214936:web:7285386a485d09e05769ad",
    measurementId: "G-862812QEH6"
};

// Inicializar Firebase
const app = firebase.initializeApp(config);
const db = firebase.firestore();

// Função para gerar o relatório de faltas
const gerarRelatorio = async () => {
    const agrupamento = document.getElementById("select-agrupamento").value;
    const relatorioTabela = document.getElementById("relatorio-tabela");

    if (!agrupamento) {
        console.error("Critério de agrupamento não selecionado.");
        return;
    }

    relatorioTabela.innerHTML = ''; // Limpar tabela antes de carregar

    try {
        const querySnapshot = await db.collection("Presenças").get();
        const dados = querySnapshot.docs.map((doc) => doc.data());

        // Agrupar dados conforme o critério selecionado
        const agrupado = {};

        dados.forEach((item) => {
            const chave = item[agrupamento]; // Pode ser data, ano, turma, professor, etc.

            if (!agrupado[chave]) {
                agrupado[chave] = [];
            }

            agrupado[chave].push(item);
        });

        // Criar a tabela para exibir o relatório
        const table = document.createElement("table");
        table.className = "table table-striped";

        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");
        trHead.appendChild(document.createElement("th")).textContent = "Agrupamento";
        trHead.appendChild(document.createElement("th")).textContent = "Detalhes";

        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        for (const chave in agrupado) {
            const tr = document.createElement("tr");

            const agrupamentoCell = document.createElement("td");
            agrupamentoCell.textContent = chave; // Exibe o valor do agrupamento

            const detalhesCell = document.createElement("td");
            detalhesCell.textContent = agrupado[chave].map((item) => item.presentes.join(", ")).join(" | ");

            tr.appendChild(agrupamentoCell);
            tr.appendChild(detalhesCell);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        relatorioTabela.appendChild(table);
    } catch (error) {
        console.error("Erro ao gerar relatório de faltas:", error);
    }
};

// Vincular evento para gerar relatório
document.getElementById("gerar-relatorio").addEventListener("click", gerarRelatorio);

