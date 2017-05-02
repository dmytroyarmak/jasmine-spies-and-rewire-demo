import axios from 'axios';

export function getPrimaryAccount() {
    return axios
        .get('/primary-account')
        .then(res => res.data);
}

export function getTransactions(accountId) {
    return axios
        .get(`/accounts/${accountId}/transactions`)
        .then(res => res.data);
}

export function getPrimaryAccountTransactions() {
    return getPrimaryAccount()
        .then(primaryAccount => getTransactions(primaryAccount.id));
}
