/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main content column
  const mainCol = element.querySelector('main.container.responsivegrid.aem-GridColumn--tablet--12');
  if (!mainCol) return;

  // Find the main content container
  const mainContent = mainCol.querySelector('#container-ee62c0dd17');
  if (!mainContent) return;

  // Gather all content blocks in visual order
  const columns = [];

  // 1. Title and author
  const titleBlock = [];
  const titleEls = mainContent.querySelectorAll('.title .cmp-title__text');
  titleEls.forEach((el) => titleBlock.push(el));
  if (titleBlock.length) columns.push(titleBlock);

  // 2. Article body (with images and subheadings)
  const article = mainContent.querySelector('article.cmp-contentfragment');
  if (article) {
    const cfElements = article.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      // Group content by visual section
      const sectionNodes = [];
      let currentSection = [];
      cfElements.childNodes.forEach((node) => {
        // If node is a div with a grid, treat as a visual break
        if (node.nodeType === 1 && node.querySelector('.aem-Grid')) {
          if (currentSection.length) {
            sectionNodes.push(currentSection);
            currentSection = [];
          }
          currentSection.push(node);
        } else {
          currentSection.push(node);
        }
      });
      if (currentSection.length) sectionNodes.push(currentSection);

      // For each section, flatten and add as a column
      sectionNodes.forEach((section) => {
        // Remove empty grid wrappers and empty nodes
        const filtered = section.filter((n) => {
          if (n.nodeType === 3 && !n.textContent.trim()) return false;
          if (n.nodeType === 1 && n.classList.contains('aem-Grid') && n.children.length === 0) return false;
          // Remove empty divs
          if (n.nodeType === 1 && n.tagName === 'DIV' && n.childNodes.length === 0) return false;
          // Remove divs with only empty grid
          if (n.nodeType === 1 && n.tagName === 'DIV' && n.children.length === 1 && n.children[0].classList && n.children[0].classList.contains('aem-Grid') && n.children[0].children.length === 0) return false;
          return true;
        });
        if (filtered.length) columns.push(filtered);
      });
    }
  }

  // 3. Byline block (author image + name + occupation + social)
  const xf = element.querySelector('.experiencefragment .cmp-experiencefragment');
  if (xf) {
    columns.push([xf]);
  }

  // Remove any columns that are completely empty (no text, no images, no elements)
  const meaningfulColumns = columns.filter((col) => {
    if (!col || !col.length) return false;
    // If every node is a text node with only whitespace, skip
    if (col.every((n) => n.nodeType === 3 && !n.textContent.trim())) return false;
    // If every node is an empty div, skip
    if (col.every((n) => n.nodeType === 1 && n.tagName === 'DIV' && n.childNodes.length === 0)) return false;
    return true;
  });

  // Build the table
  const headerRow = ['Columns (columns29)'];
  const contentRow = meaningfulColumns.map((col) => Array.isArray(col) && col.length === 1 ? col[0] : col);

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
