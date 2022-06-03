import React from 'react'
import axios from 'axios'


const getToken = () => {
    return localStorage.getItem('USER_KEY')
}
export const userLoginRequest = (authRequest) => {
    return axios({
        method: 'POST',
        url: `${process.env.hostUrl || 'http://localhost:9090'}/api/v1/login`,
        data: authRequest
    })
}

export const userLogin = (authRequest) => {
    return userLoginRequest(authRequest).then((response) => {
        const result = response.data.user
        const accessToken = response.data.jwtToken

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
            accessToken
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
        method: 'GET',
        url: `${process.env.hostUrl || 'http://localhost:8080'}/api/v1/auth/userinfo`,
        headers: {
            Authorization: `Bearer' + ${getToken()}`
        }
    })
}