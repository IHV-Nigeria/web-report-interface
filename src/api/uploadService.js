import apiRequest from './useJwt'


export const uploadFileRequest = (authRequest) => {
    const formData = new FormData()
    formData.append('zippedFile', authRequest.zippedFile[0])
    formData.append('batchNumber', authRequest.batchNumber)
    return apiRequest({
        requetType: 'POST',
        contentType: 'multipart/form-data',
        requestUrl: `zipped-file-upload`,
        requestData: formData
    })
}

export const uploadFile = (authRequest) => {
    return uploadFileRequest(authRequest).then((response) => {
        return response.data.message
    }).catch((err) => {
        return err
    })
}

// study more at https://codesandbox.io/s/react-data-table-server-side-pagination-delete-forked-jgj3oo?file=/src/index.js:407-2599
export const fetchUploadsData = (page, size) => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `get-uploads?page=${page}&per_page=${size}&delay=1`
    })
}

export const fetchStatsData = () => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `get-stats`
    })
}