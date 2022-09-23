import apiRequest from './useJwt'

export const performanceDashboard = (page, size) => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `performance/dashboard?page=${page}&per_page=${size}&delay=1`
    })
}
