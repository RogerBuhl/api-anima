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

router.get('/category-tree',(req,res)=>{
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

	var url=constantes.url_v3+"catalog/categories/tree"
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})