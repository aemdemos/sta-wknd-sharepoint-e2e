/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Find main content area (the main article)
  const mainContent = element.querySelector('main.container');
  if (!mainContent) return;

  // Find the main article block (the magazine article)
  const mainGrid = findChildByClass(mainContent, 'cmp-container');
  if (!mainGrid) return;

  // Find the main article contentfragment
  const contentFragment = mainGrid.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the contentfragment elements wrapper
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Prepare the header row
  const headerRow = ['Accordion (accordion39)'];
  const rows = [headerRow];

  // Get all children of cfElements
  const children = Array.from(cfElements.children);

  // Find all h2s (section titles)
  const h2s = children
    .map((el, idx) => ({ el, idx }))
    .filter(({ el }) => el.querySelector && el.querySelector('h2.cmp-title__text'));

  // Find intro title (h3.cmp-contentfragment__title)
  const introTitleEl = contentFragment.querySelector('h3.cmp-contentfragment__title');
  // Intro content: everything from first child until first h2 section
  let firstH2Idx = h2s.length ? h2s[0].idx : children.length;
  const introContentEls = children.slice(0, firstH2Idx).filter((el) => el !== introTitleEl && el.textContent.trim());
  if (introTitleEl && introContentEls.length) {
    rows.push([
      introTitleEl.cloneNode(true),
      introContentEls.map(el => el.cloneNode(true)),
    ]);
  }

  // For each section (h2), get its content until the next h2
  for (let i = 0; i < h2s.length; i++) {
    const { el: h2Wrapper, idx: h2Idx } = h2s[i];
    const h2El = h2Wrapper.querySelector('h2.cmp-title__text');
    // Section content: all children after h2Wrapper until next h2
    const nextH2Idx = (h2s[i + 1] ? h2s[i + 1].idx : children.length);
    const sectionContentEls = children.slice(h2Idx + 1, nextH2Idx).filter((el) => el.textContent.trim());
    if (h2El && sectionContentEls.length) {
      rows.push([
        h2El.cloneNode(true),
        sectionContentEls.map(el => el.cloneNode(true)),
      ]);
    }
  }

  // Defensive: If no rows, do nothing
  if (rows.length < 2) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
