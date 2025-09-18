/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the main title for the first accordion item
  const mainTitle = contentFragment.querySelector('.cmp-contentfragment__title');

  // Get the main content container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Get all direct children (intro, sections)
  const children = Array.from(elementsContainer.childNodes).filter(n => n.nodeType === 1);

  // Find all sections (each section starts with a h2 title)
  const rows = [];
  const headerRow = ['Accordion (accordion12)'];

  // Collect intro content before first h2
  let introContent = [];
  let foundFirstH2 = false;
  for (const node of children) {
    if (
      node.classList &&
      node.classList.contains('aem-Grid') &&
      node.querySelector('.cmp-title__text') &&
      node.querySelector('.cmp-title__text').tagName === 'H2'
    ) {
      foundFirstH2 = true;
      break;
    }
    if (node.tagName === 'P') {
      introContent.push(node);
    } else if (node.classList && node.classList.contains('cmp-text')) {
      introContent.push(node);
    }
  }
  if (introContent.length) {
    rows.push([
      mainTitle ? mainTitle : document.createElement('span'),
      introContent.length === 1 ? introContent[0] : introContent
    ]);
  }

  // Now collect each section: title (h2), image, paragraphs
  let currentTitle = null;
  let currentContent = [];
  let inSection = false;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (
      node.classList &&
      node.classList.contains('aem-Grid') &&
      node.querySelector('.cmp-title__text') &&
      node.querySelector('.cmp-title__text').tagName === 'H2'
    ) {
      if (currentTitle && currentContent.length) {
        rows.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent
        ]);
      }
      currentTitle = node.querySelector('.cmp-title__text');
      currentContent = [];
      const imageDiv = node.querySelector('.cmp-image');
      if (imageDiv) {
        currentContent.push(imageDiv);
      }
      inSection = true;
    } else if (
      inSection &&
      node.classList &&
      node.classList.contains('aem-Grid') &&
      node.querySelector('.cmp-image')
    ) {
      const imageDiv = node.querySelector('.cmp-image');
      if (imageDiv) {
        currentContent.push(imageDiv);
      }
    } else if (inSection && node.classList && node.classList.contains('cmp-text')) {
      currentContent.push(node);
    } else if (inSection && node.tagName === 'P') {
      currentContent.push(node);
    }
  }
  if (currentTitle && currentContent.length) {
    rows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent
    ]);
  }

  if (rows.length === 0) return;

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
