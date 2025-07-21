/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (where the carousel content is)
  const tabs = element.querySelector('.tabs');
  if (!tabs) return;
  // Find all tab panels
  const tabPanels = tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');
  if (!tabPanels || tabPanels.length === 0) return;
  // Use the first tab panel (Overview) for carousel content
  const overviewPanel = tabPanels[0];
  if (!overviewPanel) return;
  // Find the contentfragment inside the panel
  const fragment = overviewPanel.querySelector('article.cmp-contentfragment');
  if (!fragment) return;
  // Get the element which contains the slide content in order
  const contentElements = fragment.querySelector('.cmp-contentfragment__elements');
  if (!contentElements) return;

  // We'll collect slides: each slide is an array: [image, [text content...]]
  const slides = [];
  let workingSlide = null;
  let workingText = [];
  const flatChildren = Array.from(contentElements.querySelectorAll(':scope > *'));
  flatChildren.forEach((node, idx) => {
    const image = node.querySelector && node.querySelector('.cmp-image');
    if (image) {
      if (workingSlide) {
        slides.push([workingSlide, workingText.length ? workingText : ['']]);
        workingText = [];
      }
      workingSlide = image;
      Array.from(node.children).forEach((child) => {
        if (child !== image && (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P' || child.tagName === 'UL' || child.tagName === 'OL')) {
          workingText.push(child);
        }
      });
    } else if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P' || node.tagName === 'UL' || node.tagName === 'OL') {
      workingText.push(node);
    } else if (node.tagName === 'DIV' && node.children.length) {
      Array.from(node.children).forEach((child) => {
        if (/^H[1-6]$/.test(child.tagName) || child.tagName === 'P' || child.tagName === 'UL' || child.tagName === 'OL') {
          workingText.push(child);
        }
      });
    }
    if (idx === flatChildren.length - 1 && workingSlide) {
      slides.push([workingSlide, workingText.length ? workingText : ['']]);
    }
  });
  if (slides.length === 0) return;

  // FIX: header row must have two cells ['Carousel (carousel33)', ''] to match the number of columns in slide rows
  const cells = [['Carousel (carousel33)', '']];
  slides.forEach(([img, textArr]) => {
    let cellContent = textArr;
    if (Array.isArray(textArr) && textArr.length === 1 && textArr[0] === '') {
      cellContent = [''];
    }
    cells.push([img, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
