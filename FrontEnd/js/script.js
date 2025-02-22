async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const data = await reponse.json();

    const gallery = document.querySelector('.gallery');
    data.forEach(work => {
    const figure = document.createElement('figure');
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

getWorks();