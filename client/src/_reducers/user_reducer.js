import { LOGIN_USER } from '../_actions/types';

const initialState = {
     // 로그인 성공 여부를 추적합니다. 초기값은 false입니다.
        loginSuccess: false,
        // 로그인한 사용자의 정보를 저장할 공간을 만듭니다. 초기값은 null입니다.
        userData: null
};

export default function (state = {initialState}, action) {
    switch (action.type){
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
            break;

        default:
            return state;

    }
}