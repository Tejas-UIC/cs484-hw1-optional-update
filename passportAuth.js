// Import Modules Required to setup passport local stragegy 
const crypto = require("crypto");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const crudOperations = require("./crudOperationFunctions.js")


/**
 * passportInit() function is used to initialize the LocalStrategy of passport.js
 * This strategy helps apply session based authentication 
 * Please note "usenameField" & "passwordField" provide the alias names which correspond to input data
 * For Ex - Any POST must have key value like  emailId="someEmail@email.com" and password="SomePassword"
 * Call Back for this function has three arguments (emailId, password, next) where the next is called to apply next stage in the middleware 
 * For more information on middlewares check out this link- https://expressjs.com/en/guide/using-middleware.html
 */
function passportInit(){
    passport.use(
        new LocalStrategy( {usernameField : "emailId", passwordField : "password"},function (emailId, password, next) {
           
            /**
             * This code space is used to initialize passport strategy
             * The Local Strategy takes in two arguments emailId and password which will be used to setup autheticate user 
             * 1. For authenticating a user, you should first check if the user exists and and then fetch data about user (like emailId, encrypted password, etc ) 
             *    ( For this you can make use of the crudOperations provided)
             * 2. Check if the password matches with what is stored in the database (i.e. the encrypted password in database is same as password entered by the user on screen)
             * 3. If a match is found, pass the control to the next middleware. Call the next middleware by passing two arguments (err, information). 
             *    Pass-in data if its a valid user Else pass false for the information param.   
             * Hint -You could leverage validPassword, genPassword, etc helper functions for performing above tasks
             */

            // Check if the user exists and get the data
            
            // Validate the password with the hash stored 

            // Call the middleware
          
        })
      );

}


/**
 * Functions serializeUser & deserializeUser need to be implementated while working with passport
 * serializeUser function stores a mapping of emailId and express session
 * derializeUser functions does the opposite of finding if there exists a valid user **
 */
passport.serializeUser(function (data, next) {
    //TO DO - Call the middleware with the data's attribute that you want to be stored in the express session 
    
  });


// User input for the deserialize function comes from the passport entry that forms in the express session
// This function is called when you invoked the isAuthenticated() function. 
// Here the 'data' is the value that is stored in the express session under the passport field ( This is the same data that you store when serialize method is called )
passport.deserializeUser(function (data, next) {
    // TO DO - Fetch the data about the user and if the user exists then return data else return false 
});


// Function to generate hashed password and salt 
// ***** This function is used in dbFunctions.js while creating the user in which the password is hashed with a salt
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString("hex");
    var genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
  
    return {
      salt: salt,
      hash: genHash,
    };
}

// Function to validate if password matches the stored hashed password
function validPassword(password, hash, salt) {
    var hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return hash === hashVerify;
}

module.exports = {
    passportInit, genPassword, validPassword
}
