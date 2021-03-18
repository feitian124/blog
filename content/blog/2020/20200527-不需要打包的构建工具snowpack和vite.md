关注 vue3 的人一定关注到尤雨溪的另一个开源项目 [vitejs](https://github.com/vitejs/vite), 
它是一个不需打包的构建工具，开发时使用 `es module` 导入代码，生产环境用 rollup 构建。
它 有一些显著的优势:

- 使用`es module`导入代码, 极快的启动速度(ESM)
- 即时的热模块替换(HMR)
- 真正的按需编译

目前尤雨溪似乎花费了蛮多精力在这个项目的，目前 vitejs 600左右 commit，vue3 2000左右 commit， 粗略估算工作量前者约后者的 30%，我甚至忍不住想 vue3 的延期会不会跟这个项目有关呢?可见尤大对这个项目的重视。

vitejs 依赖现代浏览器的一个关键特性，即`es module imports`, 那么市面上有没有类似的工具呢? 答案是有的，vitejs 的 `how and why` 章节也列了出来，其中最接近的一个就是 `snowpack`，文档里说道:

- 两个工具都原生支持基于 ESM 的 HMR。 Vite 先一步支持， snowpack 在 v2 时也支持了。双方在基于 ESM 的 HMR 上合作过，尝试建立统一的 api， 但因为底层不同还是会略微不同。
- vite 更加专注，自带更多功能，如 typescript 编译，css 导入， css 模块和 post css 的默然支持。
- 生产环境打包， vite 使用 rollup， snowpack 使用 parcel/webpack

今天恰巧也关注到 [snowpack v2 的发布博客](https://www.snowpack.dev/posts/2020-05-26-snowpack-2-0-release), 在 v1 的目标 `在浏览器中直接使用 npm 包`外，v2 又增加了对基于 ESM 的 HMR 的原生支持。它有如下特性：

- 不需打包的 O(1) 复杂度的构建系统。只编译改变的文件，其它文件不需要重新编译。
- 更快的开发环境。少于 50ms 的启动，typescript， jsx， hmr， css modules 等的原生支持
- 自定义构建。使用构建脚本链接到你最喜欢的构建工具。
- 生产环境打包。使用 webpack 或 parce 等工具打包，或者直接不打包直接使用。

从特性看， vitejs 和 snowpack 2.0 有几乎90%重合，它们的优缺点如下：
- vitejs 优点是尤雨溪出品，可能和 vue3 生态更好的融合。 缺点是目前还未出正式版，文档也不完善。目前 5.4k star。
- snowpack 优点是更加成熟，有成熟的 v1 和已经发布正式版的 v2, 支持 react， vue， preact， svelte 等各类应用，文档也更加完善。 目前 7.9k star

开发时不需要编译打包整个应用，而是单个文件直接供浏览器使用，且默然支持 jsx 和 typescript， 编译成 js 后发送给浏览器:

```js
// 你的代码
import * as React from 'react'

// 编译输出
import * as React form 'web_modules/react.js'
```
这对于开发确实是一个杀手级特性，上面提到， snowpack 和 vitejs 作者有过合作， 尝试统一 [ESM-HMR API 规范](https://github.com/pikapkg/esm-hmr)，预计不久的将来，越来越多的框架会迁移到 ESM-HMR，让我们持续关注。目前对于 snowpack 和 vitejs 而言，它们功能类似， snowpack 官网和文档齐全，我可能会更倾向于尝试 snowpack。
