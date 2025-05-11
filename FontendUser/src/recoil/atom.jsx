import { atom } from "recoil";


export const isAuthenticatedState = atom({
    key: 'isAuthenticated',
    default: false,
});

export const userState = atom({
    key: 'userState',
    default: null,
});

export const isLogin = atom({
    key: 'isLogin',
    default: null,
})

export const ListCart = atom({
    key: "listCart",
    default: [],
})

export const orderIdState = atom({
    key: 'orderIdState',
    default: null,
});

