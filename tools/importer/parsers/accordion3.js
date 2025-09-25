/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (the main story)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Always start with the required header
  const headerRow = ['Accordion (accordion3)'];
  const rows = [];

  // Find the elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Helper: collect all direct children that are elements
  const children = Array.from(elementsContainer.children);

  // Helper: flatten content (unwrap single-child divs)
  function flattenContent(nodes) {
    const result = [];
    nodes.forEach(node => {
      // If it's a div with only one child, flatten it
      if (node.nodeType === 1 && node.childNodes.length === 1 && node.firstChild.nodeType === 1) {
        result.push(node.firstChild);
      } else {
        result.push(node);
      }
    });
    return result;
  }

  // Find all section titles (h2.cmp-title__text)
  const sectionTitleEls = children.filter(el => el.querySelector && el.querySelector('h2.cmp-title__text'));
  const sectionIndices = sectionTitleEls.map(titleEl => children.indexOf(titleEl));

  // Handle intro section (before first h2)
  if (sectionIndices.length > 0 && sectionIndices[0] > 0) {
    // Find the main title (h1)
    let introTitle = null;
    for (let j = 0; j < sectionIndices[0]; j++) {
      const el = children[j];
      if (el.querySelector && el.querySelector('h1.cmp-title__text')) {
        introTitle = el.querySelector('h1.cmp-title__text');
        break;
      }
    }
    // Fallback to .cmp-contentfragment__title if not found
    if (!introTitle) {
      const cfTitle = contentFragment.querySelector('.cmp-contentfragment__title');
      if (cfTitle) introTitle = cfTitle;
    }
    // Collect all content before first h2 (including all paragraphs, blockquotes, etc)
    const introContent = flattenContent(children.slice(0, sectionIndices[0]).filter(el => {
      // skip h1 and h4
      if (el.querySelector && (el.querySelector('h1.cmp-title__text') || el.querySelector('h4.cmp-title__text'))) return false;
      return true;
    }));
    if (introTitle && introContent.length > 0) {
      rows.push([introTitle, introContent]);
    }
  }

  // Now handle each section
  for (let s = 0; s < sectionIndices.length; s++) {
    const idx = sectionIndices[s];
    const nextIdx = sectionIndices[s + 1] || children.length;
    const sectionEl = children[idx];
    const sectionTitle = sectionEl.querySelector('h2.cmp-title__text');
    // Content is everything from idx+1 up to nextIdx
    // --- FIX: include the sectionEl itself if it contains more than just the title ---
    let sectionContentNodes = [];
    // If sectionEl has more than just the h2, include its other children as content
    const sectionChildren = Array.from(sectionEl.children);
    if (sectionChildren.length > 1) {
      sectionChildren.forEach(child => {
        if (!child.matches('h2.cmp-title__text')) sectionContentNodes.push(child);
      });
    }
    // Also include all following siblings up to nextIdx
    sectionContentNodes = sectionContentNodes.concat(children.slice(idx + 1, nextIdx));
    const sectionContent = flattenContent(sectionContentNodes.filter(Boolean));
    if (sectionTitle && sectionContent.length > 0) {
      rows.push([sectionTitle, sectionContent]);
    }
  }

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
