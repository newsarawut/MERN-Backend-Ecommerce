const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Check User
    const { username, password } = req.body;
    var user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("User already exists");
    }
    const salt = await bcrypt.genSalt(10)
    user = new User({
        username,
        password
    });
    //Encrypt
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.send('register Success');

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        var user = await User.findOneAndUpdate({username}, { new: true});
        if(user && user.enabled) {
            // Check password
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(400).send('Password Invalid!!')
            }
            // Payload
            const payload = {
                user:{
                    username: user.username,
                    role: user.role,
                }
            }
            // Generate Token
            jwt.sign(payload,
                'jwtSecret', 
                {expiresIn: 3600 }, (err, token)=>{
                    if(err) throw err;
                    res.json({token, payload})
                });

        }else {
            return res.status(400).send('User Not found!!');
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error!')
    }
};

exports.currentUser = async (req, res) => {
  try {
    // model User
    // console.log('controller',req.user)
    const user = await User.findOne({username:req.user.username})
    .select('-password').exec();
    res.send(user);
  }catch (err) {
    console.log(err);
    res.status(500).send("Server Error!!")
  }
}


exports.listUser = async (req, res) => {
  try {
    res.send("List Get User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.editUser = async (req, res) => {
  try {
    res.send("Edit User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    res.send("Remove User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};
