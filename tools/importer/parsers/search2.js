/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section or div containing the search form
  let searchSection = element.querySelector('section.cmp-search');
  if (!searchSection) {
    searchSection = element.querySelector('.cmp-search');
  }

  // Extract all relevant content (visible text, structure) from the search block
  let content = [];
  if (searchSection) {
    // Collect all non-empty nodes
    content = Array.from(searchSection.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      // ignore empty elements
      if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length === 0) {
        return false;
      }
      return true;
    });
  }

  // Attempt to extract the query index url for the second row
  let queryIndexUrl = '';
  if (searchSection) {
    const form = searchSection.querySelector('form[action]');
    if (form) {
      const action = form.getAttribute('action');
      if (action) {
        const searchSuffix = '.searchresults.json';
        const idx = action.indexOf(searchSuffix);
        if (idx !== -1) {
          let pathPart = action.substring(0, idx);
          if (pathPart.endsWith('/')) {
            pathPart = pathPart.substring(0, pathPart.length - 1);
          }
          queryIndexUrl = `https://main--helix-block-collection--adobe.hlx.page${pathPart}/query-index.json`;
        }
      }
    }
  }

  // Fallback: if no search section or no content, use the main element's child nodes
  if (content.length === 0) {
    content = Array.from(element.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length === 0) {
        return false;
      }
      return true;
    });
  }

  // Compose the content for the table's second row
  // If queryIndexUrl is found, match the example output and use it as a clickable link
  let rowContent;
  if (queryIndexUrl) {
    const a = document.createElement('a');
    a.href = queryIndexUrl;
    a.textContent = queryIndexUrl;
    rowContent = [a];
  } else {
    // Otherwise, include all visible content
    rowContent = content;
  }

  // Create the table as per the example
  const cells = [
    ['Search'],
    [rowContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
