// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import users from '@src/views/linelisting/store'

const rootReducer = {
    auth,
    navbar,
    layout,
    users
}

export default rootReducer