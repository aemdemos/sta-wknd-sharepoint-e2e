/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate on the main contentfragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  const headerRow = ['Accordion (accordion19)'];
  const rows = [];

  // Find the main content container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;
  const children = Array.from(elementsContainer.children);

  // Find all .aem-Grid blocks with h2.cmp-title__text (section titles)
  const sectionIndices = [];
  children.forEach((el, idx) => {
    if (
      el.classList.contains('aem-Grid') &&
      el.querySelector('h2.cmp-title__text')
    ) {
      sectionIndices.push(idx);
    }
  });

  // For each section, extract title and content
  sectionIndices.forEach((startIdx, i) => {
    const gridEl = children[startIdx];
    const h2 = gridEl.querySelector('h2.cmp-title__text');
    // Content is everything after this gridEl up to the next section or end
    const endIdx = sectionIndices[i + 1] !== undefined ? sectionIndices[i + 1] : children.length;
    let contentEls = [];
    for (let j = startIdx + 1; j < endIdx; j++) {
      const el = children[j];
      // If it's a .aem-Grid, flatten its children
      if (el.classList.contains('aem-Grid')) {
        Array.from(el.children).forEach(child => {
          if (child.querySelector('*') || child.textContent.trim()) contentEls.push(child);
        });
      } else if (el.querySelector('*') || el.textContent.trim()) {
        contentEls.push(el);
      }
    }
    // If still no content, try to get the next <p> or <div> after gridEl (outside .cmp-contentfragment__elements)
    if (contentEls.length === 0) {
      let parent = elementsContainer.parentElement;
      let afterGrid = gridEl.nextElementSibling;
      while (afterGrid && (afterGrid.classList.contains('aem-Grid') || !afterGrid.textContent.trim())) {
        afterGrid = afterGrid.nextElementSibling;
      }
      if (afterGrid && afterGrid.textContent.trim()) {
        contentEls = [afterGrid];
      }
    }
    // Defensive: flatten contentEls if any are <div> with only one child
    contentEls = contentEls.flatMap(el => {
      if (el && el.tagName === 'DIV' && el.children.length === 1) {
        return [el.children[0]];
      }
      return [el];
    });
    // CRITICAL FIX: Always push a row for each h2, even if contentEls is empty
    if (h2) {
      rows.push([
        h2,
        contentEls.length ? contentEls : ['']
      ]);
    }
  });

  // Only output if we have at least one accordion row
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    contentFragment.replaceWith(table);
  }
}
