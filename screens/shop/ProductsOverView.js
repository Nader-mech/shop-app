import React ,{useEffect, useState , useCallback} from 'react'
import { FlatList,Button , Platform ,View , ActivityIndicator , StyleSheet , Text} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import ProductItem from '../../compenents/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import {HeaderButtons , item, Item}  from 'react-navigation-header-buttons'
import HeaderButton  from '../../compenents/UI/HeaderButton'
import Colors from '../../constants/Colors'
import * as productsActions from '../../store/actions/products'  




const ProductsOverView = props => {
    const [isRefreshing , setIsRefreshing]= useState(false)
    const [isLoading , setIsLoading] = useState(false)
    const [error , setError] = useState()
    const products = useSelector(state => state.products.availableProducts)
    const dispatch = useDispatch()


    const selectItemHandler = (id , title) =>{
        props.navigation.navigate('productDetail',
                         {productId:id,
                            title:title}
                         )
    }
    
    const loadProducts =useCallback( async () => {
        console.log('Loading')
        setError(null)
         setIsRefreshing(true)
        try{
            await dispatch(productsActions.fetchProducts())
        }catch(err){
          setError(err.message)
        } 
        setIsRefreshing(false)
    },[dispatch , setIsLoading , setError])
     
    useEffect(()=>{
       const willFocusSub =  props.navigation.addListener('willFocus', loadProducts)
       return () => {
           willFocusSub.remove()
       }
    },[loadProducts])
    
    useEffect(() => {
     loadProducts().then(() => {
         setIsLoading(false)
     })
    }, [dispatch, loadProducts])

     if(error){
        return <View style={styles.centered}>
         <Text>An error occurred</Text>
         <Button title='Reload' onPress={loadProducts} color={Colors.primaryColor} />
         </View>
     }


     if (isLoading) {
         return <View style={styles.centered}>
         <ActivityIndicator size='large' color={Colors.primaryColor} />
         </View>
     }
     if(!isLoading && products.length === 0){
        return <View style={styles.centered}>
        <Text>No products found</Text>
        </View>
     }

    return (
        <FlatList
            data={products}
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            keyExtractor={(item => item.id)}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {selectItemHandler(itemData.item.id , itemData.item.title)}}
                     >
                     <Button color={Colors.primaryColor} title='View Details' onPress={() => {selectItemHandler(itemData.item.id , itemData.item.title)}} />
                     <Button color={Colors.primaryColor} title='To Cart' onPress={() => {
                        dispatch(cartActions.addToCart(itemData.item))
                     }} />
                     </ProductItem>} />
    )
} 


ProductsOverView.navigationOptions = (navData) => {
    return{
    headerTitle: 'All Products' ,
    headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item  title='cart'  iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
    onPress={() => {
        navData.navigation.navigate('cart')
    }} />
    </HeaderButtons> ,
    headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item  title='Menu'  iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
    onPress={() => {
        navData.navigation.toggleDrawer()
    }} />
    </HeaderButtons>

}
}

  const styles= StyleSheet.create({
      centered:{
        flex:1 , justifyContent:'center' , alignItems:'center'
      }
  })
export default ProductsOverView