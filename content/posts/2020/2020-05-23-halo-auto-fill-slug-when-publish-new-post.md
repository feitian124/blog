---
title: "halo发布文章自动输入slug"
date: 2020-05-23 20:00:00
tags: ["halo", "java", "js"]
categories: ["work"]
---

halo 发布文章时，需输入 slug，即固定链接地址，有利于搜索引擎收录和提升权重。而中文出现在 url 中并不友好，
所以需要自己想一个 slug，一般是英文或者中文拼音。每次发文章都需要这么想一下不方便，我们来优化一下，
即默认填写文章标题的中文拼音作为 slug。

这里有两个思路，首先想到的是后台去转换，毕竟服务器端资源更多更强大，但需要写一个额外的 api，稍显麻烦。
那先研究一下纯前端 js 有没有合适的解决方案呢？马上调研一下:

- 百度一下 `js 中文 拼音`，有不少相关文章，毕竟是比较常见的需求。但排名靠前的文章都是贴在文章中的代码，或者百度网盘，
啥年代了还不知道贴一个仓库地址，不专业不考虑。

- github 搜 'pinyin', 找到一些几个不错的仓库。 
结合他们的文档和然后分别百度， 搞清楚了他们的优劣:

- https://github.com/hotoo/pinyin  
  5.1k star, 常见汉字字典文件 165kB，后端版本有 npm 包，web 版本没有。

- https://github.com/sxei/pinyinjs  
  1.8k star, 常见汉字字典文件 27kB， 无npm包。该作者知晓并借鉴了上面的库，自己整理了字库，且做了JS版拼音输入法，看了效果不错。

- https://github.com/creeperyang/pinyin 
  420 star, 常见汉字字典文件 7kB， 有npm包， 缺点是不支持ie和edeg浏览器。该库转换方原理参见博客[利用Android源码，轻松实现汉字转拼音功能](http://blog.coderclock.com/2017/04/04/android/2017-04-04/)，可以算作Java到JavaScript的一次转译。


说明一下，上面的情况都是选择他们的 web 常用字库版,带约 6000+ 汉字也有排序。它们都还有带声调多音子的完整字库版本，需要的自己去深入研究。有人可能会和我一样，觉得 6000+ 常用字够不够，那就来感觉一下，这些常用字你能认识多少先吧:

```js
/**
 * 常规拼音数据字典，收录常见汉字6763个，不支持多音字
 */
var pinyin_dict_notone = 
{
	"a":"啊阿锕",
	"ai":"埃挨哎唉哀皑癌蔼矮艾碍爱隘诶捱嗳嗌嫒瑷暧砹锿霭",
	"an":"鞍氨安俺按暗岸胺案谙埯揞犴庵桉铵鹌顸黯",
	"ang":"肮昂盎",
	"ao":"凹敖熬翱袄傲奥懊澳坳拗嗷噢岙廒遨媪骜聱螯鏊鳌鏖",
	"ba":"芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸茇菝萆捭岜灞杷钯粑鲅魃",
	"bai":"白柏百摆佰败拜稗薜掰鞴",
	"ban":"斑班搬扳般颁板版扮拌伴瓣半办绊阪坂豳钣瘢癍舨",
	"bang":"邦帮梆榜膀绑棒磅蚌镑傍谤蒡螃",
	"bao":"苞胞包褒雹保堡饱宝抱报暴豹鲍爆勹葆宀孢煲鸨褓趵龅",
	"bo":"剥薄玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳亳蕃啵饽檗擘礴钹鹁簸跛",
	"bei":"杯碑悲卑北辈背贝钡倍狈备惫焙被孛陂邶埤蓓呗怫悖碚鹎褙鐾",
	"ben":"奔苯本笨畚坌锛"
	// 省略其它
};
```

我要优化的这个场景是 halo 博客的后台，发布文章时默认填充一个文章标题的中文拼音作为 slug。

- js 体积肯定越小越好
- 有 npm 包的更好，集成成本低
- 博客后台是给博客主人用的，会部署独立博客的人，应该多数是使用现代浏览器。同时做到使用 ie 时体验不降低即可。

ok， 方案确定后，很快实现了。halo 后台是独立的仓库 halo-admin, 基于 antd vue 实现，稍作修改完成。主要代码如下

```js
    slugDefaultValue() {
      if (this.selectedPost.title) {
        if (pinyin.isSupported()) {
          return pinyin.convertToPinyin(this.selectedPost.title, '-', true)
        } else {
          console.warn('当前浏览器不支持 tiny-pinin，请使用chrome等现代浏览器.')
        }
      }
      return ''
    },
```

现在可以愉快的发布文章，少一点为想 slug 费脑筋了。
