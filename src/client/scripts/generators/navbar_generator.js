export function generateNavbar(navInputs, container) {
    let nav = document.createElement('nav');
    nav.setAttribute("id", "navbar");
    let list = document.createElement('ul');
    nav.appendChild(list);

    for(let navInput in navInputs){

        let listLink = document.createElement('a');
        listLink.setAttribute("href", navInputs[navInput]);
        listLink.innerText = navInput;

        let listElem = document.createElement('li');
        listElem.setAttribute("id", navInput + "OnNavBar");
        listElem.classList.add("navbarLink");

        listElem.appendChild(listLink);
        list.appendChild(listElem);
        list.appendChild(document.createElement("br"));
    }
    container.appendChild(nav);
}

