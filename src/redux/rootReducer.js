// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import users from '@src/views/users/store'
import analytics from '@src/views/analytics/treatment/store'

const rootReducer = {
    auth,
    navbar,
    layout,
    users,
    analytics
}

export default rootReducer