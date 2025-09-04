/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion31)'];
  const rows = [];

  // Find main article contentfragment
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Get all direct children
  const children = Array.from(elementsContainer.childNodes);

  // Helper to flush a section into rows
  function pushSection(titleElem, contentElems) {
    if (!titleElem || contentElems.length === 0) return;
    rows.push([titleElem, contentElems.length === 1 ? contentElems[0] : contentElems]);
  }

  // First section: intro before first h2
  let i = 0;
  let introContent = [];
  while (i < children.length) {
    const node = children[i];
    if (node.nodeType === 1 && node.querySelector && node.querySelector('h2')) {
      break;
    }
    if ((node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim())) {
      introContent.push(node);
    }
    i++;
  }
  const articleTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
  if (articleTitle && introContent.length > 0) {
    rows.push([articleTitle, introContent.length === 1 ? introContent[0] : introContent]);
  }

  // Now process the rest, looking for h2s and grouping content between them
  let sectionTitle = null;
  let sectionContent = [];
  for (; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType !== 1) continue;
    const h2 = node.querySelector && node.querySelector('h2');
    if (h2) {
      // If we have a previous section, push it
      if (sectionTitle) {
        pushSection(sectionTitle, sectionContent);
      }
      sectionTitle = h2;
      sectionContent = [];
      Array.from(node.childNodes).forEach(child => {
        if (child !== h2 && ((child.nodeType === 1 && child.textContent.trim()) || (child.nodeType === 3 && child.textContent.trim()))) {
          sectionContent.push(child);
        }
      });
    } else {
      if ((node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim())) {
        sectionContent.push(node);
      }
    }
  }
  if (sectionTitle) {
    pushSection(sectionTitle, sectionContent);
  }

  // Ensure each row is a 2-column array (title, content)
  // If any row is missing a column, fill with empty string
  const tableRows = [headerRow, ...rows.map(row => [row[0], row[1]])];

  // Build the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
