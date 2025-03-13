/**
 * CoolHTML - Ultra-Minimal Component Framework
 * Build entire websites with minimal code
 * Developed by Megadeploy.com and Giannis Katsaros, 2025 All Rights Reserved
 * You can find me from here: katsarosgiannis1[at]gmail.com, linkedin.com/in/giannis-katsaros
 */

(function(global) {
  'use strict';

  class CoolHTML {
    constructor(opts = {}) {
      this.target = opts.target || document.body;
      this._loadAssets();
      this._initComponents();
    }

    // Load Bootstrap and icons
    _loadAssets() {
      if (!document.querySelector('link[href*="bootstrap"]')) {
        document.head.appendChild(Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        }));
        document.body.appendChild(Object.assign(document.createElement('script'), {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
        }));
        document.head.appendChild(Object.assign(document.createElement('meta'), {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }));
        document.head.appendChild(Object.assign(document.createElement('link'), {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css'
        }));
      }
    }

    // Create CSS from object
    css(obj, sel = '') {
      if (typeof obj === 'string') return obj;
      return Object.entries(obj).map(([k, v]) => {
        // Handle nested selectors
        if (typeof v === 'object') return this.css(v, sel ? `${sel} ${k}` : k);
        // Convert camelCase to kebab-case
        const prop = k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return sel ? `${sel} { ${prop}: ${v}; }` : `${prop}: ${v};`;
      }).join(' ');
    }

    // Add style to document
    style(css, id) {
      const elem = id && document.getElementById(id) || document.createElement('style');
      if (id && !elem.id) elem.id = id;
      elem.textContent = css;
      if (!elem.parentNode) document.head.appendChild(elem);
      return this;
    }

    // Parse text with markdown-like syntax
    text(str) {
      if (!str) return '';
      return str
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/~(.*?)~/g, '<del>$1</del>')
        .replace(/\-\-(.*?)\-\-/g, '<mark>$1</mark>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n\s*\n/g, '</p><p>')
        .replace(/^(?!<)/, '<p>')
        .replace(/(?!>)$/, '</p>');
    }

    // Get HTML for any content
    html(c) {
      if (!c) return '';
      if (typeof c === 'string') return this.text(c);
      if (Array.isArray(c)) return c.map(i => this.html(i)).join('');
      if (typeof c === 'object') {
        // Format based on content keys
        let content = '';
        if (c.t || c.title) content += `<h2>${c.t || c.title}</h2>`;
        if (c.st || c.subtitle) content += `<p class="lead">${c.st || c.subtitle}</p>`;
        if (c.img || c.image) content += `<img src="${c.img || c.image}" class="img-fluid" alt="${c.alt || ''}">`;
        if (c.txt || c.text) content += this.text(c.txt || c.text);
        if (c.btn || c.button) {
          const btn = c.btn || c.button;
          const txt = btn.txt || btn.text || 'Button';
          const cls = btn.cls || btn.class || 'primary';
          const url = btn.url || btn.href || '#';
          content += `<a href="${url}" class="btn btn-${cls}">${txt}</a>`;
        }
        return content || JSON.stringify(c);
      }
      return String(c);
    }

    // Render component to DOM
    render(content, target) {
      const container = target || this.target;
      if (typeof content === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = content.trim();
        Array.from(temp.childNodes).forEach(node => container.appendChild(node));
      } else if (content instanceof Node) {
        container.appendChild(content);
      }
      return this;
    }

    // Build site from config
    site(cfg = {}) {
      // Apply theme
      if (cfg.theme) {
        this.style(this.css({
          ':root': {
            '--bs-primary': cfg.theme.primary || '#0d6efd',
            '--bs-secondary': cfg.theme.secondary || '#6c757d',
            '--bs-header-bg': cfg.theme.header || cfg.theme.primary || '#0d6efd',
            '--bs-footer-bg': cfg.theme.footer || cfg.theme.primary || '#0d6efd'
          },
          '.navbar': { 'background-color': 'var(--bs-header-bg) !important' },
          '.footer, footer': { 'background-color': 'var(--bs-footer-bg) !important' },
          ...cfg.theme.css || {}
        }), 'coolhtml-theme');
      }

      // Build each section
      if (cfg.nav || cfg.navbar) this.nav(cfg.nav || cfg.navbar);
      if (cfg.hero) this.hero(cfg.hero);
      if (cfg.features) this.features(cfg.features);
      if (cfg.sections) {
        (Array.isArray(cfg.sections) ? cfg.sections : [cfg.sections])
          .forEach(s => this.section(s));
      }
      if (cfg.pricing) this.pricing(cfg.pricing);
      if (cfg.testimonials) this.testimonials(cfg.testimonials);
      if (cfg.contact) this.contact(cfg.contact);
      if (cfg.footer) this.footer(cfg.footer);

      return this;
    }

    // Initialize all component methods
    _initComponents() {
      // Navigation Bar
      this.nav = (opts = {}) => {
        if (typeof opts === 'string') opts = { title: opts };
        
        const title = opts.title || opts.t || 'CoolHTML';
        const logo = opts.logo ? `<img src="${opts.logo}" height="30" class="me-2">` : '';
        const dark = opts.dark !== false;
        const fixed = opts.fixed ? 'fixed-top' : '';
        const links = Array.isArray(opts.links) ? opts.links : [];
        
        let linksHtml = links.map(link => {
          if (typeof link === 'string') link = { text: link };
          return `<li class="nav-item">
            <a class="nav-link ${link.active ? 'active' : ''}" href="${link.url || '#'}">${link.text}</a>
          </li>`;
        }).join('');

        let btnHtml = '';
        if (opts.btn || opts.button) {
          const btn = opts.btn || opts.button;
          const type = btn.type || (dark ? 'light' : 'primary');
          const outline = btn.outline ? 'outline-' : '';
          btnHtml = `<div class="ms-auto">
            <a href="${btn.url || '#'}" class="btn btn-${outline}${type} my-2 my-lg-0">${btn.text || 'Button'}</a>
          </div>`;
        }

        return this.render(`
          <nav class="navbar navbar-expand-lg ${dark ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} ${fixed}">
            <div class="container">
              <a class="navbar-brand" href="#">${logo}${title}</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">${linksHtml}</ul>
                ${btnHtml}
              </div>
            </div>
          </nav>
        `);
      };

      // Hero Section
      this.hero = (opts = {}) => {
        if (typeof opts === 'string') opts = { title: opts };
        
        const title = opts.title || opts.t || '';
        const subtitle = opts.subtitle || opts.st || '';
        const align = opts.align || 'center';
        const dark = opts.dark !== false;
        const bg = opts.bg || opts.background || '';
        const buttons = opts.buttons || opts.btns || [];
        
        let style = '';
        if (bg) {
          style = bg.includes('#') || bg.includes('rgb') || bg.includes('gradient') ? 
            `background: ${bg};` : `background-image: url(${bg}); background-size: cover;`;
        }

        let btnHtml = '';
        if (buttons.length) {
          btnHtml = `<div class="mt-4">${buttons.map(btn => {
            const type = btn.type || 'primary';
            const outline = btn.outline ? 'outline-' : '';
            const size = btn.size ? `btn-${btn.size}` : '';
            return `<a href="${btn.url || '#'}" class="btn btn-${outline}${type} ${size} me-2">${btn.text}</a>`;
          }).join('')}</div>`;
        }

        return this.render(`
          <div class="py-5 text-${align} ${dark ? 'text-white' : ''}" style="${style}">
            <div class="container py-5">
              ${title ? `<h1 class="display-4">${title}</h1>` : ''}
              ${subtitle ? `<p class="lead">${subtitle}</p>` : ''}
              ${this.html(opts.content || opts.text || '')}
              ${btnHtml}
            </div>
          </div>
        `);
      };

      // Features Grid
      this.features = (opts = {}) => {
        if (typeof opts === 'string') opts = { title: opts };
        
        const items = opts.items || opts.list || [];
        const title = opts.title || opts.t || 'Features';
        const subtitle = opts.subtitle || opts.st || '';
        const cols = opts.cols || opts.columns || 3;
        const colWidth = 12 / Math.min(cols, 4);
        
        let featuresHtml = '';
        if (items.length) {
          featuresHtml = `<div class="row">${items.map(item => {
            if (typeof item === 'string') item = { title: item };
            
            let iconHtml = '';
            if (item.icon) {
              iconHtml = item.icon.startsWith('bi-') ? 
                `<i class="bi ${item.icon} fs-1 text-${item.iconColor || 'primary'} mb-3"></i>` :
                `<img src="${item.icon}" class="mb-3" style="height: 60px;">`;
            }
            
            return `
              <div class="col-md-${colWidth} col-sm-6 mb-4 text-center">
                <div class="p-3 h-100">
                  ${iconHtml}
                  <h3>${item.title || item.t || ''}</h3>
                  <p>${item.text || item.desc || ''}</p>
                </div>
              </div>
            `;
          }).join('')}</div>`;
        }

        return this.render(`
          <section class="py-5">
            <div class="container">
              <div class="text-center mb-5">
                <h2>${title}</h2>
                ${subtitle ? `<p class="lead">${subtitle}</p>` : ''}
              </div>
              ${featuresHtml}
            </div>
          </section>
        `);
      };

      // Generic Section
      this.section = (opts = {}) => {
        if (typeof opts === 'string') opts = { content: opts };
        
        const title = opts.title || opts.t || '';
        const subtitle = opts.subtitle || opts.st || '';
        const bg = opts.bg || opts.background || '';
        const dark = opts.dark === true;
        const id = opts.id || '';
        const align = opts.align || '';
        
        let style = '';
        if (bg) {
          style = bg.includes('#') || bg.includes('rgb') || bg.includes('gradient') ? 
            `background: ${bg};` : `background-image: url(${bg}); background-size: cover;`;
        }

        return this.render(`
          <section class="py-5 ${dark ? 'text-white' : ''}" id="${id}" style="${style}">
            <div class="container">
              ${title ? `<h2 class="text-center mb-4">${title}</h2>` : ''}
              ${subtitle ? `<p class="lead text-center mb-5">${subtitle}</p>` : ''}
              <div class="text-${align}">${this.html(opts.content || opts.text || '')}</div>
            </div>
          </section>
        `);
      };

      // Pricing Table
      this.pricing = (opts = {}) => {
        if (typeof opts === 'string') opts = { title: opts };
        
        const title = opts.title || opts.t || 'Pricing';
        const subtitle = opts.subtitle || opts.st || 'Choose your plan';
        const plans = opts.plans || opts.items || [];
        const bg = opts.bg || opts.background || '';
        
        let style = '';
        if (bg) {
          style = bg.includes('#') || bg.includes('rgb') ? 
            `background: ${bg};` : `background-image: url(${bg}); background-size: cover;`;
        }

        let plansHtml = '';
        if (plans.length) {
          plansHtml = `<div class="row">${plans.map(plan => {
            if (typeof plan === 'string') plan = { title: plan };
            
            const featured = plan.featured || plan.primary;
            const features = plan.features || [];
            
            return `
              <div class="col-lg-${Math.floor(12 / plans.length)} col-md-6 mb-4">
                <div class="card h-100 ${featured ? 'shadow border-primary' : ''}">
                  <div class="card-header text-center ${featured ? 'bg-primary text-white' : ''}">
                    <h4 class="my-0">${plan.title}</h4>
                  </div>
                  <div class="card-body text-center">
                    <h1 class="card-title">${plan.price || ''}<small class="text-muted fw-light">${plan.period || ''}</small></h1>
                    <ul class="list-unstyled mt-3 mb-4">
                      ${features.map(f => {
                        const included = f.included !== false;
                        return `<li class="${!included ? 'text-muted' : ''}">
                          <i class="bi bi-${included ? 'check text-success' : 'x text-muted'}"></i> 
                          ${typeof f === 'string' ? f : f.text}
                        </li>`;
                      }).join('')}
                    </ul>
                    <a href="${plan.url || '#'}" class="btn btn-${featured ? '' : 'outline-'}primary w-100">${plan.btn || 'Sign up'}</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}</div>`;
        }

        return this.render(`
          <section class="py-5" style="${style}">
            <div class="container">
              <div class="text-center mb-5">
                <h2>${title}</h2>
                <p class="lead">${subtitle}</p>
              </div>
              ${plansHtml}
            </div>
          </section>
        `);
      };

      // Testimonials
      this.testimonials = (opts = {}) => {
        if (typeof opts === 'string') opts = { title: opts };
        
        const title = opts.title || opts.t || 'Testimonials';
        const subtitle = opts.subtitle || opts.st || '';
        const items = opts.items || opts.list || [];
        const bg = opts.bg || opts.background || '';
        const type = opts.type || 'grid';
        
        let style = '';
        if (bg) {
          style = bg.includes('#') || bg.includes('rgb') ? 
            `background: ${bg};` : `background-image: url(${bg}); background-size: cover;`;
        }

        let content = '';
        if (items.length) {
          if (type === 'carousel') {
            const id = 'testimonial-' + Math.random().toString(36).substring(2, 9);
            content = `
              <div id="${id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  ${items.map((item, i) => `
                    <div class="carousel-item ${i === 0 ? 'active' : ''}">
                      <div class="d-flex flex-column align-items-center">
                        ${item.image ? `<img src="${item.image}" class="rounded-circle mb-3" width="80">` : ''}
                        <p class="lead text-center mb-3">"${item.text || item.quote || ''}"</p>
                        <h5>${item.name || item.author || ''}</h5>
                        <p class="text-muted">${item.title || item.role || ''}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
                  <span class="carousel-control-next-icon"></span>
                </button>
              </div>
            `;
          } else {
            content = `
              <div class="row">
                ${items.map(item => `
                  <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                      <div class="card-body">
                        <p class="card-text">"${item.text || item.quote || ''}"</p>
                        <div class="d-flex align-items-center mt-3">
                          ${item.image ? `<img src="${item.image}" class="rounded-circle me-3" width="50">` : ''}
                          <div>
                            <h5 class="mb-0">${item.name || item.author || ''}</h5>
                            <p class="text-muted mb-0">${item.title || item.role || ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
          }
        }

        return this.render(`
          <section class="py-5" style="${style}">
            <div class="container">
              <div class="text-center mb-5">
                <h2>${title}</h2>
                <p class="lead">${subtitle}</p>
              </div>
              ${content}
            </div>
          </section>
        `);
      };

      // Contact Form
      this.contact = (opts = {}) => {
        if (typeof opts === 'string') opts = { title: opts };
        
        const title = opts.title || opts.t || 'Contact Us';
        const subtitle = opts.subtitle || opts.st || '';
        const info = opts.info || {};
        const map = opts.map || '';
        
        let infoHtml = '';
        if (info.email || info.phone || info.address) {
          infoHtml = `
            <div class="mb-4">
              ${info.address ? `<p><i class="bi bi-geo-alt text-primary me-2"></i> ${info.address}</p>` : ''}
              ${info.email ? `<p><i class="bi bi-envelope text-primary me-2"></i> ${info.email}</p>` : ''}
              ${info.phone ? `<p><i class="bi bi-telephone text-primary me-2"></i> ${info.phone}</p>` : ''}
            </div>
          `;
        }

        return this.render(`
          <section class="py-5">
            <div class="container">
              <div class="text-center mb-5">
                <h2>${title}</h2>
                <p class="lead">${subtitle}</p>
              </div>
              <div class="row">
                <div class="col-lg-5 mb-4">
                  ${this.html(opts.text)}
                  ${infoHtml}
                </div>
                <div class="col-lg-7">
                  <form>
                    <div class="mb-3">
                      <label for="name" class="form-label">Name</label>
                      <input type="text" class="form-control" id="name" required>
                    </div>
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="mb-3">
                      <label for="message" class="form-label">Message</label>
                      <textarea class="form-control" id="message" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">${opts.btn || 'Send'}</button>
                  </form>
                </div>
              </div>
              ${map ? `
                <div class="mt-5">
                  <div class="ratio ratio-21x9">
                    <iframe src="${map}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                  </div>
                </div>
              ` : ''}
            </div>
          </section>
        `);
      };

      // Footer
      this.footer = (opts = {}) => {
        if (typeof opts === 'string') opts = { text: opts };
        
        const dark = opts.dark !== false;
        const links = opts.links || [];
        const social = opts.social || [];
        
        let linksHtml = '';
        if (links.length) {
          linksHtml = `
            <div class="col-md-4">
              <h5>Links</h5>
              <ul class="list-unstyled">
                ${links.map(link => {
                  if (typeof link === 'string') link = { text: link };
                  return `<li><a href="${link.url || '#'}" class="${dark ? 'text-white-50' : 'text-muted'}">${link.text}</a></li>`;
                }).join('')}
              </ul>
            </div>
          `;
        }

        let socialHtml = '';
        if (social.length) {
          socialHtml = `
            <div class="d-flex gap-3 mb-3">
              ${social.map(item => {
                if (typeof item === 'string') item = { icon: item };
                return `<a href="${item.url || '#'}" class="fs-5 ${dark ? 'text-white' : ''}" aria-label="${item.name || ''}">
                  <i class="bi bi-${item.icon}"></i>
                </a>`;
              }).join('')}
            </div>
          `;
        }

        return this.render(`
          <footer class="py-4 ${dark ? 'bg-dark text-white' : 'bg-light'}">
            <div class="container">
              <div class="row">
                <div class="col-md-${links.length ? '4' : '6'}">
                  <h5>${opts.title || ''}</h5>
                  <p class="${dark ? 'text-white-50' : 'text-muted'}">${opts.text || ''}</p>
                  ${socialHtml}
                </div>
                ${linksHtml}
                <div class="col-md-4">
                  ${opts.form ? `
                    <h5>${opts.form.title || 'Newsletter'}</h5>
                    <p class="${dark ? 'text-white-50' : 'text-muted'}">${opts.form.text || 'Subscribe for updates'}</p>
                    <div class="input-group mb-3">
                      <input type="email" class="form-control" placeholder="Email address">
                      <button class="btn btn-${dark ? 'light' : 'dark'}" type="button">${opts.form.btn || 'Subscribe'}</button>
                    </div>
                  ` : ''}
                </div>
              </div>
              <div class="text-center mt-4">
                <p class="mb-0">${opts.copyright || `© ${new Date().getFullYear()} All rights reserved`}</p>
              </div>
            </div>
          </footer>
        `);
      };
    }
  }

  // Export to global scope
  global.CoolHTML = CoolHTML;
  global.cool = opts => new CoolHTML(opts);

})(typeof window !== 'undefined' ? window : this);