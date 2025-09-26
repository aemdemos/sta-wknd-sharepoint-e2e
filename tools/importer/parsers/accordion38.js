/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;
  const fragmentBody = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!fragmentBody) return;

  // Get main title
  const mainTitle = contentFragment.querySelector('.cmp-contentfragment__title');
  // Get author
  const author = element.querySelector('.title h4');

  // Collect all nodes in fragmentBody for flexible parsing
  const nodes = Array.from(fragmentBody.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);

  // Helper to get next element sibling in nodes array
  function nextElem(idx) {
    for (let i = idx + 1; i < nodes.length; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) return nodes[i];
    }
    return null;
  }

  // Compose accordion items
  const items = [];

  // Find the intro section: everything before first h2.cmp-title__text
  let introEndIdx = nodes.findIndex(n => n.querySelector && n.querySelector('h2.cmp-title__text'));
  let introContent = [];
  if (introEndIdx === -1) introEndIdx = nodes.length;
  for (let i = 0; i < introEndIdx; i++) {
    introContent.push(nodes[i]);
  }
  // Add author if present
  if (author) introContent.push(author);
  // Add intro row if there's meaningful content
  if (mainTitle && introContent.length > 0) {
    items.push([
      mainTitle,
      introContent
    ]);
  }

  // For each h2.cmp-title__text, collect all content until next h2.cmp-title__text
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) {
      // Collect content for this section
      const content = [];
      let j = i + 1;
      while (j < nodes.length && !(nodes[j].querySelector && nodes[j].querySelector('h2.cmp-title__text'))) {
        content.push(nodes[j]);
        j++;
      }
      if (content.length > 0) {
        items.push([
          h2,
          content
        ]);
      }
      i = j - 1;
    }
  }

  // Build table rows
  const headerRow = ['Accordion (accordion38)'];
  const rows = [headerRow];
  items.forEach(([title, content]) => {
    rows.push([
      title,
      Array.isArray(content) ? content : [content]
    ]);
  });

  // Create table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
