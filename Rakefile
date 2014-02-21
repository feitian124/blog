require 'rubygems'
require 'chronic'

desc 'create new post with given title'
task :new, :title do |t, args|

  title = args[:title] || "New Title"
  title = title.strip.gsub(' ','-').downcase
  date = Time.new.strftime('%Y-%m-%d')

  filename = "#{date}-#{title}.md"
  target_dir = "_posts"

  path = File.join(target_dir, filename)

  post = <<-HTML
---
layout: post
title: "TITLE"
date: DATE
---

HTML

  post.gsub!('TITLE', title).gsub!('DATE', Time.new.to_s)
  File.open(path, 'w') do |file|
    file.puts post
  end
  puts "new post generated in #{path}"

end
