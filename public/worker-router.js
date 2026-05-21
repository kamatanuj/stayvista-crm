// Simple Router for Cloudflare Worker
export class Router {
  constructor() {
    this.routes = new Map();
  }
  
  get(path, handler) {
    this.routes.set(`GET:${path}`, handler);
  }
  
  post(path, handler) {
    this.routes.set(`POST:${path}`, handler);
  }
  
  async handle(request, env) {
    const url = new URL(request.url);
    const key = `${request.method}:${url.pathname}`;
    const handler = this.routes.get(key);
    
    if (handler) {
      return await handler(request, env);
    }
    
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
}
