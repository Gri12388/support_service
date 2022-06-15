import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import InputText from '../InputText/InputText.jsx';
import Sel from '../Sel/Sel.jsx';

import { hosts, methods, publicPaths, rules, errors, messages } from '../../data/data.js'
import { configSettings } from '../../store/slices/claimsSlice.js';

import '../../assets/styles/common.scss';
import './NewClaim.scss';

function NewClaim() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  let typeID = useMemo(() => {
    if (location.state) {
      let types = Object.values(JSON.parse(sessionStorage.getItem('types')));
      let temp = types.find(item => item.slug === location.state.typeSlug).id;
      let other = types.find(item => item.type === 'Other').id;
      return temp === other ? '' : temp.toString();
    }
    return null;
  }, []);
  let doneSlug = useMemo(() => location.state && Object.values(JSON.parse(sessionStorage.getItem('statuses'))).find(item => item.status === 'DONE').slug, []);
  let declineSlug = useMemo(() => location.state && Object.values(JSON.parse(sessionStorage.getItem('statuses'))).find(item => item.status === 'DECLINED').slug, []);
  
  
  


  //location.state && Object.values(JSON.parse(sessionStorage.getItem('types'))).find(item => item.slug === location.slug).id;
  
  
  const [title, setTitle] = useState({
    content: location.state ? location.state.title : '', 
    status: location.state ? true : false, 
    touched: false, 
    error: errors.titleErrors.noTitle
  });
  
  const [description, setDescription] = useState({
    content: location.state ? location.state.description : '', 
    status: location.state ? true : false, 
    touched: false, 
    error: errors.descriptionError.noDescription
  });
  
  const [type, setType] = useState({
    content: location.state ? typeID : '', 
    status: location.state ? true : false, 
    touched: false, 
    error: errors.typeError.noType
  });

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


  const checkForm = () => {
    let isValid = states.every(item => item.state.status);
    if (!isValid) {
      states.forEach(item => {
        if (!item.state.status) item.setState(state=>({...state, touched: true}));
      });
      return false;
    }
    return true;
  }

  const createBody = claimStatus => JSON.stringify({
    title: title.content,
    description: description.content,
    type: JSON.parse(sessionStorage.getItem('types'))[type.content].slug,
    status: Object.values(JSON.parse(sessionStorage.getItem('statuses'))).find(item => item.status === claimStatus).slug,
  });

  const submit = claimStatus => {

    if (!checkForm()) return;

    let method;
    let publicPath;
    let token = sessionStorage.getItem('token');
    let bodyJSON = createBody(claimStatus);
    switch (claimStatus) {
      case 'NEW': method = methods.post;
                  publicPath = publicPaths.claim;
                  break;
      case 'DONE':
      case 'DECLINED':  method = methods.put;
                        publicPath = publicPaths.claim;
                        break;
      default: return;
    }
    
    if (location.state) publicPath += `/${location.state.id}`;
   
    dispatch(configSettings({status: 'loading'}));

    sendRequest(publicPath, method, token, bodyJSON).catch(err => {
      setStatesDefault();
      dispatch(configSettings({status: 'ok', error: true, errorMessage: err.message}));
      console.log(err);
    })
  }

  async function sendRequest(publicPath, method, token, body) {

    let promise = await fetch(hosts.local + publicPath, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    
    switch (promise.status) {
      case 200: dispatch(configSettings({status: 'ok'}));
                if (!location.state) sessionStorage.setItem('offset', 'last');
                navigate('/base/claims');
                break;
      default:  throw Error(messages.default);
    }
  }

  const onCreate = e => {
    e.preventDefault();
    submit('NEW')
  }

  const onDone = e => {
    e.preventDefault();
    submit('DONE')
  }

  const onDecline = e => {
    e.preventDefault();
    submit('DECLINED')
  }

  const onBlur = (setter, checker) => {
    setter(state=> ({...state, touched: true}));
    checker();
  }

  const onCancel = e => {
    e.preventDefault();
    navigate(-1);
  }

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
    <form className='container2'>
      <div className='subcontainer'>
      {!location.state && <p className='text4 NewClaim__title'>Creating new claim</p>}
      {location.state && <p className='text4 NewClaim__title'>Incoming claim</p>}
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
          {!location.state && <input  type='submit' 
                                      className='button2 xbutton1 NewClaim__button' 
                                      value='Create'
                                      onClick={onCreate}  
          />}
          {location.state && <input   type='submit' 
                                      className='button2 xbutton1 NewClaim__button' 
                                      value='Done'
                                      onClick={onDone}
          />}
          {location.state && <input   type='submit' 
                                      className='button1 xbutton1 NewClaim__button' 
                                      value='Decline'
                                      onClick={onDecline}

          />}
        </section>
      </div>
    </form>
  ); 
}

export default NewClaim;