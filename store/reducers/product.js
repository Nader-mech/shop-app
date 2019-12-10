import PRODUCTS from '../../data/4.1 dummy-data.js'
import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from '../actions/products.js'
import product from '../../models/product'

const initialState = {
    availableProducts: [] ,
    userProducts: []
}

export default (state=initialState, action) =>  {
    switch(action.type){
        case SET_PRODUCTS:
             return{
                 availableProducts: action.products,
                 userProducts:action.userProducts
             }
        case CREATE_PRODUCT:
                const newProduct = new product(
                  action.productData.id,
                  action.productData.ownerId,
                  action.productData.title,
                  action.productData.imageUrl,
                  action.productData.description,
                  action.productData.price
                );
                return {
                  ...state,
                  availableProducts: state.availableProducts.concat(newProduct),
                  userProducts: state.userProducts.concat(newProduct)
                };
          
        case UPDATE_PRODUCT:  
        const productIndex = state.userProducts.findIndex(product => product.id === action.pid)
        const updatedProduct = new product(
            action.pid ,
            state.userProducts[productIndex].ownerId ,
            action.productData.imageUrl , 
            action.productData.description , 
            state.userProducts[productIndex].price
        )  
         const updatedUserProducts = [...state.userProducts]
         updatedUserProducts[productIndex] = updatedProduct
         const updatedAvailableProducts =[...state.availableProducts]
         updatedAvailableProducts[productIndex] = updatedProduct

         return {
             ...state ,
             availableProducts: updatedAvailableProducts ,
             userProducts: updatedUserProducts
         }
        case DELETE_PRODUCT :
            return {
                ...state , 
                userProducts:state.userProducts.filter(product => product.id !== action.pid),
                availableProducts:state.availableProducts.filter(product => product.id !== action.pid)
            }
    }
    
    
    
    
    return state
}