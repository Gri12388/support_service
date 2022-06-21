import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { 
  claimsModes, 
  claimsStatuses, 
  hosts,
  messages, 
  methods, 
  pager, 
  publicPaths 
} from '../../data/data.js';

const initialState = {
  totalItems: 0,
  values: {},
  mode: claimsModes.default,
  status: claimsStatuses.ok,
  message: ''
}

export const fetchClaims = createAsyncThunk('claims/fetchClaims', async ({ token, offset, limit, search, column, sort }) => {
  //------------------------------------------------------------//
  // Готовим пробный запрос на сервер, чтобы узнать общее 
  // количество элементов на момент запроса (totalItems)                                 
  //------------------------------------------------------------//
  let urlTest = new URL(publicPaths.claim, hosts.local);
  urlTest.searchParams.append('offset', 0);
  urlTest.searchParams.append('limit', 1);
  if (search) urlTest.searchParams.append('search', `${search}`);
  


  //------------------------------------------------------------//
  // Отправляем запрос и ждем ответа                                
  //------------------------------------------------------------//
  let promise = await fetch (urlTest, {
      method: methods.get,
      headers: {
      Authorization: `Bearer ${token}`
      },
    });


  //------------------------------------------------------------//
  // Если ответ не объект или объект без свойства status или 
  // свойство status не содержат значение truthy, или свойство 
  // status не может быть преобразовано в число, генерируем 
  // ошибку. Иначе запрашиваем json                              
  //------------------------------------------------------------//
  if (
    !promise || 
    typeof promise !== 'object' || 
    !promise.status || 
    isNaN(+promise.status)
  ) throw new Error(messages.wrongData);

  if (promise.status !== 200) throw new Error(promise.status);
  let result = await promise.json();



  //------------------------------------------------------------//
  // Анализируем ответ: 
  // Если ответ не объект, или объект без свойства totalItems,
  // или свойство totalItems falsy или свойство totalItems    
  // не преобразуется в число или свойство totalItems равно 0,
  // но ответ не содержит свойства claims или свойство claims
  // не является массивом, то генерируем ошибку. 
  // Иначе готовимся к запросу по существу, если свойство
  // totalItems не равно 0, или возвращаем ответ, если равно 0.                        
  //------------------------------------------------------------//
  if (
    !result || 
    typeof result !== 'object' || 
    !result.totalItems || 
    isNaN(+result.totalItems)
  ) throw new Error(messages.wrongData);
  if (result.totalItems === 0) {
    if (
      !result.claims ||
      !Array.isArray(result.claims)
    ) throw new Error(messages.wrongData);
    return result;
  }
  
  

  //------------------------------------------------------------//
  // Исходя из полученных данных вычисляем максимально 
  // возможный offset. Если поступивший в аргументах offset
  // не число или число, большее чем максимально возможный offset
  // корректируем поступивший в аргументах offset на максимально
  // возможный offset. Это делается для того, чтобы на запросить
  // несуществующие данные с сервера.                      
  //------------------------------------------------------------//
  let maxOffset = (Math.floor(result.totalItems / pager.base) * pager.base);
  if (isNaN(offset) || offset > maxOffset) offset = maxOffset;
  sessionStorage.setItem('offset', offset);



  //------------------------------------------------------------//
  // Готовим на сервер запрос по существу                                 
  //------------------------------------------------------------//
  let url = new URL(publicPaths.claim, hosts.local);
  url.searchParams.append('offset', `${offset}`);
  url.searchParams.append('limit', `${limit}`);
  if (search) url.searchParams.append('search', `${search}`);
  if (column) {
    url.searchParams.append('column', `${column}`);
    url.searchParams.append('sort', `${sort}`);
  }



  //------------------------------------------------------------//
  // Отправляем запрос и ждем ответа                                
  //------------------------------------------------------------//
  promise = await fetch (url, {
    method: methods.get,
    headers: {
    Authorization: `Bearer ${token}`
    },
  });


  //------------------------------------------------------------//
  // Если ответ не объект или объект без свойства status или 
  // свойство status не содержат значение truthy, или свойство 
  // status не может быть преобразовано в число, генерируем 
  // ошибку. Иначе запрашиваем json                              
  //------------------------------------------------------------//
  if (
    !promise || 
    typeof promise !== 'object' || 
    !promise.status || 
    isNaN(+promise.status)
  ) throw new Error(messages.wrongData);

  if (promise.status !== 200) throw new Error(promise.status);
  result = await promise.json();



  //------------------------------------------------------------//
  // Анализируем ответ: 
  // Если ответ не объект, или объект без свойства claims,
  // или свойство claims falsy или свойство claims    
  // не массив, генерируем ошибку. 
  // Иначе возвращаем ответ.                       
  //------------------------------------------------------------//
  if (
    !result || 
    typeof result !== 'object' || 
    !result.claims ||
    !Array.isArray(result.claims)
  ) throw new Error(messages.wrongData);
  return result;
});



const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    reset: state => {
      state = initialState;
    },
    upload: (state, action) => {
      state.totalItems = action.payload.totalItems;
      action.payload.claims.forEach((item, index) => {
        state.values[index] = item;
      });
    }, 
    configSettings: (state, action) => {
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
        let temp = {};
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

export const { reset, upload, configSettings } = claimsSlice.actions;

export const selectClaims = state => Object.values(state.claims.values);

export const selectTotalClaimsNumber = state => state.claims.totalItems;

export const selectModes = state => state.claims.mode;

export const selectStatus = state => state.claims.status;

export const selectMessage = state => state.claims.message;

export default claimsSlice.reducer;
