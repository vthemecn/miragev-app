var validators = {};

// 手机
validators.isMobile = function(mobile){
  if(/^1\d{10}$/.test(mobile) == true){
    return true;
  }
  return false;
};

// 身份证
validators.isIdCard = function(idCard){
  if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard) == true){
    return true;
  }
  return false;
};

// 密码
validators.isPassword = function(password){
  // if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,20}$/.test(password)){
  if(/^(?![a-zA-Z]+$)[0-9a-zA-Z]{6,20}$/.test(password)){
    return true;
  }
  return false;
};

// 邮箱
validators.isEmail = function(email){
  if(/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(email)){
    return true;
  }
  return false;
};

// 价格 格式 11.01
validators.isPrice = function(email){
  if(/^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/.test(email)){
    return true;
  }
  return false;
};

export default validators;
