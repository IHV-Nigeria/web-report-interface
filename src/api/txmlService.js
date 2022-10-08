import apiRequest from './useJwt'
import {buildWaterFallChart} from './chatUtils/waterfallChat'


export const fetchGetTXMLAnalytics = (param) => {
    const url = `data/get-txml-analytics?states=${param.states}&
    lgas=${param.lgas}&
    facilities=${param.facilities}&
    ageRange=${param.ageRange}&
    indicator=${param.indicator}&
    sex=${param.sex}&
    searchType=NORMAL&
    startDate=${param.startDate}&
    endDate=${param.endDate}`
    return apiRequest({
       requetType: 'GET',
       contentType: 'application/json',
       requestUrl: url
     })
 }
   
export const  buildTxmlChart = (Series)  => {
    return  buildWaterFallChart('', Series)
}