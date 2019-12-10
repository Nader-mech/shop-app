import React,{useState} from 'react'
import { View, Text, FlatList, Button, StyleSheet , ActivityIndicator} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Colors from '../../constants/Colors'
import CartItem from '../../compenents/shop/CartItem'
import * as cartActions from '../../store/actions/cart'
import * as  ordersActions from '../../store/actions/orders'
import Card from '../../compenents/UI/Card'

const CartScreen = props => {
    const[isLoading,  setIsLoading] = useState(false)
    const cartTotalAmount = useSelector(state => state.cart.totalAmount)
    const cartItems= useSelector(state => {
        const transformedCartItems = []
        for(const key in state.cart.items){
            transformedCartItems.push({
                productId: key ,
                productTitle :state.cart.items[key].productTitle ,
                productPrice :state.cart.items[key].productPrice  ,
                quantity: state.cart.items[key].quantity ,
                sum: state.cart.items[key].sum
            })
        }
        return transformedCartItems.sort((a,b) => a.productId > b.productId ?1 :-1)

    })

   const dispatch = useDispatch()
const sendOrderHandler =  async () => {
    setIsLoading(true)
   await dispatch(ordersActions.addOrder(cartItems , cartTotalAmount))
   setIsLoading(false)

}

    return <View style={styles.screen}>
        <Card style={styles.summary}>
            <Text style={styles.summaryText}>Total:<Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
            </Text>
            {isLoading ? <ActivityIndicator size='small' color={Colors.primaryColor} />  
            :  
            <Button color={Colors.accentColor} title='Order Now' disabled={cartItems.length === 0} 
            onPress={sendOrderHandler}/> }
           
        </Card> 
        <FlatList data={cartItems}  keyExtractor={(item => item.productId)} renderItem={itemData => <CartItem 
            quantity={itemData.item.quantity}
             amount={itemData.item.sum} 
             deletable
             title={itemData.item.productTitle} 
            onRemove={() =>{
                dispatch(cartActions.removeFromCart(itemData.item.productId))
                console.log('id=====>', itemData.item.productId)
            }} />}/>
    </View>
}

CartScreen.navigationOptions ={
    headerTitle: 'Your Orders '
}
const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
        padding: 10,
        
    },
    summaryText: {
        fontFamily:'open-sans-bold' ,
        fontSize:18
    },
    amount: {
      color:Colors.primaryColor
    },

})

export default CartScreen