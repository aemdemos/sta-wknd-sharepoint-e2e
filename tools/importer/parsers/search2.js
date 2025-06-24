/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-search section anywhere within the element
  const searchSection = element.querySelector('.cmp-search');
  if (!searchSection) return;

  // Find the search form and its action attribute for the query index URL
  const form = searchSection.querySelector('form');
  let queryIndexUrl = '';
  if (form && form.hasAttribute('action')) {
    let action = form.getAttribute('action');
    // Normalize to absolute URL if needed
    if (/^https?:\/\//.test(action)) {
      queryIndexUrl = action;
    } else {
      let base = document.baseURI || (document.location && document.location.href) || '';
      try {
        queryIndexUrl = new URL(action, base).href;
      } catch (e) {
        queryIndexUrl = action;
      }
    }
  }
  // As a fallback, if no URL is found, use the visible text content of the search field
  if (!queryIndexUrl) {
    // Try to get the placeholder or any other visible text
    const input = searchSection.querySelector('input[placeholder]');
    if (input) {
      queryIndexUrl = input.getAttribute('placeholder');
    } else {
      queryIndexUrl = searchSection.textContent.trim();
    }
  }

  // Build the table according to the spec
  const cells = [
    ['Search'],
    [queryIndexUrl]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
