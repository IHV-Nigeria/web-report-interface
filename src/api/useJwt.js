import jwtConfig from './jwtConfig'
import { Link } from 'react-router-dom'
import { fetchUserData } from './authenticationService'
import axios from 'axios'

export function getToken() {
    return localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
}

export default function apiRequest({
    requetType: requetType,
    requestUrl: requestUrl,
    contentType: contentType = 'multipart/form-data',
    requestData: requestData = []
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
        if (err && err.response) {
            //setIsError(true)
            switch (err.response.status) {
                case 401:
                    fetchUserData()
                    break
                case 500:
                    // setErrMsg("Authentication Failed.Bad Credentials")
                    break
                default:
                    // setErrMsg('Something Wrong!Please Try Again')
            }
        } else {
            // setErrMsg('Something Wrong!Please Try Again')
        }
    })

}