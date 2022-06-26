//-- Classes --//
class Validator {
    //-- Constructor --//
    /**
     * Creates a new validator
     * @param {string?} errorMessageSelector Jquery selector to select the element for displaying error messages 
     */
    constructor(errorMessageSelector) {
        this.errorMessageSelector = errorMessageSelector;
    }

    //-- Methods --//
    /**
     * Validates a input field
     * @param {string} selector Selector to the input field
     * @param {()} validator Validator function
     */
    _validateInput = (selector, validator) => {
        //Get value of the input field
        let inputValue = $(selector).val();

        if (inputValue)
            inputValue = inputValue.trim();

        //Run the validator function
        const error = validator(inputValue, $(selector));

        //Check if the input is valid
        if (error) {
            //The input is invalid
            //Mark the input as invalid
            this._setInvalid(selector, error, () => {
                //Revalidator function
                this._validateInput(selector, validator);
            });

            //Return false
            return false;
        } else {
            //The input is valid
            this._setValid(selector);
            return inputValue;
        }
    }

    /**
     * Marks a input field as invalid
     * @param {string} selector Jquery selector to select the element
     * @param {string} errorMessage The error message to be displayed
     * @param {()} revalidate A function to re-validate the input field on every keypress
     */
    _setInvalid = (selector, errorMessage, revalidate) => {
        //Set the state of the input field
        if ($(selector).hasClass("form-control")) {
            //Input supports bootstrap input validation styling
            $(selector).removeClass("is-valid");
            $(selector).addClass("is-invalid");
        } else {
            $(selector).removeClass("border-success");
            $(selector).addClass("border-danger");
        }

        //Add danger text
        $(this.errorMessageSelector).removeClass("text-success").addClass("text-danger");

        //Set the error message
        $(this.errorMessageSelector).text(errorMessage);

        //Remove old keyup listener
        $(selector).unbind("keyup");

        //Add a keyup listener to the element
        $(selector).keyup(() => {
            //Invoke revalidation function (if any)
            if (revalidate) {
                revalidate();
            } else {
                //Clear error message on keyup
                this._setValid(selector);
            }
        });

        return;
    }

    /**
     * Marks a input field as valid
     * @param {string} selector Jquery selector to select the element
     */
    _setValid = (selector) => {
        //Sets the state of the input field
        if ($(selector).hasClass("form-control")) {
            //Input supports bootstrap input validation styling
            $(selector).removeClass("is-invalid");
            $(selector).addClass("is-valid");
            $(selector).removeClass("text-danger");
        } else {
            $(selector).removeClass("border-danger");
            $(selector).addClass("border-success");
        }

        //Clear error message
        $(this.errorMessageSelector).text("");

        //Remove keyup listener
        $(selector).unbind("keyup");

        return;
    }

    /**
     * Validates username
     * @param {string} usernameSelector Jquery selector for the username input field
     * @returns {boolean}
     */
    _validateUsername = (usernameSelector) => {
        //Validate the username input field
        const isValid = this._validateInput(usernameSelector, (username) => {
            //Ensure that the username is not empty
            if (username.length == 0) {
                return "Username cannot be empty";
            }

            //Ensure that the username does not contain special characters
            if (username.match(/[^A-Za-z0-9/ /]/g)) {
                return "Username cannot contain special characters";
            }
        });

        //Return the outcome
        return isValid;
    }

	/**
	 * Validates the password input
	 * @param {string} passwordSelector Jquery selector for the password input field
	 * @returns {boolean}
	 */
	_validatePassword = (passwordSelector) => {
	    //Validate the password input field
	    const isValid = this._validateInput(passwordSelector, (password) => {
	        //Ensure that the password is at at least 8 characters long
	        if (password.length < 8) {
	            return "Password must be at least 8 characters long";
	        }
	    });

	    //Return the outcome
	    return isValid;
	}

	/**
	 * Validates the confirm password input
	 * @param {string} passwordSelector Jquery selector for the password input field
	 * @param {string} confirmPasswordSelector Jquery selector for the confirm password input field
	 * @returns {boolean}
	 */
	_validateConfirmPassword = (passwordSelector, confirmPasswordSelector) => {
	    //Validate the confirm password input field
	    const isValid = this._validateInput(confirmPasswordSelector, (confirmPassword) => {
	        //Ensure that the confirm password field is not empty
	        if (confirmPassword.length == 0) {
	            return "Confirm password cannot be empty";
	        }

	        //Ensure that the confirm password matches the password
	        if (confirmPassword != $(passwordSelector).val().trim()) {
	            return "Confirm password must match password";
	        }
	    });

	    //Return the outcome
	    return isValid;
	}

    //Expose the methods
    validate = {
        username: this._validateUsername,
        password: this._validatePassword,
        confirmPassword: this._validateConfirmPassword
    }
}