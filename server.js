// Import modules
const express = require('express')
const app = express()
const sessionObj = require("express-session");
const port = 8080
const crudOperations = require("./crudOperationFunctions.js")
const passport = require('passport');


// Middlewares

// Middle ware for parsing JSON 
app.use(express.json());

// Middle ware to expose static content ( CSS, Javascript, Images ) in the public folder
app.use(express.static('public'));

// Middleware to create in-memory session store
// In-memory vs persistent datastore (Database based)
// Session data is lost when the server is stopped with in-memory store
// Session data is not lost when the server is stopped
// Below is the configuration for in-memory datastore
// For details on Options used for this middleware check out - https://www.npmjs.com/package/express-session
app.use(sessionObj({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}));

// Initialize passport auth middleware
app.use(passport.initialize())
app.use(passport.session())

// Initialise the "Local" Strategy for passport authentication
const passportAuth = require('./passportAuth.js');
passportAuth.passportInit();        // Initialize local Passport Straregy for session based authentication

// ***********   Below are all the endpoints where requests are sent ( GET, POST ) ***********


/*
* GET ENDPOINTS
*/
// Make the / -> /
app.get('/', (req, res) => {
    // TO DO - Add Authentication for this route . If the user is authenticated redirect to the dashboard else send the login.html page
    res.sendFile('./views/login.html', {root: __dirname })
})

app.get('/create-user', (req, res) => {
   res.sendFile('./views/create_user.html', {root: __dirname })
})

app.get('/update-user', (req, res) => {
    // TO DO - Add Authentication for this route . If the user is authenticated then return update users page or else redirect to login page
    res.sendFile('./views/update_user.html', {root: __dirname })
})

app.get('/delete-user', (req, res) => {
    // TO DO - Add Authentication for this route . If the user is authenticated then return delete users page or else redirect to login page
    res.sendFile('./views/delete_user.html', {root: __dirname })
})

app.get('/dashboard', (req, res) => {
    // TO DO - Add Authentication for this route . If the user is authenticated then return dashboard page or else redirect to login page
    res.sendFile('./views/dashboard.html', {root: __dirname })
})
 
app.get('/logout', (req, res)=>{
    req.logOut(()=>{
        console.log("Logging out")
    });
    res.redirect('/')
})

app.get("/get_service_requests", (req, res)=>{
    // TO DO - Add Authentication for this route . If not authenticated respond with this json - {"msg" : false}
        crudOperations.getServiceList((err, data)=>{
            if(err != null){
                console.log(err);
                res.json({"msg" : "There was some issue with fetching service request list. Check server logs"});
            }
            if (data != null && data != false){
                console.log("Fetched Data Successfuly ");
                res.json({"msg" : data});
            }else{
                res.json({"msg" : []})
            }
        })
})


/*
* POST ENDPOINTS
*/

app.post('/create_user', (req, res) => {
   
    // Parse the data from the request
    let {firstname, lastname, emailId, password, role} = req.body;

    // Check if user exists or not
    crudOperations.checkUser(emailId, firstname, lastname, password, role, (err, data)=>{
        if (err != null){
            console.log(err);
            res.json({"msg" : false});
            return;
           
        }
        if (data == false){
            // Call the operation to create the user 
            // Password Encrpted at dbFunctions.js
            crudOperations.createUser(firstname, lastname, emailId, password, role, (err, data)=>{
                    if (err != null){
                        console.log(err);
                        res.json({"msg" : "Error While Creating User in Dbfunctions"})
                    }
                    if ( data == true) {
                        console.log(`User Created with email id ${emailId}`);
                        res.json({"msg" : true});
                    }else{
                        res.json({"msg" : false})
                    }   
            });
            
        }else{
            // If there is not err and checkUser didn't return true. Send the data to frontend
            console.log(`Problems creating a new user - user already exists`)
            res.json({"msg" : false})
        }

    });
})

// Endpoint called when a user is trying to log-in
// When this endpoint is accessed passport needs to autheticate with the provided emailId and password
// TO DO - Add the snippet to autheticate with passport 
app.post("/login",(req, res)=>{
    console.log(req.session);
    res.redirect('/dashboard');
})

app.post("/update_user", (req, res)=>{
    // TO DO - Add Authentication for this route . If not authenticated respond with this json - {"msg" : false}
        let {firstname, lastname, emailId} = req.body;

        crudOperations.updateUser(firstname, lastname, emailId, (err, data)=>{
            if (err != null){
                console.log(err);
                res.json({"msg" : "Error While Updating User. See Server Logs for Details"});
            }
            if (data == true) {
                console.log(`User Updated with email id ${emailId}`);
                res.json({"msg" : true})
            }else{
                console.log(`Unable to update user for email id ${emailId}`);
                console.log(`Problem while updating the user - ${data}`);
                res.json({"msg" : data})
            }   
        })

})

app.post("/delete_user", (req, res)=>{
    // TO DO - Add Authentication for this route . If not authenticated respond with this json - {"msg" : false}
        let {emailId} = req.body;

        crudOperations.deleteUser(emailId, (err, data)=>{
            if (err != null){
                console.log(err);
                res.json({"msg" : "Error While Deleting User. See Server Logs for Details"});
            }
            if ( data == true) {
                console.log(`User Deleted with email id ${emailId}`);
                res.json({"msg" : true});
            }else{
                console.log(`Unable to delete user for email id ${emailId}`);
                console.log(`Problem while deleting the user - ${data}`);
                res.json({"msg" : data})
            }
        })

})

app.post("/create_service_request", (req, res)=>{
    // TO DO - Add Authentication for this route . If not authenticated respond with this json - {"msg" : false}
        let {name, sdescription, emailId, ldescription } = req.body;

        crudOperations.createServiceReq(name, sdescription, emailId, ldescription, (err, data)=>{
            if (err != null){
                console.log(err);
                res.json({"msg" : "Error While Creating Service Request. See Server Logs for Details"});
            }
            if ( data == true) {
                console.log(`Service Request Created for  email id ${emailId}`);
                res.json({"msg" : true});
            }else{
                console.log(`Unable to create service request`);
                console.log(data);
                res.json({"msg" : data})
            }
        })
})


app.post("/approve_service_request", (req, res)=>{

    // TO DO - Add Authentication for this route 
        // Check if the user has permission's ( proper role ) to approve / complete the request
        // If user has permissions then proceed else return json : {"msg" : false}

            crudOperations.approveServiceReq(req.body.id, (err, data)=>{
                if(err != null){
                    console.log(err);
                    res.json({"msg" : "There was some issue in approving service request. Check server logs"});
                }
                if (data == true){
                    console.log(`Approved Request for id -> ${req.body.id}`);

                    // Send an email about completion of the service request
                    // TO DO - Use mailgun npm module to send an email to the customer
                    // Link - https://www.npmjs.com/package/mailgun.js?utm_source=recordnotfound.com

                    res.json({"msg" : true});
                }else{
                    console.log(data);
                    res.json({"msg" : false});
                }
            })
})

app.post("/cancel_service_request", (req, res)=>{
    // TO DO - Add Authentication for this route 
        // Check if the user has permission's ( proper role ) to cancel  the request
       // If user has permissions then proceed else return json : {"msg" : false}

            crudOperations.cancelServiceReq(req.body.id, (err, data)=>{
                if(err != null){
                    console.log(err);
                    res.json({"msg" : "There was some issue in cancelling service request. Check server logs"});
                }
                if (data == true){
                    console.log(`Cancelled Service Request for id -> ${req.body.id}`);
                    res.json({"msg" : true});
                }else{
                    console.log(data);
                    res.json({"msg" : false});
                }
            })
})


// Application setup / entry to create a server on a port which is given as an argument
app.listen(port, () => {
  console.log(`Server Up and Listening at http://localhost:${port}/`)
})

