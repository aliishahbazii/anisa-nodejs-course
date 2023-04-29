import log from "../utils/logger";
import Comment from '../models/comment'
import Article from "../models/article";
import {ForbiddenError, NotFoundError} from "../utils/errors";
import {ROLE_HIERARCHY} from "../config/roles";

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

        const comment = new Comment({text, rate, articleId: articleId, userId: req.user.id})
        await comment.save()

        log({
            message: 'comment:create',
            metadata: {article: article.dataValues, user: req.user.dataValues, comment: comment.dataValues}
        })

        res.redirect('/article/' + articleId)
    }

    async remove(req, res) {
        console.log("req is ", req)
        const {id} = req.params

        const comment = await Comment.find(+id)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        //if loggedInUser is owner of comment or admin then he can remove the comment


        const {role} = req.user

        if (role === "ADMIN" || ROLE_HIERARCHY[role]?.includes("ADMIN") || comment.userId === req.user.id) {
            throw new ForbiddenError('Invalid Access')
        }


        await comment.remove()

        log({
            message: 'comment:remove',
            metadata: {comment: comment.dataValues, user: req.user.dataValues}
        })

        res.redirect('/article/' + comment.articleId)
    }
}

export default new CommentController()
