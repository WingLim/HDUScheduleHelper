let api = process.env.API
let url
if (api == 'remote') {
  url = "https://api.limxw.com/courses/query?"
} else {
  url = "http://127.0.0.1:8000/courses/query?"
}

export const apiUrl = url
export const corsUrl = 'https://cors.lim.workers.dev/'