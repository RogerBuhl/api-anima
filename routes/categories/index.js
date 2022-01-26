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

router.get('/tree/id/:id',async (req,res)=>{
	console.log('tree')
	const id = String(req.params.id)
	const categoryTree = require('./category-tree.json')
	let response
	try{
		response = await barrerArbol(categoryTree,id)
		console.log(response)
		
	}catch(err){
		console.log('cacheo el error')
	}
	res.status(200).json(response)
})

function barrerArbol(categoryTree,id){
	return new Promise(async(resolve,reject)=>{
		try{
			categoryTree.forEach(async category=>{
				if(category.id == id){
					console.log('retornando:',category)
					resolve(category)
				}else{
					if(category.children.length>0){
						await barrerArbol(category.children,id)
					}
					reject()
				}
			})
		}catch(err){
			reject(err)
		}
	})
	
}


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