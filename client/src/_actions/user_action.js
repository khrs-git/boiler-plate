// user_action.js
import axios from 'axios';
import { LOGIN_USER } from './types';

// `export default` 대신 `export`만 사용합니다.
export async function loginUser(dataToSubmit) {

    try {
        const response = await axios.post('http://localhost:5000/api/users/login', dataToSubmit);
        const request = response.data;

        return {
            type: "LOGIN_USER",
            payload: request
        };

    } catch (error) {
        console.error("로그인 요청 실패:", error);
        return {
            type: "LOGIN_USER_FAILURE",
            payload: error.message
        };
    }
}