export const rules = {
  nameLengthMin: 1,
  nameLengthMax: 20,
  surnameLengthMin: 1,
  surnameLengthMax: 20,
  emailRegExp: /^\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3}$/,
  passwordLengthMin: 6,
  passwordLengthMax: 20,
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
  }
}

export const messages = {
  regGood: 'You are registered successfully',
  regBad: 'You are not registered',
  noAuth: 'You are not authenticated',
  alreadyRegistered: 'User with the same credentials is already registered',
  default: 'Something went wrong'
}

export const pager = {
  base: 10,
  edge: 500,
  offsetMin: 4,
  offsetMax: 6
}
