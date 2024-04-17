

export  function loadProfileView() {
    let testcontent = document.createElement("div");
    testcontent.setAttribute("id", "ProfileView");
    testcontent.classList.add("view");
    testcontent.innerText = "Profile";
    return testcontent;
}