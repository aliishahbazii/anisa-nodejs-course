import log from "../../utils/logger";
import Comment from '../../models/comment'
import {NotFoundError} from "../../utils/errors";

class CommentController {
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
        console.log("article is ====== " + article)

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

        await comment.remove()

        log({
            message: 'comment:remove',
            metadata: {comment: comment.dataValues, user: req.user.dataValues}
        })

        res.json(comment)
    }
}

export default new CommentController()
