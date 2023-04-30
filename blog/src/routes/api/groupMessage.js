import express from 'express'
import GroupMessage from '../../controllers/groupMessage'
import acl from '../../middlewares/acl'

const router = express.Router()

router.get('/', acl('USER'), GroupMessage.list)

export default router
