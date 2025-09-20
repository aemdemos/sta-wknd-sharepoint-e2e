/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment
  const cf = element.querySelector('.cmp-contentfragment__elements');
  if (!cf) return;

  // Helper: get all h2.cmp-title__text in order
  const h2s = Array.from(cf.querySelectorAll('h2.cmp-title__text'));

  // Compose rows
  const rows = [];
  const headerRow = ['Accordion (accordion38)']; // Only one column in header row
  rows.push(headerRow);

  // --- Introduction (everything before first h2) ---
  let introNodes = [];
  let foundFirstH2 = false;
  for (const child of cf.children) {
    if (!foundFirstH2 && child.querySelector && child.querySelector('h2.cmp-title__text')) {
      foundFirstH2 = true;
    }
    if (!foundFirstH2) {
      if (child.classList && child.classList.contains('aem-Grid')) {
        for (const gridChild of Array.from(child.children)) {
          if (isContent(gridChild)) {
            introNodes.push(cleanContent(gridChild, document));
          }
        }
      } else if (isContent(child)) {
        introNodes.push(cleanContent(child, document));
      }
    }
  }
  if (introNodes.length) {
    rows.push(['Introduction', introNodes]);
  }

  // --- Accordion items for each h2 ---
  for (let i = 0; i < h2s.length; i++) {
    const h2 = h2s[i];
    const title = h2.textContent.trim();
    let h2Col = h2.closest('.aem-GridColumn');
    if (!h2Col) h2Col = h2.parentElement;
    let contentEls = [];
    let node = h2Col.nextElementSibling;
    while (node && !(node.querySelector && node.querySelector('h2.cmp-title__text'))) {
      if (node.classList && node.classList.contains('aem-Grid')) {
        for (const gridChild of Array.from(node.children)) {
          if (isContent(gridChild)) {
            contentEls.push(cleanContent(gridChild, document));
          }
        }
      } else if (isContent(node)) {
        contentEls.push(cleanContent(node, document));
      }
      node = node.nextElementSibling;
    }
    if (contentEls.length) {
      rows.push([title, contentEls]);
    }
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);

  // --- Helpers ---
  function isContent(el) {
    if (!el) return false;
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
    if (el.textContent && el.textContent.trim()) return true;
    if (el.querySelector && el.querySelector('img')) return true;
    return false;
  }
  function cleanContent(node, document) {
    if (node.tagName === 'IMG') {
      const img = document.createElement('img');
      img.src = node.src;
      img.alt = node.alt || '';
      img.title = node.title || '';
      return img;
    }
    const img = node.querySelector && node.querySelector('img');
    if (img) {
      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.alt = img.alt || '';
      imgClone.title = img.title || '';
      return imgClone;
    }
    if (/^(P|BLOCKQUOTE|H1|H2|H3|H4|H5|H6|U|B|I|EM|STRONG|SPAN|BR)$/.test(node.tagName)) {
      const clone = document.createElement(node.tagName);
      clone.innerHTML = node.innerHTML;
      return clone;
    }
    const blockquote = node.querySelector && node.querySelector('blockquote');
    if (blockquote) {
      const bq = document.createElement('blockquote');
      bq.innerHTML = blockquote.innerHTML;
      return bq;
    }
    const para = node.querySelector && node.querySelector('p');
    if (para) {
      const p = document.createElement('p');
      p.innerHTML = para.innerHTML;
      return p;
    }
    if (node.textContent && node.textContent.trim()) {
      return document.createTextNode(node.textContent.trim());
    }
    return null;
  }
}
