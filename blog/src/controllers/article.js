import Article from '../models/article'
import Comment from '../models/comment'
import {Op} from 'sequelize'


import {NotFoundError} from '../utils/errors'
import User from "../models/user";
import {ROLE_HIERARCHY} from "../config/roles";

class ArticleController {
    async list(req, res) {
        const data = await Article.findPaginate(req.query.page, {limit: 8})

        res.render('article/list', {
            title: 'Articles',
            user: req.user,
            ...data
        })
    }

    async get(req, res) {
        const {id} = req.params

        const article = await Article.find(+id)

        if (!article) {
            throw new NotFoundError('Article not found')
        }

        const comments = await Comment.findAll({
            where: {articleId: {[Op.eq]: article.id}},
            order: [['createdAt', 'desc']]
            , include: User
        })

        //if loggedInUser is owner of comment or admin then he can remove the comment
        if (req.user) {

            const {role} = req.user

            for (const comment of comments) {
                if (role === "ADMIN" || ROLE_HIERARCHY[role]?.includes("ADMIN") || comment.userId === req.user.id) {
                    comment.removable = true;
                } else {
                    comment.removable = false;
                }
                console.log("comment", comment.removable, "  ", comment.id)
            }
        }


        res.render('article/show', {
            title: article.title,
            article,
            comments,
            user: req.user
        })
    }
}

export default new ArticleController()
