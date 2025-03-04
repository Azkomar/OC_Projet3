// Envoie une requête au server pour obtenir les travaux de l'utilisateur
// et les affiche sur la page principale
async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const data = await reponse.json();

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";
    data.forEach(work => {
        const figure = document.createElement('figure');
        figure.dataset.category = work["category"]["name"];
        figure.dataset.id = work["id"];
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

    const menuBtn = document.getElementById('menu-cate');

    if (!isLogged()) {
        menuBtn.className = 'menu-categories';
        getCategories();
    } else {
        menuBtn.className = 'hide';
    }
}

// Envoie une requête au server pour obtenir les différentes catégories
// et créer les boutons pour filtrer la page
async function getCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const data = await reponse.json();
    const menu = document.getElementById('menu-cate');
    menu.innerHTML = "";
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
    const validForm = document.querySelector('.add-work-form');

    btn.addEventListener('click', (e) => {
        validForm.reset();
        mainSection.className = 'hide';
        secondSection.className = 'second-modale';
        imagePreview();
        const select = document.getElementById('form-categories');
        if (select.children.length === 1) {
            selectCategories(select);
        }
        const form = document.getElementById('second-modale');
        const eventList = ['change', 'keyup'];
        eventList.forEach(evnt => {
            form.addEventListener(evnt, checkAddWork);
        });
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
    modaleGallery.innerHTML = "";
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
    const modale = document.getElementById('modale');
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
    });

    modale.addEventListener('click', (event) => {
        if (event.target === modale) {
            modale.close();
            modale.className = 'modale';
        }
    });
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

// Permet de supprimer les travaux existants
async function removeWork() {
    const trashIcon = document.querySelectorAll('.trash');
    trashIcon.forEach( trash => {
        const parent = trash.parentNode;
        trash.addEventListener('click', async (e) => {
            e.preventDefault();
            const token = window.localStorage.getItem("token");
            const workId = parent.dataset.id;
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const elementToDelete = document.querySelectorAll(`[data-id="${workId}"]`);
                elementToDelete.forEach(elem => {
                    elem.remove();
                })
            } else {
                console.log("L'élément n'a pas pu être supprimer ...");
            }
        });
    });
}

// Permet de prévisualiser les images chargées
function imagePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '<i class="fa-regular fa-image" id="previewIcon"></i>';
    const input = document.getElementById('image_uploads');
    input.value = null;
    input.addEventListener("change", (e) => {
        const fichier = input.files[0];
        if (fichier) {
            const img = document.createElement('img');
            img.id = 'previewImg';
            img.src = window.URL.createObjectURL(fichier);
            img.alt = fichier.name;
            preview.innerHTML = '';
            preview.appendChild(img);
        } 
    });
}
// Affiche les catégories dans le menu déroulant en les récupérant depuis l'API
async function selectCategories(select) {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const data = await reponse.json();
    data.forEach(cat => {
        const option = document.createElement('option');
        option.innerHTML = cat["name"];
        option.value = cat["id"];
        select.appendChild(option);
    });
}

// Vérifie si le formulaire 'addWork' est correctement rempli
function checkAddWork() {
    const titre = document.getElementById('form-titre');
    const select = document.getElementById('form-categories');
    const preview = document.getElementById('preview');
    const btn = document.getElementById('form-valid');

    if (select.value !== '' && titre.value !== '' && preview.querySelector('img')) {
        btn.disabled = false;
    }
    else {
        btn.disabled = true;
    }
}

// Ajout d'un nouveau 'travail'
async function addWork(e) {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    const titreValue = document.getElementById('form-titre').value;
    const imgSrc = document.getElementById('previewImg').src;
    const selectValue = parseInt(document.getElementById('form-categories').value);

    // Convertir l'image en Blob
    const imgResponse = await fetch(imgSrc);
    const blob = await imgResponse.blob();
    const file = new File([blob], 'image.png', { type: blob.type });

    let formData = new FormData();
    formData.append('image', file);
    formData.append('title', titreValue);
    formData.append('category', selectValue);
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const validForm = document.querySelector('.add-work-form');
    validForm.addEventListener('submit', addWork);
    logout();
    whenLogged();
    getWorks();
});