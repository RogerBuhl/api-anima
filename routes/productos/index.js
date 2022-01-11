const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		brands=require('../brands/brands.json'),
		constantes=require('../constantes.json'),
		obj='PRODUCTO'

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

	var url=constantes.url_v3+"catalog/products/"+id+"?include=primary_image"
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/:extra/id/:id',(req,res)=>{
	const 	id=String(req.params.id),extra=String(req.params.extra),
			extras=['videos','images','variants','options','custom-fields']
	if(!extras.includes(extra)) return res.status(400).send('Valor no valido')
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
			    if(response.status==404)res.status(404).send()
			    else if(!response.data.length)res.status(204).send()
			    else{
			    	if(extra=='images')response.data.sort((a,b)=>(a.sort_order>b.sort_order)?1:((b.sort_order>a.sort_order)?-1:0))
			    	res.status(200).json(response.data)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/products/"+id+"/"+extra
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/feature/:f/p/:p/l/:l',(req,res)=>{
	const 	p=String(req.params.p),l=String(req.params.l),f=String(req.params.f)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
			    if(response.status==404)res.status(404).send()
			    else if(!response.data.length) res.status(204).send()
			    else{
			    	response.data.forEach(e=>{(e.brand_id>0)?e.brand=brands.find(b=>b.id==e.brand_id):e.brand=null})
			    	res.status(200).json(response)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/products/?sort=date_modified&include=primary_image%2Cvariants&limit="+l+"&page="+p+"&is_featured="+f+"&is_visible=true"
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/p/:p/l/:l',(req,res)=>{
	const 	p=String(req.params.p),l=String(req.params.l),
			query=req.originalUrl.split('?')[1]
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
			    if(response.status==422)res.status(422).json(response)
			    else if(response.status==404)res.sendStatus(404)
			    else if(!response.data.length) res.sendStatus(204)
			    else{
			    	response.data.forEach(e=>{(e.brand_id>0)?e.brand=brands.find(b=>b.id==e.brand_id):e.brand=null})
			    	res.status(200).json(response)
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/products/?limit="+l+"&page="+p+"&"+query+"&is_visible=true"
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})


module.exports=router
