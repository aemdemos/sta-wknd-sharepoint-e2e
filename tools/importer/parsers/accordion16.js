/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;
  // Find the main content container (holds all h2s, images, paragraphs)
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements > div:last-of-type');
  if (!elementsRoot) return;

  // Compose the table rows
  const headerRow = ['Accordion (accordion16)'];
  const rows = [headerRow];

  // Helper: collect nodes until next h2 or end
  function collectContent(startIdx, children) {
    const contentNodes = [];
    let i = startIdx;
    while (i < children.length && !(children[i].tagName === 'H2')) {
      // Only include elements with visible content
      if (
        (children[i].nodeType === 1 && children[i].tagName === 'DIV' && children[i].querySelector('img')) ||
        children[i].tagName === 'P'
      ) {
        contentNodes.push(children[i].cloneNode(true));
      }
      i++;
    }
    return [contentNodes, i];
  }

  // First accordion item: intro (no h2, just paragraph + image)
  const children = Array.from(elementsRoot.childNodes);
  let i = 0;
  let introContent = [];
  while (i < children.length && children[i].tagName !== 'H2') {
    if (
      (children[i].nodeType === 1 && children[i].tagName === 'DIV' && children[i].querySelector('img')) ||
      children[i].tagName === 'P'
    ) {
      introContent.push(children[i].cloneNode(true));
    }
    i++;
  }
  if (introContent.length) {
    // Compose intro title and content
    const mainTitle = element.querySelector('.cmp-title h1');
    const authorTitle = element.querySelector('.cmp-title h4');
    const introTitle = document.createElement('div');
    if (mainTitle) introTitle.appendChild(mainTitle.cloneNode(true));
    if (authorTitle) introTitle.appendChild(authorTitle.cloneNode(true));
    rows.push([
      introTitle,
      introContent
    ]);
  }

  // Now extract all h2 sections as accordion items
  while (i < children.length) {
    // Find next h2
    while (i < children.length && children[i].tagName !== 'H2') i++;
    if (i >= children.length) break;
    const titleEl = children[i].cloneNode(true);
    i++;
    // Collect content for this accordion item
    const [contentNodes, nextIdx] = collectContent(i, children);
    if (titleEl && contentNodes.length) {
      rows.push([
        titleEl,
        contentNodes
      ]);
    }
    i = nextIdx;
  }

  // Only output table if there are accordion items
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
