import apiRequest from './useJwt'

export const fetchDashboardStats = () => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/dashbaord-stats`
    })
}
