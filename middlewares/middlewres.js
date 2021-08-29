const user = require('../models/user');
class Middlewares{
    auth(req, res, next){
        if(!req.cookies.user_id){
            res.redirect('/login');
        }else{
            let user_id = req.cookies.user_id;
            let arr = user_id.split('/');
            user.findOne({_id: arr[0], password: arr[1]}).then((data)=>{
                if(!data){
                    res.redirect('/login');
                }else{
                    //arr[0] == user._id
                    res.locals.user_id = arr[0];
                    next();
                }
            })
        }
    }
    signupAuth(req, res, next){
        const name = req.body.name;
        const email= req.body.email;
        const password= req.body.password;
        const repassword= req.body.repassword;
        if(!name || !email || !password || !repassword){
            res.render('signup',{errMess: 'err'});
            return;
        }else{
            user.findOne({email:`${email}`}).then((result)=>{
                if(result) {
                    res.render('signup',{errMess: 'email already exists'});
                    return;
                }else{
                    const newUser = new user({
                        name: name,
                        email: email,
                        password: password,
                        keys: generateKeywords(name.toLowerCase()),
                    });
                    newUser.save();
                    next();
                }
            })
        }
    }

}
const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(' ').filter((word) => word);
  
    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];
  
    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
      flagArray[i] = false;
    }
  
    const createKeywords = (name) => {
      const arrName = [];
      let curName = '';
      name.split('').forEach((letter) => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    };
  
    function findPermutation(k) {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];
  
          if (k === length - 1) {
            stringArray.push(result.join(' '));
          }
  
          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    }
  
    findPermutation(0);
  
    const keywords = stringArray.reduce((acc, cur) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);
  
    return keywords;
  };
module.exports = new Middlewares();