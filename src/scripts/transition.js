import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  function calculateLogoScale() {
    const logoSize = 60;
    const logoData =
      'm 190.93268,149.13926 c -0.93714,0 -1.69191,0.87709 -1.69191,1.96749 v 35.4292 c 0,1.0904 0.75477,1.96749 1.69191,1.96749 h 115.02756 c 0.93714,0 1.69191,-0.87709 1.69191,-1.96749 v -35.4292 c 0,-1.0904 -0.75477,-1.96749 -1.69191,-1.96749 z m 58.69139,39.73909 c -0.37331,0.013 -0.74725,0.1347 -1.07347,0.37171 l -28.26421,20.53526 c -0.86992,0.63203 -1.06142,1.84098 -0.42939,2.7109 l 49.28173,67.83188 c 0.63204,0.86992 1.84259,1.06142 2.71251,0.42939 l 28.26422,-20.53526 c 0.86991,-0.63203 1.06142,-1.84099 0.42938,-2.71091 l -49.28333,-67.83187 c -0.39502,-0.5437 -1.01526,-0.82284 -1.63744,-0.8011 z';

    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', logoData);
    tempSvg.appendChild(tempPath);
    document.body.appendChild(tempSvg);

    const bbox = tempPath.getBBox();
    document.body.removeChild(tempSvg);

    const scale = logoSize / Math.max(bbox.width, bbox.height);

    return { scale, bbox };
  }

  function createMaskOverlay() {
    const maskOverlay = document.querySelector('.mask-transition');

    maskOverlay.innerHTML = `
      <svg width="100%" height="100%">
        <defs>
          <mask id="logoRevealMask">
            <rect width="100%" height="100%" fill="white" />
            <path id="logoMask" fill="black"></path>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="var(--base-300)"
          mask="url(#logoRevealMask)"
        />
      </svg>
    `;
  }

  revealTransition();

  function revealTransition() {
    return new Promise((resolve) => {
      createMaskOverlay();

      const logoMask = document.getElementById('logoMask');
      const logoData =
        'm 190.93268,149.13926 c -0.93714,0 -1.69191,0.87709 -1.69191,1.96749 v 35.4292 c 0,1.0904 0.75477,1.96749 1.69191,1.96749 h 115.02756 c 0.93714,0 1.69191,-0.87709 1.69191,-1.96749 v -35.4292 c 0,-1.0904 -0.75477,-1.96749 -1.69191,-1.96749 z m 58.69139,39.73909 c -0.37331,0.013 -0.74725,0.1347 -1.07347,0.37171 l -28.26421,20.53526 c -0.86992,0.63203 -1.06142,1.84098 -0.42939,2.7109 l 49.28173,67.83188 c 0.63204,0.86992 1.84259,1.06142 2.71251,0.42939 l 28.26422,-20.53526 c 0.86991,-0.63203 1.06142,-1.84099 0.42938,-2.71091 l -49.28333,-67.83187 c -0.39502,-0.5437 -1.01526,-0.82284 -1.63744,-0.8011 z';

      logoMask.setAttribute('d', logoData);

      const { scale: logoScale, bbox } = calculateLogoScale();
      const pathCenterX = bbox.x + bbox.width / 2;
      const pathCenterY = bbox.y + bbox.height / 2;

      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const initialScale = logoScale;
      const translateX = viewportCenterX - pathCenterX * initialScale;
      const translateY = viewportCenterY - pathCenterY * initialScale;

      logoMask.setAttribute(
        'transform',
        `translate(${translateX}, ${translateY}) scale(${initialScale})`
      );

      gsap.set('.mask-transition', {
        display: 'block',
      });

      gsap.set('.mask-bg-overlay', {
        display: 'block',
        opacity: 1,
      });

      const scaleMultiplier = window.innerWidth < 1000 ? 15 : 40;

      gsap.to(
        {},
        {
          duration: 1,
          delay: 0,
          ease: 'power4.out',
          onUpdate: function () {
            const progress = this.progress();
            const scale = initialScale + progress * scaleMultiplier;

            const newTranslateX = viewportCenterX - pathCenterX * scale;
            const newTranslateY = viewportCenterY - pathCenterY * scale;

            logoMask.setAttribute(
              'transform',
              `translate(${newTranslateX}, ${newTranslateY}) scale(${scale})`
            );

            const fadeProgress = Math.min(0.3, progress * 2.5);
            gsap.set('.mask-bg-overlay', {
              opacity: 0.3 - fadeProgress,
            });
          },
          onComplete: () => {
            gsap.set('.mask-transition', { display: 'none' });
            gsap.set('.mask-bg-overlay', { display: 'none' });
            resolve();
          },
        }
      );

      gsap.set('.transition-overlay', { scaleY: 0 });
    });
  }

  function animateTransition() {
    return new Promise((resolve) => {
      gsap.set('.transition-overlay', { scaleY: 0, transformOrigin: 'bottom' });

      gsap.to('.transition-overlay', {
        scaleY: 1,
        duration: 0.75,
        ease: 'power4.out',
        onStart: () => {
          gsap.set('.transition-logo', {
            top: '120%',
            opacity: 1,
          });

          gsap.to('.transition-logo', {
            top: '50%',
            transform: 'translate(-50%, -50%)',
            duration: 0.75,
            delay: 0.5,
            ease: 'power4.out',
            onComplete: () => {
              setTimeout(() => {
                resolve();
              }, 50);
            },
          });
        },
      });
    });
  }

  function closeMenuIfOpen() {
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    if (menuToggleBtn && menuToggleBtn.classList.contains('menu-open')) {
      menuToggleBtn.click();
    }
  }

  function isSamePage(href) {
    if (!href || href === '#' || href === '') return true;

    const currentPath = window.location.pathname;

    if (href === currentPath) return true;

    if (
      (currentPath === '/' || currentPath === '/index.html') &&
      (href === '/' || href === '/index.html' || href === 'index.html' || href === './index.html')
    ) {
      return true;
    }

    const currentFileName = currentPath.split('/').pop() || 'index.html';
    const hrefFileName = href.split('/').pop();

    if (currentFileName === hrefFileName) return true;

    return false;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (!link) return;

    const href = link.getAttribute('href');

    if (
      href &&
      (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))
    ) {
      return;
    }

    if (isSamePage(href)) {
      event.preventDefault();
      closeMenuIfOpen();
      return;
    }

    event.preventDefault();

    animateTransition().then(() => {
      window.location.href = href;
    });
  });
});
