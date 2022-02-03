const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		constantes=require('../constantes.json'),
		obj='BRAND'

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
			    else (!response.data)?res.status(204).send():res.status(200).json(response.data)
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/brands/"+id
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/file-local',(req,res)=>{
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				if(response.status==404)res.status(404).send()
				else if(!response.data.length)res.status(204).send()
				else{
					fs.writeFileSync('./src_anima/routes/brands/brands.json',JSON.stringify(response.data))
					res.status(200).send()
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/brands?include_fields=id%2Cname"
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/p/:p/l/:l',(req,res)=>{
	const 	p=String(req.params.p),l=String(req.params.l)
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
			    if(response.status==422)res.status(203).json(response)
			    else if(response.status==404)res.status(404).send()
			    else if(!response.data.length) res.status(204).send()
			    else res.status(200).json(response)
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/brands?limit="+l+"&page="+p
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})


module.exports=router
