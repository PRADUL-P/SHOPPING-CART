var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
/*const userHelpers=require('../helpers/user-helpers')
var userHelpers=require('../helpers/user-helpers')
/* GET users listing. */

/*login verification*/
const verifyAdmin = (req, res, next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

router.get('/',(req, res, next)=> {
   if(req.session.adminLoggedIn){
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true,products})
  })
  }else{
    res.redirect('/admin/login')
  }
  
});

/*router.get('/all-user',(req,res,next)=>{
  userHelpers.getAllUsers().then((users)=>{
    console.log(user);
  res.render('admin/all-user',{admin:true,users})
})

});*/
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
  res.redirect('/admin')
  console.log(req.body);
  console.log(req.files.Image);
  

  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    console.log(id);
    image.mv('./public/product-image/'+id+'.jpg',(err,done)=>{
     if(!err) {
      res.render("admin/add-product",{admin:true})
     }else{
       console.log(err);
     }

    })
   
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let productId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(productId).then((response)=>{
    res.redirect('/admin/')
  })

  
})
router.get('/edit-product/:id',async (req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product,admin:true})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-image/'+id+'.jpg')
      
    }
  })

})
router.get('/login', (req, res) => {
  let adminLoginErr = req.session.adminloginErr
  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  } else {
    res.render('admin/form', { adminLoginErr, admin:true })
    req.session.adminLoggedIn = false
  }

})
// router.get('/signup', (req, res) => {
//   res.render('admin/form')
// })
// router.post('/signup', (req, res) => {
//   productHelpers.doSignup(req.body).then((response) => {
//     console.log(response);
    
//     req.session.admin = response
//     req.session.loggedIn = true
//     res.redirect('/admin')


//   })

// })
// router.post('/login', (req, res) => {
//   productHelpers.doLogin(req.body).then((response) => {
//     if (response.status) {
//       req.session.adminLoggedIn = true ;
//       res.redirect('/admin')
//     } else {
     
//     }
//   }).catch((response)=>{
//     req.session.loginErr = "Invalid Username or Password"
//     res.redirect('/admin/login')
// })
// })
router.post('/login', (req, res)=>{
  productHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.adminLoggedIn = true;
      res.redirect('/admin')
    }else{
      
    }
  }).catch((response)=>{
      req.session.adminloginErr = "Username or password is incorrect"
      res.redirect('/admin/login')
  })
})

// router.get('/logout', (req, res) => {
//   req.session.admin=null
//   res.redirect('/admin/login')
// })
router.get('/orders',verifyAdmin,async (req, res)=>{
  let orders =await productHelpers.getAllOrders()
  orders.reverse()
  console.log(orders)
  res.render('admin/orders', {admin:true, orders})
})

router.get('/update-order/:id', (req, res)=>{
  let orderId = req.params.id
  productHelpers.getOrderDetails(orderId).then((orderDetails)=>{
    console.log(orderDetails);
    res.render('admin/order-details', {admin:true, orderDetails})
  })
})

router.post('/updateOrderStatus', (req, res)=>{
  productHelpers.updateProductStatus(req.body).then((response)=>{
    res.json(response)
  })
})

module.exports = router;

