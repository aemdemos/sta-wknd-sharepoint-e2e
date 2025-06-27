/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search block container (search column)
  const searchContainer = element.querySelector('.cmp-search--header');
  if (!searchContainer) return;

  // Find the search <section>
  const searchSection = searchContainer.querySelector('section.cmp-search');
  if (!searchSection) return;

  // Find the form with the action attribute
  const form = searchSection.querySelector('form');
  if (!form) return;

  const action = form.getAttribute('action');
  if (!action) return;

  // Resolve the action to an absolute URL, as in the markdown example output
  let absActionUrl;
  try {
    absActionUrl = new URL(action, document.baseURI || document.location).href;
  } catch (e) {
    absActionUrl = action;
  }

  // Create the block table according to the example structure
  // First row: header exactly 'Search', one column
  // Second row: the absolute URL as a clickable link (as in the example)
  const link = document.createElement('a');
  link.href = absActionUrl;
  link.textContent = absActionUrl;

  const cells = [
    ['Search'],
    [link],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
