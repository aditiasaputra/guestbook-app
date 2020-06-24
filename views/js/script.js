// const URL = window.location.href.split("/");
// const newEntry = URL[3];

// if (newEntry) {
//   const formEntry = document.querySelector(".form-entry");
//   const btnSubmit = document.querySelector("button[type=submit]");

//   formEntry.addEventListener("submit", (e) => {
//     // e.preventDefault();
//     const formControl = document.getElementsByClassName("form-control");
//     var formData = new FormData();
//     for (let i = 0; i < formControl.length; i++) {
//       formData.append(formControl[i].name, formControl[i].value);
//     }
//     const xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function () {
//       if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//         console.log(`success`);
//       }
//     };
//     xmlHttp.open("POST", "http://localhost:5000/new-entry", true);
//     xmlHttp.send(formData);
//     return false;
//   });
// }
const success = document.querySelector(".success");
if (success) {
  setTimeout(() => {
    success.remove();
  }, 2000);
}
