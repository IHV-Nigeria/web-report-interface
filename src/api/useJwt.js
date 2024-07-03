import jwtConfig from './jwtConfig'
// import { Link } from 'react-router-dom'
import { fetchUserData } from './authenticationService'
import axios from 'axios'
import { HashRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom'

const client = axios.create({baseURL:`${jwtConfig.baseUrl}`})

export function getToken() {
    return localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
}

export const request = ({...options}) => {
    client.defaults.headers.common.Authorization = `Bearer ${getToken()}`
    const onSuccess = (response) => response
    const onError = (error) => {

        return error
    }

    return client(options).then(onSuccess).catch(onError)
}

export default function apiRequest({
    requetType: requetType,
    requestUrl: requestUrl,
    contentType: contentType = 'multipart/form-data',
    requestData: requestData = [],
    respType: respType
}) {
    console.log('Making rest call')
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
        data: requestData,
        responseType: respType
    }).then((response) => {
        if (response.status === 401) {
            console.log('Expired token')
            fetchUserData()
        }
        return response
    }).catch((err) => {
        console.log('Error', err)
        if (err && err.response) {
            //setIsError(true)
            switch (err.response.status) {
                case 401:
                    console.log('Expired token in catch')
                    fetchUserData()
                    break
                case 500:
                   // location.href = "/login"
                    break
                case 400:
                    return err.response
                default:
            }
        } else if (err.response === undefined)  { 
          //  location.href = "/login"          
        } else {}
    })

}