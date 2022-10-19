import apiRequest from './useJwt'
import {serialize} from '../api/utils/common'

import {buildWaterFallChart} from './chatUtils/waterfallChat'


export const fetchGetTXMLAnalytics = (param) => {
    const url = `data/get-txml-analytics?${serialize(param)}`
    return apiRequest({
       requetType: 'GET',
       contentType: 'application/json',
       requestUrl: url
     })
 }
   
export const  buildTxmlChart = (Series)  => {
    return  buildWaterFallChart('', Series)
}