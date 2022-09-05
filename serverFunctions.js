// This file contains all the helper functions 

// Function to check if the username is string and not empty
function checkString(username){
    //Remove all the white spacing from the left and the right 
    username = username.trim()

    if (typeof username === "string" && username.length != 0){
        return true;
    }else{
        return false;
    }
}

// Function to check if the password length is atleast 8 characters
function checkPasswordLength(password){
    if (password.length >= 8){
        return true;
    }else{
        return false;
    }
}

// Function to check if the email Id has '@' and contains '.' and the email Id is string@string.string.* format. (Can contain ,!$#%, etc in the email Id. For more strict check , checkout regex expression to validate email ID)
function checkEmailId(emailID){
    // Regex for checking a simple email id
    var re = /\S+@\S+\.\S+/;
    return re.test(emailID);
}

// Export modules so that they can be accessed from another file . Check out import statements in server.js
module.exports = {checkPasswordLength, checkString, checkEmailId};