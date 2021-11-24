import { message } from 'antd';
import Cookies from 'universal-cookie';
import refreshTokenApi from './api/refreshTokenApi';

const cookie = new Cookies();

export type FormData = {
    username: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
};

export type DataLogin = {
    username: string;
    password: string;
};

export const refresh = (reload: boolean) => {
    cookie.remove('token');
    cookie.remove('refreshToken');
    cookie.set('status', false);
    if (reload) {
        window.location.reload();
    }
};

export const checkToken = async (status: boolean) => {
    const refresh = cookie.get('refreshToken');
    if (refresh === undefined || status === false) {
        cookie.remove('token');
        cookie.remove('refreshToken');
        cookie.remove('status');
        window.location.reload();
    } else {
        try {
            const response: any = await refreshTokenApi.refresh(refresh);
            if (response) {
                cookie.set('token', response.token);
                cookie.set('refreshToken', response.refreshToken);
                return { status: 'Done', token: response.token };
            }
        } catch (err: any) {
            return err.response.data.message;
        }
    }
};