// Configuração do Firebase
const config = {
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

// Criar Aula
document.getElementById("create-class-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const turma = document.getElementById("class-turma").value;
    const date = document.getElementById("class-date").value;

    // Adicionar uma nova aula ao Firestore
    db.collection("Aulas").add({
        turma,
        date
    }).then(() => {
        alert("Aula criada com sucesso!");
    }).catch((error) => {
        console.error("Erro ao criar aula:", error);
    });
});

// Carregar Alunos e Registrar Presença
document.getElementById("load-students").addEventListener("click", () => {
    const turma = document.getElementById("select-turma").value;
    const studentList = document.getElementById("student-list");

    // Limpar lista de alunos existente
    studentList.innerHTML = "";

    // Carregar alunos da turma
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
});

// Registrar Presença
document.getElementById("register-presence-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const turma = document.getElementById("select-turma").value;
    const date = document.getElementById("select-date").value;

    // Criar uma lista de IDs de alunos presentes
    const studentCheckboxes = document.querySelectorAll("#student-list input[type='checkbox']");
    const presentStudentIds = [];

    studentCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            presentStudentIds.push(checkbox.value);
        }
    });

    // Adicionar ou atualizar a lista de presença para a aula específica
    db.collection("Presenças").add({
        turma,
        date,
        presentes: presentStudentIds
    }).then(() => {
        alert("Presença registrada com sucesso!");
    }).catch((error) => {
        console.error("Erro ao registrar presença:", error);
    });
});

// Visualizar Presença
document.getElementById("view-presence-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const turma = document.getElementById("view-turma").value;
    const date = document.getElementById("view-date").value;
    const presenceList = document.getElementById("presence-list");

    presenceList.innerHTML = "";

    // Procurar presença para uma aula específica
    db.collection("Presenças").where("turma", "==", turma).where("date", "==", date).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            presenceList.innerText = "Nenhuma presença encontrada para essa aula.";
            return;
        }

        const doc = querySnapshot.docs[0];
        const presentes = doc.data().presentes;

        // Carregar nomes dos alunos presentes
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
});
