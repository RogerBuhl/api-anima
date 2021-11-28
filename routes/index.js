const 	express=require('express'),
		app=express(),
		router=require('express').Router()

router.use('/*',(req,res,next)=>{
	const modulo=req.originalUrl.split('/')

	router.use('/'+modulo[2],require('./'+modulo[2]))
	next()
})

module.exports=router