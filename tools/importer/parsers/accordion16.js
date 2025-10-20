/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion16)'];
  const rows = [];

  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Get all elements inside the contentfragment__elements
  const contentRoot = cf.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) return;
  const children = Array.from(contentRoot.children);

  // Helper: flatten all content including nested grids
  function flattenContent(el) {
    if (el.classList && el.classList.contains('aem-Grid')) {
      return Array.from(el.children).flatMap(flattenContent);
    }
    return [el];
  }

  // Find all section title indices (h2.cmp-title__text)
  const sectionIndices = [];
  children.forEach((el, idx) => {
    const h2 = el.querySelector && el.querySelector('h2.cmp-title__text');
    if (h2) sectionIndices.push(idx);
  });

  // First section: everything before first h2
  {
    // Get main title from the article
    const mainTitle = cf.querySelector('h3.cmp-contentfragment__title');
    if (mainTitle) {
      const firstEnd = sectionIndices.length ? sectionIndices[0] : children.length;
      let firstContent = [];
      for (let i = 0; i < firstEnd; i++) {
        firstContent.push(...flattenContent(children[i]));
      }
      // Gather all text and images from firstContent
      let contentEls = [];
      firstContent.forEach(el => {
        // Paragraphs and blockquotes
        if (el.matches && el.matches('p, blockquote')) {
          contentEls.push(el.cloneNode(true));
        } else if (el.querySelectorAll) {
          el.querySelectorAll('p, blockquote').forEach(n => contentEls.push(n.cloneNode(true)));
        }
        // Images
        if (el.matches && el.matches('.cmp-image')) {
          const img = el.querySelector('img');
          if (img) contentEls.push(img.cloneNode(true));
        } else if (el.querySelectorAll) {
          el.querySelectorAll('.cmp-image img').forEach(n => contentEls.push(n.cloneNode(true)));
        }
      });
      // Also include any images directly under the cf before contentRoot
      const cfImages = Array.from(cf.querySelectorAll('.cmp-image img'));
      cfImages.forEach(img => contentEls.push(img.cloneNode(true)));
      if (contentEls.length) {
        rows.push([mainTitle.textContent, contentEls]);
      }
    }
  }

  // Subsequent sections
  for (let s = 0; s < sectionIndices.length; s++) {
    const idx = sectionIndices[s];
    const el = children[idx];
    const h2 = el.querySelector('h2.cmp-title__text');
    // Section content: from idx+1 to next section or end
    const nextIdx = sectionIndices[s + 1] !== undefined ? sectionIndices[s + 1] : children.length;
    let content = [];
    for (let i = idx + 1; i < nextIdx; i++) {
      content.push(...flattenContent(children[i]));
    }
    // Gather all text and images from content
    let contentEls = [];
    content.forEach(el => {
      if (el.matches && el.matches('p, blockquote')) {
        contentEls.push(el.cloneNode(true));
      } else if (el.querySelectorAll) {
        el.querySelectorAll('p, blockquote').forEach(n => contentEls.push(n.cloneNode(true)));
      }
      if (el.matches && el.matches('.cmp-image')) {
        const img = el.querySelector('img');
        if (img) contentEls.push(img.cloneNode(true));
      } else if (el.querySelectorAll) {
        el.querySelectorAll('.cmp-image img').forEach(n => contentEls.push(n.cloneNode(true)));
      }
    });
    if (h2 && contentEls.length) {
      rows.push([h2.textContent, contentEls]);
    }
  }

  // Defensive: Remove empty rows
  const filteredRows = rows.filter(row => row[0] && row[1] && row[1].length);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...filteredRows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
