export interface Ihost {
  local: string;
}

export interface Imethods {
  delete: string;
  get: string;
  post: string;
  put: string;
}

export interface IpublicPaths {
  auth: string;
  claim: string;
  reg: string;
  status: string;
  types: string;
}

export interface Iclaims {
  declined: string;
  done: string;
  new: string;
}

export interface Iroles {
  admin: string;
  user: string;
}

export interface Irules {
  nameLengthMin: number;
  nameLengthMax: number;
  surnameLengthMin: number;
  surnameLengthMax: number;
  emailRegExp: RegExp,
  passwordLengthMin: number;
  passwordLengthMax: number;
  titleLengthMax: number;
}

export interface InameErrors {
  noName: string;
  shortName: string;
  longName: string;
}

export interface IsurnameErrors {
  noSurname: string;
  shortSurname: string;
  longSurname: string;
}

export interface IemailErrors {
  noEmail: string;
  wrongEmail: string;
}

export interface IpasswordErrors {
  noPassword: string;
  noPasswordCopy: string;
  shortPassword: string;
  longPassword: string;
  noMatch: string;
}

export interface ItitleErrors {
  noTitle: string;
  longTitle: string;
}

export interface IdescriptionError {
  noDescription: string;
}

export interface ItypeError {
  noType: string;
}

export interface ItypeError {
  noType: string;
}

export interface Ierrors {
  nameErrors: InameErrors;
  surnameErrors: IsurnameErrors;
  emailErrors: IemailErrors;
  passwordErrors: IpasswordErrors;
  titleErrors: ItitleErrors;
  descriptionError: IdescriptionError;
  typeError: ItypeError;
}

// export interface Imessages {
//   alreadyRegistered: string;
//   default: string;
//   regBad: string;
//   regGood: string;
//   noAuth: string;
//   noClaimId: string;
//   noData: string;
//   noFound: string;
//   noFoundStatus: string,
//   noFoundType: string;
//   noRole: string;
//   noToken: string;
//   noUserId: string;
//   nullEmail: string;
//   nullPassword: string;
//   nullStatusOrTypeName: string;
//   nullStatusOrTypeSlug: string;
//   wrongData: string;
// }

export interface Imessages {
  [index : string] : string;
}

export interface IclaimsModes {
  default: string;
  modal: string;
}

export interface IclaimsStatuses {
  ok: string;
  error: string;
  loading: string;
  message: string;
}

export interface Ipager {
  base: number;
  edge: number;
  offsetMin: number;
  offsetMax: number;
}

export interface IsortOptions {
  asc: string;
  desc: string;
}

export interface IcolumnOptions {
  title: string;
  description: string;
  type: string;
  status: string;
}

export interface Itoken {
  token: string;
}