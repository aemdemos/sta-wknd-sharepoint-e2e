/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract contributor slides from a section
  function extractSlides(section) {
    const slides = [];
    // Defensive: find image
    const img = section.querySelector('.cmp-image__image');
    // Defensive: find name/title (h3)
    const nameTitle = section.querySelector('.cmp-title h3');
    // Defensive: find subtitle (h5)
    const subtitle = section.querySelector('.cmp-title h5');
    // Defensive: find social buttons
    const socialBlock = section.querySelector('.cmp-buildingblock--btn-list');
    // Compose text cell
    const textCell = document.createElement('div');
    if (nameTitle) {
      const h3 = document.createElement('h3');
      h3.textContent = nameTitle.textContent;
      textCell.appendChild(h3);
    }
    if (subtitle) {
      const h5 = document.createElement('h5');
      h5.textContent = subtitle.textContent;
      textCell.appendChild(h5);
    }
    if (socialBlock) {
      textCell.appendChild(socialBlock.cloneNode(true));
    }
    // Only add slide if image exists
    if (img) {
      slides.push([
        img.cloneNode(true),
        textCell.childNodes.length > 0 ? textCell : ''
      ]);
    }
    return slides;
  }

  // Find all sections containing contributors/guides
  let sections = Array.from(element.querySelectorAll('section.cmp-experiencefragment'));
  if (sections.length === 0) {
    // fallback: look for direct children
    sections = Array.from(element.querySelectorAll(':scope > section.cmp-experiencefragment'));
  }

  // Compose header row
  const headerRow = ['Carousel (carousel22)'];
  // Compose all slides
  let allSlides = [];
  sections.forEach(section => {
    const slide = extractSlides(section);
    if (slide.length) allSlides.push(...slide);
  });

  // Defensive: only replace if we have slides
  if (allSlides.length > 0) {
    const cells = [headerRow, ...allSlides];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.innerHTML = '';
    element.appendChild(block);
  }
}
