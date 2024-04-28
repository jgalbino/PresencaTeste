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

// Função para carregar turmas
const loadTurmas = async () => {
    try {
        // Obter todos os documentos da coleção "Turmas"
        const querySnapshot = await db.collection("Turmas").get();

        // Mapeie para obter o ID do documento e o campo "nome"
        const turmas = querySnapshot.docs.map((doc) => {
            return { id: doc.id, nome: doc.data().nome };
        });

        // Preencher o dropdown com as turmas
        preencherDropdown("select-class-turma", turmas);
        preencherDropdown("select-presence-turma", turmas);
        preencherDropdown("select-view-turma", turmas);
    } catch (error) {
        console.error("Erro ao carregar turmas:", error);
    }
};

// Função para preencher um dropdown
const preencherDropdown = (dropdownId, items) => {
    const dropdown = document.getElementById(dropdownId);

    // Limpar dropdown antes de adicionar novos itens
    dropdown.innerHTML = '<option value="" disabled selected>Selecione uma turma</option>';

    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id; // Usar ID do documento como valor
        option.textContent = item.nome; // Mostrar nome no dropdown
        dropdown.appendChild(option);
    });
};

// Carregar turmas ao carregar a página
document.addEventListener("DOMContentLoaded", loadTurmas);

// Função para criar aula
const createClass = (event) => {
    event.preventDefault();

    const turmaId = document.getElementById("select-class-turma").value;
    const date = document.getElementById("class-date").value;

    db.collection("Aulas").add({
        turma: turmaId,
        date
    }).then(() => {
        alert("Aula criada com sucesso!");
    }).catch((error) => {
        console.error("Erro ao criar aula:", error);
    });
};

// Vincular evento para criar aula
document.getElementById("create-class-form").addEventListener("submit", createClass);

// Função para carregar alunos
const loadStudents = () => {
    const turmaId = document.getElementById("select-presence-turma").value;
    const studentList = document.getElementById("student-list");

    studentList.innerHTML = ""; // Limpar antes de carregar

    db.collection("Alunos").where("turma", "==", turmaId).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const student = doc.data();
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `student-${doc.id}`;
            checkbox.value = doc.id;

            const label = document.createElement("label");
            label.htmlFor = `student-${doc.id}`;
            label.innerText = student.nome;

            const div = document.createElement("div");
            div.appendChild(checkbox);
            div.appendChild(label);

            studentList.appendChild(div);
        });
    }).catch((error) => {
        console.error("Erro ao carregar alunos:", error);
    });
};

// Vincular evento para carregar alunos
document.getElementById("load-students").addEventListener("click", loadStudents);

// Função para registrar presença
const registerPresence = (event) => {
    event.preventDefault();

    const turmaId = document.getElementById("select-presence-turma").value;
    const date = document.getElementById("select-date").value;

    const studentCheckboxes = document.querySelectorAll("#student-list input[type='checkbox']");
    const presentStudentIds = [];

    studentCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            presentStudentIds.push(checkbox.value);
        }
    });

    db.collection("Presenças").add({
        turma: turmaId,
        date,
        presentes: presentStudentIds
    }).then(() => {
        alert("Presença registrada com sucesso!");
    }).catch((error) => {
        console.error("Erro ao registrar presença:", error);
    });
};

// Vincular evento para registrar presença
document.getElementById("register-presence-form").addEventListener("submit", registerPresence);

// Função para visualizar presença
const viewPresence = (event) => {
    event.preventDefault();

    const turmaId = document.getElementById("select-view-turma").value;
    const date = document.getElementById("view-date").value;

    const presenceList = document.getElementById("presence-list");
    presenceList.innerHTML = ""; // Limpar antes de carregar

    db.collection("Presenças").where("turma", "==", turmaId).where("date", "==", date).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            presenceList.innerText = "Nenhuma presença encontrada para essa aula.";
            return;
        }

        const presentes = querySnapshot.docs[0].data().presentes;

        const promises = presentes.map((studentId) => {
            return db.collection("Alunos").doc(studentId).get();
        });

        Promise.all(promises).then((results) => {
            results.foram por aí.
        });
    }).catch((error) => {
        console.error("Erro ao visualizar presença:", error);
    });
};

// Vincular evento para visualizar presença
document.getElementById("view-presence-form").addEventListener("submit", viewPresence);
