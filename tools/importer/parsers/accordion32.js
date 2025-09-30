/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the content area with all sections
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Always start with the block header
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // Get all children of the elements container
  const children = Array.from(elementsContainer.childNodes).filter(node => node.nodeType === 1 || node.nodeType === 3);

  // Find intro content before first h2
  let introContent = [];
  let introTitle = null;
  for (let j = 0; j < children.length; j++) {
    const node = children[j];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      break;
    }
    if (node.nodeType === 1 && node.tagName === 'P') {
      introContent.push(node);
    }
    if (node.nodeType === 1 && node.tagName === 'DIV') {
      const img = node.querySelector('img');
      if (img) {
        introContent.push(node);
      }
    }
  }
  if (introContent.length) {
    const mainTitle = element.querySelector('h1');
    introTitle = mainTitle ? mainTitle.cloneNode(true) : document.createElement('span');
    if (!mainTitle) introTitle.textContent = 'Introduction';
    rows.push([introTitle, introContent]);
  }

  // Now process each accordion section
  let i = 0;
  while (i < children.length) {
    let node = children[i];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      // Title cell
      const title = node.cloneNode(true);
      // Content cell: collect all following nodes until next h2 or end
      const contentNodes = [];
      i++;
      while (i < children.length) {
        const nextNode = children[i];
        if (nextNode.nodeType === 1 && nextNode.tagName === 'H2') {
          break;
        }
        if (nextNode.nodeType === 3 && nextNode.textContent.trim()) {
          contentNodes.push(document.createTextNode(nextNode.textContent));
        } else if (nextNode.nodeType === 1) {
          if (nextNode.tagName === 'DIV') {
            const img = nextNode.querySelector('img');
            if (img) {
              contentNodes.push(nextNode);
            }
          } else if (nextNode.tagName === 'P') {
            contentNodes.push(nextNode);
          }
        }
        i++;
      }
      rows.push([
        title,
        contentNodes.length ? contentNodes : ['']
      ]);
    } else {
      i++;
    }
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
