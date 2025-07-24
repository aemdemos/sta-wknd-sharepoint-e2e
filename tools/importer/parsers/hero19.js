/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first hero image (usually at the top of the main > container)
  function findHeroImage(el) {
    // Try to find the first .image with .cmp-image > img
    let image;
    // Start with direct .image under first .cmp-container
    const mainImageDiv = el.querySelector(':scope > div > div > div.image');
    if (mainImageDiv) {
      const cmpImage = mainImageDiv.querySelector('.cmp-image img');
      if (cmpImage) image = cmpImage;
    }
    // Fallback: any first img
    if (!image) {
      image = el.querySelector('img');
    }
    return image;
  }

  // Helper to collect all hero text content (title, byline, and main intro)
  function findHeroTextContent(el) {
    // The main hero text is in the 2nd .cmp-container (not the first, which is only an image)
    const containers = el.querySelectorAll(':scope > div > div.cmp-container');
    let textContainer = null;
    if (containers.length > 1) {
      textContainer = containers[1];
    } else if (containers.length === 1) {
      textContainer = containers[0];
    }
    const textContent = [];
    if (textContainer) {
      // Include all immediate .title and article.contentfragment children
      textContainer.childNodes.forEach((node) => {
        if (
          (node.nodeType === 1 && node.classList.contains('title')) ||
          (node.nodeType === 1 && node.tagName.toLowerCase() === 'article' && node.classList.contains('contentfragment'))
        ) {
          textContent.push(node);
        }
      });
    }
    // Fallback: get first h1, h4, and article from anywhere in element
    if (textContent.length === 0) {
      const h1 = el.querySelector('h1');
      if (h1) textContent.push(h1);
      const h4 = el.querySelector('h4');
      if (h4) textContent.push(h4);
      const art = el.querySelector('article');
      if (art) textContent.push(art);
    }
    return textContent;
  }

  // Block header
  const headerRow = ['Hero (hero19)'];

  // Background image row
  const heroImg = findHeroImage(element);
  const imgRow = [heroImg ? heroImg : ''];

  // Title, byline, and intro text row
  const heroTextBlock = findHeroTextContent(element);
  const textRow = [heroTextBlock.length ? heroTextBlock : ''];

  // Compose table
  const cells = [headerRow, imgRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
