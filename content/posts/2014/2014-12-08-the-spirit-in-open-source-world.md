---
layout: post
title: "开源社区的精神, 坚持与人性"
date: 2014-12-08 17:38:08
categories: life
tags:
---

用了一段时间的 nodejs 了, 今天意外发现有了一个新repo [iojs](https://github.com/iojs/io.js), 了解了一下事情的前因后果, 也谈谈开源社区的精神, 坚持与人性.
iojs 的由来, 可以追述到 这个 [issue](https://github.com/joyent/libuv/commit/804d40ee14dc0f82c482dcc8d1c41c14333fcb48).

我来复述一下. 某人 A 修改了项目的文档, 将文档中带性别倾向的那些词, 如 `he`, `him` 等改成了通用的 `they`, `them` 等词. 这个改动当然是很小的, 对项目的功能, 性能的影响为无, 对文档的可读性的影响也很微小. 这个提交被项目的某个维护者 B 拒绝掉了.
因为 nodejs 是公司 C 赞助的, 而社区以为 B 是 C 的员工, 故而认为 B(以及 C 公司)个人意志凌驾社区意志之上, 然后引发大规模的吐槽.

其实, B 不是 C 的员工, A 才是; 而 A 的行为才是 C 公司赞赏的. 事后 B 被开除, 这一段我也没懂, 不是员工怎么开除? 可能是外包顾问或者第三方吧.
具体可以看[这里](http://www.joyent.com/blog/the-power-of-a-pronoun). 

从这件事可以看出一些有意义的东西:

1. 一个社区(团队), 有公共的准则(信仰)是多么的重要. 这减少很多沟通的成败, 也相当于增加了执行力.

2. 细节决定成败. 流行的开源项目已经精益求精到了怎样的地步? 文档中单词使用的锱铢必较.

3. 怎么处理矛盾? 矛盾是永远存在的, 比如准则不适应或者特殊情况等, 该如何化解呢? 上述事件发生后, 也一度演变成对 B 和 C 公司的口诛嘴伐, 偏离了该有的路径. 这时几个社区有威望的人物及时出现, 不厌其烦的解释前因后果, C 公司也通过上述博文及时澄清. 

我自己的团队有时也会为某些问题争的面红耳赤, 我们应该依次通过:

1. 积极沟通尝试达成一致.

2. 适当退步, 一方证明自己观点是正确的, 并帮助另一方理解.

3. 实在讲不通, 那说明双方不合适, 各干各吧.

每次都深思熟虑, 尽量在上一步解决.
