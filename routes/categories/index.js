const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		constantes=require('../constantes.json'),
		obj='CATEGORY'

router.all('/*',(req,res,next)=>{
    const 	modulo=req.originalUrl.split('?')[0].split('/')
    switch(modulo[3]){
        case 'algo':
            router.use('/'+modulo[3],require('./'+modulo[3]))
            break;
    }
    next()
})

router.get('/file-local',(req,res)=>{
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true

	xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				if(response.status==404)res.status(204).send()
			    else{
					fs.writeFileSync('./routes/categories/category-tree.json',JSON.stringify(response.data))
					res.status(200).send()
				} 
			}catch(err){end(res,err,'GET',obj)}
		}
	})

	var url=constantes.url_v3+"catalog/categories/tree"
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

router.get('/id/:id',(req,res)=>{
	const id=String(req.params.id)
	const categoryTree=require('./category-tree.json')
	let response = categoryTree.find(element=>element.id==id)
	res.status(200).json(response)
})

router.get('/tree/id/:id',(req,res)=>{
	console.log('tree')
	const id = String(req.params.id)
	const categoryTree = require('./category-tree.json')
	let response = new Object()
	categoryTree.forEach(category=>{
		if(category.id == id){
			response.id = category.id
			response.name = category.name
			response.children = category.children
		}else{
			category.children.forEach(child => {
				if(child.id == id){
					response.id = category.id
					response.name = category.name
					response.children = child
				}else{
					child.children.forEach(subChild=>{
						if(subChild.id == id){
							response.id = category.id
							response.name = category.name
							response.children = new Object()
							response.children.id = child.id
							response.children.name = child.name
							response.children.children = subChild
						}
					})
				}
			})
		}
	})
	res.status(200).json(response)
})


router.get('/detail/id/:id',(req,res)=>{
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

	var url=constantes.url_v3+"catalog/categories/"+id
	xhr.open("GET",url)
	xhr.setRequestHeader('X-Auth-Token',constantes.token)
	xhr.send()
})

module.exports=router