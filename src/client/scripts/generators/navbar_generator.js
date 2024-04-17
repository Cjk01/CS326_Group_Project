/** 
  * Generates a navbar element with id='navbar'
  * @param {Object} navInputs - Object with keys as names of items on navbar and values as references to where the navbar buttons should link to
  * @param {HTMLElement} container - The navbar element is appended to container after it is created
  * @returns {HTMLElement} - Returns the navbar element
  */
export function generateNavbar(navInputs, container) {
    let nav = document.createElement('nav');
    nav.setAttribute("id", "navbar");
    let list = document.createElement('ul');
    nav.appendChild(list);

    for(let navInput in navInputs){

        let listLink = document.createElement('a');
        listLink.setAttribute("href", navInputs[navInput]);
        listLink.setAttribute("id", navInput + "View");
        listLink.classList.add("navbarLink");
        listLink.innerText = navInput;

        let listElem = document.createElement('li');
        

        listElem.appendChild(listLink);
        list.appendChild(listElem);
        list.appendChild(document.createElement("br"));
    }
    container.appendChild(nav);
    return nav;
}

