const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require("./middleware/auth")
const {User} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose');


mongoose.connect(config.mongoURI
                ).then(() => console.log('mongoDB Connected...'))
                .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 ~! 방가워용')
})

app.post('/api/users/register',async (req,res) => {

    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);
    try{
        const userInfo = await user.save();
        res.status(200).json({
            success:true
        })
    }catch{
        res.json({success:false, err})
    }
})

app.post('/api/users/login',async (req,res) => {
    try{

        //요청된 이메일을 데이터베이스에서 있는지 찾는다 .
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return res.json({
            loginSuccess: false,
            message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
        const isMatch = await user.comparePassword(req.body.password);
        console.log(isMatch);
        console.log(req.body.password);
        if(!isMatch)
            return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."});

        //비밀번호까지 맞다면 token 을 생성
        const tokenUser = await user.generateToken();
         //토큰을 저장한다. 어디에 ? 쿠키 , 로컬스토리지
         res.cookie("x_auth",tokenUser.token)
         .status(200)
         .json({loginSuccess:true, userId:tokenUser._id})

    }catch(err){
        // 에러를 콘솔에 출력하여 원인을 파악
        console.error("로그인 중 오류 발생:", err);
        return res.status(500).json({
            loginSuccess: false,
            message: "로그인 중 오류가 발생했습니다.",
            error: err.message || '알 수 없는 오류'
        });
    }
})


app.get('/api/users/auth',auth,(req,res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true 라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0?false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: req.user._id },
            { token: "" }
        );
        if (!result) {
            return res.json({ success: false, message: "사용자를 찾을 수 없습니다." });
        }
        return res.status(200).send({
            success: true,
            message: "로그아웃 성공!"
        });
    } catch (err) {
        return res.json({ success: false, err: err });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

