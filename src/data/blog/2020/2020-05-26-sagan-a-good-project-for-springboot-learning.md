---
title: "spring官网推荐的学习项目sagan"
description: "spring官网推荐的学习项目sagan"
pubDatetime: 2020-05-26T12:00:00.000Z
tags: ["springboot", "java"]
categories: ["work"]
series: ["研究"]
---

spring 系框架如 spring， springboot， springcloud 等已成为 java 开发的标配，笔者也是 spring 系框架的多年用户，它们遵循统一的原则，原理清晰，实现优雅， 更新及时，很多最佳实践慢慢都沉淀为规则，为广大 javaer 提供了很多开箱即用的便利，大大降低开发成本。

官方网站一般是学习和查阅某种技术资料的首选, spring 也不例外. 前段时间，我惊喜的发现它们的[官方网站](https://spring.io) 改版了，
风格更加清爽轻量，访问速度更快，布局更加条理找文档更加方便了。在这个前端框架层出不穷的年代，我有点好奇 spring 的官网前端和后端分别是用
啥做的， 又有啥亮点呢？ 我们来一探究竟。

> 首页截图

分析网站技术架构有一个不错的工具 [wappalyzer](https://wappalyzer.com), 不过我们这里用不到，因为他家[官网源码](https://github.com/spring-io/sagan)是开源的。
把源码 clone 下来，README 上面一开始就写着:

> In addition to the practical purpose of powering Spring's home on the web, this project is designed to serve as a reference application--
resource that developers can use to see how the Spring team have used Spring to implement a real-world app with a few interesting requirements. We hope you'll find it useful!

有趣，这个项目是**官方推荐的学习项目**，开发者可以把这个项目作为一个参考项目,从这个项目学到 spring 团队怎么用 spring 来实现一个真实项目的。
生产环境即spring官网，需求明确，不算复杂也不会太简单，官方实现肯定代码质量也有保证，用来学习非常好。

```
--sagan
  |-- sagan-client
  |-- sagan-renderer
  |-- sagan-site
```

这是一个gradle 多模块项目， 项目按功能划分到 3 个子模块。这是一个很好的实践，将项目代码按功能分成多个子模块。

### sagan-client
这是前端模块，该模块使用 [node.js and npm](http://nodejs.org) 和 [Webpack](https://webpack.js.org/) 进行编译, 包含所有 web 端的资源:

* JavaScript 模块和依赖
* CSS 样式
* 图片和字体

这个模块有2个有趣的点，我可以学习这种前后端分离的方式:
*  一是它用 gradle 调用 npm 编译前端，也就是说前端也集成到 gradle 里面
* 二是它并没有用到 react， vue 等前端框架。这是一个传统的 jquery 项目，但看代码仍然很清晰，而且速度很快(可直接在官网体验)

### sagan-renderer
这是渲染模块，简约而不简单，作用是将 markdown  asciidoc 等文档渲染成 html 。
这里我们看到了 springboot 一些经典的用法， 如
* 配置自动注入 ， yaml 中的配置可以自动注入到需要的类中，如 `RendererProperties`

* spring-boot-starter-hateoas 
HATEOAS 即 hypertext as the engine of application state, 超媒体即应用状态引擎，它是 Richardson 提出的 REST 成熟的模型中的第 4 层也就是最高一层。
它要求资源不但有链接信息， 还应该有可以执行的动作信息，这样客户端就可以动态发现所有它能执行的动作。
spring-boot-starter-hateoas  就是 HATEOAS 的一个实现, 该仓库有几处用了它，如 `GuideResource`。

* 远程调用
非微服务架构，也可以方便的使用远程调用，见 `GithubClient`. 在这里可以学到另一个很有用的方法-使用 springboot 短短几行代码下载 git 仓库:

```java
	/**
	 * Download a repository as a zipball
	 * @param organization the github organization name
	 * @param repository the repository name
	 * @return the zipball as raw bytes
	 */
	public byte[] downloadRepositoryAsZipball(String organization, String repository) {
		try {
			byte[] response = this.restTemplate.getForObject(REPO_ZIPBALL_PATH,
					byte[].class, organization, repository);
			return response;
		}
		catch (HttpClientErrorException ex) {
			throw new GithubResourceNotFoundException(organization, ex);
		}
	}
```

### sagan-renderer
这是核心模块，它获获取内容，渲染成 html，展示给前端。  
我们首先来看看它是怎么和 `sagan-client` 关联起来的。其实比较简单，将静态资源路径添加到 springboot 配置文件即可，如下:
```yaml
spring:
  profiles: standalone
  resources:
    static_locations:
      - file:${client.dir}/build/dist/
  devtools:
    restart:
      additional_paths:
        - ../sagan-client/build/dist/
      additional_exclude: "**/*.js,**/*.css"
```

然后它是怎么使用 `sagan-client` 服务的呢， 见 `SaganRendererClient`。此外可见项目并不是国内流行的 mybatis 而是 jpa， 经过 springboot-data-jpa 的加持，有很强的灵活性和可读性。再我的下一个项目，我可能也会试试 jpa。

```java
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByCategoryAndDraftFalse(PostCategory category, Pageable pageable);

    Page<Post> findByDraftTrue(Pageable pageRequest);

    @Query("select p from Post p where YEAR(p.publishAt) = ?1 and MONTH(p.publishAt) = ?2 and DAY(p.publishAt) = ?3")
    Page<Post> findByDate(int year, int month, int day, Pageable pageRequest);
}
```

最后， sagan-renderer 是一个常规的 mvc 项目，视图层使用 thymeleaf, 将结果返回给浏览器。这样，整个流程就完成了。

最后，我们来总结一下，这个项目可以学到什么.

* gradle 多模块项目，包括和 npm 等前端的整合
* springboot mvc 开发， 包括多环境支持， jpa，cache， 远程调用，thymeleaf 等
* 其他最佳实践，如代码规范包括命名和注释，脚本， flyway管理数据库变化，第三方服务如github，cloudfoundry

感谢您的阅读。

