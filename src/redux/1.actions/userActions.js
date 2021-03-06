import { 
    LOGIN_SUCCESS,
    USER_LOGOUT,
    IS_LOADING,
    NOT_LOADING,
    NAV_ITEM_CHANGE
 } from "./types"

 
import Axios from "axios"
import {urlApi} from "../../3.helpers/database"
import swal from 'sweetalert'



export const navItemChange = (navItem) => {
    return {
        type: NAV_ITEM_CHANGE,
        payload: navItem
    }
}


export const confirmLogin = (user) => {
    console.log(user)
    return {
        type: LOGIN_SUCCESS,
        payload: user
    }
}

export const userLogin = (userObject) => {
    return (dispatch) => {
        dispatch({
            type: IS_LOADING
        })

        Axios.post(urlApi + 'user/userLogin', {
                email: userObject.email,
                password: userObject.password
            }).then((res) => {
                console.log(res.data)
                localStorage.setItem('token', res.data.token)
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        id: res.data.id,
                        username: res.data.username,
                        email: res.data.email,
                        role: res.data.roleName
                    }
                })
            })
            .catch((err) => {
                dispatch({
                    type: NOT_LOADING
                })
                if (err.response.data === 'Suspended') {
                    swal('We Are Sorry', "Your account is being terminated, try contacting admin.", "error")
                } else if (err.response.data === 'NoResult') {
                    swal('Login Failed', "Wrong password / username, please try again.", "warning")
                }
            })
    }
}


export const keepLogin = (token) => {
    return (dispatch) => {
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(urlApi + 'user/userKeepLogin', null, options)
            .then(res => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        id: res.data.id,
                        username: res.data.username,
                        email: res.data.email,
                        role: res.data.roleName
                    }
                })
            })
            .catch(err => {
                localStorage.removeItem('token')
                console.log(err.response)
                dispatch({
                    type: USER_LOGOUT
                })
            })
    }
}


export const userLogout = () => {
    localStorage.removeItem('token')
    return {
        type: USER_LOGOUT
    }
}