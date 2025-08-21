/* global WebImporter */
export default function parse(element, { document }) {
  // Find the article containing the contentfragment (main article body)
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Get the main content area for the article, prioritizing .cmp-contentfragment__elements
  // We'll build a flat ordered list of DOM nodes that are direct children or meaningful siblings
  // so we can precisely map headings to their content
  let contentNodes = [];
  const cfBody = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (cfBody) {
    // Add all children from this node
    contentNodes = Array.from(cfBody.children);
    // Add any top-level <p> or <div> after the elements block (sometimes paragraphs are appended after grids)
    let after = cfBody.nextElementSibling;
    while (after) {
      if (after.tagName === 'P' || after.tagName === 'DIV') contentNodes.push(after);
      after = after.nextElementSibling;
    }
  } else {
    // fallback: just collect all children of .contentfragment
    contentNodes = Array.from(contentFragment.children);
  }

  // Find ALL h2.cmp-title__text nodes in the document (these are accordion section titles in order)
  const h2s = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (!h2s.length) return;

  const rows = [['Accordion (accordion32)']];

  h2s.forEach((h2) => {
    // Find the full .cmp-title element so that markup is preserved
    const titleEl = h2.closest('.cmp-title') || h2;
    // Find the index of this node in our contentNodes flat list
    let titleIdx = contentNodes.findIndex((node) => node.contains(titleEl) || node === titleEl);
    if (titleIdx === -1) {
      // fallback: direct match
      titleIdx = contentNodes.indexOf(titleEl);
    }
    if (titleIdx === -1) return; // can't find this section, skip

    // Section content is all subsequent nodes up to either the next section heading or end
    const sectionContent = [];
    for (let i = titleIdx + 1; i < contentNodes.length; i++) {
      // If this node is (or contains) a new h2.cmp-title__text, stop (next section)
      if (contentNodes[i].querySelector && contentNodes[i].querySelector('h2.cmp-title__text')) break;
      // Only include nodes with real content
      if (contentNodes[i].innerText && contentNodes[i].innerText.trim()) {
        sectionContent.push(contentNodes[i]);
      }
    }
    // Fallback: if no content found, look for the next <p> after the title
    if (!sectionContent.length) {
      let fallback = titleEl.parentElement.nextElementSibling;
      if (fallback && fallback.tagName === 'P' && fallback.innerText.trim()) {
        sectionContent.push(fallback);
      }
    }
    // If still no content, skip section
    if (!sectionContent.length) return;
    // Reference, don't clone
    rows.push([
      titleEl,
      sectionContent.length === 1 ? sectionContent[0] : sectionContent
    ]);
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
