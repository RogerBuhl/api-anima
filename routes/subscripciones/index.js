const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		constantes=require('../constantes.json'),
		obj='SUBSCRIPCION'

router.all('/*',(req,res,next)=>{
	const modulo=req.originalUrl.split('/')
	switch(modulo[3]){
		case 'algo':
			router.use('/'+modulo[3],require('./'+modulo[3]))
			break;
	}
	next()
})


/*------------------------GET---------------------------*/
router.post('/',(req,res)=>{
	const body=JSON.stringify(req.body)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				console.log(xhr)
				if(xhr.status==404)res.status(404).send(xhr.responseText)
			    else{
					var response=JSON.parse(xhr.responseText),data={};
			    	(!response.data)?res.status(204).send():res.status(200).json(response.data)
			    }
			}catch(err){end(res,err,'POST',obj)}
		}
	})

	var url=constantes.url+"subscriptions"
	xhr.open("POST",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send(body)
})


module.exports=router