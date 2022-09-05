const cryptoFunctions = require('./passportAuth.js')
const dbName = "HW1_DB"
let db
const sqlite3 = require("sqlite3")
const sqlite = require("sqlite")

sqlite.open({
  filename: `./database/${dbName}.db`,
  driver: sqlite3.Database
}).then((dbConn) => {
    console.log(`Connected to database - ./database/${dbName}.db`)
    db = dbConn
})


async function checkUserExists(emailId){
    queryString = "SELECT * FROM users where email=?"
    try {
        const result = await db.get(queryString, [emailId]);
        if (result != undefined) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
    
}


async function checkUserExistsAndGet(emailId){
    queryString = "SELECT * FROM users where email=?"
    try {
        const result = await db.get(queryString, [emailId]);
        if (result != undefined) {
            return result;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
    
}


async function createUser(firstname, lastname,  email , password, role){
   
    try {
        // Generate Hashed Password
        passwordHashSalt = cryptoFunctions.genPassword(password)

        queryString = "INSERT INTO users(name, password, email, salt, role)"
        queryString += "VALUES(?, ?, ?, ?, ?);"

        const result = await db.run(queryString, [firstname + " " + lastname, passwordHashSalt.hash, email, passwordHashSalt.salt, role]);
        if (result != null) {
            return true;
        }
        return false;
    }
    catch (e) {
        console.log(e);
        return false;
    }
    
}

async function updateUser(firstname, lastname, email){
    try {
        queryString = "UPDATE users "
        queryString += "SET name=?,"
        queryString += "email=?"
        queryString += "  where email=?;"

        const result = await db.run(queryString, [firstname + " " + lastname, email, email])
        console.log(result);
        if (result.changes > 0) {
            return true;
        }
        return false;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

async function deleteUser(email){
    try {
        queryString = "DELETE FROM users "
        queryString += " where email=?"

        const result = await db.run(queryString, [email])
        if (result.changes > 0) {
            return true;
        }
        return false;
    }
    catch (e) {
        console.log(e);
        return false;
    }

}

async function createServiceReq(name, sdesc, email, ldesc, callback){ 
    try {
        queryString = "INSERT INTO service_request(name, short_desc, email, service_desc, accept_reject) "
        queryString += " VALUES(?, ?, ?, ?, false);"

        const result = await db.run(queryString, [name, sdesc, email, ldesc])
        if (result.changes > 0) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }

}

async function getServiceReqList(){
    try {
        queryString = "SELECT * FROM service_request where accept_reject=?";

        const result = await db.all(queryString, [false]);
        if (result != []) {
            return result;
        }
        return false;

    } catch (e) {
        console.log(e);
        return false;
    }
}

async function approveRequest(id){
    try{
        queryString = "UPDATE service_request SET accept_reject=true where id=?";
        const result = await db.run(queryString, [id])
        if (result.changes > 0){
            return true;
        }
        return false;
    }catch(e){
        console.log(e);
        return false;
    }

}

async function cancelRequest(id, callback){
    try {
        queryString = "DELETE FROM service_request where id=?";
        const result = await db.run(queryString, [id])
        if (result.changes > 0) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getServiceReqDataFromId(id){
    try{
        queryString = "Select * from service_request where id=?";

        const result = await db.get(queryString, [id])
        console.log(result);
        if (result != undefined){
            return result;
        } 
        return false;
    }catch(e){
        console.log(e);
        return false;
    }   
}

module.exports = {checkUserExists, createUser, checkUserExistsAndGet, updateUser, deleteUser, createServiceReq, getServiceReqList, approveRequest, cancelRequest, getServiceReqDataFromId}

