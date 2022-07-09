import React from 'react';
import { decode, JwtPayload } from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as T from '../commonTypes';
import type * as t from './types'; 




//------------------------------------------------------------//
// Константы, необходимые для функций шифрования/дешифрования.                           
//------------------------------------------------------------//
const key: string = crypto.randomBytes(16).toString('hex');
const algorithm = 'aes256';


//------------------------------------------------------------//
// Enum, содержащий тип проверки ответа с сервера.                           
//------------------------------------------------------------//
export enum EresponseTypes {
  Token,
  Status,
  Type,
}



//------------------------------------------------------------//
// Возможные хосты.                           
//------------------------------------------------------------//
export const hosts: t.Ihost = {
  local: 'http://localhost:3001',
}



//------------------------------------------------------------//
// Возможные методы.                      
//------------------------------------------------------------//
export const methods: t.Imethods = {
  delete: 'DELETE',
  get: 'GET',
  post: 'POST',
  put: 'PUT',
}



//------------------------------------------------------------//
// Возможные пути.                           
//------------------------------------------------------------//
export const publicPaths: t.IpublicPaths = {
  auth: '/auth/login',
  claim: '/claim',
  reg: '/auth/registration',
  status: '/status',
  types: '/types'
}



//------------------------------------------------------------//
// Возможные действия пользователя.                           
//------------------------------------------------------------//
export const claims: t.Iclaims = {
  declined: 'Declined',
  done: 'Done',
  new: 'New'
}



//------------------------------------------------------------//
// Возможные роли пользователя.                       
//------------------------------------------------------------//
export const roles: t.Iroles = {
  admin: 'Administrator',
  user: 'User'
}



//------------------------------------------------------------//
// Возможные правила валидации.                      
//------------------------------------------------------------//
export const rules: t.Irules = {
  nameLengthMin: 1,
  nameLengthMax: 20,
  surnameLengthMin: 1,
  surnameLengthMax: 20,
  emailRegExp: /^\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3}$/,
  passwordLengthMin: 1,
  passwordLengthMax: 30,
  titleLengthMax: 50,
}



//------------------------------------------------------------//
// Возможные ошибки валидации.                         
//------------------------------------------------------------//
export const errors: t.Ierrors = {
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
export const messages: t.Imessages = {
  alreadyRegistered: 'User with the same credentials is already registered',
  default: 'Something went wrong',
  regBad: 'You are not registered',
  regGood: 'You are registered successfully',
  noAuth: 'You are not authenticated',
  noClaimId: 'Claim has not id',
  noData: 'Data is not recieved',
  noFound: 'Page is not found',
  noFoundStatus: 'Status is not found',
  noFoundType: 'Type is not found',
  noRole: 'Role is not defined',
  noToken: 'Token is not recieved',
  noUserId: 'Claim has not user\'s id',
  nullEmail: 'Email is null',
  nullPassword: 'Password is null',
  nullStatusOrTypeName: 'Status\'s or type\'s name is null',
  nullStatusOrTypeSlug: 'Status\'s or type\'s slug is null',
  wrongData: 'Recieved data are not correct',
}



//------------------------------------------------------------//
// Возможные состояния свойства Mode из claimsSlice.                            
//------------------------------------------------------------//
export const claimsModes: t.IclaimsModes = {
  default: 'default',
  modal: 'modal',
}



//------------------------------------------------------------//
// Возможные состояния свойства Status из claimsSlice.                            
//------------------------------------------------------------//
export const claimsStatuses: t.IclaimsStatuses = {
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
export const pager: t.Ipager = {
  base: 10,
  edge: 500,
  offsetMin: 4,
  offsetMax: 6
}



//------------------------------------------------------------//
// Виды сортировки.                             
//------------------------------------------------------------//
export const sortOptions: t.IsortOptions = {
  asc: 'asc',
  desc: 'desc'
}



//------------------------------------------------------------//
// Возможные названия колонок таблицы.                               
//------------------------------------------------------------//
export const columnOptions: t.IcolumnOptions = {
  title: 'title', 
  description: 'description',
  type: 'type',
  status: 'status'
}



//------------------------------------------------------------//
// Палитра цветов типов.                                
//------------------------------------------------------------//
export const typeColors: string[] = [
  '#7DB59A',
  '#FF7675',
  '#FDCB6E',
  '#6C5CE7'
]



//------------------------------------------------------------//
// Палитра цветов статусов.                                
//------------------------------------------------------------//
export const statusColors: string[] = [
  '#E84393',
  '#6C5CE7',
  '#00B894',
  '#FDCB6E'
]

  //------------------------------------------------------------//
  // Функция, возвращающая функцию, которая будет перемещать 
  // фокус с текущего элемента input на следующий.                                 
  //------------------------------------------------------------//
  export const onPressedEnter = (elements : T.IelementsObj) => (e: React.KeyboardEvent) => {
    if (e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
      const arr: T.Ielement[] = Object.values(elements);
      const element : T.Ielement | undefined = arr.find((item : T.Ielement) : boolean => item.id === e.currentTarget.id);
      let pos : number;
      if (element === undefined) {
        console.error('error #1 of "onPressedEnter" function');
        return;
      }
      pos = element.pos;
      const state : HTMLElement | null = elements[++pos % arr.length].state;
      if (state === null) {
        console.error('error #2 of "onPressedEnter" function');
        return;
      }
      state.focus();
    }
  }



  //------------------------------------------------------------//
  // Функция, устанавливающая значение token. Извлекает 
  // token из sessionStorage и проверяет его актуальность. 
  // Если token просрочен - возвращает null, иначе возвращает
  // значение token.                                 
  //------------------------------------------------------------//
  export function setToken(encryptedToken : string) : string | null {
    if (!encryptedToken) return null;
    const temp = decrypt(encryptedToken);
    const decoded : string | JwtPayload | null = decode(temp); 
    if (typeof decoded === 'string' || decoded === null || decoded.exp === undefined ) throw new Error (messages.wrongData);
    if (Date.now() >= decoded.exp * 1000) return null;
    else return temp;
  }



  //------------------------------------------------------------//
  // Функция, шифрующая строку.                                 
  //------------------------------------------------------------//
  export function encrypt(string : string) : string {
    const iv: string =  crypto.randomBytes(8).toString('hex');
    const cipher : crypto.Cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted : string = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${encrypted}:${iv}:${key}`;
  }



  //------------------------------------------------------------//
  // Функция, расшифровывающая строку.                                 
  //------------------------------------------------------------//
  export function decrypt(string : string) : string {
    
    const [encryptedString, iv, key] : string[] = string.split(':');
    const decipher : crypto.Decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted : string = decipher.update(encryptedString, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted; 
  }



  //------------------------------------------------------------//
  // Функция, направляющая запрос на сервер с телом.                                  
  //------------------------------------------------------------//
  export async function sendRequestBodyfull(publicPath : string, method : string, body : string, token? : string ) : Promise<Response> {
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
  export async function sendRequestBodyless(publicPath : string, method : string, token : string) : Promise<Response> {
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
  export function handleData(arr : T.IresponseItem[], str: string) : string {
    let name: string;
    let database: string[];
    let length: number;
    let obj: T.Iobj;

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

    const tempArr: T.Iobj[] = arr.map((item : T.IresponseItem, index : number) : T.Iobj => ({
      id: index,
      [name]: item.name,
      slug: item.slug,
      color: database[index % length] 
    }));

    tempArr.push(obj);

    const tempObj : T.IobjObj = {};

    tempArr.forEach((item : T.Iobj) => tempObj[item.id] = item);

    return JSON.stringify(tempObj);
  }



  //------------------------------------------------------------//
  // Функция формирует содержание body-компонента AJAX запроса                              
  //------------------------------------------------------------//  
  export function createBody(email : string, pass : string) : string {
    return JSON.stringify({
      email: email,
      password: pass
    });
  }



  export function checkLoginResponse(resultUnchecked: any){
    if (
      !resultUnchecked ||
      typeof resultUnchecked !== 'object' || 
      !resultUnchecked.token ||
      !resultUnchecked.role ||
      typeof resultUnchecked.role !== 'object' ||
      !resultUnchecked.role.name
    ) return false;
    return true;
  }


  //------------------------------------------------------------//
  // Функция проверяет полученный ответ на наличие необходимых
  // составляющих, набор которых зависит от представленного
  // критерия проверки.
  //------------------------------------------------------------// 
  export function checkResponse(resultUnchecked: any, criteria : EresponseTypes) : boolean {
    function checkStatusOrType() : boolean {
      if (
        !resultUnchecked ||
        typeof resultUnchecked !== 'object' || 
        !Array.isArray(resultUnchecked)
      ) return false;
      return true;
    }

    function checkToken() : boolean {
      if (
        !resultUnchecked ||
        typeof resultUnchecked !== 'object' || 
        !resultUnchecked.token
      ) return false;
      return true;
    }
    
    switch (criteria) {
      case EresponseTypes.Status: return checkStatusOrType();
      case EresponseTypes.Type: return checkStatusOrType();
      case EresponseTypes.Token: return checkToken();
      default: return false;
    }
  }



  //------------------------------------------------------------//
  // Функция нормализует полученный от сервера результат, то есть
  // приводит результа запроса к состоянию, конфигурацию которого
  // ожидает соответствующий тип данных. 
  //------------------------------------------------------------// 
  function normilizeResponse(resultUnchecked: any) : T.IresponseItem[] {
    const result : T.IresponseItem[] = [] as T.IresponseItem[]; 
    resultUnchecked.forEach((item: any) => {
      const responseItem : T.IresponseItem = {} as T.IresponseItem;
      if (item.name) responseItem.name = item.name.toString();
      else throw new Error(messages.nullStatusOrTypeName);
      if (item.slug) responseItem.slug = item.slug.toString();
      else throw new Error(messages.nullStatusOrTypeSlug);
      result.push(responseItem);
    });
    return result;
  }



  //------------------------------------------------------------//
  // Функция, обновляющая типы.                                  
  //------------------------------------------------------------//
  export async function getTypes(token : string) : Promise<void> {
    
    const publicPath : string = publicPaths.types;
    const method : string = methods.get;
    
    const res : Response = await sendRequestBodyless(publicPath, method, token);
    let resultUnchecked : any;

    switch (res.status) {
      case 200: resultUnchecked = await res.json() as T.IresponseItem[]; break;
      case 404: throw new Error(messages.noFound);
      default:  throw new Error(messages.default);
    }

    if (!checkResponse(resultUnchecked, EresponseTypes.Type)) throw new Error(messages.wrongData);

    const result : T.IresponseItem[] = normilizeResponse(resultUnchecked);
    
    sessionStorage.setItem('types', handleData(result, 'type'));
  }



  //------------------------------------------------------------//
  // Функция, обновляющая статусы.                                  
  //------------------------------------------------------------//
  export async function getStatuses(token : string) : Promise<void> {
    const publicPath : string = publicPaths.status;
    const method : string = methods.get;
    
    const res : Response = await sendRequestBodyless(publicPath, method, token);
    let resultUnchecked : any;

    switch (res.status) {
      case 200: resultUnchecked = await res.json(); break;
      case 404: throw new Error(messages.noFound);
      default:  throw new Error(messages.default);
    }

    if (!checkResponse(resultUnchecked, EresponseTypes.Status)) throw new Error(messages.wrongData);

    const result : T.IresponseItem[] = normilizeResponse(resultUnchecked);
        
    sessionStorage.setItem('statuses', handleData(result, 'status'));
  }



  //------------------------------------------------------------//
  // Функция, обновляющая token.                                  
  //------------------------------------------------------------//
  export async function getToken(email : string, pass : string) : Promise<string> {

    const decryptedEmail : string = decrypt(email);
    const decryptedPass : string = decrypt(pass);

    const publicPath : string = publicPaths.auth;
    const method : string = methods.post;
    const bodyJSON : string = createBody(decryptedEmail, decryptedPass);

    const res : Response = await sendRequestBodyfull(publicPath, method, bodyJSON);
    let resultUnchecked : any;

    switch (res.status) {
      case 200: resultUnchecked = await res.json() as T.Itoken; break;
      case 401: throw new Error(messages.noAuth);
      case 404: throw new Error(messages.noFound);
      default:  throw new Error(messages.default); 
    }

    if (!checkResponse(resultUnchecked, EresponseTypes.Token)) throw new Error(messages.wrongData);

    const result : T.Itoken = {} as T.Itoken;
    result.token = resultUnchecked.token.toString();

    const encryptedToken : string = encrypt(result.token);
    sessionStorage.setItem('token', encryptedToken);
    return result.token;
  }



  //------------------------------------------------------------//
  // Функция, обновляющая сессию.                                  
  //------------------------------------------------------------//
  export async function reconnect(email : string, pass : string) : Promise<{ newToken: string }> {

    const token : string = await getToken(email, pass);
    await getTypes(token);
    await getStatuses(token);

    return { newToken: token } 
  }