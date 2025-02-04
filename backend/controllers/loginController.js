const db = require('../database');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const xss = require('xss');
const jwt = require('jsonwebtoken'); 

const SECRET_KEY = process.env.JWT_SECRET;

const loginSCHEMA = Joi.object({
    username:  Joi.string().pattern(/^[a-zA-Z0-9-_]*$/).min(3).max(50).required().messages({
            'string.pattern.base': `"username" should only contain alphanumeric characters, hyphens, and underscores (no spaces)`
        }),
    password: Joi.string().required(),
});

async function login(req,res){
    const username = xss(req.body.username);
    const password = xss(req.body.password);

    const {error} = loginSCHEMA.validate({username, password});

    if(error){
        return res.status(400).json({ errors: error.details[0].message });
    }

    try{
        const query = 'SELECT * FROM users where username = ?';
        const values = [username];
        const [users] = await db.query(query, values);

        if(users.length === 0){
            return res.status(400).json({message:"Invalid credentials."});
        }
        const user = users[0];


        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign(
            {
                user_id: user.id,
                role: user.role
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            status: 'Success',
            token: token,
        });

    } catch (err) {
        return res.status(500).json({ message: 'Login Error' });
    }
};

module.exports = {login}

