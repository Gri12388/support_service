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
