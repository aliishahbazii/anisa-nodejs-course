import {NotFoundError} from '../utils/errors'
import express from 'express'
import general from './general'
import article from './article'
import auth from './auth'
import api from './api'
import comment from './comment'

const router = express.Router()

router.use('/', general)
router.use('/', auth)
router.use('/article', article)
router.use('/comment', comment)
router.use('/api', api)

router.all('*', (req, res) => {
    throw new NotFoundError()
})

export default router
