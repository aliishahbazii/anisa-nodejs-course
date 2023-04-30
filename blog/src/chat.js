import Message from './models/message'
import GroupMessage from "./models/groupMessage";

const map = new Map()

export default (io, socket) => {
    console.log('connect', socket.id)

    const {user} = socket.request

    console.log(user.username, 'connected')

    saveId()

    console.log(map)

    socket.emit('user_connected', user)

    socket.on('message', async data => {
        console.log(data)

        const message = new Message(data)
        await message.save()

        const receiver = getSocketId(data.to)
        socket.to(receiver).emit('message', message)
        socket.emit('message', message)
    })


    socket.on('groupMessage', async data => {
        console.log(data)

        const groupMessage = new GroupMessage(data)
        await groupMessage.save();

        map.forEach((value, key) => {
            console.log(key, "  ", value)

            if (key === user.id) {
                socket.emit('groupMessage', groupMessage)
            } else {
                socket.to(value).emit('groupMessage', groupMessage)
            }
        })

    })


    socket.on('disconnect', () => {
        console.log('disconnected', socket.id)
        removeId()
    })

    function saveId() {
        map.set(user.id, socket.id)
    }

    function getSocketId(id) {
        return map.get(id)
    }

    function removeId() {
        map.delete(user.id)
    }
}
