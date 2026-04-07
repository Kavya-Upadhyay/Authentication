const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "randombrocode";


app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "token"]
}));
app.use(express.json());


let users = [];

app.post('/signup',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(users.find(user => user.username === username && user.password === password)){
        res.json({
            message : "Already registered"
        })
    }
    else{
        users.push({
            username : username,
            password: password,
        })

        res.json({
            message:"Sign up successfully",
        })
    }

    // console.log(users)

});


app.post('/signin',(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    const foundUser = (users.find(u => {
        if(u.username === username && u.password === password){
            return true;
        }

    }))

    if(foundUser){

        const token = jwt.sign({
            username : username,
        }, JWT_SECRET)

        // foundUser.token = token
        res.json({
            token : token
        })

    }
    else{
        res.status(403).send({
            message: 'Invalid username or password'

        })
    }


    // console.log(users)


})


// function generateToken(){
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     const length = chars.length;
//
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * chars.length);
//         result += chars[randomIndex];
//     }
//
//     return result;
// }

app.get("/me", auth, (req,res)=>{

        let founduser=null;
        for(let i=0;i<users.length;i++){
            if(users[i].username === req.username) {
                founduser = users[i];
            }
        }

        if(founduser){
            res.status(200).send({
                username : founduser.username,
                password: founduser.password,
            })
        }


})

function auth(req, res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_SECRET);


    if(decoded.username){
        req.username = decoded.username;
        next();
    }
    else{
        res.status(403).send({
            message: 'Please login first'
        })
    }

}




app.listen(3000, () => {
    console.log('Server is running on port 3000');
});