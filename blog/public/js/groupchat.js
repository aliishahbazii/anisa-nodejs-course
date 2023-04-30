const messageListWrapper = document.getElementById('message-list-wrapper')
const form = document.getElementById('chat-form')
const input = document.getElementById('chat-input')

const socket = io()

let user

socket.on('user_connected', data => {
    console.log('user connected.....')
    console.log(data)
    user = data

    if (user !== undefined) {
        createChatBase()
    }else {
        alert("user not connected try refresh the page")
    }

})


socket.on('groupMessage', data => {
    printMessage(data)
})


form.addEventListener('submit', event => {
    event.preventDefault()

    if (!input.value) {
        return
    }

    socket.emit('groupMessage', {
        message: input.value,
        from: user.id,
    })

    input.value = ''
    input.focus()
})

function createChatBase() {

    const messageWrapper = document.createElement('div')
    messageWrapper.classList.add('message-list-active')
    messageWrapper.id = 'message-wrapper'

    messageWrapper.addEventListener('scroll', event => {
        console.log('scroll', event)
        const element = event.target
        if (element.scrollTop === 0) {
            loadMessageByScroll(element)
        }
    })

    messageListWrapper.appendChild(messageWrapper)

    loadMessage(messageWrapper)

}

function printMessage(data, type = 'append', scrollElement) {
    console.log(data, type)
    const message = document.createElement('div')
    message.classList.add('message')

    const text = document.createElement('div')
    text.textContent = data.message

    const time = document.createElement('div')
    time.textContent = data.createdAt
    time.classList.add('time')

    message.appendChild(text)
    message.appendChild(time)

    message.setAttribute('message-id', data.id)

    console.log('user is ', user)
    if (data.from === user.id) {
        message.classList.add('owner')
    }

    const elementId = data.from

    const messages = document.getElementById(`message-wrapper`)

    if (type === 'append') {
        messages.appendChild(message)
    } else {
        messages.prepend(message)
    }

    if (scrollElement) {
        scrollElement.scrollIntoView()
    } else {
        message.scrollIntoView()
    }
}

function loadMessage(messageWrapper) {
    if (messageWrapper.childNodes.length) return

    getMessages().then(messages => {
        messages.forEach(message =>
            printMessage(message, 'prepend', messageWrapper.lastChild)
        )
    })
}

function loadMessageByScroll(messageWrapper) {
    const {firstChild} = messageWrapper
    const messageId = firstChild.getAttribute('message-id')

    getMessages({messageId}).then(messages => {
        messages.forEach(message => printMessage(message, 'prepend', firstChild))
    })
}

function getMessages(options) {
    const url =
        `/api/groupMessage?` +
        new URLSearchParams({
            ...options
        })

    return fetch(url).then(res => res.json())
}
