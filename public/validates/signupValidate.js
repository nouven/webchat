
      const name = document.querySelector('#name');
      const nameErr = document.querySelector('#nameErr');
      const email = document.querySelector('#email');
      const emailErr = document.querySelector('#emailErr');
      const password= document.querySelector('#password');
      const passwordErr = document.querySelector('#passwordErr');
      const repassword= document.querySelector('#repassword');
      const repasswordErr= document.querySelector('#repasswordErr');
      function showErrMess(errInput, mess){
        errInput.textContent = mess;
      };
      function hiddenErrMess(errInput){
        errInput.textContent  = "";
      }

      name.addEventListener('blur',()=>{
        let value = name.value;
        if(value == ""){
          showErrMess(nameErr, 'this field is require');
        }else{
          hiddenErrMess(nameErr);
        }
      });
      email.addEventListener('blur',()=>{
        let value = email.value;
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(value == ""){
          showErrMess(emailErr, 'this field is require');
        }else if(!value.match(validRegex)){
          showErrMess(emailErr, 'this field is email');
        }else{
          hiddenErrMess(emailErr);
        }

      })
      password.addEventListener('blur',()=>{
        let value = password.value;
        if(value == ""){
          showErrMess(passwordErr, 'this field is require');
        }else{
          hiddenErrMess(passwordErr);
        }
      })
      repassword.addEventListener('blur',()=>{
        let value = repassword.value;
        if(value == ""){
          showErrMess(password, 'this feild is require');
        }else if(repassword.value != password.value){
          showErrMess(repasswordErr, 'password do not match');
        }else{
          hiddenErrMess(repasswordErr);
        }
      })