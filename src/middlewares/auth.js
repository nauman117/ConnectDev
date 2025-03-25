const adminAuth = (req,res,next)=>{
    console.log("Admin Auth is getting checked");
    const token ="xyz";
    const isAdminAuthorized = token==="xyz";
    if(!isAdminAuthorized) res.status(401).send("unauthorized");

    next();
}
const userAuth = (req,res,next)=>{
    console.log("User Auth is getting checked");
    const token ="xyz";
    const isAdminAuthorized = token==="xyz";
    if(!isAdminAuthorized) res.status(401).send("unauthorized");

    next();
}

module.exports={
    adminAuth,
    userAuth
}