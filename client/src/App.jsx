
import { Fragment } from 'react'
import ReactHookFormExample from './pages/react-hook-form'
import { Route,Routes } from 'react-router-dom'
import ProductList from './pages/product-list'
import Cart from './pages/cart'
import ProductDetails from './pages/product-details'
import LoginPage from './pages/login'
import RegisterUser from './pages/register'
import ForgotPassword from './pages/fogotPassword'
import ResetPassword from './pages/reset-password'
import Home from './pages/home'
import MyAccount from './pages/myaccount'
import UpdatePassword from './pages/updatePassword'

function App() {

  return (
   <Fragment>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product-list' element={<ProductList/>}/>
        <Route path='/product-details/:id' element={<ProductDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterUser/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:id/:token' element={<ResetPassword/>}/>
        <Route path='/myAccount/:username' element={<MyAccount/>}/>
        <Route path='/updatePassword/:username' element={<UpdatePassword/>}/>
      </Routes>
   </Fragment>
  )
}

export default App
