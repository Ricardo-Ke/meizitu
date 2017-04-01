# meizitu
A simle script crawling pictures on http://jandan.net/ooxx

# Usage

```js
new Meizitu(options).start()
```

### options:
`baseUrl` [**required**] 目标网站

`dir` [**optional**] 下载图片到指定目录(相对路径)，默认**images**

`targetNum` [**optional**] 下载图片数量，可用命令行第一个参数指定，默认**20**

`selector` [**required**] 图片的选择器，比如`ol.commentlist li .text > p img`
