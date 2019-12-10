import React, { useReducer, useCallback, useState , useEffect } from 'react'
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button , Alert, ActivityIndicator} from 'react-native'
import Input from '../../compenents/UI/input'
import Card from '../../compenents/UI/Card'
import Colors from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import * as authActions from '../../store/actions/auth'


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const AuthScreen = props => {
    const dispatch = useDispatch()
   const[isSignUp , setIsSignUp]=useState(false)
   const[error , setError]= useState()
   const [isLoading , setIsLoading ] = useState(false)

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email:'',
            password:''
        },
        inputValidities: {
            email:false ,
            password:false
        },
        formIsValid: false
    })
    useEffect(()=>{
        if(error){
            Alert.alert('An Error Occured' , error , [{text:'Okay'}])
        }
    },[error])
    const authHandler = async() => {
        let action
        if(isSignUp){
        action = authActions.signup(formState.inputValues.email , formState.inputValues.password)
        }else{
         action = authActions.login(formState.inputValues.email , formState.inputValues.password)
        }
        setError(null)
        setIsLoading(true)
        try{
            await dispatch(action)
            props.navigation.navigate('Shop')
        } catch(err) {
           setError(err.message)
           setIsLoading(false)

        }
       
    }

    const inputChangeHandler =useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
          type: FORM_INPUT_UPDATE,
          value: inputValue,
          isValid: inputValidity,
          input: inputIdentifier
        })},[dispatchFormState])
    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient} >
                <Card style={styles.authContainer} >
                    <ScrollView>
                        <Input id='email' label='E-Mail' keyboardType='email-address' required email autoCapitalize='none'
                            errorText='Please enter a valid email address' onInputChange={inputChangeHandler} initialValue='' />
                        <Input 
                        id="password"
                        label="Password"
                        keyboardType="default"
                        secureTextEntry
                        required
                        minLength={5}
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                      />  
                            
                        <View style={styles.ButtonContainer} >
                            {isLoading ? <ActivityIndicator size='small'  color={Colors.primaryColor} /> :<Button title={isSignUp ?'Sign up' : 'Login'} color={Colors.primaryColor} onPress={authHandler} />}
                        </View>
                        <View style={styles.ButtonContainer}>
                            <Button title={`Switch to ${isSignUp ? 'Login' :'Sign Up' }`} color={Colors.accentColor} onPress={() => { 
                                setIsSignUp(prevState => !prevState)
                            }} />
                        </View>

                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Please authenticate'
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20


    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'


    },
    ButtonContainer: {
        marginTop: 10,
    }
})


export default AuthScreen
