/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from contributor/guide sections
  function extractCards(sectionEls) {
    const cards = [];
    sectionEls.forEach((section) => {
      // Find the innermost container holding the card content
      const container = section.querySelector('.cmp-container .cmp-container .cmp-container');
      if (!container) return;
      // Image
      const imageDiv = container.querySelector('.image .cmp-image img');
      // Name (h3)
      const nameDiv = container.querySelector('.title .cmp-title h3');
      // Subtitle (h5)
      let subtitleDiv = container.querySelector('.title.cmp-title--black .cmp-title h5, .title .cmp-title h5');
      if (!subtitleDiv) {
        // Try to find h5 after h3 if not found
        const h3 = container.querySelector('.title .cmp-title h3');
        if (h3) {
          let next = h3.parentElement.parentElement.parentElement.nextElementSibling;
          if (next && next.querySelector('h5')) subtitleDiv = next.querySelector('h5');
        }
      }
      // Social buttons
      const buttonContainer = container.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
      let buttons = [];
      if (buttonContainer) {
        buttons = Array.from(buttonContainer.querySelectorAll('a.cmp-button'));
      }
      // Compose text cell
      const textCell = [];
      if (nameDiv) textCell.push(nameDiv);
      if (subtitleDiv) textCell.push(subtitleDiv);
      if (buttons.length) {
        const btnDiv = document.createElement('div');
        btnDiv.append(...buttons);
        textCell.push(btnDiv);
      }
      // Compose row
      if (imageDiv && textCell.length) {
        cards.push([imageDiv, textCell]);
      }
    });
    return cards;
  }

  // Helper to extract heading and description for a section
  function extractSectionInfo(titleIndex, descIndex) {
    const guideTitles = Array.from(element.querySelectorAll('.title.cmp-title--underline .cmp-title h2'));
    const guideTexts = Array.from(element.querySelectorAll('.text.cmp-text--font-small .cmp-text p i'));
    const sectionInfo = [];
    if (guideTitles[titleIndex]) sectionInfo.push(guideTitles[titleIndex].cloneNode(true));
    if (guideTexts[descIndex]) sectionInfo.push(guideTexts[descIndex].cloneNode(true));
    return sectionInfo;
  }

  // Find all card sections in order
  const allSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  // Contributors: first 4, Guides: next 3 (fix: use all found, not hardcoded count)
  // Instead of slicing, use the actual count from the HTML
  // Contributors: Stacey Roswells, Jake Hammer, Ian Provo, Jacob Wester
  // Guides: Sofia Sjöberg, Justin Barr, Kumar Selveraj
  // Find the start index for guides by searching for the h2 'WKND Guides'
  const headings = Array.from(element.querySelectorAll('.title.cmp-title--underline .cmp-title h2'));
  let guideStartIdx = 0;
  if (headings.length > 1) {
    // Find the index of the section after the second heading
    const allChildren = Array.from(element.children);
    const wkndGuideHeading = headings[1].closest('.title.cmp-title--underline');
    guideStartIdx = allChildren.indexOf(wkndGuideHeading);
    // Now find the first section after this index
    let foundIdx = -1;
    for (let i = guideStartIdx + 1; i < allChildren.length; i++) {
      if (allChildren[i].tagName === 'SECTION' && allChildren[i].classList.contains('cmp-experience-fragment--contributor')) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx !== -1) {
      // Count how many sections before foundIdx
      const contributorSections = allSections.filter((section) => {
        return Array.from(element.children).indexOf(section) < foundIdx;
      });
      const guideSections = allSections.filter((section) => {
        return Array.from(element.children).indexOf(section) >= foundIdx;
      });
      // Contributors section
      const contributorsInfo = extractSectionInfo(0, 0);
      const contributorRows = [['Cards (cards3)'], ...extractCards(contributorSections)];
      // Guides section
      const guidesInfo = extractSectionInfo(1, 1);
      const guideRows = [['Cards (cards3)'], ...extractCards(guideSections)];
      // Compose output fragment
      const fragment = document.createDocumentFragment();
      if (contributorsInfo.length) contributorsInfo.forEach((el) => fragment.appendChild(el));
      fragment.appendChild(WebImporter.DOMUtils.createTable(contributorRows, document));
      if (guidesInfo.length) guidesInfo.forEach((el) => fragment.appendChild(el));
      fragment.appendChild(WebImporter.DOMUtils.createTable(guideRows, document));
      element.replaceWith(fragment);
      return;
    }
  }
  // Fallback: first 4 contributors, rest guides
  const contributorSections = allSections.slice(0, 4);
  const guideSections = allSections.slice(4);
  const contributorsInfo = extractSectionInfo(0, 0);
  const contributorRows = [['Cards (cards3)'], ...extractCards(contributorSections)];
  const guidesInfo = extractSectionInfo(1, 1);
  const guideRows = [['Cards (cards3)'], ...extractCards(guideSections)];
  // Compose output fragment
  const fragment = document.createDocumentFragment();
  if (contributorsInfo.length) contributorsInfo.forEach((el) => fragment.appendChild(el));
  fragment.appendChild(WebImporter.DOMUtils.createTable(contributorRows, document));
  if (guidesInfo.length) guidesInfo.forEach((el) => fragment.appendChild(el));
  fragment.appendChild(WebImporter.DOMUtils.createTable(guideRows, document));
  element.replaceWith(fragment);
}
