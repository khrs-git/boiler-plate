const { User } = require('../models/User');

let auth = async (req, res, next) => {
    // 인증 처리를 하는 곳

    try {
        // 클라이언트에서 쿠키를 가져온다.
        let token = req.cookies.x_auth;

        // 토큰을 복호화 한 후 유저를 찾는다.
        const user = await User.findByToken(token);

        // 유저가 없다면 인증 실패
        if (!user) {
            return res.json({ isAuth: false, error: true });
        }

        // 유저가 있다면 인증 성공
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        // 에러 발생 시 인증 실패 처리
        console.error('인증 오류:', err);
        return res.json({ isAuth: false, error: true, message: err.message });
    }
};

module.exports = { auth }