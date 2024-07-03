import axios from 'axios'
import jwtConfig from './jwtConfig'
import Router from '../router/Router'

export const userLoginRequest = (authRequest) => {
    return axios({
        method: 'POST',
        url: `${jwtConfig.baseUrl}/auth/login`,
        data: authRequest
    })
}

export const userLogin = (authRequest) => {
    return userLoginRequest(authRequest).then((response) => {
        const result = response.data.user
        const accessToken = response.data.jwtToken
        const refreshToken = response.data.refreshToken

        const user = {
            fullName: `${result.userFirstName} ${result.userLastName}`,
            username: result.userName,
            email: result.userEmail,
            role: result.role,
            ability: [

                {
                    action: 'manage',
                    subject: 'all'
                }
            ]
        }

        const userData = {...user }
        const data = {
            userData,
            accessToken,
            refreshToken
        }
        return data

    }).catch((err) => {
        console.log(err)
              if (err && err.response) {   
                setIsError(true)         
                 switch (err.response.status) {
                   case 401:
                     setErrMsg("Authentication Failed.Bad Credentials")
                     window.alert("email/password not correct")
                       break
                   case 500:
                     setErrMsg("Authentication Failed.Bad Credentials")
                     window.alert("Something Wrong! Please Try Again")
                     break
                   default:
                     setErrMsg('Something Wrong!Please Try Again')
                     window.alert("Something Wrong! Please Try Again")
                     break
                 }
               } else {
                 setErrMsg('Something Wrong!Please Try Again')
                 window.alert("Something Wrong! Please Try Again")
               } 
    })
}


export const fetchUserData = () => {
    const refreshTokenData = {
        refreshToken: localStorage.getItem(jwtConfig.storageRefreshTokenKeyName)
    }
    console.log('refresh token data', refreshTokenData)
    return axios({
        method: 'POST',
        url: `${jwtConfig.baseUrl}/auth/refreshtoken`,
        data: refreshTokenData
    }).then((response) => {
        console.log('Success', response)
        if (response.status === 403) {
            <Router/>
        }
        const accessToken = response.data.accessToken
        const refreshToken = response.data.refreshToken
        localStorage.setItem(jwtConfig.storageTokenKeyName, accessToken)
        localStorage.setItem(jwtConfig.storageRefreshTokenKeyName, refreshToken)
        window.location.reload()
    }).catch(() => {
        localStorage.clear()
        window.location.reload()
        // <Router/>
    })
}


export const getOrgunit = (accessToken) => {
    return axios({
        method: 'GET',
        url: `${jwtConfig.baseUrl}/org-unit/list`,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
                // data: authRequest
        }
    }).then((response) => {
        return response
    })
}