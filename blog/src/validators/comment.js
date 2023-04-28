export const commentSchema = {
  body: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 100
      },
      rate: {
        type: 'NUMBER',
        required: true
      },
      articleId: {
        type: 'NUMBER',
        required: true
      }

    }
  }
}
