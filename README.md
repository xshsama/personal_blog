# Personal Blog System

一个基于 Vue 3 和 Spring Boot 的现代化个人博客系统。

## 技术栈

### 前端

- Vue 3.5.13
- TypeScript
- Element Plus 2.9.6
- Vue Router 4
- Vuex 4
- ByteMD (Markdown 编辑器)
- Axios

### 后端

- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- MySQL 8
- JWT
- Flyway (数据库版本控制)
- Project Lombok
- Hutool
- MapStruct

## 功能特性

- 用户认证与授权
  - JWT based 身份验证
  - 基于角色的访问控制

- 文章管理
  - Markdown 编辑器支持
  - 文章分类和标签
  - 封面图片上传
  - 草稿保存
  - 文章预览

- 首页功能
  - 最新文章展示
  - 热门文章推荐
  - 全文搜索
  - 响应式设计

- 文章浏览
  - 文章详情页
  - 文章评论
  - 文章点赞
  - 阅读统计

- 用户中心
  - 个人资料管理
  - 文章管理
  - 评论管理

## 项目结构

```
├── backend/                # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── frontend/              # 前端项目
    ├── src/
    │   ├── components/    # 公共组件
    │   ├── views/         # 页面组件
    │   ├── router/        # 路由配置
    │   ├── store/         # Vuex 状态管理
    │   ├── utils/         # 工具函数
    │   └── services/      # API 服务
    └── package.json
```


## 主要依赖说明

### 后端主要依赖
- spring-boot-starter-web: Web 应用支持
- spring-boot-starter-security: 安全框架
- spring-boot-starter-data-jpa: ORM 框架
- java-jwt: JWT 支持
- mysql-connector-j: MySQL 驱动
- lombok: 注解处理器
- mapstruct: 对象映射
- flyway-core: 数据库迁移

### 前端主要依赖
- vue: 核心框架
- element-plus: UI 组件库
- bytemd: Markdown 编辑器
- axios: HTTP 客户端
- vuex: 状态管理
- vue-router: 路由管理


