import axios from 'axios'
import jwtConfig from './jwtConfig'

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
            fullName: `
                    $ { result.userFirstName }
                    $ { result.userLastName }
                    `,
            username: result.userName,
            email: result.userEmail,
            role: result.role[0].roleName,
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
            /*  if (err && err.response) {   
                setIsError(true)         
                 switch (err.response.status) {
                   case 401:
                     setErrMsg("Authentication Failed.Bad Credentials")
                       break
                   case 500:
                     setErrMsg("Authentication Failed.Bad Credentials")
                     break
                   default:
                     setErrMsg('Something Wrong!Please Try Again')
                 }
               } else {
                 setErrMsg('Something Wrong!Please Try Again')
               } */
    })
}


export const fetchUserData = () => {
    return axios({
        method: 'POST',
        url: `
                    $ { jwtConfig.baseUrl }
                    /auth/refreshtoken
                    `
    }).then((response) => {
        const accessToken = response.data.jwtToken
        const refreshToken = response.data.refreshToken
        localStorage.setItem(config.storageTokenKeyName, accessToken)
        localStorage.setItem(config.storageRefreshTokenKeyName, refreshToken)
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