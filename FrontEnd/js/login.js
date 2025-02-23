async function login() {
    const loginForm = document.getElementById('login-form');
    const erreur = document.getElementById('message-erreur');
    erreur.innerHTML = '';
    loginForm.addEventListener("submit", (e) => {
        // Désactivation du comportement par défaut du navigateur
        e.preventDefault();

        let emailValue = document.getElementById('email').value;
        let passwordValue = document.getElementById('password').value;

        let loginValue = {
            email: emailValue,
            password: passwordValue
        };
        let loginString = JSON.stringify(loginValue);

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: loginString
        })
        .then(response => {
            console.log(response);
            if (!response.ok) {
                erreur.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Convertit la réponse en JSON
        })
        .then(data => {
            window.localStorage.setItem("token", data.token);
            window.location.replace("http://127.0.0.1:5500/Portfolio-architecte-sophie-bluel/FrontEnd/index.html");
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });
}

login();