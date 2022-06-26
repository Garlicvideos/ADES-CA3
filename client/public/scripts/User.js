/**
 * Xavier Teo Zai Ken (p2104261)
 * DIT/1B/02
 */
//-- Class --//
class User {
    //-- Static properties --//
    //Query url
    static baseUrl = window.location.origin.replace(":3001", ":3000");

    //-- POSTS --//
    /**
     * Registers a new user account
     * @param {string} username The username of the account
     * @param {string} password The password of the account
     * @param {()} callback Invoked when the request is complete
     * @returns {string?} Error message 
     */
    static register(username, password, callback) {
        const reqUrl = User.baseUrl + '/api/users/';
        axios.post(reqUrl, {
            username: username,
            password: password
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err.response.data);
            return;
        });
    }

    /**
     * Attempts to login to a user account
     * @param {*} username The username of the user account
     * @param {*} password The password of the account
     * @param {()} callback Invoked when the request is complete
     * @returns Result
     */
    static login(username, password, callback) {
        const reqUrl = User.baseUrl + '/api/users/authenticate';
        axios.post(reqUrl, {
            username: username,
            password: password
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }

    /**
     * Logs out the user
     * @param {()} callback Invoked when the request is complete
     */
    static logout(callback) {
        //Clear both storages
        sessionStorage.clear();
        localStorage.clear();

        //Invoke callback
        if (callback)
            callback();

        return;
    }

    /**
     * Saves login data to session/local storage
     * @param {string} token JWT token
     * @param {boolean} persistent Whether or not to use session or local storage
     * @param {()} callback Invoked upon completion
     */
    static saveSessionData(token, persistent, callback) {
        //Determine which storage system to use
        const storageSystem = persistent ? localStorage : sessionStorage;

        //Store the data in the storage system selected
        storageSystem.setItem("token", token);

        //Invoke callback
        if (callback)
            callback();

        return;
    }

    /**
     * Retrieves data from session/local storage
     * @param {()} callback Invoked upon completion
     */
     static retrieveSessionData(callback) {
        //Attempt to retrieve token from localstorage
        let token = null;

        //Retrieve the token from localStorage
        token = localStorage.getItem("token");

        //Check if the token was stored within local storage
        if (token != null) {
            //The token was stored inside local storage, invoke callback with the token
            return callback(token);
        }

        //It was not in localstorage, will likely be in session storage instead
        //Attempt to retrieve token from session storage
        token = sessionStorage.getItem("token");

        //Check if data was stored within session storage
        if (token != null) {
            //Data was within session storage, invoke callback with the data
            return callback(sessionStorageData);
        }

        //User is not logged in at all.
        return callback(false);
    }
}