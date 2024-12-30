import { I18n } from 'i18n'
import path from 'node:path'

const i18n = new I18n({
    locales: ['en', 'es'],
    directory: path.join(import.meta.dirname, '..', 'locales'),
    //Si hacen una peticion sin idioma qué pondremos por defecto:
    defaultLocale: 'en',
    autoReload: true, //Recargar si hay cambios en los archivos JSON de locale
    syncFiles: true,
    cookie: 'nodepop-lang-cookie',
})

export default i18n