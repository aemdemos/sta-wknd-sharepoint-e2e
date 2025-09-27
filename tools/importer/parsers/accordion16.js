/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child elements of a node
  function getDirectChildren(parent) {
    return Array.from(parent.children);
  }

  // Find the main contentfragment article (where the surf spots content lives)
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;

  // Get the main content container inside the contentfragment
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll build accordion items from each surf spot section
  // Each section starts with an h2 (spot name), followed by images and paragraphs
  const children = getDirectChildren(cfElements);

  // Build the rows for the accordion
  const rows = [];

  // Header row
  const headerRow = ['Accordion (accordion16)'];
  rows.push(headerRow);

  // Find the intro section before the first h2
  let idx = 0;
  let introContent = [];
  while (idx < children.length && children[idx].tagName !== 'H2') {
    introContent.push(children[idx]);
    idx++;
  }
  if (introContent.length) {
    rows.push([
      'Introduction',
      introContent
    ]);
  }

  // Now, parse each surf spot section as its own row
  while (idx < children.length) {
    // Each section starts with an h2
    const h2 = children[idx];
    if (h2.tagName !== 'H2') {
      idx++;
      continue;
    }
    const title = h2.textContent.trim();
    idx++;

    // Gather all content until the next h2 or end
    const sectionContent = [];
    while (idx < children.length && children[idx].tagName !== 'H2') {
      sectionContent.push(children[idx]);
      idx++;
    }
    // Defensive: skip empty sections
    if (sectionContent.length === 0) continue;
    rows.push([
      title,
      sectionContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
