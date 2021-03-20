---
layout: post
title: "highlight the current navigation"
date: 2013-03-18 23:05
comments: true
categories: 
---

Why do we need highlight the current navigation? Best pratice suggests that we should always indicate   
links to the page the user is currently on. It's a very common and reasonable request when we involved in the UI development.
<!--more-->
Ok, the important point is how to highlight the current navigation. I got many answers after i googled and  
i plan to share the most efficient and easy to implement solution.
This solution uses JavaScript to match the URL of the current  
page to the URL of the link. The JavaScript simply gets the URL of the current page, then it looks through all the links in the navigation  
menu you target. If the link href matches the url of the page, it adds an extra CSS class to that link. Here the `current` is.

The html code is like below:
```
<ul id="nav">
	<li><a href="index.html">主页</a></li>
	<li><a href="column.html">栏目</a></li>
</ul>
```
And javascript code is like below:
```
<script type="text/javascript">
	var nav = document.getElementById("nav");
	var links = document.getElementsByTagName("li");
	var lilen = document.getElementsByTagName("a");
	var currenturl = document.location.href;
	var last = 0;
	for (var i=0; i<links.length; i++)
	{
		var linkurl = lilen[i].getAttribute("href");
		if(currenturl.indexOf(linkurl)!=-1)
		{
			last = i-1;
		}
	}
	links[last].className = "current";
</script>

```
That's it! You just highlight the current navigation! Congratulations~