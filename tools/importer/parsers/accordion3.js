/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column containing the article
  const mainContent = element.querySelector('article.contentfragment');
  if (!mainContent) return;

  // Find the contentfragment elements container
  const elementsContainer = mainContent.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Find all .title blocks with h2.cmp-title__text (accordion titles)
  const titleBlocks = Array.from(elementsContainer.querySelectorAll('.title'));
  const accordionItems = [];

  titleBlocks.forEach((titleBlock, idx) => {
    const h2 = titleBlock.querySelector('h2.cmp-title__text');
    if (!h2) return;
    // Title cell: just the text content
    const title = document.createTextNode(h2.textContent.trim());
    // Content cell: gather all siblings until the next .title block (or end)
    const content = [];
    let node = titleBlock.nextElementSibling;
    while (node && !node.classList.contains('title')) {
      // For images, include the image element
      if (node.classList.contains('image')) {
        const img = node.querySelector('img');
        if (img) content.push(img.cloneNode(true));
      }
      // For paragraphs, blockquotes, etc, include as is
      node.querySelectorAll('p, blockquote').forEach(el => content.push(el.cloneNode(true)));
      node = node.nextElementSibling;
    }
    // Defensive: only add if there's actual content
    if (content.length) {
      accordionItems.push([title, content.length === 1 ? content[0] : content]);
    }
  });

  // --- FIX: include all content before the first .title block as intro ---
  // This will capture the blockquote/definition and intro paragraphs
  const firstTitleBlock = titleBlocks[0];
  if (firstTitleBlock) {
    const introContent = [];
    let node = elementsContainer.firstElementChild;
    while (node && node !== firstTitleBlock) {
      // For images, include the image element
      if (node.classList && node.classList.contains('image')) {
        const img = node.querySelector('img');
        if (img) introContent.push(img.cloneNode(true));
      }
      node.querySelectorAll && node.querySelectorAll('p, blockquote').forEach(el => introContent.push(el.cloneNode(true)));
      node = node.nextElementSibling;
    }
    if (introContent.length) {
      accordionItems.unshift([
        document.createTextNode('Introduction'),
        introContent.length === 1 ? introContent[0] : introContent
      ]);
    }
  }

  // If nothing found, do not replace
  if (accordionItems.length === 0) return;

  // Build the table rows
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];
  for (const [title, content] of accordionItems) {
    rows.push([title, content]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
