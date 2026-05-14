/**
 * ============================================================
 * THE VIBE BOXING CLUB — Main JavaScript File
 * File: script.js
 * Description: All interactivity for the boxing gym website.
 *              Written in plain Vanilla JS — no libraries needed.
 *              A single developer can read, edit, and extend this.
 * ============================================================
 *
 * TABLE OF CONTENTS:
 *   1.  DOM Ready — wait for HTML to fully load before running
 *   2.  Element References — grab all needed DOM nodes once
 *   3.  HEADER: Scroll Shadow Effect
 *   4.  HEADER: Active Nav Link Highlighter (on scroll)
 *   5.  SIDEBAR: Open / Close Toggle (mobile hamburger)
 *   6.  SIDEBAR: Backdrop / overlay for mobile sidebar
 *   7.  SIDEBAR: Link click → open content panel
 *   8.  CONTENT PANELS: Show / Hide panel logic
 *   9.  CONTENT PANELS: Close button handler
 *   10. CONTENT PANELS: CTA buttons that open panels
 *   11. SMOOTH SCROLL: All [data-scroll] anchor links
 *   12. CONTACT FORM: Validation & submit handler
 *   13. FOOTER LINKS: Panel-opening footer links
 *   14. ANIMATIONS: Scroll-triggered section reveal
 *   15. ANIMATIONS: Typewriter effect on hero headline
 *   16. UTILITY FUNCTIONS
 * ============================================================
 */


/* ============================================================
   1. DOM READY
   All code is wrapped in DOMContentLoaded so we're sure
   every HTML element exists before we try to manipulate it.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // ── Log that JS has loaded (useful for debugging) ──
  console.log('[Vibe Boxing] JS Loaded ✔');


  /* ============================================================
     2. ELEMENT REFERENCES
     Query all DOM elements once at the top.
     Storing in variables = faster than querying every time.
     ============================================================ */

  // ── Header ──
  const siteHeader   = document.getElementById('site-header');       // The top fixed header bar
  const hamburgerBtn = document.getElementById('hamburger-btn');     // Hamburger menu button (mobile)

  // ── Right Sidebar ──
  const rightSidebar = document.getElementById('right-sidebar');     // The fixed right sidebar

  // ── Main content ──
  const mainContent  = document.getElementById('main-content');      // Main scrollable area

  // ── All sidebar navigation links ──
  // querySelectorAll returns a NodeList (array-like) of all matching elements
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');

  // ── All content panels ──
  const contentPanels = document.querySelectorAll('.content-panel');

  // ── All panel close buttons (the ✕ inside each panel) ──
  const panelCloseButtons = document.querySelectorAll('[data-close-panel]');

  // ── All buttons / links that open a panel from outside the sidebar ──
  // e.g. "View Plans" button in the hero, "Join Now" inside plan cards
  const externalPanelOpeners = document.querySelectorAll('[data-open-panel]');

  // ── Header navigation links (Home, Coaches) ──
  const headerNavLinks = document.querySelectorAll('.nav-link[data-scroll]');

  // ── All smooth scroll anchor links (data-scroll attribute) ──
  const scrollLinks = document.querySelectorAll('[data-scroll]');

  // ── Contact form ──
  const contactForm   = document.getElementById('contact-form');     // The <form> element
  const formStatus    = document.getElementById('form-status');      // Success/error message div
  const formSubmitBtn = document.getElementById('form-submit-btn');  // Submit button

  // ── Sections for scroll-based active nav tracking ──
  // These are the main page sections (Home, About, Coaches)
  const pageSections = document.querySelectorAll('.section[id]');

  // ── All animatable elements (for scroll reveal effect) ──
  // Elements with class .reveal-on-scroll get animated as they enter viewport
  // We'll also add this class programmatically to certain elements below
  const revealTargets = document.querySelectorAll(
    '.coach-card, .about-grid, .hero-stats, .section-header, .timetable-card, .plan-card, .highlight-item, .pt-card, .location-card, .schedule-row'
  );


  /* ============================================================
     3. HEADER: Scroll Shadow Effect
     When the user scrolls down past 50px, add class .scrolled
     to the header. The CSS then darkens its background.
     This makes the header more readable over content below.
     ============================================================ */

  /**
   * handleHeaderScroll
   * Called every time the window scrolls.
   * Adds or removes the .scrolled class from the header.
   */
  function handleHeaderScroll() {
    // window.scrollY = how many pixels the page has been scrolled vertically
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');        // Make header darker
    } else {
      siteHeader.classList.remove('scrolled');     // Restore transparent look
    }
  }

  // Attach scroll listener to the window
  window.addEventListener('scroll', handleHeaderScroll);

  // Run once immediately in case the page loads already scrolled
  handleHeaderScroll();


  /* ============================================================
     4. HEADER: Active Nav Link Highlighter
     As the user scrolls through sections, the corresponding
     header nav link gets the class .active (underline effect).
     Uses IntersectionObserver for performance (no scroll events).
     ============================================================ */

  /**
   * IntersectionObserver watches when sections enter/exit the viewport.
   * callback fires with a list of entries (observed elements).
   * options.rootMargin shifts the trigger point upward so the link
   * activates before the section fully reaches the top.
   */
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Get the id of the section currently in view
          const sectionId = entry.target.getAttribute('id');

          // Remove .active from all nav links first
          headerNavLinks.forEach(function (link) {
            link.classList.remove('active');
          });

          // Add .active to the matching nav link
          const matchingLink = document.querySelector(
            `.nav-link[data-section="${sectionId}"]`
          );
          if (matchingLink) {
            matchingLink.classList.add('active');
          }
        }
      });
    },
    {
      // rootMargin: '-20% 0px -70% 0px'
      // Triggers when section is between 20%–30% of viewport height
      rootMargin: '-20% 0px -70% 0px',
      threshold:  0   // Fire as soon as any pixel enters the adjusted region
    }
  );

  // Tell the observer to watch each section with an [id]
  pageSections.forEach(function (section) {
    sectionObserver.observe(section);
  });


  /* ============================================================
     5. SIDEBAR: Open / Close Toggle (Mobile Hamburger)
     On mobile, the sidebar is hidden off-screen to the right.
     Clicking the hamburger button toggles body.sidebar-open,
     which CSS uses to slide the sidebar into view.
     ============================================================ */

  /**
   * toggleSidebar
   * Flips the open/closed state of the mobile sidebar.
   * Also animates the hamburger icon between ☰ and ✕.
   */
  function toggleSidebar() {
    // Toggle .sidebar-open on <body> — CSS uses this to slide sidebar in
    const isOpen = document.body.classList.toggle('sidebar-open');

    // Update the hamburger button's visual state (☰ ↔ ✕ animation)
    hamburgerBtn.classList.toggle('open', isOpen);

    // Update ARIA attribute so screen readers know the state
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Prevent body from scrolling while the sidebar overlay is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /**
   * closeSidebar
   * Explicitly closes the sidebar.
   * Called when clicking outside the sidebar or navigating.
   */
  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';   // Restore normal scrolling
  }

  // Attach click handler to hamburger button
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleSidebar);
  }


  /* ============================================================
     6. SIDEBAR: Mobile Backdrop (click outside = close)
     We create a translucent backdrop element in JS.
     It appears behind the sidebar when open on mobile.
     Clicking it closes the sidebar without needing an HTML change.
     ============================================================ */

  // Create the backdrop element dynamically
  const sidebarBackdrop = document.createElement('div');
  sidebarBackdrop.className = 'sidebar-backdrop';   // Styled in a <style> block below

  // Inject inline styles (keeps all JS-created styles here, not scattered)
  // These styles are only for this single element
  sidebarBackdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 850;
    opacity: 0;
    pointer-events: none;
    transition: opacity 350ms ease;
  `;

  // Append to body
  document.body.appendChild(sidebarBackdrop);

  // Watch for .sidebar-open on body to show/hide the backdrop
  // We use a MutationObserver to detect class changes
  const bodyClassObserver = new MutationObserver(function () {
    if (document.body.classList.contains('sidebar-open')) {
      // Sidebar opened — show backdrop
      sidebarBackdrop.style.opacity        = '1';
      sidebarBackdrop.style.pointerEvents  = 'auto';
    } else {
      // Sidebar closed — hide backdrop
      sidebarBackdrop.style.opacity        = '0';
      sidebarBackdrop.style.pointerEvents  = 'none';
    }
  });

  bodyClassObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Clicking the backdrop closes the sidebar
  sidebarBackdrop.addEventListener('click', closeSidebar);


  /* ============================================================
     7. SIDEBAR: Link click → open content panel
     Each sidebar link has data-panel="panel-id".
     When clicked:
       1. Mark the link as active (highlight it in sidebar)
       2. Call showPanel() with the panel ID
       3. Close mobile sidebar if on small screen
     ============================================================ */

  sidebarLinks.forEach(function (link) {

    link.addEventListener('click', function (event) {

      // Prevent default anchor jump behaviour
      event.preventDefault();

      // Get which panel this link should open
      // e.g. data-panel="boxing" → panel id = "panel-boxing"
      const targetPanelId = 'panel-' + this.getAttribute('data-panel');

      // Remove .active from ALL sidebar links first
      sidebarLinks.forEach(function (l) {
        l.classList.remove('active');
      });

      // Add .active only to the clicked link
      this.classList.add('active');

      // Show the target panel
      showPanel(targetPanelId);

      // On mobile: close the sidebar after selecting
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });

  });


  /* ============================================================
     8. CONTENT PANELS: Show / Hide Panel Logic
     showPanel(panelId) — reveals one panel, hides all others.
     hideAllPanels()    — hides every panel.
     ============================================================ */

  /**
   * showPanel(panelId)
   * @param {string} panelId — the id attribute of the panel to show
   *                           e.g. "panel-boxing"
   *
   * Steps:
   *   1. Hide all currently visible panels
   *   2. Find the target panel element
   *   3. Add .panel-active to make it visible (CSS: display: block)
   *   4. Smooth-scroll the main content area to bring it into view
   */
  function showPanel(panelId) {

    // Step 1: Hide everything
    hideAllPanels();

    // Step 2: Find the target panel by ID
    const targetPanel = document.getElementById(panelId);

    if (!targetPanel) {
      // Panel not found — log a warning and stop
      console.warn('[Vibe Boxing] Panel not found:', panelId);
      return;
    }

    // Step 3: Make the panel visible
    targetPanel.classList.add('panel-active');

    // Step 4: Scroll the window so the panel comes into view
    // We scroll to the content-panels-wrapper container
    const panelsWrapper = document.getElementById('content-panels-wrapper');
    if (panelsWrapper) {
      // setTimeout 0 gives the browser one frame to paint the panel
      // before we try to scroll to it (avoids incorrect scroll positions)
      setTimeout(function () {
        panelsWrapper.scrollIntoView({
          behavior: 'smooth',   // Animate the scroll
          block:    'start'     // Align to top of viewport
        });
      }, 0);
    }

    // Log for debugging — remove in production if desired
    console.log('[Vibe Boxing] Panel opened:', panelId);
  }

  /**
   * hideAllPanels
   * Removes .panel-active from all panels, hiding them all.
   * Also clears active state from all sidebar links.
   */
  function hideAllPanels() {
    // Remove active class from each panel
    contentPanels.forEach(function (panel) {
      panel.classList.remove('panel-active');
    });
  }


  /* ============================================================
     9. CONTENT PANELS: Close Button Handler
     Each panel has a ✕ button with [data-close-panel].
     Clicking it closes the panel and clears sidebar active states.
     ============================================================ */

  panelCloseButtons.forEach(function (btn) {

    btn.addEventListener('click', function () {

      // Hide all panels
      hideAllPanels();

      // Remove active state from all sidebar links
      sidebarLinks.forEach(function (link) {
        link.classList.remove('active');
      });

      // Scroll back to the top of the main sections
      // so the user lands back on the hero/about area
      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    });

  });


  /* ============================================================
     10. CONTENT PANELS: External CTA Buttons
     Some buttons outside the sidebar also open panels.
     e.g. "View Plans" button in the hero: data-open-panel="boxing"
     These use data-open-panel (not data-panel like sidebar links).
     ============================================================ */

  externalPanelOpeners.forEach(function (btn) {

    btn.addEventListener('click', function (event) {

      // Prevent any default link behaviour
      event.preventDefault();

      // Get the panel to open from the attribute
      // e.g. data-open-panel="boxing" → panel id = "panel-boxing"
      const targetPanelKey = this.getAttribute('data-open-panel');
      const targetPanelId  = 'panel-' + targetPanelKey;

      // Mark the corresponding sidebar link as active
      // (gives visual feedback that that section is open)
      sidebarLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-panel') === targetPanelKey) {
          link.classList.add('active');
        }
      });

      // Open the panel
      showPanel(targetPanelId);
    });

  });


  /* ============================================================
     11. SMOOTH SCROLL: All [data-scroll] Links
     Any link with data-scroll scrolls smoothly to its href anchor.
     e.g. <a href="#coaches" data-scroll> → smooth scroll to #coaches
     ============================================================ */

  scrollLinks.forEach(function (link) {

    link.addEventListener('click', function (event) {

      // Get the href — e.g. "#coaches"
      const href = this.getAttribute('href');

      // Only handle links that start with # (anchor links on same page)
      if (!href || !href.startsWith('#')) return;

      // Find the target element on the page
      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      // Prevent default instant-jump behaviour
      event.preventDefault();

      // Calculate the scroll position
      // Subtract the header height so the section isn't hidden behind it
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 72;
      const targetTop    = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

      // Perform smooth scroll
      window.scrollTo({
        top:      targetTop,
        behavior: 'smooth'
      });

      // Also close any open sidebar on mobile
      closeSidebar();
    });

  });


  /* ============================================================
     12. CONTACT FORM: Validation & Submit Handler
     Validates fields before submit.
     Ready to hook up to Formspree, EmailJS, or any backend.
     ============================================================ */

  if (contactForm) {

    /**
     * validateField(input)
     * Checks one form input for validity.
     * @param   {HTMLElement} input — the input/textarea/select to check
     * @returns {boolean}            true if valid, false if not
     *
     * Shows the error message below the field if invalid.
     * Clears the error message if valid.
     */
    function validateField(input) {

      // Find the matching error span for this input
      // e.g. input id="contact-name" → error span id="error-name"
      const fieldId   = input.getAttribute('id');
      const errorSpan = document.getElementById(
        'error-' + fieldId.replace('contact-', '')
      );

      let errorMsg = '';   // Default: no error

      // ── Validation rules ──

      if (input.hasAttribute('required') && !input.value.trim()) {
        // Empty required field
        errorMsg = 'This field is required.';

      } else if (input.type === 'email' && input.value.trim()) {
        // Basic email format check using a regex
        // The regex checks for: something @ something . something
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          errorMsg = 'Please enter a valid email address.';
        }

      } else if (input.tagName === 'TEXTAREA' && input.value.trim().length < 10) {
        // Message too short — must be at least 10 characters
        errorMsg = 'Message must be at least 10 characters.';
      }

      // ── Show or clear error ──
      if (errorSpan) {
        errorSpan.textContent = errorMsg;  // Set error text (or clear it)
      }

      // Add/remove a visual .error class on the input for red border effect
      if (errorMsg) {
        input.style.borderColor = '#ff4d4d';   // Red border on invalid
        return false;                           // Validation failed
      } else {
        input.style.borderColor = '';          // Reset to default
        return true;                           // Validation passed
      }
    }

    /**
     * Live validation: validate each field as the user types/changes it.
     * This provides immediate feedback without waiting for form submit.
     */
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(function (input) {
      // 'input' event fires on every keystroke
      // 'change' event fires when select value changes
      input.addEventListener('input',  function () { validateField(this); });
      input.addEventListener('change', function () { validateField(this); });
    });


    /**
     * Form submission handler.
     * Fires when the user clicks "Send Message".
     * 1. Validates all fields
     * 2. If invalid: shows errors, stops submission
     * 3. If valid:   shows loading state, submits (or simulates submit)
     */
    contactForm.addEventListener('submit', function (event) {

      event.preventDefault();

      // ── Validate all required fields ──
      let isFormValid = true;

      const nameVal  = document.getElementById('contact-name').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const phoneVal = document.getElementById('contact-phone') ? document.getElementById('contact-phone').value.trim() : '1';
      const msgVal   = document.getElementById('contact-message').value.trim();
      const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      document.getElementById('error-name').textContent    = !nameVal  ? 'Full name is required.'        : '';
      document.getElementById('error-email').textContent   = !emailVal ? 'Email is required.'            : !emailOk ? 'Enter a valid email.' : '';
      document.getElementById('error-message').textContent = !msgVal   ? 'Please enter a message.'       : '';

      const phoneErr = document.getElementById('error-phone');
      if (phoneErr) phoneErr.textContent = !phoneVal ? 'Phone number is required.' : '';

      if (!nameVal || !emailVal || !emailOk || !msgVal || !phoneVal) {
        isFormValid = false;
      }

      if (!isFormValid) return;

      // ── Valid — submit to Web3Forms (delivers to thevibeboxing@gmail.com) ──
      setFormLoadingState(true);

      // Build form data object
      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        body:    formData
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        setFormLoadingState(false);
        if (data.success) {
          showFormSuccess();
          contactForm.reset();
          // Clear red borders
          contactForm.querySelectorAll('input, textarea').forEach(function(el) {
            el.style.borderColor = '';
          });
        } else {
          showFormError();
        }
      })
      .catch(function() {
        setFormLoadingState(false);
        showFormError();
      });

    });
 
 
    /**
     * setFormLoadingState(isLoading)
     * Changes the submit button to show a loading spinner
     * or restores it to normal.
     * @param {boolean} isLoading
     */
    function setFormLoadingState(isLoading) {
      if (!formSubmitBtn) return;
 
      const btnText = formSubmitBtn.querySelector('.btn-text');
      const btnIcon = formSubmitBtn.querySelector('.btn-icon');
 
      if (isLoading) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.style.opacity = '0.7';
        if (btnText) btnText.textContent = 'Sending...';
        // Replace icon with a rotating spinner character
        if (btnIcon) {
          btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
        }
      } else {
        formSubmitBtn.disabled = false;
        formSubmitBtn.style.opacity = '';
        if (btnText) btnText.textContent = 'Send Message';
        // Restore the paper-plane icon
        if (btnIcon) {
          btnIcon.className = 'fas fa-paper-plane btn-icon';
        }
      }
    }
 
 
    /**
     * showFormSuccess()
     * Displays a green success message below the form.
     * Hides after 5 seconds automatically.
     */
    function showFormSuccess() {
      if (!formStatus) return;
 
      formStatus.textContent = '✓ Message sent! We\'ll get back to you within 24 hours.';
      formStatus.className   = 'form-status success';  // CSS shows the green box
 
      // Auto-hide after 5 seconds
      setTimeout(function () {
        formStatus.className = 'form-status';   // Removes success → CSS: display: none
        formStatus.textContent = '';
      }, 5000);
    }
 
 
    /**
     * showFormError()
     * Displays a red error message below the form.
     * Used when the server/fetch call fails.
     */
    function showFormError() {
      if (!formStatus) return;
 
      formStatus.textContent = '✕ Something went wrong. Please try again or email us directly.';
      formStatus.className   = 'form-status error';   // CSS shows the red box
    }
 
  }
  // ── End contact form block ──
 
 
  /* ============================================================
     13. FOOTER LINKS: Open Panels from Footer
     Footer links also use data-open-panel attribute.
     Handled by the same externalPanelOpeners listener (section 10).
     Footer scroll links are handled by smooth scroll (section 11).
     Nothing extra needed here — both are already covered above.
     ============================================================ */
  // (No additional code needed — covered by sections 10 and 11)


  /* ============================================================
     14. ANIMATIONS: Scroll-Triggered Section Reveal
     Elements fade and slide up as they enter the viewport.
     Uses IntersectionObserver (performant — no scroll events).
     ============================================================ */

  /**
   * Add the base reveal class to all target elements.
   * CSS sets them as: opacity: 0, translateY(30px)
   * Once .revealed is added, they animate to: opacity: 1, translateY(0)
   */

  // Inject the base styles for reveal animations via a <style> tag
  // (Keeps all animation logic in one place: here in JS)
  const revealStyleTag = document.createElement('style');
  revealStyleTag.textContent = `
    /* Base state — hidden, slightly below final position */
    .reveal-target {
      opacity:    0;
      transform:  translateY(30px);
      transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1),
                  transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    /* Revealed state — visible and in final position */
    .reveal-target.revealed {
      opacity:   1;
      transform: translateY(0);
    }

    /* Stagger children inside grids — each child slightly delayed */
    .reveal-target:nth-child(2) { transition-delay: 0.1s; }
    .reveal-target:nth-child(3) { transition-delay: 0.2s; }
    .reveal-target:nth-child(4) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(revealStyleTag);

  // Add .reveal-target class to each element we want to animate
  revealTargets.forEach(function (el) {
    el.classList.add('reveal-target');
  });

  /**
   * IntersectionObserver for reveal animations.
   * When an element enters the viewport (10% visible),
   * add .revealed → triggers the CSS transition.
   * Once revealed, stop observing it (no need to watch anymore).
   */
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Element is now visible — animate it in
          entry.target.classList.add('revealed');
          // Unobserve so we don't re-trigger it
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.1,            // Trigger when 10% of element is visible
      rootMargin: '0px 0px -60px 0px'  // Trigger slightly before element reaches viewport edge
    }
  );

  // Start watching each reveal target
  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ============================================================
     15. ANIMATIONS: Typewriter Effect on Hero Tag Line
     The small tag line above the hero headline ("Kathmandu's
     Premier Fight Gym") types out character by character.
     ============================================================ */

  const heroTag = document.querySelector('.hero-tag');

  if (heroTag) {
    // Store the original text content
    const originalText = heroTag.textContent.trim();

    // Clear the element — we'll type text back in
    heroTag.textContent = '';

    // Keep a small spacer so the ::before decorative line still renders
    // (The CSS .hero-tag::before draws a red line before the text)

    /**
     * typeWriter(element, text, index, speed)
     * Recursively adds one character at a time to an element.
     * @param {HTMLElement} element — the element to type into
     * @param {string}      text    — full string to type
     * @param {number}      index   — current character position
     * @param {number}      speed   — milliseconds between each character
     */
    function typeWriter(element, text, index, speed) {
      if (index < text.length) {
        // Append the next character
        element.textContent += text.charAt(index);

        // Schedule the next character
        setTimeout(function () {
          typeWriter(element, text, index + 1, speed);
        }, speed);
      }
    }

    // Start typing after a short initial delay (lets the page load first)
    // 800ms delay → 50ms per character
    setTimeout(function () {
      typeWriter(heroTag, originalText, 0, 50);
    }, 800);
  }


  /* ============================================================
     16. UTILITY FUNCTIONS
     Small reusable helpers used throughout the script.
     ============================================================ */

  /**
   * debounce(fn, delay)
   * Prevents a function from firing too rapidly.
   * Useful for scroll and resize event handlers.
   *
   * @param   {Function} fn    — function to debounce
   * @param   {number}   delay — wait time in ms after last call
   * @returns {Function}         wrapped debounced function
   */
  function debounce(fn, delay) {
    let timeoutId;
    return function () {
      // Clear any existing timer
      clearTimeout(timeoutId);
      // Set a new timer — fn only fires if delay passes without another call
      timeoutId = setTimeout(fn, delay);
    };
  }

  /**
   * throttle(fn, limit)
   * Ensures a function is called at most once per `limit` ms.
   * Better for continuous events like scroll where debounce feels laggy.
   *
   * @param   {Function} fn    — function to throttle
   * @param   {number}   limit — minimum ms between calls
   * @returns {Function}         wrapped throttled function
   */
  function throttle(fn, limit) {
    let lastCall = 0;
    return function () {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, arguments);
      }
    };
  }

  /**
   * isMobile()
   * Returns true if viewport width is ≤ 900px.
   * Used to apply mobile-specific behaviour.
   * @returns {boolean}
   */
  function isMobile() {
    return window.innerWidth <= 900;
  }


  /* ============================================================
     BONUS: Close sidebar when pressing Escape key
     Standard UX behaviour for modal/drawer components.
  ============================================================ */

  document.addEventListener('keydown', function (event) {
    // Check if Escape key was pressed
    if (event.key === 'Escape' || event.keyCode === 27) {

      // Close the mobile sidebar if it's open
      if (document.body.classList.contains('sidebar-open')) {
        closeSidebar();
      }

      // Close any open content panel
      const activePanel = document.querySelector('.content-panel.panel-active');
      if (activePanel) {
        hideAllPanels();
        sidebarLinks.forEach(function (link) {
          link.classList.remove('active');
        });
      }
    }
  });


  /* ============================================================
     BONUS: Re-check sidebar on window resize
     If user resizes from mobile → desktop, ensure sidebar is
     properly shown and backdrop is removed.
  ============================================================ */

  window.addEventListener('resize', debounce(function () {
    // If resized to desktop width, remove mobile sidebar state
    if (window.innerWidth > 900) {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  }, 200));


  /* ============================================================
     BONUS: Highlight nav link for currently open panel
     When a panel is open, update the active state in the header
     if the panel corresponds to a main section.
  ============================================================ */

  // Called after a panel opens — adds active class to correct sidebar link
  // Already handled inside showPanel() indirectly via sidebarLinks loop.
  // This is a placeholder for any future header-level sync needed.


  /* ============================================================
     INIT COMPLETE
     All event listeners are attached.
     The page is ready for interaction.
  ============================================================ */
  console.log('[Vibe Boxing] All systems go. 🥊');


  /* ============================================================
     TRIAL CLASS FORM — Validation & Formspree Submit
     Panel id: panel-trial
     Formspree endpoint: https://formspree.io/f/xrejjpov
  ============================================================ */

  const trialForm = document.getElementById('trial-form');

  if (trialForm) {

    trialForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let valid = true;

      // ── Full Name ──
      const name = document.getElementById('trial-name').value.trim();
      document.getElementById('terr-name').textContent =
        !name ? 'Full name is required.' : '';
      if (!name) valid = false;

      // ── Age ──
      const age = parseInt(document.getElementById('trial-age').value, 10);
      document.getElementById('terr-age').textContent =
        !age ? 'Age is required.' : (age < 5 || age > 70) ? 'Enter a valid age (5–70).' : '';
      if (!age || age < 5 || age > 70) valid = false;

      // ── Phone ──
      const phone = document.getElementById('trial-phone').value.trim();
      document.getElementById('terr-phone').textContent =
        !phone ? 'Phone number is required.' : '';
      if (!phone) valid = false;

      // ── Fitness experience ──
      const fitness = document.getElementById('trial-fitness').value;
      document.getElementById('terr-fitness').textContent =
        !fitness ? 'Please select your experience level.' : '';
      if (!fitness) valid = false;

      // ── Why join ──
      const why = document.getElementById('trial-why').value.trim();
      document.getElementById('terr-why').textContent =
        !why ? 'Please tell us why you want to join.' :
        why.length < 20 ? 'Please write at least 20 characters.' : '';
      if (!why || why.length < 20) valid = false;

      // ── Training preference (at least one checkbox) ──
      const checked = trialForm.querySelectorAll('input[name="Preferred Training"]:checked');
      document.getElementById('terr-training').textContent =
        checked.length === 0 ? 'Please select at least one training type.' : '';
      if (checked.length === 0) valid = false;

      // ── Timing ──
      const timing = document.getElementById('trial-timing').value;
      document.getElementById('terr-timing').textContent =
        !timing ? 'Please select a preferred timing.' : '';
      if (!timing) valid = false;

      // ── Stop if invalid ──
      if (!valid) return;

      // ── Valid — submit to Formspree via fetch ──
      const submitBtn = document.getElementById('trial-submit-btn');
      const statusEl  = document.getElementById('trial-form-status');
      const btnText   = submitBtn.querySelector('.btn-text');
      const btnIcon   = submitBtn.querySelector('.btn-icon');

      // Loading state
      submitBtn.disabled    = true;
      submitBtn.style.opacity = '0.7';
      if (btnText) btnText.textContent = 'Sending...';
      if (btnIcon) btnIcon.className   = 'fas fa-spinner fa-spin btn-icon';

      // Submit to Web3Forms — delivers to thevibeboxing@gmail.com
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   new FormData(trialForm)
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          statusEl.textContent = '✓ Application received! We will review it and contact you within 48 hours.';
          statusEl.className   = 'form-status success';
          trialForm.reset();
          setTimeout(function() {
            statusEl.className   = 'form-status';
            statusEl.textContent = '';
          }, 6000);
        } else {
          statusEl.textContent = '✕ Something went wrong. Please try again or contact us directly.';
          statusEl.className   = 'form-status error';
        }
      })
      .catch(function() {
        statusEl.textContent = '✕ Network error. Please check your connection and try again.';
        statusEl.className   = 'form-status error';
      })
      .finally(function() {
        submitBtn.disabled      = false;
        submitBtn.style.opacity = '';
        if (btnText) btnText.textContent = 'Submit Application';
        if (btnIcon) btnIcon.className   = 'fas fa-paper-plane btn-icon';
      });

    });

  }
  // ── End trial form ──


}); // ── End DOMContentLoaded ──