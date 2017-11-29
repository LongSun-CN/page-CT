/**
 * Created by admin on 2017/6/19.
 */
import {Action} from '@ngrx/store';
import {simpleObject, serviceMap, simpleMap} from  '../../entity/simple.map';

export interface ProductState {
  data: Array<simpleObject>
}

const initProductState: ProductState = {
  data: [{id: '', text: ''}]
};

export const SEARCH_PRODUCT = 'search product';
export const SEARCH_SERVICE = 'search service';
export const SEARCH_CHANNEL = 'search channel';
export const SEARCH_VIP = 'search vip';
export const  SEARCH_MAINCHANNEL = "search main channel";
export const  SEARCH_SUBCHANNEL = "search sub channel";
export const  SEARCH_PAYCHANNELS = "search pay channels";
export const SELECT_CHANNELID = "select channel id";


export function ProductReducer(state: ProductState = initProductState, action: Action) {
  switch (action.type) {
    case SEARCH_PRODUCT:
      return action.payload;
    default :
      return state;
  }
}


export interface serviceState {
  key: string;
  data: simpleObject[];
}

export const initserviceState = {
  key: '',
  data: [{text: '', id: ''}]
};

export function ServiceReducer(state: serviceState[] = [initserviceState], action: Action) {
  switch (action.type) {
    case SEARCH_SERVICE:
      let isExist = false;
      state = state.map(function (item) {
        if (item.key === action.payload.key) {
          isExist = true;
          item = action.payload;
        }
        return item;
      });
      !isExist && state.push(action.payload);
      return [...state];
    default :
      return state;
  }
}


export interface vipState {
  key: string;
  data: simpleObject[];
}

export const initvipState = {
  key: '',
  data: [{text: '', id: ''}]
};

export function VipReducer(state: vipState[] = [initvipState], action: Action) {
  switch (action.type) {
    case SEARCH_VIP:
      let isExist = false;
      state = state.map(function (item) {
        if (item.key === action.payload.key) {
          isExist = true;
          item = action.payload;
        }
        return item;
      });
      !isExist && state.push(action.payload);
      return [...state];
    default :
      return state;
  }
}


export function ChannelReducer(state: serviceState[] = [initserviceState], action: Action) {
  switch (action.type) {
    case SEARCH_CHANNEL:
      let isExist = false;
      state = state.map(function (item) {
        if (item.key === action.payload.key) {
          isExist = true;
          item = action.payload;
        }
        return item;
      });
      !isExist && state.push(action.payload);
      return [...state];
    default :
      return state;
  }
}

export function mainChannelReducer(state: serviceState[] = [initserviceState], action: Action) {
  switch (action.type) {
    case SEARCH_MAINCHANNEL:
      let isExist = false;
      state = state.map(function (item) {
        if (item.key === action.payload.key) {
          isExist = true;
          item = action.payload;
        }
        return item;
      });
      !isExist && state.push(action.payload);
      return [...state];
    default :
      return state;
  }
}

export function subChannelReducer(state: serviceState[] = [initserviceState], action: Action) {
  switch (action.type) {
    case SEARCH_SUBCHANNEL:
      let isExist = false;
      state = state.map(function (item) {
        if (item.key === action.payload.key) {
          isExist = true;
          item = action.payload;
        }
        return item;
      });
      !isExist && state.push(action.payload);
      return [...state];
    default :
      return state;
  }
}


export function payChannelsReducer(state: serviceState[] = [initserviceState], action: Action) {
  switch (action.type) {
    case SEARCH_PAYCHANNELS:
      let isExist = false;
      state = state.map(function (item) {
        if (item.key === action.payload.key) {
          isExist = true;
          item = action.payload;
        }
        return item;
      });
      !isExist && state.push(action.payload);
      return [...state];
    default :
      return state;
  }
}

export const uiselectautoReducer = {
  product: ProductReducer,
  service: ServiceReducer,
  channel: ChannelReducer,
  mainChannel: mainChannelReducer,
  subChannel:subChannelReducer,
  vipAuto: VipReducer,
  paychannel:payChannelsReducer
};
