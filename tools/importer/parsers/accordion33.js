/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the content fragment area containing the accordion content
  const mainFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!mainFragment) return;

  // Helper to extract each accordion section: title (h2) + content (until next h2)
  function extractAccordionItems(root) {
    const items = [];
    const children = Array.from(root.childNodes);
    let i = 0;
    while (i < children.length) {
      const node = children[i];
      // Find the next H2 (accordion title)
      if (node.nodeType === 1 && node.tagName === 'H2') {
        const title = node;
        i++;
        const content = [];
        // Gather all nodes (including images, paragraphs, divs) until next H2 or end
        while (
          i < children.length &&
          !(children[i].nodeType === 1 && children[i].tagName === 'H2')
        ) {
          const el = children[i];
          // Skip empty grid wrappers common in AEM
          if (
            el.nodeType === 1 &&
            el.classList &&
            el.classList.contains('aem-Grid') &&
            el.childElementCount === 0
          ) {
            i++;
            continue;
          }
          if (
            el.nodeType === 1 &&
            el.tagName === 'DIV' &&
            el.childElementCount === 1 &&
            el.firstElementChild &&
            el.firstElementChild.classList.contains('aem-Grid') &&
            el.firstElementChild.childElementCount === 0
          ) {
            i++;
            continue;
          }
          // Add non-empty content
          content.push(el);
          i++;
        }
        // Only add if there is content for this section
        if (title && content.length > 0) {
          items.push({ title, content });
        } else if (title && content.length === 0) {
          // Add empty section if exists (edge case)
          items.push({ title, content: [] });
        }
      } else {
        i++;
      }
    }
    return items;
  }

  // Extract all accordion items (sections)
  const accordionItems = extractAccordionItems(mainFragment);
  if (!accordionItems.length) return;

  // Compose the table rows: header + rows for each accordion section
  const rows = [['Accordion (accordion33)']];
  accordionItems.forEach(({ title, content }) => {
    // Clean up: remove any empty wrappers inside content
    const filteredContent = (content || []).filter(el => {
      if (
        el.nodeType === 1 &&
        el.classList &&
        el.classList.contains('aem-Grid') &&
        el.childElementCount === 0
      ) {
        return false;
      }
      if (
        el.nodeType === 1 &&
        el.tagName === 'DIV' &&
        el.childElementCount === 1 &&
        el.firstElementChild &&
        el.firstElementChild.classList.contains('aem-Grid') &&
        el.firstElementChild.childElementCount === 0
      ) {
        return false;
      }
      // Remove whitespace-only text nodes
      if (el.nodeType === 3 && !el.textContent.trim()) {
        return false;
      }
      return true;
    });
    rows.push([
      title,
      filteredContent.length > 1 ? filteredContent : (filteredContent[0] || '')
    ]);
  });

  // Create the accordion block table and replace the content fragment with it
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the whole contentfragment article (not just the elements) for block-level replacement
  const cfArticle = element.querySelector('article.contentfragment');
  if (cfArticle) {
    cfArticle.replaceWith(table);
  }
}
