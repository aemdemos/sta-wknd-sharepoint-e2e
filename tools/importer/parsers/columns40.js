/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image element for the left column
  const imageDiv = element.querySelector('.cmp-teaser__image');
  const imgEl = imageDiv ? imageDiv.querySelector('img') : null;

  // Find the content for the right column
  const contentDiv = element.querySelector('.cmp-teaser__content');
  let rightCol = document.createElement('div');
  if (contentDiv) {
    // Featured Article (pretitle)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) rightCol.appendChild(pretitle.cloneNode(true));
    // Title
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) rightCol.appendChild(title.cloneNode(true));
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) rightCol.appendChild(desc.cloneNode(true));
    // CTA button
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Preserve original button label casing
      const btn = document.createElement('a');
      btn.href = cta.href;
      btn.textContent = cta.textContent;
      btn.setAttribute('style', 'display:inline-block;background:#ffe500;color:#202020;padding:8px 16px;font-weight:bold;text-align:center;text-decoration:none;');
      rightCol.appendChild(btn);
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns40)'];
  const contentRow = [imgEl, rightCol];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
