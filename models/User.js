import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String
})

//para devolver la contraseña encriptada
userSchema.statics.hashPassword = function (unencryptedPassword) {
    return bcrypt.hash(unencryptedPassword, 9);
  };


// método de instancia, comprueba que la password que pone el usuario coincide con la del schema
userSchema.methods.comparePassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password)
};


const User = mongoose.model('User', userSchema)


export default User