import mongoose, {Schema} from 'mongoose'
import * as bcrypt from 'bcrypt'

//Definir esquema de usuarios:

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String
})

//Para devolver la contraseña encriptada_bcrypt.hash() la encripta:
userSchema.statics.hashPassword = function (unencryptedPassword) {
    return bcrypt.hash(unencryptedPassword, 7);
  };


// Método de instancia, comprueba que la password que pone el usuario coincide con la del schema:
userSchema.methods.comparePassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password)
};


const User = mongoose.model('User', userSchema)


export default User