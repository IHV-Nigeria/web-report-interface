// ** Auth Endpoints
export default {
    baseUrl: process.env.REACT_APP_SERVER_URL,
    dqaUrl: process.env.REACT_APP_DQASERVER_URL,
    // ** This will be prefixed in authorization header with token
    // ? e.g. Authorization: Bearer <token>
    tokenType: 'Bearer',

    // ** Value of this property will be used as key to store JWT token in storage
    storageTokenKeyName: 'accessToken',
    storageRefreshTokenKeyName: 'refreshToken'
}