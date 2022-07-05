import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store/store';

import type { 
  Iclaim,
  Iclaims,
  IclaimsSliceState, 
  IconfigSettingsPayload, 
  IcreateAsyncThunkParams,
  IrequestResult,
} from '../../commonTypes';

import { 
  claims,
  claimsModes, 
  claimsStatuses, 
  hosts,
  messages, 
  methods, 
  pager, 
  publicPaths,
  reconnect 
} from '../../data/data.js';

const initialState : IclaimsSliceState = {
  totalItems: 0,
  values: {},
  mode: claimsModes.default,
  status: claimsStatuses.ok,
  message: ''
}



//------------------------------------------------------------//
// Функция проверяет полученный ответ на наличие необходимых
// составляющих:
// 1) является ли ответ truthy;
// 2) является ли ответ объектом ('object');
// 3) есть ли в ответе свойство totalItems;
// 4) можно ли свойство totalItems конвертировать в number;
// 5) есть ли в ответе свойство claims;
// 6) является ли свойство claims массивом;
//------------------------------------------------------------// 
function checkResponse(resultUnchecked: any) : boolean {
  if (
    !resultUnchecked || 
    typeof resultUnchecked !== 'object' || 
    !resultUnchecked.totalItems || 
    isNaN(+resultUnchecked.totalItems) || 
    !resultUnchecked.claims ||
    !Array.isArray(resultUnchecked.claims)
  ) return false;
  return true;
}



//------------------------------------------------------------//
// Функция нормализует полученный от сервера результат, то есть
// приводит результа запроса к состоянию, конфигурацию которого
// ожидает соответствующий тип данных. 
//------------------------------------------------------------// 
function normalizeResponse(resultUnchecked: any) : Iclaim[] {
  const result : Iclaim[] = [] as Iclaim[]; 
  resultUnchecked.claims.forEach((item: any) => {
    const claim : Iclaim = {} as Iclaim;
    if (item._id) claim._id = item._id.toString();
    else throw new Error(messages.noClaimId);
    if (item.user) claim.user = item.user.toString();
    else throw new Error(messages.noUserId);
    if (item.createdAt) claim.createdAt = item.createdAt.toString();
    else claim.createdAt = '0000-00-00T00:00:00.000Z';
    if (item.updatedAt) claim.updatedAt = item.updatedAt.toString();
    else claim.updatedAt = '0000-00-00T00:00:00.000Z';
    if (item.title) claim.title = item.title.toString();
    else claim.title = null;
    if (item.description) claim.description = item.description.toString();
    else claim.description = null;
    if (item.type) {
      if (item.type.name && item.type.slug) claim.type = {
        name: item.type.name.toString(),
        slug: item.type.slug.toString(),
      };
      else if (!item.type.name && item.type.slug) claim.type = {
        name: '',
        slug: item.type.slug.toString(),
      };
      else if (item.type.name && !item.type.slug) claim.type = {
        name: item.type.name.toString(),
        slug: '',
      };
      else claim.type = {
        name: '',
        slug: '',
      };
    }
    else claim.type = null;
    if (item.status) {
      if (item.status.name && item.status.slug) claim.status = {
        name: item.status.name.toString(),
        slug: item.status.slug.toString(),
      };
      else if (!item.status.name && item.status.slug) claim.status = {
        name: '',
        slug: item.status.slug.toString(),
      };
      else if (item.status.name && !item.status.slug) claim.status = {
        name: item.status.name.toString(),
        slug: '',
      };
      else claim.status = {
        name: '',
        slug: '',
      };
    }
    else claim.status = null;
    result.push(claim);
  })
  return result;
}



export const fetchClaims = createAsyncThunk('claims/fetchClaims', async ({ token, offset, limit, search, column, sort } : IcreateAsyncThunkParams) => {

  //------------------------------------------------------------//
  // Если token просрочен, извлекаем из sessionStorage email и
  // password, затем, чтобы обновить token, вызываем функцию 
  // reconnect, передавая ей в качестве аргументов email и 
  // password.                                   
  //------------------------------------------------------------//
  if(!token) {
    const email : string | null = sessionStorage.getItem('email');
    const password : string | null = sessionStorage.getItem('password');
    if (!email) throw new Error(messages.nullEmail);
    if (!password) throw new Error(messages.nullPassword);
    token = (await reconnect(email, password)).newToken;
  }
  

  
  //------------------------------------------------------------//
  // Готовим пробный запрос на сервер, чтобы узнать общее 
  // количество элементов на момент запроса (totalItems). Если
  // мы что-то ищем, то указываем то, что ищем, чтобы узнать
  // общее количество элементов, удовлетворяющих критерию 
  // запроса.                                   
  //------------------------------------------------------------//
  const urlTest : URL = new URL(publicPaths.claim, hosts.local);
  urlTest.searchParams.append('offset', '0');
  urlTest.searchParams.append('limit', '1');
  if (search) urlTest.searchParams.append('search', `${search}`);
  


  //------------------------------------------------------------//
  // Отправляем запрос, ждем ответа и анализируем ответ.                                
  //------------------------------------------------------------//
  let promise : Response = await fetch (urlTest, {
      method: methods.get,
      headers: {
      Authorization: `Bearer ${token}`
      },
    });
  if (promise.status !== 200) throw new Error(`Net error ${promise.status.toString()}`);
  let resultUnchecked : any = await promise.json();
  if (!checkResponse(resultUnchecked)) throw new Error(messages.wrongData);
  


  //------------------------------------------------------------//
  // Если свойство totalItems переменной resultUnchecked равно
  // 0, то создаем нормализованную переменную result, присваиваем
  // ее свойствам соответствущие значения и выходим из функции, 
  // возвращая нормализованную переменную result.                         
  //------------------------------------------------------------//
  if (+resultUnchecked.totalItems === 0) {
    const result : IrequestResult = {} as IrequestResult;
    result.totalItems = 0;
    result.claims = [];
    return result;
  }



  //------------------------------------------------------------//
  // Исходя из полученных данных вычисляем максимально 
  // возможный offset. Если поступивший в аргументах offset
  // не число или число, большее чем максимально возможный offset
  // корректируем поступивший в аргументах offset на максимально
  // возможный offset. Это делается для того, чтобы не запросить
  // несуществующие данные с сервера.                      
  //------------------------------------------------------------//
  const totalItems : number = +resultUnchecked.totalItems;
  const maxOffset : number = (Math.floor(totalItems / pager.base) * pager.base);
  if (isNaN(offset) || offset > maxOffset) offset = maxOffset;
  sessionStorage.setItem('offset', offset.toString());



  //------------------------------------------------------------//
  // Готовим на сервер запрос по существу.                                 
  //------------------------------------------------------------//
  const url : URL = new URL(publicPaths.claim, hosts.local);
  url.searchParams.append('offset', `${offset}`);
  url.searchParams.append('limit', `${limit}`);
  if (search) url.searchParams.append('search', `${search}`);
  if (column) {
    url.searchParams.append('column', `${column}`);
    url.searchParams.append('sort', `${sort}`);
  }



  //------------------------------------------------------------//
  // Отправляем запрос, ждем ответа и анализируем ответ.                              
  //------------------------------------------------------------//
  promise = await fetch (url, {
    method: methods.get,
    headers: {
    Authorization: `Bearer ${token}`
    },
  });
  if (promise.status !== 200) throw new Error(promise.status.toString());
  resultUnchecked = await promise.json();
  if (!checkResponse(resultUnchecked)) throw new Error(messages.wrongData);


  //------------------------------------------------------------//
  // Нормализируем ответ и выходим из функции, возвращая 
  // нормализованный результат.                              
  //------------------------------------------------------------//
  const result : IrequestResult = {} as IrequestResult;
  result.totalItems = +resultUnchecked.totalItems;
  result.claims = normalizeResponse(resultUnchecked);

  return result;
});



const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    reset: state => {
      state = initialState;
    }, 
    configSettings: (state, action : PayloadAction<IconfigSettingsPayload>) => {
      if (action.payload.mode !== null && action.payload.mode !== undefined) state.mode = action.payload.mode; 
      if (action.payload.status !== null && action.payload.status !== undefined) state.status = action.payload.status; 
      if (action.payload.message !== null && action.payload.message !== undefined) state.message = action.payload.message;
    },  
  },
  extraReducers: builder => {
    builder
      .addCase(fetchClaims.pending, state => {
        state.status = claimsStatuses.loading;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.totalItems = action.payload.totalItems;
        let temp : Iclaims = {} as Iclaims;
        action.payload.claims.forEach((item, index) => temp[index] = item);
        state.values = temp;
        state.status = claimsStatuses.ok;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.status = claimsStatuses.error;
        state.message = action.error.message ? action.error.message : 'Something wrong';
        state.totalItems = 0;
        state.values = {};
      })
  }, 
});

export const { reset, configSettings } = claimsSlice.actions;

export const selectClaims = (state : RootState) => Object.values(state.claims.values);

export const selectTotalClaimsNumber = (state : RootState) => state.claims.totalItems;

export const selectModes = (state : RootState) => state.claims.mode;

export const selectStatus = (state : RootState) => state.claims.status;

export const selectMessage = (state : RootState) => state.claims.message;

export default claimsSlice.reducer;
