import {createStackNavigator} from 'react-navigation-stack' 
import ProductsOverView from '../screens/shop/ProductsOverView'
import Colors from '../constants/Colors'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {Platform , SafeAreaView , Button , View} from 'react-native'
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen'
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import {Ionicons} from '@expo/vector-icons'
import React from 'react'
import UserProducts from '../screens/user/UserProducts'
import EditProductScreen from '../screens/user/EditProducts'
import AuthScreen from '../screens/user/AuthScreen'
import StartupScreen from '../screens/StartupScreen'
import {useDispatch} from 'react-redux'
import * as authActions from '../store/actions/auth' 



const defaultNavOptions= { headerStyle:{
    backgroundColor: Platform.OS === 'android'? Colors.primaryColor :''
}, 
headerTintColor:Platform.OS === 'android' ? 'white' : Colors.primaryColor,
headerTitleStyle:{
    fontFamily:'open-sans-bold'
},headerBackTitleStyle:{
    fontFamily:'open-sans'
}
}

const ProductsNavigator = createStackNavigator({
    products :ProductsOverView ,
    productDetail : ProductDetailsScreen ,
    cart : CartScreen

},{navigationOptions:{
    drawerIcon: drawerConfig => (
     <Ionicons name={Platform.OS  === 'android'?'md-cart' : 'ios-cart' } 
     size={23}
     color={drawerConfig.tintColor}/>
    )
} ,
defaultNavigationOptions:defaultNavOptions
    
}, 
)

const OrdersNavigator = createStackNavigator ({
    orders : OrdersScreen
}, {navigationOptions:{
    drawerIcon: drawerConfig => (
     <Ionicons name={Platform.OS  === 'android'?'md-list' : 'ios-list' } 
     size={23}
     color={drawerConfig.tintColor}/>
    )
},defaultNavigationOptions:defaultNavOptions})


const AdminNavigator = createStackNavigator ({
    UserProducts : UserProducts ,
    EditProduct: EditProductScreen
}, {navigationOptions:{
    drawerIcon: drawerConfig => (
     <Ionicons name={Platform.OS  === 'android'?'md-create' : 'ios-create' } 
     size={23}
     color={drawerConfig.tintColor}/>
    )
},defaultNavigationOptions:defaultNavOptions})



const ShopNavigator = createDrawerNavigator({
 products: ProductsNavigator ,
 Orders: OrdersNavigator ,
 Admin: AdminNavigator
},{
    contentOptions:{
        activeTintColor:Colors.primaryColor
    }, 
    contentComponent: props =>{
        const dispatch = useDispatch()
        return <View style={{flex:1 , padding:20 }}>
        <SafeAreaView  forceInset={{top:'always' , horizontal:'never'}} >
        <DrawerItems {...props} />
        <Button title='Logout' color={Colors.primaryColor} onPress={() =>{
            dispatch(authActions.logOut())
            // props.navigation.navigate('Auth')
        }} />
        </SafeAreaView>
        </View>
    }
} )

const AuthNavigator= createStackNavigator({
    Auth: AuthScreen
})

const MainNavigator= createSwitchNavigator({
    Startup: StartupScreen ,
    Auth: AuthNavigator,
    Shop: ShopNavigator , 
},{
    defaultNavigationOptions:defaultNavOptions
})


export default createAppContainer(MainNavigator)