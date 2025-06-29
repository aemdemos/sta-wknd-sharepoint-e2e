/* global WebImporter */
export default function parse(element, { document }) {
  // Find the aem-Grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the search block (div whose class contains 'search')
  const searchDiv = Array.from(grid.children).find(child =>
    child.classList && Array.from(child.classList).some(cl => cl.includes('search'))
  );
  if (!searchDiv) return;

  // Find the section.cmp-search within the searchDiv
  const section = searchDiv.querySelector('section.cmp-search');
  if (!section) return;

  // Find the form to get the action (index url for search)
  const form = section.querySelector('form');
  if (!form) return;

  let absUrl = '';
  const action = form.getAttribute('action');
  if (action) {
    // If the action is already an absolute URL, use it
    try {
      const url = new URL(action, window.location.origin);
      if (url.origin !== window.location.origin) {
        absUrl = action;
      } else {
        absUrl = 'https://main--helix-block-collection--adobe.hlx.page' + action;
      }
    } catch (e) {
      // If action is relative, prepend base
      absUrl = 'https://main--helix-block-collection--adobe.hlx.page' + action;
    }
  }

  // Create the output table: header and url row
  const headerRow = ['Search'];
  // Output only the absolute URL in the content row, as per example
  const link = document.createElement('a');
  link.href = absUrl;
  link.textContent = absUrl;
  const cells = [headerRow, [link]];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
