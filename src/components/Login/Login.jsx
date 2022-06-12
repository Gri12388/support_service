import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import InputText from '../InputText/InputText.jsx';

import { rules, errors, messages, typeColors } from '../../data/data.js';
import { uploadTypes } from '../../store/slices/typesSlice.js';
import { upload } from '../../store/slices/claimsSlice.js';

import '../../assets/styles/common.scss';
import './Login.scss';

import mail from '../../assets/images/mail.svg';
import lock from '../../assets/images/lock.svg';


function Login({ setLoading, email, setEmail, password, setPassword }) {
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const states = [
    {state: email, setState: setEmail},
    {state: password, setState: setPassword},
  ];

  const onEmailInput = e => setEmail(state=>({...state, content: e.target.value}));
  const onPasswordInput = e => setPassword(state=>({...state, content: e.target.value}));

  const onSubmit = e => {
    e.preventDefault();

    let isValid = states.every(item => item.state.status);
    if (!isValid) {
      states.forEach(item => {
        if (!item.state.status) item.setState(state=>({...state, touched: true}));
      });
      return;
    }

    let post = {
      email: email.content,
      password: password.content
    }
    
    sendRequest(JSON.stringify(post));
    setLoading(state=>({...state, isLoading: true, isBlocked: true}));

  }




  async function sendRequest(body) {
    let promise = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}, 
      body: body,
    });

    switch(promise.status) {
      case 200: break;
      case 401: setLoading(state=>({...state, isBlocked: false, message: messages.noAuth}));
                return;
      default:  setLoading(state=>({...state, isBlocked: false, message: messages.default}));
                return;
    }
    
    let data = await promise.json();

//-------------------------------------------------------------------

    // let promiseClaims = await fetch('http://localhost:3001/claim?offset=0&limit=10', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${data.token}`
    //   },
    // });

    // switch(promiseClaims.status) {
    //   case 200: break;
    //   default:  setLoading(state=>({...state, isBlocked: false, message: messages.default}));
    //             return;
    // }

    // let result = await promiseClaims.json();
    // result.token = data.token;

    // dispatch(upload(result));

//-------------------------------------------------------------------

    
    console.log (data);

    sessionStorage.setItem('fullName', data.fullName);
    sessionStorage.setItem('role', data.role.name);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('offset', 0);

    //--- Загружаем типы ---//

    let promiseTypes = await fetch('http://localhost:3001/types', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.token}`
      },
    });

    switch(promiseTypes.status) {
      case 200: break;
      default:  setLoading(state=>({...state, isBlocked: false, message: messages.default}));
                return;
    }

    let types = await promiseTypes.json();

    if (!Array.isArray(types)) {
      setLoading(state=>({...state, isBlocked: false, message: messages.default}));
      return;
    }

    let typesArray = types.map((item, index) => ({
      id: index,
      type: item.name,
      slug: item.slug,
      color: typeColors[index % typeColors.length] 
    }));

    typesArray.push({id: typeColors.length, type: 'Other', color: '#ADADAD'});

    let typesObject = {};

    typesArray.forEach(item => typesObject[item.id] = item);

    dispatch(uploadTypes(typesObject));

    // typesObject;

    // debugger

    setLoading({isLoading: false, isBlocked: false, message: ''});
    navigate('/base/claims');
  }

  const onBlur = (setter, checker) => {
    setter(state=>({...state, touched: true}));
    checker();
  }

  const onKeyDown = e => {
    if (e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const checkEmail = () => {
    if (email.content.length === 0) return setEmail(state=>({...state, status: false, error: errors.emailErrors.noEmail}));
    if (!rules.emailRegExp.test(email.content)) return setEmail(state=>({...state, status: false, error: errors.emailErrors.wrongEmail}));
    setEmail(state=>({...state, status: true, error: ''}));
  }

  const checkPassword = () => {
    if (password.content.length === 0) return setPassword(state=>({...state, status: false, error: errors.passwordErrors.noPassword}));
    if (password.content.length < rules.passwordLengthMin) return setPassword(state=>({...state, status: false, error: errors.passwordErrors.shortPassword}));
    if (password.content.length > rules.passwordLengthMax) return setPassword(state=>({...state, status: false, error: errors.passwordErrors.longPassword}));
    setPassword(state=>({...state, status: true, error: ''}));
  }

  return (
    <form className='Login__form' onSubmit={onSubmit} onKeyDown={onKeyDown}>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id='fromLogin__email'
          type='email'
          label='E-MAIL'
          placeholder='Type your e-mail'
          value={email.content}
          img={mail}
          alt='mail'
          callbacks={{onChange: onEmailInput, onBlur: onBlur.bind(null, setEmail, checkEmail)}}
          state={email}
        />
      </div>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id='fromLogin__password'
          type='password'
          label='PASSWORD'
          placeholder='Type your password'
          value={password.content}
          img={lock}
          alt='lock'
          callbacks={{onChange: onPasswordInput, onBlur: onBlur.bind(null, setPassword, checkPassword)}}
          state={password}
        />
      </div>
      <div className='Login__checkbox_wrapper'>
        <input type='checkbox' id='Login__checkbox' name='Login__checkbox' className='Login__checkbox' />
        <label htmlFor='' className='text2'>Keep me logged in</label>
      </div>

      
     
      <input type='submit' className='button2 xbutton1' value='Login' />
    </form>
  );
}

export default Login;

//---------------------------

  // let [email, setEmail] = useState('');
  // let [password, setPassword] = useState();

//---------------------------

//  {/* <button className='button2 xbutton1'>Login</button> */}

//---------------------------