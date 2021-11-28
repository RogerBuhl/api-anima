const fs=require('fs')
exports.end=(res,msg,type,obj,tr=null)=>{
    let code=400,data={}
    if(tr) tr.rollback()
    console.log('Error: ',type,obj,msg)
    if(msg&&msg.parent&&msg.parent.errno==1062){
        data.duplicate=msg.parent.sqlMessage.split("'")[3]
        code=409
    }
    fs.appendFile('error.txt','- '+new Date().toLocaleString()+','+type+','+obj+','+msg+'\n',(err)=>{})
    msg=String(msg)
    res.status(code).json({code,msg,data})
}