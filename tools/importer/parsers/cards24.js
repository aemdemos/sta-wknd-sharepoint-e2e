/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a table for a card section
  function createCardsTable(cardSections) {
    const cards = cardSections.map((section) => {
      // Image: first img in the section
      const img = section.querySelector('img');
      // Name (h3)
      const name = section.querySelector('h3.cmp-title__text');
      // Role (h5)
      const role = section.querySelector('h5.cmp-title__text');
      // Social buttons: all .cmp-button inside this card
      const socialBtns = Array.from(section.querySelectorAll('a.cmp-button'));

      // Compose content cell
      const contentFrag = document.createElement('div');
      if (name) {
        const nameElem = document.createElement('div');
        nameElem.appendChild(name.cloneNode(true));
        contentFrag.appendChild(nameElem);
      }
      if (role) {
        const roleElem = document.createElement('div');
        roleElem.appendChild(role.cloneNode(true));
        contentFrag.appendChild(roleElem);
      }
      if (socialBtns.length > 0) {
        const socialsDiv = document.createElement('div');
        socialBtns.forEach(btn => socialsDiv.appendChild(btn.cloneNode(true)));
        contentFrag.appendChild(socialsDiv);
      }
      // Add missing text content from the section (e.g. descriptions)
      Array.from(section.querySelectorAll('p, i')).forEach((txtElem) => {
        if (!contentFrag.textContent.includes(txtElem.textContent)) {
          contentFrag.appendChild(txtElem.cloneNode(true));
        }
      });
      return [img, contentFrag];
    });
    const headerRow = ['Cards (cards24)'];
    return WebImporter.DOMUtils.createTable([headerRow, ...cards], document);
  }

  // Find all card sections and split by their parent section
  // Contributors: first group (first 4), Guides: last group (last 3)
  const allSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  const contributorsSections = allSections.slice(0, 4);
  const guidesSections = allSections.slice(4);

  // Extract headings and intros
  const aboutUsHeading = element.querySelector('h1.cmp-title__text');
  const contributorsHeading = Array.from(element.querySelectorAll('h2.cmp-title__text')).find(h => h.textContent.trim().toLowerCase().includes('contributors'));
  const contributorsIntro = Array.from(element.querySelectorAll('.cmp-text p, .cmp-text i')).find(p => p.textContent.trim().toLowerCase().includes('stories across the globe'));
  const guidesHeading = Array.from(element.querySelectorAll('h2.cmp-title__text')).find(h => h.textContent.trim().toLowerCase().includes('guides'));
  const guidesIntro = Array.from(element.querySelectorAll('.cmp-text p, .cmp-text i')).find(p => p.textContent.trim().toLowerCase().includes('extraordinary travel guides'));

  // Compose output fragment
  const fragment = document.createElement('div');
  if (aboutUsHeading) fragment.appendChild(aboutUsHeading.cloneNode(true));
  if (contributorsHeading) fragment.appendChild(contributorsHeading.cloneNode(true));
  if (contributorsIntro) fragment.appendChild(contributorsIntro.cloneNode(true));
  if (contributorsSections.length > 0) fragment.appendChild(createCardsTable(contributorsSections));
  if (guidesHeading) fragment.appendChild(guidesHeading.cloneNode(true));
  if (guidesIntro) fragment.appendChild(guidesIntro.cloneNode(true));
  if (guidesSections.length > 0) fragment.appendChild(createCardsTable(guidesSections));

  // Replace the element
  element.replaceWith(fragment);
}
