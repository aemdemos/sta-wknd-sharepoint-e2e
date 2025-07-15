/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment
  const contentFragment = element.querySelector('article.contentfragment, .cmp-contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find all aem-Grid blocks inside cmp-contentfragment__elements
  const grids = Array.from(cfElements.querySelectorAll('.aem-Grid.aem-Grid--12'));

  // Group all children from all grids in order. This will preserve document order.
  const allSectionEls = [];
  for (const grid of grids) {
    allSectionEls.push(...Array.from(grid.children));
  }

  // Identify all .title.cmp-title--underline elements as section dividers
  const sectionIndexes = [];
  for (let i = 0; i < allSectionEls.length; i++) {
    const child = allSectionEls[i];
    if (child.matches('.title.cmp-title--underline')) {
      sectionIndexes.push(i);
    }
  }

  // For each section, collect the content from the title to before the next title
  const columns = [];
  for (let c = 0; c < sectionIndexes.length; c++) {
    const start = sectionIndexes[c];
    const end = (c + 1 < sectionIndexes.length) ? sectionIndexes[c + 1] : allSectionEls.length;
    const content = [];
    for (let j = start; j < end; j++) {
      // Only add elements with meaningful content
      const el = allSectionEls[j];
      if (el && (el.textContent.trim() || el.querySelector('img'))) {
        content.push(el);
      }
    }
    if (content.length > 0) {
      columns.push(content);
    }
  }

  // Fallback: If no columns found, push all content as a single column
  if (columns.length === 0) {
    const fallback = Array.from(cfElements.children).filter(e => e.textContent.trim() || e.querySelector('img'));
    if (fallback.length) {
      columns.push(fallback);
    } else {
      columns.push([cfElements]);
    }
  }

  // Compose the table: header row, then a content row with all columns' full blocks
  const cells = [
    ['Columns (columns26)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  contentFragment.replaceWith(table);
}
