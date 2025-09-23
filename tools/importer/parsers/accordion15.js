/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment area
  const contentFragment = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Build rows: header, then [title, content] for each accordion item
  const rows = [];
  const headerRow = ['Accordion (accordion15)'];
  rows.push(headerRow);

  // Parse children in order
  const children = Array.from(cfElements.children);
  let i = 0;

  // Gather intro content before first h2
  const introContent = [];
  while (i < children.length && children[i].tagName.toLowerCase() !== 'h2') {
    if (children[i].tagName.toLowerCase() === 'p') {
      introContent.push(children[i]);
    } else if (children[i].tagName.toLowerCase() === 'div') {
      const img = children[i].querySelector('img');
      if (img) introContent.push(children[i]);
    }
    i++;
  }
  if (introContent.length) {
    rows.push([
      'Introduction',
      introContent.length === 1 ? introContent[0] : introContent
    ]);
  }

  // For each h2, collect title and content until next h2
  while (i < children.length) {
    if (children[i].tagName.toLowerCase() === 'h2') {
      const title = children[i].textContent.trim();
      i++;
      const content = [];
      // Collect content until next h2
      while (i < children.length && children[i].tagName.toLowerCase() !== 'h2') {
        if (children[i].tagName.toLowerCase() === 'p') {
          content.push(children[i]);
        } else if (children[i].tagName.toLowerCase() === 'div') {
          const img = children[i].querySelector('img');
          if (img) content.push(children[i]);
        }
        i++;
      }
      rows.push([
        title,
        content.length === 1 ? content[0] : content
      ]);
    } else {
      i++;
    }
  }

  // Remove the intro row if it contains all the content (bad split)
  if (
    rows.length === 2 &&
    Array.isArray(rows[1]) &&
    rows[1][1] && Array.isArray(rows[1][1]) &&
    rows[1][1].some(
      node => node.tagName && node.tagName.toLowerCase() === 'h2'
    )
  ) {
    // If intro row contains an h2, it's a bad split; remove intro row
    rows.splice(1, 1);
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
