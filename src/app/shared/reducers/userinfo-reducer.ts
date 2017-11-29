import {User} from "../../widgets/user-box/user";
import {Action} from "@ngrx/store";

export const INIT_USER_INFO = '[Init User Info]';


export interface UserInfoState {
    initState?: boolean,
    user: User
}

const initialState: UserInfoState = {
    initState: true,
    user: null
};

export function userInfoReducer(state: UserInfoState = initialState, action: Action) {
    switch (action.type) {
        case INIT_USER_INFO:
            return action.payload;
        default:
            return state;
    }
}