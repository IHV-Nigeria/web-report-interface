import apiRequest from './useJwt'

// study more at https://codesandbox.io/s/react-data-table-server-side-pagination-delete-forked-jgj3oo?file=/src/index.js:407-2599
export const fetchUsersData = (page, size) => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `users?page=${page}&per_page=${size}&delay=1`
    })
}

export const addNewUser = (formData) => {
    return apiRequest({
        requetType: 'POST',
        contentType: 'application/json',
        requestUrl: `register`,
        requestData: formData
    })
}