export default class ErrorService {
    static createError({name="Error",cause,message,code=1,status=500}){
        //console.log(status);
        const error = new Error(message,{cause});
        error.name= name,
        error.code = code,
        error.status = status
        //lanzo el error
        throw error;
        
    }
}