const express=require('express')
const router=express.Router()
const userController=require('../controller/userController')

router.get('/attractions',userController.scrapeData)
router.post('/create',userController.craeteClub)
router.get('/getClubs',userController.getClubs)
router.post('/join',userController.joinClub)
router.get('/detail',userController.getClubDetail)
router.post('/addTrip',userController.createTrip)
router.get('/getTrips',userController.getTrips)
router.get('/getTripDetail',userController.getTripDetail)
router.post('/joinRide',userController.joinTrip)
router.post('/login',userController.login)
router.post('/newchat',userController.newChat)
router.get('/getChat',userController.getChat)

module.exports=router




