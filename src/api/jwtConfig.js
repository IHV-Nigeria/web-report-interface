// ** Auth Endpoints
export default {
    baseUrl: 'http://localhost:9090/api/v1',

    // ** This will be prefixed in authorization header with token
    // ? e.g. Authorization: Bearer <token>
    tokenType: 'Bearer',

    // ** Value of this property will be used as key to store JWT token in storage
    storageTokenKeyName: 'accessToken',
    storageRefreshTokenKeyName: 'refreshToken'
}