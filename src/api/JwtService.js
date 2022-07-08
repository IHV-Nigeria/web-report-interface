import jwtConfig from './jwtConfig'

export default class JwtService {

    getToken() {
        return localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
    }

    apiRequest({
        requetType: requetType,
        requestUrl: requestUrl,
        contentType: contentType = 'multipart/form-data',
        requestData: requestData
    }) {
        return axios({
            method: requetType,
            url: `${jwtConfig.baseUrl}/${requestUrl}`,
            withCredentials: true,
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                Accept: 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            data: requestData
        }).then((response) => {
            return response
        }).catch((err) => {
            return err
        })

    }
}