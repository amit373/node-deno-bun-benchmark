// Optimized Swagger UI HTML - minified and cached
let cachedSwaggerHTML: string | null = null;

export function getSwaggerHTML(): string {
  if (cachedSwaggerHTML) {
    return cachedSwaggerHTML;
  }

  cachedSwaggerHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Student API - Deno</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"><style>.topbar{display:none}body{margin:0;padding:0}</style></head><body><div id="swagger-ui"></div><script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script><script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script><script>window.onload=function(){SwaggerUIBundle({url:'/api-docs.json',dom_id:'#swagger-ui',deepLinking:true,presets:[SwaggerUIBundle.presets.apis,SwaggerUIStandalonePreset],layout:"StandaloneLayout"})}</script></body></html>`;

  return cachedSwaggerHTML;
}
