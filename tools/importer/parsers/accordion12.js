/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll collect accordion items as [title, content] pairs
  const accordionItems = [];

  // Helper: flatten nodes, skipping empty grids
  function getMeaningfulNodes(nodes) {
    const result = [];
    nodes.forEach(node => {
      if (node.nodeType === 1) {
        // If it's a grid with no children, skip
        if (node.classList && node.classList.contains('aem-Grid') && !node.querySelector('*:not(.aem-Grid)')) {
          return;
        }
        // If it's a grid with meaningful children, flatten
        if (node.classList && node.classList.contains('aem-Grid')) {
          result.push(...getMeaningfulNodes(Array.from(node.children)));
          return;
        }
        // If it's a container div with only a grid, flatten
        if (node.tagName === 'DIV' && node.children.length === 1 && node.children[0].classList && node.children[0].classList.contains('aem-Grid')) {
          result.push(...getMeaningfulNodes(Array.from(node.children[0].children)));
          return;
        }
        // Otherwise, keep
        result.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        result.push(node);
      }
    });
    return result;
  }

  // Get all children, flattening grids
  let children = getMeaningfulNodes(Array.from(elementsContainer.childNodes));

  // Find all h2 sections and their content
  let sectionStarts = [];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType === 1 && (node.tagName === 'H2' || node.querySelector('h2'))) {
      sectionStarts.push(i);
    }
  }

  // If there is intro content before the first h2, add as first accordion item
  if (sectionStarts.length > 0 && sectionStarts[0] > 0) {
    const introNodes = children.slice(0, sectionStarts[0]);
    const introContentNodes = getMeaningfulNodes(introNodes);
    if (introContentNodes.length) {
      const mainTitleDiv = element.querySelector('.cmp-title h1');
      let introTitle = mainTitleDiv ? mainTitleDiv.cloneNode(true) : document.createElement('span');
      const introContent = document.createElement('div');
      introContentNodes.forEach(node => {
        introContent.appendChild(node.cloneNode(true));
      });
      if (introContent.textContent.trim() || introContent.querySelector('*')) {
        accordionItems.push([introTitle, introContent]);
      }
    }
  }

  // For each h2 section, extract title and content
  for (let s = 0; s < sectionStarts.length; s++) {
    const startIdx = sectionStarts[s];
    const endIdx = (s + 1 < sectionStarts.length) ? sectionStarts[s + 1] : children.length;
    const titleNode = children[startIdx];
    let sectionTitleDiv = null;
    if (titleNode.nodeType === 1 && titleNode.tagName === 'H2') {
      sectionTitleDiv = titleNode;
    } else if (titleNode.nodeType === 1 && titleNode.querySelector('h2')) {
      sectionTitleDiv = titleNode.querySelector('h2');
    }
    const contentNodes = children.slice(startIdx + 1, endIdx);
    const sectionContentNodes = getMeaningfulNodes(contentNodes);
    if (sectionTitleDiv && sectionContentNodes.length > 0) {
      const titleEl = sectionTitleDiv.cloneNode(true);
      const contentEl = document.createElement('div');
      sectionContentNodes.forEach(node => {
        contentEl.appendChild(node.cloneNode(true));
      });
      accordionItems.push([titleEl, contentEl]);
    }
  }

  // If no sections found, fallback: treat all paragraphs as one accordion item
  if (accordionItems.length === 0) {
    const allParas = elementsContainer.querySelectorAll('p');
    if (allParas.length) {
      const mainTitleDiv = element.querySelector('.cmp-title h1');
      let introTitle = mainTitleDiv ? mainTitleDiv.cloneNode(true) : document.createElement('span');
      const introContent = document.createElement('div');
      allParas.forEach(p => introContent.appendChild(p.cloneNode(true)));
      accordionItems.push([introTitle, introContent]);
    }
  }

  // Compose the table rows
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];
  accordionItems.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
