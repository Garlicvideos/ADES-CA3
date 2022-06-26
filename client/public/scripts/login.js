/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//-- Functions --//
function loadScript(url) {
    return new Promise((resolve, reject) => {
        $.getScript(url, () => {
            resolve();
        });
    });
}

//Load navbar
async function loadNavbar() {
    //Load required components
    await loadScript("/components/navbar.js");

    //Render the navbar
    const renderedNavbar = await navbar.render("login");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//Submit the login form
function formSubmit() {
    //Create a new validator
    const validator = new Validator("#errorMessage");

    //Get and validate username
    const username = validator.validate.username("#username");
    if (!username) {
        //Username is invalid
        return;
    }

    //Get and validate password
    const password = $("#password").val();
    if (password.length == 0) {
        //Password is empty
        validator._setInvalid("#password", "Password cannot be empty");
        return;
    }

    //All checks passed, try to login!
    User.login(username, password, (err, res) => {
        //Checks if there were any errors
        if (err) {
            //Display an error message
            console.log(err);
            validator._setInvalid("#username", "Username or Password is invalid");
            validator._setInvalid("#password", "Username or Password is invalid");
            return;
        }

        //Obtain the JWT Token from the response
        const token = res.data.token;

        //Checks if the user wants to have persistent login
        const persistent = ($("#rememberMe:checked").length > 0);

        //Store the data
        User.saveSessionData(token, persistent, () => {
            //Redirect the user to the home page
            window.location.href = "/";
        });
    });
}

//-- On document ready --//
$(document).ready(async () => {
    //Load required scripts
    await loadScript("/scripts/InputValidation.js");
    await loadScript("/scripts/User.js");

    //Initialise components
    loadNavbar();

    //Check if the user is already logged in
    User.retrieveSessionData((isLoggedIn) => {
        if (isLoggedIn) {
            //The user is already logged in, redirect the user back to the home page
            window.location.href = "/"; 
        }
    });
});