/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment article
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the root of contentfragment elements
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Get all children of elementsRoot (including nested blocks)
  const children = Array.from(elementsRoot.children);

  // Prepare accordion items
  const accordionItems = [];

  // Find the main title (h1)
  const mainTitle = element.querySelector('.cmp-title h1');

  // Collect intro content up to first h2 (including blockquotes, etc)
  let introContent = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Check for h2 anywhere in this node
    if (node.querySelector && node.querySelector('h2')) {
      break;
    }
    // Accept paragraphs, quotes, and any non-empty divs
    if (
      node.tagName === 'P' ||
      node.tagName === 'BLOCKQUOTE' ||
      (node.tagName === 'DIV' && node.textContent && node.textContent.trim() !== '')
    ) {
      introContent.push(node);
    }
    i++;
  }
  if (mainTitle && introContent.length) {
    accordionItems.push([
      mainTitle,
      introContent
    ]);
  }

  // Now, walk through the children to find each h2 and its content
  while (i < children.length) {
    let node = children[i];
    let h2 = node.querySelector && node.querySelector('h2');
    if (h2) {
      let sectionContent = [];
      i++;
      // Collect all content until next h2 or end
      while (i < children.length) {
        const sibling = children[i];
        const siblingH2 = sibling.querySelector && sibling.querySelector('h2');
        if (siblingH2) break;
        // Accept paragraphs, images, blockquotes, and any non-empty divs
        if (
          sibling.tagName === 'P' ||
          sibling.tagName === 'BLOCKQUOTE' ||
          sibling.tagName === 'IMG' ||
          (sibling.tagName === 'DIV' && sibling.textContent && sibling.textContent.trim() !== '')
        ) {
          sectionContent.push(sibling);
        }
        i++;
      }
      if (sectionContent.length) {
        accordionItems.push([
          h2,
          sectionContent
        ]);
      }
    } else {
      i++;
    }
  }

  // Table header
  const headerRow = ['Accordion (accordion38)'];
  const cells = [headerRow];
  // Add each accordion item as a row
  accordionItems.forEach(([title, content]) => {
    cells.push([
      title,
      Array.isArray(content) ? content : [content]
    ]);
  });

  // Always output the table if there is at least one accordion item row
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
