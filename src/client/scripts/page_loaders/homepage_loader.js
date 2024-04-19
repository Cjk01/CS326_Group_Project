

export  async function loadHomepageView() {
    let homepage_view = document.createElement("div");
    homepage_view.setAttribute("id", "HomeView");
    homepage_view.classList.add("view");

    //TODO: Add code to generate the rest of the html
    homepage_view.innerText = "Homepage";


    return homepage_view;

}