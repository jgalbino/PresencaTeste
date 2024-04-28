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

    relatorioTabela.innerHTML = ''; // Limpar a tabela antes de carregar

    try {
        const querySnapshot = await db.collection("Presenças").get();
        const dados = querySnapshot.docs.map((doc) => doc.data());

        // Agrupar conforme o critério selecionado
        const agrupado = {};

        dados.forEach((item) => {
            const chave = item[agrupamento]; // Pode ser data, ano, turma, professor, etc.

            if (!agrupado[chave]) {
                agrupado[chave] = [];
            }

            agrupado[chave].push(item);
        });

        // Criar a tabela para exibição do relatório
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

        return agrupado; // Retorna para usar na função de baixar como TXT
    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
    }
};

// Função para baixar relatório como arquivo de texto
const baixarRelatorioTXT = async () => {
    const agrupado = await gerarRelatorio();

    if (!agrupado) {
        console.error("Não foi possível gerar o relatório para baixar.");
        return;
    }

    // Criar o conteúdo do arquivo TXT
    let txtContent = "Relatório de Faltas:\n\n";

    for (const chave in agrupado) {
        txtContent += `Agrupamento: ${chave}\n`;
        txtContent += "Detalhes:\n";

        agrupado[chave].forEach((item) => {
            txtContent += `  - ${item.presentes.join(", ")}\n`;
        });

        txtContent += "\n";
    }

    // Criar um Blob para o arquivo TXT
    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Criar um link para download do arquivo TXT
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio_faltas.txt";
    a.click(); // Clicar para iniciar o download

    URL.revokeObjectURL(url); // Limpar o objeto após download
};

// Vincular evento para gerar o relatório
document.getElementById("gerar-relatorio").addEventListener("click", gerarRelatorio);

// Vincular evento para baixar relatório como TXT
document.getElementById("baixar-txt").addEventListener("click", baixarRelatorioTXT);

