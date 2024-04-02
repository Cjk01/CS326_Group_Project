const bios = [
  "Experience with full-stack web development, and that is also what I am interested in. Have experience with git, github, js, html/css, databases (mongo/mysql). I would be interested in focusing on the back-end of the web application for whichever project idea we decide to pursue.",
  "Solid backend experience, limited front end experience. Technologies I’ve worked with include git, github, js, html/css, databases(mongo), and other commonly used languages(C/C++, Java, Python, etc.). I would prefer to work on the back end but would love to gain additional frontend experience. Overall, I’m excited to contribute whatever is necessary for the team to thrive.",
  "I have very limited experience with web development overall, but I have a strong interest in writing code and seeing the results of it manifested in interactive ways. I have prior experience working in JavaScript as well as other languages such as C, Java, and Python, and am confident in my ability to learn new skills in a timely fashion and get work done as is needed. Whatever I need to do, I intend to find a way to do it.",
  "I do not have much experience with html/css, but I am very excited to experiment more and work on learning them. They seem relatively user-friendly, so I am confident that I will be able to effectively use them. I have a little more experience with Javascript, and look forward to helping out the team. Technologies I’ve used are js, html/css, and I’ve used some python for data analysis",
];

let teamCards = document.getElementsByClassName("team-block");

for (let i = 0; i < bios.length; ++i) {
  let card = teamCards[i];
  let bio = document.createElement("p");
  bio.innerHTML = bios[i];
  bio.style.visibility = "hidden";
  card.appendChild(bio);

  card.addEventListener("click", () => {
    let bio = card.children[2];
    bio.style.visibility =
      bio.style.visibility === "hidden" ? "visible" : "hidden";
  });
}
