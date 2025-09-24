/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (contains the accordion items)
  const contentFragmentArticle = element.querySelector('article.contentfragment');
  if (!contentFragmentArticle) return;

  // Get the main contentfragment content
  const contentFragment = contentFragmentArticle.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get all direct children of cmp-contentfragment__elements
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll collect accordion items as [title, content] pairs
  const accordionRows = [];

  // Find all h2.cmp-title__text elements and their content blocks
  const children = Array.from(elementsContainer.children);
  let i = 0;
  while (i < children.length) {
    const child = children[i];
    const h2Title = child.querySelector && child.querySelector('h2.cmp-title__text');
    if (h2Title) {
      // Title cell
      const titleCell = h2Title;
      // Content cell: collect all subsequent siblings until next h2.cmp-title__text or end
      const contentNodes = [];
      i++;
      while (i < children.length) {
        const nextChild = children[i];
        const isNextTitle = nextChild.querySelector && nextChild.querySelector('h2.cmp-title__text');
        if (isNextTitle) break;
        // Only add non-empty elements
        if (nextChild.nodeType === Node.ELEMENT_NODE && nextChild.innerHTML && nextChild.innerHTML.trim() !== '') {
          contentNodes.push(nextChild);
        }
        i++;
      }
      // Only add row if content is not empty
      if (contentNodes.length > 0) {
        accordionRows.push([titleCell, contentNodes]);
      }
    } else {
      i++;
    }
  }

  // If there are no h2 sections, fallback to a single accordion item for the whole content
  if (accordionRows.length === 0) {
    const h3Title = contentFragment.querySelector('h3.cmp-contentfragment__title');
    const allContent = Array.from(elementsContainer.children).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.innerHTML && node.innerHTML.trim() !== '') {
        return true;
      }
      return false;
    });
    if (allContent.length > 0) {
      accordionRows.push([h3Title || document.createElement('span'), allContent]);
    }
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion38)'];
  const tableRows = [headerRow];
  accordionRows.forEach(([title, content]) => {
    tableRows.push([
      title,
      Array.isArray(content) ? content : [content]
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
