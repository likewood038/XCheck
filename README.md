# **XCheck: 基于 WebGIS 的校园活动签到打卡系统**

后端方案链接：[XCheck](https://github.com/totoo512/XCheck/)

## 项目背景与意义
在当前的校园活动管理中，师生线下签到普遍采用手工签到、纸质登记、微信群接龙等方式。

本项目旨在构建一套基于 WebGIS 的“校园活动签到打卡系统”，用户可基于当前位置和活动时段完成打卡，系统自动验证位置、时间、身份，并可以将打卡数据汇总整理，为活动数据的分析提供基础。通过此次项目应用巩固数据库系统相关课程知识。

## 项目目标
 本系统面向校园师生，目标包括：

+ 实现基于校园地图的活动签到点展示与查询
+ 支持活动发起者创建签到任务并设置时间与地点约束
+ 支持参与者基于定位信息完成签到
+ 提供签到状态管理、历史记录查询与签到统计图表功能

## 流程图
![画板](asserts/yuque_mind.jpeg)

## 系统功能模块设计
| 模块 | 功能描述 | 技术要点 |
| --- | --- | --- |
| 活动地图展示模块 | 地图中展示当前及即将开始的签到活动位置 | 地图SDK，签到点图层加载   |
| 活动详情与用户签到模块 | 通过点击地图上的标点查看活动详情信息，用户在子页面可以执行签到操作，系统校验其地理位置与时间 | Geolocation 获取位置、PostgreSQL 数据库 ST_Dwithin 函数计算是否在范围内、签到状态记录   |
| 活动创建模块 | 在地图中选择坐标点，填入必要信息并在数据库中创建新活动，支持发起人设置活动名称、地点、时间、签到时限 | 表单输入、地理数据的传输、将地理位置存入数据库、权限控制   |
| 全部活动查询模块 | 用户可查看活动信息，点击立即定位到地图上的活动地点，支持显示当前位置到活动地点之间的距离，支持按距离排序 | 按条件查询接口、ST_Distance 函数距离计算、定位指定活动标点、表格与图表展示 |
| 登录/注册模块 | 使用 JWT 令牌存储用户的登录状态信息，通过令牌与后端交互，保障安全性 | JWT 令牌、localStorage 本地存储 |
| 我的活动查询模块 | 支持查看全部我发起的活动，二级弹窗可展示签到总数与签到人的学号、姓名、签到时间等信息 | 弹窗展示、签到数据统计、列表生成 |


## 功能演示
+ 主页地图展示

![主页地图展示](./asserts/主页地图展示.gif)

- 创建活动签到成功

![创建活动签到成功](./asserts/创建活动签到成功.gif)

- 已签到和不在范围

![已签到和不在范围](./asserts/已签到和不在范围.gif)

- 我的活动数据统计

![我的活动数据统计](./asserts/我的活动数据统计.gif)

- 登陆注册

![登陆注册](./asserts/登陆注册.gif)

- 全部活动列表跳转

![全部活动列表跳转](./asserts/全部活动列表跳转.gif)


## 关键技术与工具选型
+ 前端：html + css + js + 高德地图 JS API
+ 后端：SpringBoot + Mybatis + SpringMVC
+ 数据库：PostgreSQL（PostGIS 扩展增强）
+ 定位技术：高德定位接口
+ 部署：Nginx 服务器反向代理部署前端页面，Tomcat 部署后端服务，域名服务器部署

## 数据库设计
### ER 图
![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/50076507/1749652517091-44664436-220d-4beb-acb3-d1e81b5e653e.jpeg)

### 业务数据库结构设计
+ 用户表 user

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **id** | SERIAL | 用户ID |
| **username** | VARCHAR(20) | 用户名（通常用学号） |
| **password** | VARCHAR(20) | 密码 |
| **name** | VARCHAR(20) | 用户昵称 |
| **create_time** | TIMESTAMP | 创建时间 |
| **update_time** | TIMESTAMP | 修改时间 |


+ 活动表 activity

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **id** | SERIAL | 活动ID |
| **create_user** | INTEGER | 创建者ID |
| **radius** | INTEGER | 可签到半径 |
| **title** | VARCHAR(20) | 活动标题 |
| **start-time** | TIMESTAMP | 开始时间 |
| **end-time** | TIMESTAMP | 结束时间 |
| **description** | VARCHAR(300) | 简介 |
| **create_time** | TIMESTAMP | 创建时间 |
| **update_time** | TIMESTAMP | 修改时间 |
| **region_id** | INTEGER | 活动可签到范围ID |


+ 签到记录表 checkin

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **id** | SERIAL | 签到记录ID |
| **user_id** | INTEGER | 用户ID |
| **activity_id** | INTEGER | 活动ID |
| **geom** | INTEGER | 实际签到位置 |
| **checkin_time** | TIMESTAMP | 签到时间 |


+ 地点位置信息表 location

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **id** | SERIAL | 地点ID |
| **name** | VARCHAR(100) | 地点名称 |
| **geom** | GEOMETRY(POINT, 4326) | 经纬度 |


+ 区域信息表 region

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **id** | SERIAL | 区域ID |
| name | VARCHAR(100) | 区域名称 |
| **boundary** | GEOMETRY(POLYGON, 4326) | 经纬度 |
