const db_connection = require('../database/pgPoolconnection');
const { redis_class } = require('../redis/redis_client');
const { hashSync, compareSync } = require('bcrypt');
const { Response_object } = require("../model/ResponseModel");
var jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    //check if the user is already available in the database
    var check_database = await db_connection.command("select * from users where username=$1 ", [req.body.Username]);
    if (check_database.length != 0) {
        //user is available in the database
        res.status(400).json(new Response_object(null, 400, 'User is already available in the database try with another username'));
    } else {

        //continue registration
        const new_user = {
            username: req.body.Username,
            name: req.body.Name,
            password: hashSync(req.body.Password, 10),
            position: req.body.Position,
            company: req.body.Company,
            email: req.body.Email
        }

        //insert new user into the database
        var insert_new_user = await db_connection.command("insert into users (name, username, password, position, company, email) values ($1, $2, $3, $4, $5, $6)", [new_user.name, new_user.username, new_user.password, new_user.position, new_user.company, new_user.email]);
        res.status(201).json(new Response_object(new_user.username, 201, 'User has been created in the database.'));
    }

}

const login = async (req, res) => {
    //check if the user is already available in the database
    var user_database = await db_connection.command("select * from users where username=$1 ", [req.body.Username]);
    if (user_database.length == 0) {
        res.status(400).json(new Response_object({ username: req.body.Username }, 400, 'User is not available please register.'));
    } else {
        const req_pass = req.body.Password;
        const db_pass = user_database[0].password;

        if (!compareSync(req_pass, db_pass)) {
            //worng credentials 
            res.status(400).json(new Response_object({ username: req.body.Username }, 400, 'User credentials invalid.'));
        } else {
            //successful login -> create jwt
            const token = jwt.sign(user_database[0], process.env.SECRET_KEY, { expiresIn: "1d" });
            res.status(200).set('auth-token', token).json(new Response_object(
                {
                    username: user_database[0].username,
                    token: "Bearer " + token
                },
                200, 'Success')
            );
        }
    }

}

module.exports = { register, login }