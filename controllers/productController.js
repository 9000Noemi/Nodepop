import createError from 'http-errors'
import Product from '../models/Product.js'

export function index(req, res, next) {
  res.render('new-product')
}