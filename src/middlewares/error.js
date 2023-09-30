//al usar custom route, el error siempre lo esta atajando applyCallbacks
//por lo tanto este midleware pierde sentido, lo dejo solo a modo de ejemplo

export default (error,req,res,next) => { // COMENTARIO DE MAURI Es nuestro salvador! Éste es el que define que NUNCA caiga el server
    console.log(error);
    res.status(error.status).send({status:"error",error:error.name})
}

