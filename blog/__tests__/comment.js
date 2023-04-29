import '../src/config/loadTestEnv'
import supertest from 'supertest'
import {bootstrap} from '../src/app'
import {redisClient} from '../src/config/redis'
import {logger, mongoTransport} from '../src/utils/logger'
import User from '../src/models/user'
import Article from '../src/models/article'
import Comment from "../src/models/comment";
import {Op} from 'sequelize'

let request, user, article, comment1, getComment

const fakeUser = {
    username: 'ali',
    email: 'ali@gmail.com',
    password: '123'
}

const fakeArticle = {
    title: 'Article title',
    text: 'Article text',
    image: 'Article image'
}

const fakeComment1 = {
    text: 'fakeComment1',
    rate: 5
}

const fakeComment2 = {
    text: 'fakeComment2',
    rate: 5
}

beforeAll(async () => {
    const server = await bootstrap()
    request = supertest(server)

    await request.post('/register').send(fakeUser)

    const responseUser = await request
        .post('/api/login')
        .send({username: fakeUser.username, password: fakeUser.password})

    user = responseUser.body

    await User.update(
        {role: 'ADMIN'},
        {where: {username: fakeUser.username}}
    )

    const responseArticle = await request
        .post('/api/admin/article')
        .set('Authorization', `Bearer ${user.token}`)
        .send(fakeArticle)

    article = responseArticle.body


})

afterAll(async () => {
    await User.destroy({where: {username: fakeUser.username}})

    await Comment.destroy({where: {id: {[Op.gt]: 0}}})

    await Article.destroy({where: {id: {[Op.gt]: 0}}})

    await redisClient.disconnect()

    logger.clear()
    logger.remove(mongoTransport)
})

describe('Comment api', () => {

    test('create comment', async () => {

        fakeComment1.articleId = article.id

        const response = await request
            .post('/api/comment')
            .set('Authorization', `Bearer ${user.token}`)
            .send(fakeComment1)

        comment1 = response.body

        expect(response.statusCode).toBe(200)

        checkComment(comment1, fakeComment1)
    })
    test('get comment', async () => {
        const response = await request
            .get(`/api/comment/${comment1.id}`)
            .set('Authorization', `Bearer ${user.token}`)

        getComment = response.body
        expect(response.statusCode).toBe(200)

        checkComment(getComment, comment1)

    })

    test('delete comment', async () => {
        const response = await request
            .delete(`/api/comment/${comment1.id}`)
            .set('Authorization', `Bearer ${user.token}`)

        expect(response.statusCode).toBe(200)
    })

    test('get deleted comment', async () => {
        const response = await request
            .get(`/api/comment/${comment1.id}`)
            .set('Authorization', `Bearer ${user.token}`)

        expect(response.statusCode).toBe(404)
    })

})


function checkComment(comment, fakeComment) {
    expect(comment.text).toBe(fakeComment.text)
    expect(comment.rate).toBe(fakeComment.rate)
    expect(comment).toHaveProperty('id')
}