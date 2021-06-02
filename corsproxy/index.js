addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url);

    if (url.pathname === "/")
      return new Response(`
        Usage:\n
          ${url.origin}/<url>
      `);
    
    let params = request.url.slice(url.origin.length + 1).split('|');

    const newUrl = params[0];
    let cookies = ''
    if (params.length == 2) {
      cookies = params[1];
    }
    request = new Request(newUrl, request)
    request.headers.set("Origin", new URL(newUrl).origin)
    request.headers.set('Referer', newUrl)
    request.headers.set('Cookie', cookies)
    let response = await fetch(request);
    
    response = new Response(response.body, response);
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Expose-Headers', '*')
    response.headers.set('Access-Control-Allow-Headers', '*')

    return response;
  } catch (e) {
    return new Response(e.stack || e, {status: 500});
  }
}