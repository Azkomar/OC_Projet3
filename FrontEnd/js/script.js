// Envoie une requête au server pour obtenir les travaux de l'utilisateur
// et les affiche sur la page principale
async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const data = await reponse.json();

    const gallery = document.querySelector('.gallery');
    data.forEach(work => {
        const figure = document.createElement('figure');
        figure.dataset.category = work["category"]["name"];
        figure.className = 'work';
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work["imageUrl"];
        img.alt = work["title"];
        figcaption.innerHTML = work["title"];

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });

    getCategories();
}

// Envoie une requête au server pour obtenir les différentes catégories
// et créer les boutons pour filtrer la page
async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const data = await reponse.json();
    const menu = document.querySelector('.menu-categories');
    data.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerHTML = cat["name"];
        btn.dataset.category = cat["name"];
        btn.className = "menu-btn"
        menu.appendChild(btn);
    });

    filter();
}

// Fait disparaitre/apparaitres certaines images en fonction du filtres selectionné
function filter() {
    const btns = document.querySelectorAll('.menu-btn');
    const gallery = document.querySelectorAll('.work');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            gallery.forEach(fig => {
                if (btn.dataset.category === 'Tous') {
                    fig.className = 'work';
                }
                else if (fig.dataset.category !== btn.dataset.category) {
                    fig.className = 'noWork';
                }
                else {
                    fig.className = 'work';
                }
            })
        })
    });
}


// Permet à l'utilisateur de se déconnecter
async function logout() {
    const logout = document.getElementById('logout-li');
    logout.addEventListener('click', (e) => {
        window.localStorage.removeItem('token');
        window.location.reload();
    });
}

// Permet a l'utilisateur de naviguer entre les 2 'pages' de la modale
function modaleAddPhoto() {
    const btn = document.querySelector('.add-photo');
    const previous = document.getElementById('back-arrow');
    const mainSection = document.getElementById('main-modale');
    const secondSection = document.getElementById('second-modale');

    btn.addEventListener('click', (e) => {
        mainSection.className = 'hide';
        secondSection.className = 'second-modale';
    });
    previous.addEventListener('click', (e) => {
        mainSection.className = 'main-modale';
        secondSection.className = 'hide';
    })
}



// Envoie une requête au server pour obtenir les travaux de l'utilisateur
// et les affiche dans la modale
async function modaleGallery() {
    modaleAddPhoto();
    const reponse = await fetch("http://localhost:5678/api/works");
    const data = await reponse.json();
    const modaleGallery = document.querySelector('.modale-work');
    data.forEach(work => {
        const container = document.createElement('div');
        container.className = 'modale-img-container';
        const img = document.createElement('img');
        img.src = work["imageUrl"];
        img.alt = work["title"];
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-trash-can trash';
        container.appendChild(img);
        container.appendChild(icon);
        container.dataset.id = work["id"];
        modaleGallery.appendChild(container);
    });
    removeWork();
}

// Fait apparaître ou disparaitre la fenêtre modale
async function modify() {
    const blockButton = document.querySelector('.modifier');
    const modale = document.querySelector('.modale');
    const closeBtns = document.querySelectorAll('.modale-close');
    closeBtns.forEach((closeBtn) => {
        closeBtn.addEventListener('click', (e) => {
            modale.close();
            modale.className = 'modale';
        });
    });
    
    blockButton.addEventListener('click', (e) => {
        modale.showModal();
        modale.className = 'modale-open';
    })
}
// Test si l'utilisateur est connecté (retourne true/false)
function isLogged() {
    const token = window.localStorage.getItem('token');
    if (token !== null) {
        return true;
    } else {
        return false
    }
}

// Fait apparaître différent élement si l'utilisateur est connecté ou non
function whenLogged() {
    const login = document.getElementById('login-li');
    const logout = document.getElementById('logout-li');
    const header = document.querySelector('.mode-edition');
    const modif = document.querySelector('.modifier');

    if (isLogged()) {
        modify();
        modaleGallery();
        login.style.display = 'none';
        logout.style.display = 'block';
        header.className = 'mode-edition'
        modif.className = 'modifier';
    }
    else {
        login.style.display = 'block';
        logout.style.display = 'none';
        header.className = 'mode-edition hide'
        modif.className = 'modifier hide';
    }
}

async function removeWork() {
    const trashIcon = document.querySelectorAll('.trash');
    trashIcon.forEach( trash => {
        const parent = trash.parentNode;
        trash.addEventListener('click', async (e) => {
            console.log(parent.dataset.id);
            const token = window.localStorage.getItem("token");
            console.log(token)
            await fetch(`http://localhost:5678/api/works/${parent.dataset.id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    logout();
    whenLogged();
    getWorks();
});