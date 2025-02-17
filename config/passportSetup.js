const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/User");

passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: "/api/auth/naver/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = new User({ email: profile.email, name: profile.nickname, provider: "naver" });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: "/api/auth/kakao/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile._json.kakao_account.email });
    if (!user) {
      user = new User({ email: profile._json.kakao_account.email, name: profile.username, provider: "kakao" });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
}));
