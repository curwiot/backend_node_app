const { response } = require("express")
const res = require("express/lib/response")

class Response_object {
    constructor(data, response_type, message) {
        this.data = data
        this.response_type = response_type
        return {
            "data": data,
            "response_type": response_type,
            "message": message
        }
    }
}

module.exports={
    Response_object
}