//standard api error 

class ApiError extends Error{
    constructor(
        statusCode,
        message = "something went wrong",
        errors  = [], 
        stack =""
    ){
        super(message) // overwite the message
        this.statusCode = statusCode
        this.data= null
        this.message = message
        this.success= false;
        this.errors= errors   
        this.stack = stack
    }
}

export {ApiError}