---
layout: post
title: "trouble shooting rake preview"
date: 2013-03-05 23:27
comments: true
categories: 
---

When i cloned one repo to my local disk and try to `rake clean-> rake install[theme-name]-->rake preview`,
I encountered the issue 'Could not find... Run bundle install to install missing gems',   
so i run `bundle install` in the octopress directory, try to run `rake -T` to show the command rake related after bundle install 
 <!-- more -->
is completed,then i encountered: 'rake aborted  You have already activated rake 0.9.2.2, but your Gemfile requires rake 0.9.2. 
Using bundle exec may solve this.'
It seems the version of rake is conflict. i executed below steps to slove this issue:

`$ gem list`   (to show all the gems and their version installed(will see more than one versions for rake)), and i got:
```
*** LOCAL GEMS ***
...
rake (0.9.2.2, 0.8.7)
here it is...
```

`$ gem uninstall rake`  (since the version conflict, need to uninstall one version)
```
Select gem to uninstall:
 1. rake-0.8.7
 2. rake-0.9.2.2
 3. All versions
```
and i type into: `2`     (select the version you want to uninstall, it depends the rake verison your Gemfile requires)
```
You have requested to uninstall the gem: rake-0.9.2.2
addressable-2.2.6 depends on [rake (>= 0.7.3)]
...
If you remove this gems, one or more dependencies will not be met.
Continue with Uninstall? [Yn]  Y
Successfully uninstalled rake-0.9.2.2
INFO:  gem "0.9.2.2" is not installed
```
Now i can preview the installed `theme` happily...
