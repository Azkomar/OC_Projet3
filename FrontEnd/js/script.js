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
}

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
    const btns = document.querySelectorAll('button');
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

async function logout() {
    const logout = document.getElementById('logout-li');
    logout.addEventListener('click', (e) => {
        window.localStorage.removeItem('token');
    });
}

async function isLogged() {
    const token = window.localStorage.getItem('token');
    const login = document.getElementById('login-li');
    const logout = document.getElementById('logout-li');

    if (token !== null) {
        login.style.display = 'none';
        logout.style.display = 'block';
    }
    else {
        login.style.display = 'block';
        logout.style.display = 'none';
    }
}

logout();
isLogged();
getWorks();
getCategories();