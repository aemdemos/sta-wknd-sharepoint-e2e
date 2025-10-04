/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main hero image
  function findHeroImage(el) {
    // Look for the first .image block inside the first .aem-Grid
    const grid = el.querySelector('.aem-Grid');
    if (!grid) return null;
    const imageDiv = grid.querySelector('.image .cmp-image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) return imageDiv;
    }
    return null;
  }

  // Helper to find only the hero title, subheading, and CTA (not full article)
  function findHeroText(el) {
    const mainContent = el.querySelector('main.container');
    if (!mainContent) return [];
    const textContainer = mainContent.querySelector('.cmp-container');
    if (!textContainer) return [];

    // Title: h1
    const title = textContainer.querySelector('h1');
    // Subheading: h4 (author)
    const subheading = textContainer.querySelector('h4');
    // Optional CTA: not present in this HTML, but could be a button or link near the top
    // For this source, there is no CTA, so skip

    const heroTexts = [];
    if (title) heroTexts.push(title.cloneNode(true));
    if (subheading) heroTexts.push(subheading.cloneNode(true));
    return heroTexts;
  }

  const headerRow = ['Hero (hero18)'];
  const heroImage = findHeroImage(element);
  const heroTexts = findHeroText(element);

  let textCell = '';
  if (heroTexts.length) {
    const wrapper = document.createElement('div');
    heroTexts.forEach(node => wrapper.appendChild(node));
    textCell = wrapper;
  }

  const rows = [
    headerRow,
    [heroImage ? heroImage : ''],
    [textCell || ''],
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
