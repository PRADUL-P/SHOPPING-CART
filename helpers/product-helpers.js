var db=require('../config/connection')
var collection=require('../config/collections');
const bcrypt=require('bcrypt')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
module.exports={

    addProduct:(product,callback)=>{
        console.log(product);

        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.ops[0]._id)
        })

    },getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    
},
deleteProduct:(prodId)=>{
    return new Promise((resolve,reject)=>{
        console.log(prodId);
        console.log(objectId(prodId));
        db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(prodId)}).then((response)=>{
            //console.log(response);
            resolve(response)
        })
    })

 },
 getProductDetails:(proId)=>{
     return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
            resolve(product)

     })
     
     })
 },
 updateProduct:(proId,proDetails)=>{
     return new Promise((resolve,reject)=>{
         db.get().collection(collection.PRODUCT_COLLECTION)
         .updateOne({_id:objectId(proId)},{
             $set:{
                name:proDetails.name,
                 Description:proDetails.Description,
                 Price:proDetails.Price,
                 category:proDetails.category,
             }
         }).then((response)=>{
             resolve()
         })
     })
 },
//   doSignup:(adminData)=>{
//         return new Promise(async(resolve,reject)=>{
//             adminData.Password=await bcrypt.hash(adminData.Password,10)
//             db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
//                 resolve(data.ops[0])

//             })
            
//         })

        
// },
//     
doLogin:(userData)=>{
        return new Promise(async(resolve, reject)=>{
            if(userData.email == "pradul@admin.com" && userData.password == '12345678'){
                resolve({status:true})
            }else{
                reject({status:false})
            }
        })
    },
     getAllOrders:()=>{
        return new Promise(async(resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION)
            .find().toArray()
            console.log(orders);
            resolve(orders)
        })
    },
    getOrderDetails:(orderId)=>{
        return new Promise(async(resolve, reject) => {
        let orderDetails = await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:objectId(orderId)})
        resolve(orderDetails)
        })
        
    },
    updateProductStatus:(details)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION)
            .updateOne({_id:objectId(details.orderId)},{
                $set:{
                    status:details.newStatus
                }
            }).then(()=>{
                resolve({status:true})
            })
        });
    }



 
}