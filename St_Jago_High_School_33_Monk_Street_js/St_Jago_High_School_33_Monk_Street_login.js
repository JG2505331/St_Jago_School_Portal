/*
    Student Name: Towanda Marston
    Student ID: 2505917
    Faculty: BSc in Computing 
    Course: CIT2011
    Project: St. Jago High School Portal
*/
const loginForm = document.getElementById("loginForm");

const userRole = document.getElementById("userRole");

const username = document.getElementById("username");

const password = document.getElementById("password");

const loginMessage = document.getElementById("loginMessage");


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const usernameValue = username.value.trim();

    const passwordValue = password.value;

    const selectedRole = userRole.value;


    if (
        selectedRole === "admin" &&
        usernameValue === "admin1" &&
        passwordValue === "admin123"
    ) {

        sessionStorage.setItem("loggedInRole", "admin");

        sessionStorage.setItem("loggedInUsername", usernameValue);

        window.location.href = "St_Jago_High_School_33_Monk_Street_admin.html";


    } else if (
        selectedRole === "teacher" &&
        usernameValue === "teacher1" &&
        passwordValue === "teach123"
    ) {

        sessionStorage.setItem("loggedInRole", "teacher");

        sessionStorage.setItem("loggedInUsername", usernameValue);

        window.location.href = "St_Jago_High_School_33_Monk_Street_teacher.html";


    } else if (
        selectedRole === "viewer" &&
        usernameValue === "viewer1" &&
        passwordValue === "view123"
    ) {

        sessionStorage.setItem("loggedInRole", "viewer");

        sessionStorage.setItem("loggedInUsername", usernameValue);

        window.location.href = "St_Jago_High_School_33_Monk_Street_viewer.html";


    } else {

        loginMessage.textContent = "Invalid username or password.";

    }

});


