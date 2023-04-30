import {Op} from 'sequelize'
import groupMessage from "../models/groupMessage";

class GroupMessageController {
    async list(req, res) {

        const {messageId} = req.query

        const query = {
            limit: 10,
            order: [['id', 'DESC']]
        }

        if (messageId) {
            query.where = {id: {[Op.lt]: messageId}}
        }
        console.log('query is ', query)

        const groupMessages = await groupMessage.findAll(query)
        res.json(groupMessages)
    }
}

export default new GroupMessageController()
