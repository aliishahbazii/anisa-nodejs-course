import express from 'express'
import CommentController from '../../controllers/admin/comment'
import acl from '../../middlewares/acl'
import {validate} from 'express-jsonschema'
import {commentSchema as schema} from '../../validators/comment'

const router = express.Router()

router.post('/', acl('USER'), validate(schema), CommentController.add)
router.delete('/:id(\\d+)',acl('USER'), CommentController.remove)


export default router

// RESTFUL API

// /article       GET        Show list articles
// /article/:id   GET        Show single article
// /article       POST       Create an article
// /article/:id   PUT        Update an article
// /article/:id   DELETE     Delete an article
