var validator = require('validator');
var isEmpty = require('is-empty');
var mongoose = require('mongoose');

module.exports = function validateRegisterInput(data){

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.role = !isEmpty(data.role) ? data.role : "";
    /*data.school = !isEmpty(data.school) ? data.school : "";
    data.isAdmin = !isEmpty(data.isAdmin) ? data.isAdmin : "";*/

    //Name checks
    if(validator.isEmpty(data.name)) {
        errors.message = "El campo de nombre es obligatorio.";
    }

    //Email checks
    if(validator.isEmpty(data.email)){
        errors.message = "El campo de correo es obligatorio.";
    }else if(!validator.isEmail(data.email)){
        errors.message = "El correo tiene un formato inválido.";
    }

    //Name checks
    if(validator.isEmpty(data.role)) {
      errors.message = "El rol de usuario es obligatorio.";
    }else if (!mongoose.Types.ObjectId.isValid(data.role)){
      errors.message ="El rol de usuario es inválido.";
    }

    return{
        errors,
        isValid:isEmpty(errors)
    };

};