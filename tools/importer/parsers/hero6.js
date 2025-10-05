/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero6)'];

  // --- IMAGE ROW ---
  let imageEl = null;
  const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- CONTENT ROW ---
  // The third row should contain: Title (heading), Subheading (optional), CTA (optional) all in a single cell
  const contentCell = [];
  const teaserContentDiv = teaser.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    // Title
    const titleEl = teaserContentDiv.querySelector('h2, h1, h3, h4, h5, h6');
    if (titleEl) contentCell.push(titleEl);
    // Subheading: look for p elements after the heading
    const ps = teaserContentDiv.querySelectorAll('p');
    ps.forEach((p) => {
      if (p.textContent.trim()) contentCell.push(p);
    });
    // CTA: look for a link
    const cta = teaserContentDiv.querySelector('a');
    if (cta) contentCell.push(cta);
  }
  // Always include the content row, even if empty
  const contentRow = [contentCell.length ? contentCell : ''];

  // --- TABLE ASSEMBLY ---
  // Ensure table always has 3 rows (header, image, content)
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
