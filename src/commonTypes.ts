export interface IinputElement {
  content: string; 
  error: string;
  focused: boolean;
  status: boolean;
  touched: boolean;
}

export interface IselElement {
  content: boolean;
}

export interface Ielement {
  id: string;
  state: HTMLElement | null;
  pos: number;
}

export interface IelementsObj {
  [index : string] : Ielement
}

export interface IloginResponse {
  token: string;
  fullName?: string; 
  role: {
    name: string;
  }
}

export interface IresponseItem {
  name: string;
  slug: string;
}

export interface ItempArrItem {
  [index: string]: string | number;
  id: number;
  slug: string;
  color: string;
}

export interface Isignal { 
  signal: boolean 
}

export interface Iobj {
  id: number;
  color: string;
  slug?: string;
  status?: string;
  type?: string;
}

export interface IobjObj {
  [index: string] : Iobj;
}

export interface Iclaim {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  title: string | null;
  description: string | null;
  type: {
    name: string;
    slug: string;
  } | null;
  status: {
    name: string;
    slug: string;
  } | null;
}

export interface Iclaims {
  [index: string] : Iclaim
}

export interface IclaimsSliceState {
  totalItems: number;
  values: Iclaims;
  mode: string;
  status: string;
  message: string;
}

export interface IcommonSliceState {
  search: string;
  sort: string;
  column: string;
}

export interface IpagerSliceState {
  offset: number,
  last: number,
  start: number,
  stop: number,
  pointer: number,
  displayLeft: boolean,
  displayRight: boolean,
}

export interface IsetPagerStatePayload {
  offset?: number,
  last?: number,
  start?: number,
  stop?: number,
  pointer?: number,
  displayLeft?: boolean,
  displayRight?: boolean,
}

export interface IsetCommonStatePayload {
  search?: string;
  sort?: string;
  column?: string;
}

export interface IconfigSettingsPayload {
  mode?: string;
  status?: string;
  message?: string;
}

export interface IcreateAsyncThunkParams {
  token : string; 
  offset : number; 
  limit : number; 
  search : string; 
  column : string; 
  sort : string;
}

export interface IrequestResult {
  totalItems: number;
  claims: Iclaim[];
}

export interface IinputTextCallbacks {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void; 
  onBlur: () => void;
  onPressedEnter: (e: React.KeyboardEvent<Element>) => void;
}

export interface IinputSelCallbacks {
  onChange: (id: string) => void;
  onFocus: () => void; 
  onBlur: () => void;
  onPressedEnter: (e: React.KeyboardEvent<Element>) => void;
}

export interface IconfigInputWrapperViewReturn {
  isWarningShown: boolean;
  className: string;
}

export interface Itoken {
  token: string;
}

export interface ISliderConfig {
  isVisible: boolean;
}

export interface IBaseIconsData {
  id: number;
  name: string;
}

export interface IsliderItemsData {
  id: number;
  name: string;
  content: string;
}

export interface IlocationState {
  id: string;
  title : string;
  typeSlug : string;
  description: string;
}