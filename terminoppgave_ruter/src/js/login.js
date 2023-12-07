let loginformEl = document.getElementById("loginform");

let errormessage = ('; '+document.cookie).split(`; errormessage=`).pop().split(';')[0];

if (errormessage) {
    let errorDiv = document.createElement("div");
    errorDiv.className = "errorDiv";
    if (errormessage == "u_p") {
        errorDiv.textContent = "Wrong username or password";
    } else if (errormessage == "e_i") {
        errorDiv.textContent = "You must enter username and password"
    } else if (errormessage == "r_s") {
        errorDiv.textContent = "Registered succesfully"
    } else if (errormessage == "e_uc") {
        errorDiv.textContent = "Error creating user"
    } else {
        errorDiv.textContent = "Something went wrong";
    }
    loginformEl.appendChild(errorDiv);
    document.cookie = "errormessage" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function register(){
    location.replace("/register");
};