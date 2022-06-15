import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import InputText from '../InputText/InputText.jsx';
import Sel from '../Sel/Sel.jsx';

import { rules, errors, messages } from '../../data/data.js'
import { configSettings } from '../../store/slices/claimsSlice.js';

import '../../assets/styles/common.scss';
import './NewClaim.scss';

function NewClaim() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState({content: '', status: false, touched: false, error: errors.titleErrors.noTitle});
  const [description, setDescription] = useState({content: '', status: false, touched: false, error: errors.descriptionError.noDescription});
  const [type, setType] = useState({content: '', status: false, touched: false, error: errors.typeError.noType});

  const states = [
    {state: title, setState: setTitle},
    {state: description, setState: setDescription},
    {state: type, setState: setType},
  ];

  const onTitleInput = e => setTitle(state=>({...state, content: e.target.value}));
  const onDescriptionInput = e => setDescription(state=>({...state, content: e.target.value}));
  const onTypeInput = id => setType(state=>({...state, content: id, touched: true, status: true }));

  const setStatesDefault = () => {
    setTitle({content: '', status: false, touched: false, error: errors.titleErrors.noTitle});
    setDescription({content: '', status: false, touched: false, error: errors.descriptionError.noDescription});
    setType({content: '', status: false, touched: false, error: errors.typeError.noType});
  }

  const onSubmit = e => {
    e.preventDefault();

    let isValid = states.every(item => item.state.status);
    if (!isValid) {
      states.forEach(item => {
        if (!item.state.status) item.setState(state=>({...state, touched: true}));
      });
      return;
    }

    let token = sessionStorage.getItem('token');
    let postBodyJSON = JSON.stringify({
      title: title.content,
      description: description.content,
      type: JSON.parse(sessionStorage.getItem('types'))[type.content].slug,
      status: Object.values(JSON.parse(sessionStorage.getItem('statuses'))).find(item => item.status === 'NEW').slug,
    });


    dispatch(configSettings({status: 'loading'}));
    sendRequest(token, postBodyJSON).catch(err => {
      setStatesDefault();
      dispatch(configSettings({status: 'ok', error: true, errorMessage: err.message}));
      console.log(err);

    })
  }

  async function sendRequest(token, body) {

    let promise = await fetch('http://localhost:3001/claimss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    
    switch (promise.status) {
      case 200: dispatch(configSettings({status: 'ok'}));
                sessionStorage.setItem('offset', 'last');
                navigate('/base/claims');
                break;
      default:  throw Error(messages.default);
    }
  }

  const onBlur = (setter, checker) => {
    setter(state=> ({...state, touched: true}));
    checker();
  }

  const onCancel = () => navigate(-1);

  const checkTitle = () => {
    if (title.content.length === 0) return setTitle(state=>({...state, status: false, error: errors.titleErrors.noTitle}));
    if (title.content.length > rules.titleLengthMax) return setTitle(state=>({...state, status: false, error: errors.titleErrors.longTitle}));
    setTitle(state=>({...state, status: true, error: ''}));
  }

  const checkDescription = () => {
    if (description.content.length === 0) return setDescription(state=>({...state, status: false, error: errors.descriptionError.noDescription}));
    setDescription(state=>({...state, status: true, error: ''}));
  }

  const checkType = () => {
    if (type.content.length === 0) return setType(state=>({...state, status: false, error: errors.typeError.noType}));
    setType(state=>({...state, status: true, error: ''}));
  }

  return(
    <form className='container2' onSubmit={onSubmit}>
      <p className='text4 NewClaim__title'>Creating new claim</p>
      <section className='NewClaim__input'>
        <InputText 
          id='fromNewClaim__title'
          label='TITLE'
          placeholder='Type claim title'
          value={title.content}
          callbacks={{onChange: onTitleInput, onBlur: onBlur.bind(null, setTitle, checkTitle)}}
          state={title}
        />
      </section>
      <section className='NewClaim__input'>
        <Sel 
          id='fromNewClaim__type'
          label='TYPE'
          groupId={'fromNewClaim__sel1'}
          placeholder='Select type'
          value={type.content}
          callbacks={{onChange: onTypeInput, onBlur: onBlur.bind(null, setType, checkType)}}
          state={type}
        />
      </section>
      <section className='NewClaim__input'>
        <InputText 
          id='fromNewClaim__description'
          label='DESCRIPTION'
          placeholder='Type claim description'
          value={description.content}
          callbacks={{onChange: onDescriptionInput, onBlur: onBlur.bind(null, setDescription, checkDescription)}}
          state={description}
        />
      </section>
      <section className='NewClaim__buttons'>
        <button className='button3 NewClaim__button' onClick={onCancel}>Cancel</button>
        <input  type='submit' className='button2 xbutton1 NewClaim__button' value='Create' />
      </section>
    </form>
  ); 
}

export default NewClaim;