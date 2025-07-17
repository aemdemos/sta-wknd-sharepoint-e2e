/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-search block (either with cmp-search--header or cmp-search)
  let searchRoot = element.querySelector('.cmp-search--header') || element.querySelector('.cmp-search');
  if (!searchRoot) {
    // Fallback: look for any descendant with class containing 'cmp-search'
    searchRoot = element.querySelector('[class*="cmp-search"]');
  }
  if (!searchRoot) return;

  // Extract the search endpoint as an absolute URL
  let indexUrl = '';
  const form = searchRoot.querySelector('form');
  if (form && form.action) {
    let action = form.getAttribute('action') || '';
    const idx = action.indexOf('.searchresults.json');
    if (idx !== -1) {
      let pre = action.substring(0, idx);
      if (pre.endsWith('/')) pre = pre.slice(0, -1);
      indexUrl = pre + '/query-index.json';
    } else {
      indexUrl = action;
    }
    // Make absolute URL if relative
    if (indexUrl && !/^https?:\/\//.test(indexUrl)) {
      let { protocol, host } = document.location;
      indexUrl = protocol + '//' + host + indexUrl;
    }
  }

  // Compose the content for the block cell
  // Collect all *visible* text content and controls from the search block
  const blockContent = [];
  // Include visible label text (e.g., placeholder text)
  const input = searchRoot.querySelector('input[type="text"], input[type="search"]');
  if (input && input.placeholder) {
    // Create an element to hold the placeholder text as it appears visually in the screenshot
    const span = document.createElement('span');
    span.textContent = input.placeholder;
    blockContent.push(span);
  }
  // Fallback: if searchRoot contains any visible text outside the input, include it
  const textNodes = [];
  function walk(node) {
    node.childNodes && node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const txt = child.textContent.trim();
        if (txt) textNodes.push(txt);
      } else if (child.nodeType === Node.ELEMENT_NODE && child !== input) {
        walk(child);
      }
    });
  }
  walk(searchRoot);
  // Only add non-duplicate text
  textNodes.forEach(txt => {
    if (!blockContent.some(el => el.textContent === txt)) {
      const t = document.createElement('span');
      t.textContent = txt;
      blockContent.push(t);
    }
  });

  // Always add the query index link (per spec, always one cell as in markdown example)
  if (indexUrl) {
    const link = document.createElement('a');
    link.href = indexUrl;
    link.textContent = indexUrl;
    blockContent.push(link);
  }

  // If no content, just add empty string
  if (blockContent.length === 0) {
    blockContent.push('');
  }

  // Compose block table: header is exactly 'Search'
  const headerRow = ['Search'];
  const dataRow = [blockContent];
  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
