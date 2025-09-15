/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Find all h2 section titles in order
  const sectionTitles = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (!sectionTitles.length) return;

  // Helper: get all nodes between two nodes (inclusive of paragraphs before first h2)
  function getContentForSection(titleEl, nextTitleEl) {
    const nodes = [];
    // Find the parent .aem-GridColumn of the title
    let node = titleEl.closest('.aem-GridColumn')?.nextElementSibling;
    while (node && (!nextTitleEl || node !== nextTitleEl.closest('.aem-GridColumn'))) {
      // Only push if not empty
      if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img'))) {
        nodes.push(node);
      }
      node = node.nextElementSibling;
    }
    return nodes;
  }

  // Compose rows: [title, content] (include all text and media)
  const rows = [];
  for (let i = 0; i < sectionTitles.length; i++) {
    const titleEl = sectionTitles[i];
    const nextTitleEl = sectionTitles[i + 1] || null;
    const contentNodes = getContentForSection(titleEl, nextTitleEl);
    // If there is content, add row
    if (contentNodes.length > 0) {
      rows.push([titleEl, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    }
  }

  // Always use the correct header row
  const headerRow = ['Accordion (accordion16)'];
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    contentFragment.replaceWith(block);
  } else {
    contentFragment.remove();
  }
}
