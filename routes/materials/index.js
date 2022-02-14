const 	router=require('express').Router(),
		fs=require('fs'),
		XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest,
		end=require('../functions').end,
		constantes=require('../constantes.json'),
		obj='MATERIAL'

router.all('/*',(req,res,next)=>{
	const 	modulo=req.originalUrl.split('?')[0].split('/')
	switch(modulo[3]){
		case 'algo':
			router.use('/'+modulo[3],require('./'+modulo[3]))
			break;
	}
	next()
})

/**-------------------GET------------------------ */
router.get('/file-local', async (req,res)=>{
	var xhr=new XMLHttpRequest()
	xhr.withCredentials=true
    pageToSearch = 1
    perPageToSearch = 250
    let products = []
    let materials = []

    try{
        let productPage = await getProductosPage(pageToSearch,perPageToSearch)
        products = products.concat(productPage.data)
        while(productPage.meta.pagination.total_pages > pageToSearch){
            pageToSearch++
            productPage = await getProductosPage(pageToSearch,perPageToSearch)
            products = products.concat(productPage.data)
        }

        products.forEach(product=>{
            product.custom_fields.forEach(cf =>{
                if(String(cf.name).toUpperCase() == 'MATERIALS'){
                    let matArray = cf.value.split(',')
                    matArray.forEach(material=>{
                        material = String(material).toUpperCase()
                        if(!materials.includes(material)){
                            materials.push(material)
                        }
                    })
                }
            })
        })

        materials.forEach((mat,index)=>{
            mat = String(mat).toLowerCase()
            mat = mat[0].toUpperCase() + mat.slice(1)
            materials[index]={'name':mat}
        })
        fs.writeFileSync('./routes/materials/materials.json',JSON.stringify(materials))
        res.status(200).json(materials)
    }catch(err){
        console.log(err)
        res.status(501).json('error en bigcommerce')
    }

	/*xhr.addEventListener("readystatechange",()=>{
		if(xhr.readyState===4){
			try{
				var response=JSON.parse(xhr.responseText),data={};
				if(response.status==404)res.status(404).send()
				else if(!response.data.length)res.status(204).send()
				else{
					fs.writeFileSync('./routes/materials/materials.json',JSON.stringify(response.data))
					res.status(200).send()
			    }
			}catch(err){end(res,err,'GET',obj)}
		}
	})*/

})

function getProductosPage(page,limit){
    return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest()
		xhr.withCredentials = true
		xhr.addEventListener("readystatechange", () => {
			if (xhr.readyState === 4) {
				try {
					var response = JSON.parse(xhr.responseText),
						data = {};
					if (response.status == 422) reject(response)
					else if (response.status == 404) reject({
						code: 404,
						msg: 'status 404 bigcommerce'
					})
					else if (!response.data.length) reject({
						code: 204,
						msg: 'no data'
					})
					else {
						resolve(response)
					}
				} catch (err) {
					reject(err)
					//end(res, err, 'GET', obj)
				}
			}
		})

		var url = constantes.url_v3 + "catalog/products/?limit=" + limit + "&page=" + page + "&is_visible=true&include=custom_fields"
		xhr.open("GET", url)
		xhr.setRequestHeader('X-Auth-Token', constantes.token)
		xhr.send()
    })
}

router.get('/', (req,res)=>{
    const materials = require('./materials.json')
    res.status(200).json(materials)
})


module.exports = router