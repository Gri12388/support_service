import { decode } from 'jsonwebtoken';
import * as crypto from 'crypto';



//------------------------------------------------------------//
// Константы, необходимые для функций шифрования/дешифрования.                           
//------------------------------------------------------------//
const key = crypto.randomBytes(16).toString('hex');
const algorithm = 'aes256';



//------------------------------------------------------------//
// Возможные хосты.                           
//------------------------------------------------------------//
export const hosts = {
  local: 'http://localhost:3001',
}



//------------------------------------------------------------//
// Возможные методы.                      
//------------------------------------------------------------//
export const methods = {
  delete: 'DELETE',
  get: 'GET',
  post: 'POST',
  put: 'PUT',
}



//------------------------------------------------------------//
// Возможные пути.                           
//------------------------------------------------------------//
export const publicPaths = {
  auth: '/auth/login',
  claim: '/claim',
  reg: '/auth/registration',
  status: '/status',
  types: '/types'
}



//------------------------------------------------------------//
// Возможные действия пользователя.                           
//------------------------------------------------------------//
export const claims = {
  declined: 'Declined',
  done: 'Done',
  new: 'New'
}



//------------------------------------------------------------//
// Возможные роли пользователя.                       
//------------------------------------------------------------//
export const roles = {
  admin: 'Administrator',
  user: 'User'
}



//------------------------------------------------------------//
// Возможные правила валидации.                      
//------------------------------------------------------------//
export const rules = {
  nameLengthMin: 1,
  nameLengthMax: 20,
  surnameLengthMin: 1,
  surnameLengthMax: 20,
  emailRegExp: /^\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3}$/,
  passwordLengthMin: 6,
  passwordLengthMax: 20,
  titleLengthMax: 30,
}



//------------------------------------------------------------//
// Возможные ошибки валидации.                         
//------------------------------------------------------------//
export const errors = {
  nameErrors: {
    noName: 'Type name',
    shortName: 'Name is short',
    longName: 'Name is long',
  },
  surnameErrors: {
    noSurname: 'Type surname',
    shortSurname: 'Surname is short',
    longSurname: 'Surname is long',
  },
  emailErrors: {
    noEmail: 'Type email',
    wrongEmail: 'Wrong email',
  },
  passwordErrors: {
    noPassword: 'Type password',
    noPasswordCopy: 'Repeat password',
    shortPassword: 'Password is short',
    longPassword: 'Password is long',
    noMatch: 'Passwords don\'t match', 
  },
  titleErrors: {
    noTitle: 'Type title',
    longTitle: 'Title is long'
  },
  descriptionError: {
    noDescription: 'Type description',
  },
  typeError: {
    noType: 'Choose type',
  }
}



//------------------------------------------------------------//
// Возможные сообщения об ошибках.                          
//------------------------------------------------------------//
export const messages = {
  alreadyRegistered: 'User with the same credentials is already registered',
  default: 'Something went wrong',
  regBad: 'You are not registered',
  regGood: 'You are registered successfully',
  noAuth: 'You are not authenticated',
  noData: 'Data is not recieved',
  noFound: 'Page is not found',
  noRole: 'Role is not defined',
  noToken: 'Token is not recieved',
  wrongData: 'Recieved data are not correct'
}



//------------------------------------------------------------//
// Возможные состояния свойства Mode из claimsSlice.js.                            
//------------------------------------------------------------//
export const claimsModes = {
  default: 'default',
  modal: 'modal',
}



//------------------------------------------------------------//
// Возможные состояния свойства Status из claimsSlice.js.                            
//------------------------------------------------------------//
export const claimsStatuses = {
  ok: 'ok',
  error: 'error',
  loading: 'loading',
  message: 'message',
}



//------------------------------------------------------------//
// Конфигураця компонента 'Pager': base - число записей в 
// оффсете, edge - граница измнения вида Pager, offsetMin и 
// offsetMax - минимальный и максимальный размер оффсета 
// Pager.                             
//------------------------------------------------------------//
export const pager = {
  base: 10,
  edge: 500,
  offsetMin: 4,
  offsetMax: 6
}



//------------------------------------------------------------//
// Виды сортировки.                             
//------------------------------------------------------------//
export const sortOptions = {
  asc: 'asc',
  desc: 'desc'
}



//------------------------------------------------------------//
// Возможные названия колонок таблицы.                               
//------------------------------------------------------------//
export const columnOptions = {
  title: 'title', 
  description: 'description',
  type: 'type',
  status: 'status'
}



//------------------------------------------------------------//
// Палитра цветов типов.                                
//------------------------------------------------------------//
export const typeColors = [
  '#7DB59A',
  '#FF7675',
  '#FDCB6E',
  '#6C5CE7'
]



//------------------------------------------------------------//
// Палитра цветов статусов.                                
//------------------------------------------------------------//
export const statusColors = [
  '#E84393',
  '#6C5CE7',
  '#00B894',
  '#FDCB6E'
]

  //------------------------------------------------------------//
  // Функция, возвращающая функцию, которая будет перемещать 
  // фокус с текущего элемента input на следующий.                                 
  //------------------------------------------------------------//
  export const onPressedEnter = elements => e => {
    if (e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
      let arr = Object.values(elements);
      let pos = arr.find(item => item.id === e.target.id).pos;
      elements[++pos % arr.length].state.focus();
    }
  }



  //------------------------------------------------------------//
  // Функция, устанавливающая значение token. Извлекает 
  // token из sessionStorage и проверяет его актуальность. 
  // Если token просрочен - возвращает null, иначе возвращает
  // значение token.                                 
  //------------------------------------------------------------//
  export function setToken() {
    const x = sessionStorage.getItem('token');
    if (!x) return null;
    const temp = sessionStorage.getItem('token');
    if (Date.now() >= decode(temp).exp * 1000) return null;
    else return temp;
  }



  //------------------------------------------------------------//
  // Функция, шифрующая строку.                                 
  //------------------------------------------------------------//
  export function encrypt(string) {
    const iv =  crypto.randomBytes(8).toString('hex');
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${encrypted}:${iv}:${key}`;
  }



  //------------------------------------------------------------//
  // Функция, расшифровывающая строку.                                 
  //------------------------------------------------------------//
  export function decrypt(string) {
    const [encryptedString, iv, key] = string.split(':');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted; 
  }



  //------------------------------------------------------------//
  // Функция, направляющая запрос на сервер с телом.                                  
  //------------------------------------------------------------//
  export async function sendRequestBodyfull(publicPath, method, body, token ) {
    return await fetch(new URL(publicPath, hosts.local), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
      body: body,
    });
  }



  //------------------------------------------------------------//
  // Функция, направляющая запрос на сервер без тела.                                  
  //------------------------------------------------------------//
  export async function sendRequestBodyless(publicPath, method, token ) {
    return await fetch(new URL(publicPath, hosts.local), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }


  
  //------------------------------------------------------------//
  // Функция, нормализующая данные, полученные с сервера                                  
  //------------------------------------------------------------//
  export function handleData(arr, str) {
    let name;
    let database;
    let length;
    let obj;

    switch(str) {
      case 'type':    name = 'type';
                      database = typeColors;
                      length = typeColors.length;
                      obj = { id: length, type: 'Other', color: '#ADADAD' };
                      break;
      case 'status':  name = 'status';
                      database = statusColors;
                      length = statusColors.length;
                      obj = {id: length, status: 'UNDEFINED', color: '#ADADAD'}
                      break;
      default: return '';
    }

    const tempArr = arr.map((item, index) => ({
      id: index,
      [name]: item.name,
      slug: item.slug,
      color: database[index % length] 
    }));

    tempArr.push(obj);

    const tempObj = {};

    tempArr.forEach(item => tempObj[item.id] = item);

    return JSON.stringify(tempArr);
  }



  //------------------------------------------------------------//
  // Функция формирует содержание body-компонента AJAX запроса                              
  //------------------------------------------------------------//  
  export function createBody(email, pass) {
    return JSON.stringify({
      email: email,
      password: pass
    });
  }



  //------------------------------------------------------------//
  // Функция, обновляющая типы.                                  
  //------------------------------------------------------------//
  export async function getTypes(token) {
    
    const publicPath = publicPaths.types;
    const method = methods.get;
    
    let res = await sendRequestBodyless(publicPath, method, token);

    if (
      !res || 
      typeof res !== 'object' || 
      !res.status || 
      isNaN(+res.status)
    ) throw new Error(messages.wrongData);

    switch (res.status) {
      case 200: res = await res.json(); break;
      case 404: throw new Error(messages.noFound);
      default:  throw new Error(messages.default);
    }

    if (!Array.isArray(res)) throw new Error(messages.wrongData);
    sessionStorage.setItem('types', handleData(res, 'type'));
  }



  //------------------------------------------------------------//
  // Функция, обновляющая статусы.                                  
  //------------------------------------------------------------//
  export async function getStatuses(token) {
    const publicPath = publicPaths.status;
    const method = methods.get;
    
    let res = await sendRequestBodyless(publicPath, method, token);
    
    if (
      !res || 
      typeof res !== 'object' || 
      !res.status || 
      isNaN(+res.status)
    ) throw new Error(messages.wrongData);
    
    switch (res.status) {
      case 200: res = await res.json(); break;
      case 404: throw new Error(messages.noFound);
      default:  throw new Error(messages.default);
    }

    if (!Array.isArray(res)) throw new Error(messages.wrongData);
    sessionStorage.setItem('statuses', handleData(res, 'status'));
  }



  //------------------------------------------------------------//
  // Функция, обновляющая token.                                  
  //------------------------------------------------------------//
  export async function getToken(email, pass) {

    const decryptedEmail = decrypt(email);
    const decryptedPass = decrypt(pass);

    const publicPath = publicPaths.auth;
    const method = methods.post;
    const bodyJSON = createBody(decryptedEmail, decryptedPass);

    let res = await sendRequestBodyfull(publicPath, method, bodyJSON)

    if (
      !res || 
      typeof res !== 'object' || 
      !res.status || 
      isNaN(+res.status)
    ) throw new Error(messages.wrongData);

    switch (res.status) {
      case 200: res = await res.json(); break;
      case 401: throw new Error(messages.noAuth);
      case 404: throw new Error(messages.noFound);
      default:  throw new Error(messages.default); 
    }

    if (!res || typeof res !== 'object') throw new Error(messages.noData);

    if (!res.token) throw new Error(messages.noToken);
    else {
      sessionStorage.setItem('token', res.token);
      return res.token;
    }
  }



  //------------------------------------------------------------//
  // Функция, обновляющая сессию.                                  
  //------------------------------------------------------------//
  export async function reconnect(email, pass) {

    const token = await getToken(email, pass);
    await getTypes(token);
    await getStatuses(token);

    return { newToken: token } 
  }