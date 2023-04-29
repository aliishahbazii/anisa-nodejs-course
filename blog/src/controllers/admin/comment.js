import log from "../../utils/logger";
import Comment from '../../models/comment'
import {ForbiddenError, NotFoundError} from "../../utils/errors";
import Article from "../../models/article";
import {ROLE_HIERARCHY} from "../../config/roles";

class CommentController {

    async get(req, res) {
        const {id} = req.params

        const comment = await Comment.find(+id, {include: ['user']})

        if (!comment) {
            throw new NotFoundError('Article not found')
        }

        res.json(comment)
    }

    async add(req, res) {
        const {
            articleId,
            text,
            rate
        } = req.body

        //find article
        const article = await Article.find(+articleId)

        if (!article) {
            throw new NotFoundError('Article not found')
        }

        const comment = new Comment({text, rate, articleId: articleId, userId: req.user.id})
        await comment.save()

        log({
            message: 'comment:create',
            metadata: {article: article.dataValues, user: req.user.dataValues, comment: comment.dataValues}
        })


        res.json(comment)
    }

    async remove(req, res) {
        const {id} = req.params

        const comment = await Comment.find(+id)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        const {role} = req.user
        if (role === "ADMIN" || ROLE_HIERARCHY[role]?.includes("ADMIN") || comment.userId === req.user.id) {
            throw new ForbiddenError('Invalid Access')
        }

        await comment.remove()

        log({
            message: 'comment:remove',
            metadata: {comment: comment.dataValues, user: req.user.dataValues}
        })

        res.json(comment)
    }
}

export default new CommentController()
