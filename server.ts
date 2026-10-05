import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // 1. Search Suggestions API (Google / DuckDuckGo)
  app.get('/api/search-suggest', async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        return res.json({ suggestions: [] });
      }

      const response = await fetch(
        `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          },
        }
      );

      if (!response.ok) {
        return res.json({ suggestions: [] });
      }

      const data = await response.json();
      const suggestions = Array.isArray(data[1]) ? data[1].slice(0, 7) : [];
      return res.json({ suggestions });
    } catch {
      return res.json({ suggestions: [] });
    }
  });

  // 1.5 Real Web Search Engine API
  app.get('/api/search', async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        return res.json({ query: '', results: [], aiOverview: '' });
      }

      const response = await fetch(
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          },
        }
      );

      if (!response.ok) {
        return res.json({ query, results: [], aiOverview: '' });
      }

      const html = await response.text();
      const results: Array<{ title: string; url: string; snippet: string; domain: string }> = [];

      const blocks = html.split('<div class="result results_links');
      for (let i = 1; i < blocks.length && results.length < 12; i++) {
        const block = blocks[i];
        const linkMatch = block.match(/class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
        const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);

        if (linkMatch) {
          const rawHref = linkMatch[1];
          const uddg = rawHref.match(/uddg=([^&]+)/);
          const url = uddg ? decodeURIComponent(uddg[1]) : rawHref;
          const title = linkMatch[2].replace(/<[^>]+>/g, '').trim();
          const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';

          let domain = '';
          try {
            domain = new URL(url).hostname;
          } catch {
            domain = url;
          }

          if (title && url.startsWith('http')) {
            results.push({ title, url, snippet, domain });
          }
        }
      }

      // Generate AI Overview summary from the top web results
      let aiOverview = '';
      if (results.length > 0) {
        const topSnippets = results.slice(0, 3).map((r) => r.snippet).filter(Boolean).join(' ');
        aiOverview = topSnippets.length > 50
          ? topSnippets
          : `Informações e principais links sobre "${query}". Os resultados mais relevantes incluem páginas oficiais, portais de atendimento e referências atualizadas.`;
      }

      return res.json({ query, results, aiOverview });
    } catch (err) {
      console.error('Search error:', err);
      return res.json({ query: req.query.q || '', results: [], aiOverview: '' });
    }
  });

  // 2. High-Performance Web Browser Proxy API
  app.get('/api/proxy', async (req: Request, res: Response) => {
    try {
      let targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).send('URL não especificada.');
      }

      targetUrl = targetUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }

      // If it's Google, ensure igu=1 is active for official iframe compatibility
      if (targetUrl.includes('google.com')) {
        if (targetUrl.includes('/search')) {
          if (!targetUrl.includes('igu=1')) {
            targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'igu=1';
          }
        } else if (
          targetUrl === 'https://www.google.com' || 
          targetUrl === 'https://www.google.com/' || 
          targetUrl === 'http://www.google.com' ||
          targetUrl === 'http://www.google.com/'
        ) {
          targetUrl = 'https://www.google.com/webhp?igu=1';
        }
      }

      const parsedUrl = new URL(targetUrl);
      const isGoogle = parsedUrl.hostname.includes('google.com');

      const headers: Record<string, string> = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      };

      if (isGoogle) {
        headers['Cookie'] =
          'CONSENT=YES+cb.20210720-07-p0.pt+FX+999; SOCS=CAESHAgBEhJnd3NfMjAyMzA3MTAtMF9SQzIaAnB0IAEaBgiA_LmmBg; 1P_JAR=2026-10-03-12';
      }

      // Fetch the requested webpage with a strict 6-second timeout
      const response = await fetch(targetUrl, {
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(6000),
      });

      const contentType = response.headers.get('content-type') || 'text/html';
      const finalUrl = response.url || targetUrl;

      // Remove headers that forbid iframing in browsers
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.removeHeader('X-Content-Security-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');
      res.removeHeader('Cross-Origin-Opener-Policy');

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

      if (contentType.includes('text/html')) {
        let html = await response.text();

        // Strip any inline CSP meta tags from the HTML
        html = html.replace(
          /<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi,
          ''
        );

        // Neutralize frame-busting scripts
        html = html.replace(/if\s*\(\s*(?:window\.)?top\s*!==?\s*(?:window\.)?self\s*\)/g, 'if(false)');
        html = html.replace(/(?:window\.)?top\.location\s*=/g, 'window.location=');

        // Inject script and base tag
        const scriptToInject = `
          <base href="${finalUrl}">
          <script>
            (function() {
              // Post navigation message to parent CertoFlow browser
              function notifyParent(type, payload) {
                try {
                  window.parent.postMessage(Object.assign({ type: type }, payload), '*');
                } catch(e) {}
              }

              // Intercept all link clicks and decode redirect URLs
              document.addEventListener('click', function(e) {
                var target = e.target.closest('a');
                if (!target || !target.href || target.href.startsWith('javascript:')) return;

                var href = target.href;

                // Handle Google redirect wrappers (/url?q=... or /url?url=...)
                if (href.indexOf('/url?') !== -1 || href.indexOf('google.com/url?') !== -1) {
                  try {
                    var u = new URL(href);
                    var q = u.searchParams.get('q') || u.searchParams.get('url');
                    if (q && /^https?:\\/\\//i.test(q)) {
                      href = q;
                    }
                  } catch(err) {}
                }

                e.preventDefault();
                e.stopPropagation();

                notifyParent('CERTOFLOW_NAVIGATE', { url: href });
                window.location.href = '/api/proxy?url=' + encodeURIComponent(href);
              }, true);

              // Intercept form submissions (e.g. search boxes)
              document.addEventListener('submit', function(e) {
                var form = e.target;
                if (form && form.action) {
                  var method = (form.method || 'GET').toUpperCase();
                  if (method === 'GET') {
                    e.preventDefault();
                    e.stopPropagation();
                    var formData = new FormData(form);
                    var params = new URLSearchParams(formData).toString();
                    var actionUrl = form.action;
                    var finalTarget = actionUrl + (actionUrl.indexOf('?') !== -1 ? '&' : '?') + params;
                    notifyParent('CERTOFLOW_NAVIGATE', { url: finalTarget });
                    window.location.href = '/api/proxy?url=' + encodeURIComponent(finalTarget);
                  }
                }
              }, true);

              // Force all target="_blank" links to stay inside the browser
              document.addEventListener('DOMContentLoaded', function() {
                var links = document.querySelectorAll('a[target="_blank"]');
                for (var i = 0; i < links.length; i++) {
                  links[i].setAttribute('target', '_self');
                }
              });

              // Report title and URL on load
              window.addEventListener('DOMContentLoaded', function() {
                notifyParent('CERTOFLOW_PAGE_LOADED', {
                  title: document.title || "${parsedUrl.hostname}",
                  url: "${finalUrl}"
                });
              });

              window.addEventListener('load', function() {
                notifyParent('CERTOFLOW_PAGE_LOADED', {
                  title: document.title || "${parsedUrl.hostname}",
                  url: "${finalUrl}"
                });
              });
            })();
          </script>
        `;

        if (html.includes('<head>')) {
          html = html.replace('<head>', '<head>' + scriptToInject);
        } else if (html.includes('<html>')) {
          html = html.replace('<html>', '<html><head>' + scriptToInject + '</head>');
        } else {
          html = scriptToInject + html;
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      } else {
        // Stream non-HTML responses (CSS, JS, images, fonts)
        res.setHeader('Content-Type', contentType);
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    } catch (err: any) {
      console.error('Proxy error:', err);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(502).send(`
        <div style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; color: #1F1F1F; background: #FAF9F6; min-height: 100vh;">
          <div style="max-width: 480px; margin: 60px auto; background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E8EAED;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #EDF4FF; color: #0066FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-weight: bold; font-size: 20px;">!</div>
            <h2 style="margin: 0 0 8px; font-size: 18px; color: #1F1F1F;">Não foi possível carregar a página</h2>
            <p style="color: #64748B; font-size: 13px; line-height: 1.5; margin: 0 0 20px;">O endereço solicitado não respondeu ou recusou a conexão direta.</p>
            <a href="${req.query.url}" target="_blank" rel="noreferrer" style="display: inline-block; background: #0066FF; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">Abrir em Nova Aba</a>
          </div>
        </div>
      `);
    }
  });

  // Endpoint to serve version.json
  app.get('/version.json', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'public', 'version.json'));
  });

  // 3. Vite middleware (dev) or Static build (prod)
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CertoFlow Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
