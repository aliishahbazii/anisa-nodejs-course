import { sequelize, BaseModel, DataTypes } from '../config/database'

class Comment extends BaseModel {}

Comment.init(
  {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'comment'
  }
)

export default Comment
