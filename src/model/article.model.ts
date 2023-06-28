import { DataTypes } from 'sequelize'
import { seq } from '../db/seq.js'

// 创建模型
// 文章表设计如下：
// id: [主键] (自增)
// title: varchar(255) // 文章标题
// content: text // 文章内容
// author: varchar(255) // 文章作者
// category: varchar(255) // 文章分类
// tags: varchar(255) // 文章标签

export interface ArticleAttributes {
  id?: number
  title: string
  content: string
  author: string
  category: string
  tags: string
}

const Article = seq.define('blog_articles', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'article title',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'article content',
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'article author',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'article category',
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'article tags',
  },
})

export { Article }
