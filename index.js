const http = require('http')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const url = 'http://sports.sina.com.cn/g/premierleague/' //新浪英超新闻板块

http.get(url, res => {

    res.setEncoding('utf8')
    var html = ''
    res.on('data', chunk => {
        html += chunk
    })
    res.on('end', () => {

            $ = cheerio.load(html);
            $('.match_news_list a').each(function () {

                //获取每条新闻链接
                var postUrl = $(this).attr('href')
                http.get(postUrl, res => {
                    var htmlpost = ''
                    res.on('data', chunk => {
                        htmlpost += chunk
                    })
                    res.on('end', () => {

                        $ = cheerio.load(htmlpost);
                        // 获取新闻内容
                        var postContext = $('.article p').text()
                        //时间戳
                        var time = new Date().valueOf()
                        //将新闻数据写入post文件中
                        fs.writeFile(path.join(__dirname, './data/post' + time + '.txt'), postContext, function (err) {
                            if (err) return err.message
                        })

                    })
                })

            })
    }).on('error', (e) => {
        console.error(`出现错误: ${e.message}`);
    });

})