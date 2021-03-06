const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		constantes=require('../constantes.json'),
		obj='CART'

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
			    	data=response.data;
			    	(data.brand_id>0)?data.brand=brands.find(b=>b.id==data.brand_id):data.brand=null
			    	res.status(200).json(data)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"carts/"+id
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/order/id/:id',(req,res)=>{
	const id = String(req.params.id)
	var xhr = new XMLHttpRequest()
	xhr.withCredentials = true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				if(response.status==404)res.status(204).send()
			    else if(response.length == 0)res.status(204).send()
			    else{
			    	data=response;
			    	res.status(200).json(data)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v2+"orders/"+id
	xhr.open("GET",url)
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('accept', 'application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/order/id/:id/products',(req,res)=>{
	const id = String(req.params.id)
	var xhr = new XMLHttpRequest()
	xhr.withCredentials = true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				if(response.status==404)res.status(204).send()
			    else if(response.length == 0)res.status(204).send()
			    else{
			    	data=response;
			    	res.status(200).json(data)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v2+"orders/"+id+"/products"
	xhr.open("GET",url)
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('accept', 'application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/past-orders/customer/:id/p/:p/l/:l',(req,res)=>{
	const id = String(req.params.id)
	const page = String(req.params.p)
	const limit = String(req.params.l)
	var xhr = new XMLHttpRequest()
	xhr.withCredentials = true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				console.log(response)
				if(response.status==404)res.status(204).send()
			    else if(response.length == 0)res.status(204).send()
			    else{
			    	data=response;
			    	res.status(200).json(data)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v2+"orders?sort=date_modified%3Adesc&customer_id="+id+"&limit="+limit+"&page="+page
	xhr.open("GET",url)
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('accept', 'application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})


/*------------------------POST--------------------------*/
router.post('/',(req,res)=>{
	const body=JSON.stringify(req.body)
	console.log(body)
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

	var url=constantes.url_v3+"carts"
	xhr.open("POST",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send(body)
})

router.post('/redirect_urls/id/:id',(req,res)=>{
	const id=String(req.params.id)
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

	var url=constantes.url_v3+"carts/"+id+"/redirect_urls"
	xhr.open("POST",url)
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})


module.exports=router