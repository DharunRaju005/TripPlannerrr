const jwt=require('jsonwebtoken')

const verifyToken=async(req,res,next)=>{
    // const token=await req.cookies.token;
    const token=req.cookies["tp"];
    console.log(req.cookies);
    console.log('vt6',token);
    if(!token){
        return res.status(401).json({message:"You don't have any authorisation"})
    }
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        console.log("Verify token",decode);
        console.log(req.user,"from verify token middleware");

        next();
    }
    catch(err){
        console.log('ln33',err);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports=verifyToken;
