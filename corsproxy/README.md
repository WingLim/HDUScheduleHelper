# Cloudflare Cors Worker

因为浏览器的跨域限制，无法使用 JavaScript 来直接请求教务网站，并获取课表。

所以通过 Cloudflare Worker 来实现一个中间代理。

## 请求格式

- `url` - 需要请求的网站

- `cookie` - 请求要携带的 Cookie

使用 `|` 分割 `url` 和 `cookie`
```
https://cors.lim.workers.dev/url|cookie
```
