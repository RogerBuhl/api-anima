const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		constantes=require('../constantes.json'),
		obj='CUSTOMER'

router.all('/*',(req,res,next)=>{
	const 	modulo=req.originalUrl.split('?')[0].split('/')
	switch(modulo[3]){
		case 'algo':
			router.use('/'+modulo[3],require('./'+modulo[3]))
			break;
	}
	next()
})


/*------------------------GET---------------------------*/
router.get('/id/:id',(req,res)=>{
	const id=String(req.params.id)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				if(response.status==404)res.status(204).send()
				else if(!response.data)res.status(204).send()
				else{
					data=response.data[0];
					//(data.brand_id>0)?data.brand=brands.find(b=>b.id==data.brand_id):data.brand=null
					res.status(200).json(data)
				}
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"customers?id%3Ain="+id
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})


/*------------------------POST--------------------------*/
router.post('/',(req,res)=>{
	const body=JSON.stringify(req.body)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				console.log(xhr)
				if(xhr.status==422)res.status(203).send(JSON.parse(xhr.responseText))
				else if(xhr.status==404)res.status(404).send(xhr.responseText)
			    else{
					var response=JSON.parse(xhr.responseText),data={};
			    	(!response.data)?res.status(204).send():res.status(201).json(response.data)
			    }
			}catch(err){end(res,err,'POST',obj)}
		}
	})

	var url=constantes.url_v3+"customers"
	xhr.open("POST",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send(body)
})

router.post('/login',(req,res)=>{
	const body=JSON.stringify(req.body)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				if(xhr.status==422||xhr.status==429)res.status(203).send(JSON.parse(xhr.responseText))
				else if(xhr.status==404)res.status(404).send(xhr.responseText)
			    else{
					var response=JSON.parse(xhr.responseText),data={};
			    	(!response.is_valid)?res.status(204).send():res.status(201).json(response)
			    }
			}catch(err){end(res,err,'POST',obj)}
		}
	})

	var url=constantes.url_v3+"customers/validate-credentials"
	xhr.open("POST",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send(body)
})

router.post('/subscribers',(req,res)=>{
	const body=JSON.stringify(req.body)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				if(xhr.status==422||xhr.status==409)res.status(203).send(JSON.parse(xhr.responseText))
				else if(xhr.status==404)res.status(404).send(xhr.responseText)
			    else{
					var response=JSON.parse(xhr.responseText),data={};
			    	(!response.data)?res.status(204).send():res.status(201).json(response)
			    }
			}catch(err){end(res,err,'POST',obj)}
		}
	})

	var url=constantes.url_v3+"customers/subscribers"
	xhr.open("POST",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send(body)
})


/*------------------------PUT--------------------------*/
router.put('/',(req,res)=>{
	const body=JSON.stringify(req.body)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				if(xhr.status==404)res.status(404).send(xhr.responseText)
			    else{
					var response=JSON.parse(xhr.responseText),data={};
			    	(!response.data)?res.status(204).send():res.status(201).json(response.data)
			    }
			}catch(err){end(res,err,'POST',obj)}
		}
	})

	var url=constantes.url_v3+"customers"
	xhr.open("PUT",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send(body)
})



module.exports=router
