/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article contentfragment
  const contentFragment = element.querySelector('.contentfragment, article.contentfragment, .cmp-contentfragment');
  if (!contentFragment) return;

  // Find all direct children of cmp-contentfragment__elements (preserving order)
  const container = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!container) return;
  const children = Array.from(container.childNodes).filter(node => node.nodeType === 1);

  // Find all h2 titles and their indices
  const sectionTitles = [];
  children.forEach((child, idx) => {
    let h2 = null;
    if (child.matches('.title')) {
      h2 = child.querySelector('h2');
    } else if (child.matches('h2')) {
      h2 = child;
    }
    if (h2) {
      sectionTitles.push({ idx, h2 });
    }
  });

  // Build accordion rows
  const rows = [];
  // Always use the target block name as header
  rows.push(['Accordion (accordion31)']);

  // First accordion item: all content before the first h2
  const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title, h1.cmp-title__text, h1');
  const firstTitleText = mainTitle ? mainTitle.textContent.trim() : 'Introduction';
  let firstContentNodes = [];
  let firstH2Idx = sectionTitles.length > 0 ? sectionTitles[0].idx : children.length;
  for (let i = 0; i < firstH2Idx; i++) {
    if (children[i]) firstContentNodes.push(children[i]);
  }
  if (firstContentNodes.length > 0) {
    rows.push([
      firstTitleText,
      firstContentNodes.length === 1 ? firstContentNodes[0] : firstContentNodes
    ]);
  }

  // For each h2 section, gather content until the next h2
  for (let s = 0; s < sectionTitles.length; s++) {
    const { idx, h2 } = sectionTitles[s];
    const nextIdx = (s + 1 < sectionTitles.length) ? sectionTitles[s + 1].idx : children.length;
    const titleText = h2.textContent.trim();
    const contentNodes = [];
    for (let i = idx + 1; i < nextIdx; i++) {
      if (children[i]) contentNodes.push(children[i]);
    }
    if (titleText && contentNodes.length > 0) {
      rows.push([
        titleText,
        contentNodes.length === 1 ? contentNodes[0] : contentNodes
      ]);
    }
  }

  // Only keep rows after header that have exactly 2 columns and are not empty
  const validRows = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    if (
      Array.isArray(rows[i]) &&
      rows[i].length === 2 &&
      rows[i][0] &&
      rows[i][1] &&
      (typeof rows[i][0] === 'string' || (rows[i][0].textContent && rows[i][0].textContent.trim())) &&
      (typeof rows[i][1] === 'string' || (Array.isArray(rows[i][1]) ? rows[i][1].length > 0 : (rows[i][1].textContent && rows[i][1].textContent.trim())))
    ) {
      validRows.push(rows[i]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(validRows, document);
  element.replaceWith(block);
}
