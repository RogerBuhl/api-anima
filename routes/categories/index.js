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
					fs.writeFileSync('./src_anima/routes/categories/category-tree.json',JSON.stringify(response.data))
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
	let result = new Object()
	try{
		let nivel = 1;
		let index = 0;
		for await (let categoria of categoryTree) {
			console.log("categoria",categoria)
			if(categoria.id == id){
				console.log("devuelve en ",index)
				result.id = categoria.id
				result.url = categoria.url
				result.name = categoria.name;
				result.parent = []
				result.children = categoria.children;
				break;
			}else{
				if(!result.id && categoria.children.length > 0)
					result = await barrerNivel(nivel,[],categoria,id)
			}
			index++;
		}

		//console.log("result listado de categorias",result)
		
	}catch(err){
		console.log('cacheo el error',err)
	}

	res.status(200).json(result)
})

function barrerNivel(nivel,categoriaAnterior,categoriaPadre,idBusqueda){
	try{
		let result = new Object();

		for (let categoria of categoriaPadre.children) {
			//console.log("categoria en barrido ",categoria)
			//console.log("categoriaPadre[nivel]",categoriaPadre[nivel])
			if(categoria.id == idBusqueda){
				console.log("lo encuentro en barrido nivel",nivel)
				result.id = categoria.id
				result.url = categoria.url
				result.name = categoria.name;
				result.children = categoria.children;
				result.parent = new Object()
				result.parent.id = categoriaPadre.id;
				result.parent.url = categoriaPadre.url;
				result.parent.name = categoriaPadre.name;
				result.parent.children = [];
				if(nivel > 1){
					result.parent.parent = new Object()
					result.parent.parent.id = categoriaAnterior.id;
					result.parent.parent.url = categoriaAnterior.url;
					result.parent.parent.name = categoriaAnterior.name;
					result.parent.parent.children = [];
					//result.parent.parent = categoriaAnterior
				}


				console.log("encontro,result",result)
				break;
			}else{
				if(categoria.children.length>0)
					result = barrerNivel(nivel+1,categoriaPadre,categoria,idBusqueda)
				
			}
		}

		return result;

	}catch(err){
		console.log('cacheo el error en barrido',err)
	}
	
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
