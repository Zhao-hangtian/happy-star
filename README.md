<!-- 内容建议:以下为建议你可以补充的内容要点和方向 -->

# 成语解谜 - Chines Idiom Puzzle
<!-- 请将上面“项目名”替换为你本次参赛作品的项目名 -->


## 项目简介
<!-- 请描述此次参赛作品的简介，建议用「一句话简介」+ 详细介绍的形式 -->

### 前言

成语是汉语的精华，是中华民族的文化财富与历史载体。

从成语中我们可以体会到中国古代文明的辉煌，了解中国古代教育思想，感受古人对世界的认知。

> “日出而作，日落而息，凿井而饮。”黄河、长江哺育了我们肥沃的家园，许多成语对古代先民农业生产生活进行了描写。“田连阡陌”，谓田地广袤，接连不断。“精耕细作”谓精心细致的耕作。“寒耕热耘”寒冷时耕种，炎热时除草。形容农事艰辛。《管子·臣乘马》：“彼善为国者，使农夫寒耕热耘，力归于上。”这些成语都体现了重农、尚农的社会共识，历代封建帝王都提倡“重农抑末”，把农业看作是国固邦宁的根底，成就霸业的基础。

> 中国的古代建筑艺术主要体现在宫殿，陵墓，寺庙和园林四大类型中，成语表现了它们的某些艺术特点。例如，“堂皇富丽”(宏伟美丽，气势盛大)，多形容建筑物，特别是宫殿的宏伟华丽。又如，“雕梁画栋”亦作“画梁雕栋”，谓彩画装饰的梁栋。形容建筑物的美丽华贵。

从小，我们就接触成语，“守株待兔”、“刻舟求剑”、“愚公移山”、“白云苍狗”、“斗转星移”等，成语不仅伴随着我们的成长，也在生活中被广泛使用。

使用成语，我们可以与小伙伴开展有趣的交流；学习成语，我们可以在考试中取得更好的成绩；通过成语，我们了解一个个生动的典故，展开与古人的交流，丰富了我们的精神世界。

时光荏苒，离开学校的我们或许已经很少再接触那本厚厚的成语词典，那些总是做不完的试卷和曾经嬉笑的面孔也早已遗落在回忆的角落、失散在人生的拐角。

藉由本次声网编程挑战赛的白板SDK，我们完成了一款成语解谜游戏。

这款游戏从用户视角与技术视角分别具有几个特点：

### 用户视角

1. 操作设计**易于上手**。**玩家通过移动候选字，补全成语拼图**。无需手册，兼容触摸与鼠标操作，小朋友和长辈都可以轻松上手。

![](/images/2022-08-23-01-46-52.png)

2. 内容**丰富**。收录了接近3万个成语成语，可以生成千亿种以上组合；待填入字均是成语的之间的衔接**公共字**，作为答案填写的约束条件，提高了游戏的趣味性，同时展示出汉字成语的丰富和中华文明的深厚。


3. **寓教于乐**。答案界面提供了成语的**读音**、**解释**、**出处**以及**用例**。题目是载体，让玩家在趣味中增长见识，体验文化典故里的乐趣。

![](/images/2022-08-23-01-47-28.png)

4. 多人**合作**/**PK**。充分利用SDK能力，多个用户共享白板界面，可以共同完成同一窗口的题目，亦可各自打的游戏窗口，进行*PK*。

    #### 合作模式
    ![](/images/2022-08-23-01-52-50.png)


    #### PK模式
    ![](/images/2022-08-23-01-55-21.png)


### 技术视角


1. 前后端分离。前端专注页面逻辑，后端专注题目生成与结果判断。用户访问前端页面无需下载全量词库，大幅提高访问速度。

2. 前端几乎无图片素材加载，图形均为代码绘制，降低用户带宽的要求。游戏界面基于`PixiJS`进行开发，优先调用`WebGL`硬件加速，提高效能，对于移动设备更友好。

3. 后端基于`Go 1.18`开发。深度优先搜索(DFS)实现棋盘的生成，并加入剪枝策略：依靠头词索引（类似倒排索引的思想）进行快速命中/筛选 + 字典树(Trie)实现`O(logN)`时间下的快速查找。负责棋盘生成的结构体`Board`储存了全量成语以及中间数据信息，作为全局单例，减少内存拷贝；对于每个问题生成请求，直接返回`Board`生成结果的拷贝。

    基于此优化思路，可以实现10万次问题生成消耗13.11s的速度，接近7700QPS（单核）。

    ![](/images/2022-08-24-02-14-39.png)


## 安装部署指南

### 前端 - 白板插件

1. 克隆本git仓库，`git clone https://github.com/Zhao-hangtian/happy-star`

2. `cd happy-star`进入目录，安装npm依赖包，`npm start`；

3. 执行`npm start`即可看到白板启动，工具栏处点击“成语解谜”，即可打开游戏，支持多开。

    ![](/images/2022-08-24-02-24-53.png)

### 后端 （可选）

可直接使用`https://game.willtian.cn:8080/idioms`，此配置地址为前端工程默认，无需修改。

1. 克隆后端git仓库，`git clone https://github.com/Zhao-hangtian/happy_star_backend`

2. `cd happy_star_backend`进入目录，编译`go build`；

3. 执行`./backend`或`sh run.sh`。

## 功能简介

老少咸宜、寓教于乐的成语解谜游戏，可以作为学生们课堂闲暇之余的有益消遣，同时也适合朋友、情侣与家庭聚会，共同参与游戏并从中感受中华文化的魅力与乐趣。


## 技术栈

- 计算机&算法基础
    - 深度优先搜索(DFS)与剪枝
    - 字典树(Trie)
    - 倒排索引(Inverted index)

- Javascript
    - 语言基础
    - React - 前端框架基础
    - PixiJS - 渲染系统的原理和使用

- Golang
    - 语言基础
    - 内存模型
    - 协程模型
    - Net - 网络框架的原理和使用
    - 基于Go的算法优化

## 二次开发
无，本项目为此处参赛首次编写。


## 其他资料

- 后端工程: https://github.com/Zhao-hangtian/happy_star_backend


---
# 许可协议

该参赛作品的源代码以`MIT`开源协议对外开源。

本项目依赖了[netless-io/flat](https://github.com/netless-io/flat)、[PixiJS](https://github.com/pixijs/pixijs)、[React](https://github.com/facebook/react)。

```
Copyright (C) 2022 Zhao-hangtian iamzhaohangtian@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```



<!-- 往年作品 README 参考
https://github.com/AgoraIO-Community/RTE-2021-Innovation-Challenge/blob/master/Application-Challenge/%E3%80%90%E5%8A%A0%E6%B2%B9%EF%BC%8C%E6%89%93%E5%B7%A5%E4%BA%BA%E3%80%91AgoraHomeAI/README.zh.md

https://github.com/AgoraIO-Community/RTE-2021-Innovation-Challenge/blob/master/Application-Challenge/%5Brethinking%5D%E9%83%BD%E5%B8%82%E6%8E%A2%E9%99%A9%E5%AE%B6/Readme.md

https://github.com/AgoraIO-Community/RTE-2021-Innovation-Challenge/blob/master/Application-Challenge/%5B%E5%8F%B2%E5%A4%A7%E4%BC%9F%5D%20%E6%95%99%E5%AD%A6%E5%8A%A9%E6%89%8B/README.md

https://github.com/AgoraIO-Community/RTE-2021-Innovation-Challenge/blob/master/Application-Challenge/%E3%80%90AnakinChen%E3%80%91%E8%BF%9E%E9%BA%A6%E9%97%AE%E7%AD%94PK/README.md -->