import {AsyncStorage} from'react-native'
export const LOGOUT ='LOGOUT'
export const SIGNUP='SIGNUP'
export const LOGIN='LOGIN'
export const AUTHENTICATE ='AUTHENTICATE'

export const authenticate= (userId, token, expiryTime) =>{
    return dispatch =>{
        dispatch(setLogoutTimer(expiryTime))
        dispatch({ type:AUTHENTICATE, userId:userId , token:token })
    }
    
}

 

let timer
export const signup = (email , password) =>{
    return async dispatch => {
   const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA7EfObx_m3H1wfmlFbc69rU55CYj6MTQE'
    , {
        method:'POST' ,
        headers:{
            'Content-Type': 'application/json'
        } ,
        body:JSON.stringify({
            email:email ,
            password:password,
            returnSecureToken: true
        })
    })
    if(!response.ok){
        const errorResData = await response.json()
        const errorId = errorResData.error.message
        let message='Something went wrong'
        if(errorId === 'EMAIL_EXISTS'){
            message='This email exists'
        }else if(errorId==='INVAILD_PASSWORD'){
            message='This password is Invalid'
        }
        throw new Error(message)
    }
    const resData = await response.json()
    console.log(resData)
  dispatch(authenticate(resData.localId , resData.idToken, parseInt(resData.expiresIn)*1000))
  const expirationDate = new Date(new Date().getTime()+parseInt(resData.expiresIn)*1000)
  saveDataToStorage(resData.idToken , resData.localId , expirationDate)
    }
}

export const login = (email , password) =>{
    return async dispatch => {
   const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA7EfObx_m3H1wfmlFbc69rU55CYj6MTQE'
    , {
        method:'POST' ,
        headers:{
            'Content-Type': 'application/json'
        } ,
        body:JSON.stringify({
            email:email ,
            password:password,
            returnSecureToken: true
        })
    })
    if(!response.ok){
        const errorResData = await response.json()
        const errorId = errorResData.error.message
        let message='Something went wrong'
        if(errorId === 'EMAIL_NOT_FOUND'){
            message='This email could not be found'
        }else if(errorId==='INVAILD_PASSWORD'){
            message='This password is Invalid'
        }
        throw new Error(message)
    }
    
    const resData = await response.json()
    console.log(resData)
  dispatch(authenticate(resData.localId , resData.idToken, parseInt(resData.expiresIn)*1000))
  const expirationDate = new Date(new Date().getTime()+parseInt(resData.expiresIn)*1000)
  saveDataToStorage(resData.idToken , resData.localId , expirationDate)
    }
}
const clearLogoutTimer =() =>{
    if(timer){
        clearTimeout(timer)
    }
}

const setLogoutTimer = expirationTime =>{
    return dispatch =>{
    setTimeout(() => {
       timer = dispatch(logOut())
    }, expirationTime);}
}

export const logOut= () =>{
    clearLogoutTimer()
    AsyncStorage.removeItem('userData')
return {type:LOGOUT}
}
const saveDataToStorage =(token, userId , expirationDate)=> {
    AsyncStorage.setItem('userData',JSON.stringify({
        token:token ,
        userId:userId ,
        expiryDate:expirationDate.toISOString()
    }))
}