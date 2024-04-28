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

// Inicializar o Firebase
const app = firebase.initializeApp(config);
const db = firebase.firestore();

// Função para criar aula
const createClass = (event) => {
    event.preventDefault(); // Prevenir comportamento padrão do formulário

    const turma = document.getElementById("class-turma").value;
    const date = document.getElementById("class-date").value;

    db.collection("Aulas").add({
        turma,
        date
    }).then(() => {
        alert("Aula criada com sucesso!");
    }).catch((error) => {
        console.error("Erro ao criar aula:", error);
    });
};

// Vincular evento de submissão do formulário de criar aula
document.getElementById("create-class-form").removeEventListener("submit", createClass);
document.getElementById("create-class-form").addEventListener("submit", createClass);

// Função para carregar alunos de uma turma
const loadStudents = () => {
    const turma = document.getElementById("select-turma").value;
    const studentList = document.getElementById("student-list");

    // Limpar a lista de alunos
    studentList.innerHTML = "";

    db.collection("Alunos").where("turma", "==", turma).get().then((querySnapshot) => {
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

// Vincular evento para carregar alunos ao clicar no botão
document.getElementById("load-students").removeEventListener("click", loadStudents);
document.getElementById("load-students").addEventListener("click", loadStudents);

// Função para registrar presença
const registerPresence = (event) => {
    event.preventDefault(); // Prevenir comportamento padrão do formulário

    const turma = document.getElementById("select-turma").value;
    const date = document.getElementById("select-date").value;

    const studentCheckboxes = document.querySelectorAll("#student-list input[type='checkbox']");
    const presentStudentIds = [];

    studentCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            presentStudentIds.push(checkbox.value);
        }
    });

    db.collection("Presenças").add({
        turma,
        date,
        presentes: presentStudentIds
    }).then(() => {
        alert("Presença registrada com sucesso!");
    }).catch((error) => {
        console.error("Erro ao registrar presença:", error);
    });
};

// Vincular evento para registrar presença ao submeter o formulário
document.getElementById("register-presence-form").removeEventListener("submit", registerPresence);
document.getElementById("register-presence-form").addEventListener("submit", registerPresence);

// Função para visualizar presença
const viewPresence = (event) => {
    event.preventDefault(); // Prevenir comportamento padrão do formulário

    const turma = document.getElementById("view-turma").value;
    const date = document.getElementById("view-date").value;

    const presenceList = document.getElementById("presence-list");
    presenceList.innerHTML = ""; // Limpar lista anterior

    db.collection("Presenças").where("turma", "==", turma).where("date", "==", date).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            presenceList.innerText = "Nenhuma presença encontrada para essa aula.";
            return;
        }

        const doc = querySnapshot.docs[0];
        const presentes = doc.data().presentes;

        const promises = presentes.map((studentId) => {
            return db.collection("Alunos").doc(studentId).get();
        });

        Promise.all(promises).then((results) => {
            results.forEach((studentDoc) => {
                const student = studentDoc.data();
                const p = document.createElement("p");
                p.innerText = student.nome;
                presenceList.appendChild(p);
            });
        });
    }).catch((error) => {
        console.error("Erro ao visualizar presença:", error);
    });
};

// Vincular evento para visualizar presença ao submeter o formulário
document.getElementById("view-presence-form").removeEventListener("submit", viewPresence);
document.getElementById("view-presence-form").addEventListener("submit", viewPresence);
