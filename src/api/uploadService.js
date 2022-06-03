import axios from 'axios'

const getToken = () => {
    return localStorage.getItem('accessToken')
}

export const uploadFileRequest = (authRequest) => {
    const formData = new FormData()
    formData.append('zippedFile', authRequest.zippedFile[0])
    formData.append('batchNumber', authRequest.batchNumber)
    return axios({
        method: 'POST',
        url: `${process.env.hostUrl || 'http://localhost:9090'}/api/v1/zipped-file-upload`,
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        data: formData
    })
}

export const uploadFile = (authRequest) => {
    return uploadFileRequest(authRequest).then((response) => {
        console.log(response)
        return response.data.message
    }).catch((err) => {
        return err
    })
}