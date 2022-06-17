export const hosts = {
  local: 'http://localhost:3001',
}

export const methods = {
  delete: 'DELETE',
  get: 'GET',
  post: 'POST',
  put: 'PUT',
}

export const publicPaths = {
  claim: '/claim',
  reg: '/auth/registration'
}

export const roles = {
  admin: 'Administrator',
  user: 'User'
}

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

export const messages = {
  regGood: 'You are registered successfully',
  regBad: 'You are not registered',
  noAuth: 'You are not authenticated',
  alreadyRegistered: 'User with the same credentials is already registered',
  default: 'Something went wrong'
}

export const claimsStatuses = {
  error: 'error',
  default: 'default', 
  loading: 'loading',
  message: 'message',
  modal: 'modal',
}

export const pager = {
  base: 10,
  edge: 500,
  offsetMin: 4,
  offsetMax: 6
}

export const sortOptions = {
  asc: 'asc',
  desc: 'desc'
}

export const columnOptions = {
  title: 'title', 
  description: 'description',
  type: 'type',
  status: 'status'
}

export const typeColors = [
  '#7DB59A',
  '#FF7675',
  '#FDCB6E',
  '#6C5CE7'
]

export const statusColors = [
  '#E84393',
  '#6C5CE7',
  '#00B894',
  '#FDCB6E'
]

  //------------------------------------------------------------//
  // Реализация функции, которая будет перемещать фокус с
  // текущего элемента input на следующий                                 
  //------------------------------------------------------------//
  export const onPressedEnter = elements => e => {
    if (e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
      let arr = Object.values(elements);
      let pos = arr.find(item => item.id === e.target.id).pos;
      elements[++pos % arr.length].state.focus();
    }
  }

  export function checkForm(states) {
    if (!Array.isArray(states)) return false;
    let isValid = states.every(item => item.state.status);
    if (!isValid) {
      states.forEach(item => {
        if (!item.state.status) item.setState(state=>({...state, touched: true}));
      });
      return false;
    }
    return true;
  }

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

  export async function sendRequestBodyless(publicPath, method, token ) {
    return await fetch(new URL(publicPath, hosts.local), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }
