import multer from 'multer'
import path from 'node:path'

//Configuración de almacenamiento donde guardar los ficheros de los uploads

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        //import.meta.dirname da la carpeta actual donde esta el fichero de codigo fuente
        //path.join nos monta la ruta dependiendo del sistema operativo en el que estemos
        const route = path.join(import.meta.dirname, '..', 'public', 'photos')
        callback(null, route)
    },
    //cambiar el nombre de los archivos que se suben
    filename: function(req, file, callback){
        const filename = `${file.fieldname}-${Date.now()}-${file.originalname}`
        callback(null, filename)
    }

})

//Configuración de upload

const upload = multer({storage})

export default upload