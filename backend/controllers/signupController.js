/*const db = require('../database');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const owasp = require('owasp-password-strength-test');
const xss = require('xss');

owasp.config({
    allowPassphrases       : false,
    maxLength              : 20,
    minLength              : 6,
    minLowercase           : 1,
    minUppercase           : 1,
    minNumbers             : 1,
    minSymbols             : 1
  });

const signupSCHEMA = Joi.object({
    username:  Joi.string().pattern(/^[a-zA-Z0-9-_]*$/).min(3).max(50).required().messages({
        'string.pattern.base': `"username" should only contain alphanumeric characters, hyphens, and underscores (no spaces)`
    }),
    password1: Joi.string().min(6).required(),
});

async function signup(req, res){
    const username = xss(req.body.username);
    const password1 = xss(req.body.password1);
    const password2 = xss(req.body.password2);

    const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
    }

    if(password1 != password2){
        return res.status(400).json({message:"Passwords don't match."});
    }else{
        const strongpassword = owasp.test(password1);
        if(!strongpassword.strong){
            return res.status(400).json({errors : strongpassword.errors[0]});
        }
    }

    const { error } = signupSCHEMA.validate({ username, password1});

    if (error) {
        return res.status(400).json({ errors: error.details[0].message });
    }

    try{
        const hashedpassword = await bcrypt.hash(password1, 10)
        const query = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
        const values = [username, hashedpassword]
        await db.query(query, values);

        res.status(201).json({ message: 'User created successfully.' });
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {signup}*/

const { connectDB } = require('../mongodb_connector');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const owasp = require('owasp-password-strength-test');
const xss = require('xss');

owasp.config({
    allowPassphrases: false,
    maxLength: 20,
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
});

const signupSCHEMA = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9-_]*$/)
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.pattern.base': `"username" should only contain alphanumeric characters, hyphens, and underscores (no spaces)`
        }),
    password1: Joi.string().min(6).required(),
});

async function signup(req, res) {
    const username = xss(req.body.username);
    const password1 = xss(req.body.password);
    const password2 = xss(req.body.confirmPassword);

    try {
        const client = await connectDB();
        const database = client.db('storeB');
        const usersCollection = database.collection('users');


        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password1 !== password2) {
            return res.status(400).json({ message: "Passwords don't match." });
        }

        const strongPassword = owasp.test(password1);
        if (!strongPassword.strong) {
            return res.status(400).json({ message: strongPassword.errors[0] });
        }

        const { error } = signupSCHEMA.validate({ username, password1 });
        if (error) {
            return res.status(400).json({ errors: error.details[0].message });
        }

        const hashedPassword = await bcrypt.hash(password1, 10);
        await usersCollection.insertOne({ username, password_hash: hashedPassword });

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { signup };