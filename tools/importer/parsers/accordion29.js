/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the 8-column main, not sidebar)
  let mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainContent) mainContent = element;

  // Find the content fragment article (contains the main story)
  const cfArticle = mainContent.querySelector('article.contentfragment > article.cmp-contentfragment');
  if (!cfArticle) return;

  // Always use the required header
  const headerRow = ['Accordion (accordion29)'];
  const rows = [headerRow];

  // Find the content container inside the content fragment
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all direct children of cfElements, including text nodes
  const children = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

  // Find all section headings (h2) and their indices
  const sectionIndices = [];
  children.forEach((node, idx) => {
    if (node.nodeType === 1) {
      const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
      if (h2) sectionIndices.push({ idx, titleEl: h2 });
    }
  });

  // If there is content before the first <h2>, treat it as an accordion item
  if (sectionIndices.length > 0 && sectionIndices[0].idx > 0) {
    let introTitle = null;
    for (let i = 0; i < sectionIndices[0].idx; i++) {
      const node = children[i];
      if (node.nodeType === 1) {
        const h3 = node.querySelector && node.querySelector('h3.cmp-contentfragment__title');
        if (h3) {
          introTitle = h3;
          break;
        }
      }
    }
    if (!introTitle) introTitle = sectionIndices[0].titleEl;
    const introContentNodes = [];
    for (let i = 0; i < sectionIndices[0].idx; i++) {
      const node = children[i];
      if (node.nodeType === 3 && !node.textContent.trim()) continue;
      introContentNodes.push(node);
    }
    const hasContent = introContentNodes.some(n => {
      if (n.nodeType === 3) return n.textContent.trim();
      if (n.nodeType === 1) {
        return n.querySelectorAll('img, p, blockquote').length > 0 || n.textContent.trim();
      }
      return false;
    });
    if (introTitle && hasContent) {
      rows.push([introTitle, introContentNodes.length === 1 ? introContentNodes[0] : introContentNodes]);
    }
  }

  // For each section, collect title and content
  for (let s = 0; s < sectionIndices.length; s++) {
    const { idx, titleEl } = sectionIndices[s];
    const nextIdx = (s + 1 < sectionIndices.length) ? sectionIndices[s + 1].idx : children.length;
    const contentNodes = [];
    for (let i = idx + 1; i < nextIdx; i++) {
      const node = children[i];
      if (node.nodeType === 3 && !node.textContent.trim()) continue;
      contentNodes.push(node);
    }
    const hasContent = contentNodes.some(n => {
      if (n.nodeType === 3) return n.textContent.trim();
      if (n.nodeType === 1) {
        return n.querySelectorAll('img, p, blockquote').length > 0 || n.textContent.trim();
      }
      return false;
    });
    if (titleEl && hasContent) {
      rows.push([titleEl, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    }
  }

  // If there are no accordion item rows, add a fallback row with all content
  if (rows.length === 1) {
    let mainTitle = cfElements.querySelector('h3.cmp-contentfragment__title');
    if (!mainTitle) mainTitle = document.createElement('span');
    if (!mainTitle.textContent.trim()) mainTitle.textContent = 'Main';
    const contentNodes = children.filter(n => n.nodeType !== 3 || n.textContent.trim());
    if (contentNodes.length) {
      rows.push([mainTitle, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original content fragment with the block table
  cfArticle.replaceWith(table);
}
