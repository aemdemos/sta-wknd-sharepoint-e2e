/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section in the element
  const searchSection = element.querySelector('.cmp-search');
  if (!searchSection) return;

  // Find the search form and its action attribute
  const form = searchSection.querySelector('form[action]');
  let url = '';
  if (form && form.getAttribute('action')) {
    url = form.getAttribute('action');
    // Make sure URL is absolute
    if (url.startsWith('/')) {
      let base = '';
      // Use document.location.origin if available and not 'null', else fallback
      if (
        document.location &&
        typeof document.location.origin === 'string' &&
        document.location.origin.startsWith('http')
      ) {
        base = document.location.origin;
      } else {
        // Fallback to a plausible default base, or just use 'https://' to ensure absolute
        base = 'https://';
        // Optionally, try to get host if present
        if (document.location && document.location.host) {
          base += document.location.host;
        } else {
          // Final fallback, just use 'https://example.com'
          base = 'https://example.com';
        }
      }
      url = base + url;
    }
  }
  // If still no url, fallback to empty string

  // Create an anchor for the url
  const a = document.createElement('a');
  a.href = url;
  a.textContent = url;

  // Table structure: header and then url
  const cells = [
    ['Search (search2)'],
    [a]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
