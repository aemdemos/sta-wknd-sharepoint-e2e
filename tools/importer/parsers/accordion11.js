/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article/contentfragment to scope parsing
  const cf = element.querySelector('article.cmp-contentfragment, article.contentfragment, article');
  if (!cf) return;
  const cfElements = cf.querySelector('.cmp-contentfragment__elements') || cf;
  // Get all direct children, including both element and text nodes with content
  const children = Array.from(cfElements.childNodes).filter(n => {
    if (n.nodeType === 1) return true;
    if (n.nodeType === 3 && n.textContent.trim()) return true;
    return false;
  });

  // Section indexes: indexes of children whose subtree contains an h2
  const sectionIndexes = [];
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c.nodeType === 1 && c.querySelector && c.querySelector('h2')) {
      sectionIndexes.push(i);
    }
  }

  // Helper: collect all nodes from start to end index (exclusive), referencing existing elements/text
  function collectContent(from, to) {
    const arr = [];
    for (let i = from; i < to; i++) {
      const n = children[i];
      if (n.nodeType === 3 && n.textContent.trim()) {
        // Wrap text node in p for presentation and semantic meaning
        const p = document.createElement('p');
        p.textContent = n.textContent.trim();
        arr.push(p);
      } else if (n.nodeType === 1) {
        arr.push(n);
      }
    }
    return arr;
  }

  // Build accordion rows
  const rows = [['Accordion (accordion11)']];

  // First row: all content before first h2 section is the intro accordion item
  if (sectionIndexes.length > 0 && sectionIndexes[0] > 0) {
    const introContent = collectContent(0, sectionIndexes[0]);
    if (introContent.length > 0) {
      // Use first meaningful paragraph, heading, blockquote or first element as title
      let title = '';
      for (const el of introContent) {
        if (el.nodeType === 1 && [
          'P', 'DIV', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
        ].includes(el.tagName)) {
          title = el.textContent.trim();
          break;
        }
      }
      if (!title && introContent[0]) title = introContent[0].textContent.trim();
      rows.push([title, introContent]);
    }
  }

  // For each h2 section, grab title (from h2) and content (until next h2 section or end)
  for (let i = 0; i < sectionIndexes.length; i++) {
    const idx = sectionIndexes[i];
    const nextIdx = sectionIndexes[i + 1] !== undefined ? sectionIndexes[i + 1] : children.length;
    // Section title: find h2 (prefer cmp-title__text, else any h2)
    let title = '';
    const secNode = children[idx];
    if (secNode.nodeType === 1) {
      const h2 = secNode.querySelector('h2.cmp-title__text') || secNode.querySelector('h2');
      if (h2) title = h2.textContent.trim();
    }
    // Section content: everything after this div up to next h2 section
    const content = collectContent(idx + 1, nextIdx);
    // If content is empty but the sectionNode itself contains content, add the sectionNode
    if (content.length === 0 && secNode.nodeType === 1) {
      content.push(secNode);
    }
    rows.push([title, content]);
  }

  // If there are no h2 sections, treat all as a single accordion item
  if (sectionIndexes.length === 0 && children.length > 0) {
    const allContent = collectContent(0, children.length);
    if (allContent.length > 0) {
      let title = '';
      for (const el of allContent) {
        if (el.nodeType === 1 && [
          'P', 'DIV', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
        ].includes(el.tagName)) {
          title = el.textContent.trim();
          break;
        }
      }
      if (!title && allContent[0]) title = allContent[0].textContent.trim();
      rows.push([title, allContent]);
    }
  }

  // Create and replace with the accordion table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
