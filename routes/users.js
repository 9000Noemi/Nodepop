import { Router } from 'express';
import User from '../models/User.js';
var router = Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
