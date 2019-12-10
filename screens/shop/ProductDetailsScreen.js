import React from 'react' 
import {View, Text , Image , StyleSheet , ScrollView , Button} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import  Colors  from '../../constants/Colors'
import * as cartActions from '../../store/actions/cart'


const ProductDetailsScreen =  props => {
    const dispatch = useDispatch()

    const productId= props.navigation.getParam('productId')
    const selectedProduct = useSelector(
        state => state.products.availableProducts.find(product => product.id === productId))
    
    return (
<ScrollView>
      <Image style={styles.image} source={{uri:selectedProduct.imageUrl}}/>
      <View style={styles.actions}>
      <Button color={Colors.primaryColor} title='Add to Cart'  onPress={() => {
          dispatch(cartActions.addToCart(selectedProduct))
      }}/> 
      </View>
      <Text style={styles.price}>${selectedProduct.price}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>


</ScrollView>
    )
}

 
ProductDetailsScreen.navigationOptions= (navData) => {
 SelectedTitle = navData.navigation.getParam('title')
 return {
     headerTitle:SelectedTitle
 }
}




const styles= StyleSheet.create({
    image:{
        width:'100%' ,
        height: 300
    },
    actions:{
     marginVertical:10 ,
     alignItems: 'center'
    },
    price:{
        fontSize:20 ,
        color:'#888' ,
        textAlign:"center" ,
        marginVertical:20 ,
        fontFamily:'open-sans-bold'
    },
    description:{
        fontSize:14 ,
        textAlign:'center' ,
        marginHorizontal:20 ,
        fontFamily:'open-sans'
    }
})
 

export default ProductDetailsScreen