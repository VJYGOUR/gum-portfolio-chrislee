// loadComponent.js

// ✅ Register GSAP plugins once
gsap.registerPlugin(SplitText, ScrollTrigger);

// ✅ Reusable animation function
function animateSplitText(
  selector,
  splitTarget = selector,
  splitType = "chars, words, lines",
  splitPart = "chars",
  options = {}
) {
  document.fonts.ready.then(() => {
    const split = new SplitText(splitTarget, {
      type: splitType,
    });

    gsap.from(split[splitPart], {
      x: 100,
      autoAlpha: 0,
      stagger: {
        amount: 1.5,
        from: "random",
      },
      scrollTrigger: {
        trigger: selector,
        start: "top 70%",
        toggleActions: "play none none none",
      },
      ...options, // Allow overriding or extending properties
    });
  });
}
// testimoniaall carousel

// ✅ Main loadComponent function
async function loadComponent(selector, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    const html = await response.text();
    document.querySelector(selector).innerHTML = html;

    // 🔽 Section-specific animations
    if (selector === "#hero") {
      document.fonts.ready.then(() => {
        const split = new SplitText("#hero .text-anim", {
          type: "chars, words, lines",
        });

        gsap.from(split.words, {
          x: 100,
          autoAlpha: 0,
          stagger: {
            amount: 1.5,
            from: "start",
          },
        });
      });
    } else if (selector === "#awards") {
      animateSplitText("#awards");
    } else if (selector === "footer") {
      animateSplitText("footer");
    } else if (selector === "#about") {
      document.fonts.ready.then(() => {
        const split = new SplitText("#about .about-anim", {
          type: "words",
        });

        gsap.from(split.words, {
          y: 100,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: "#about",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });

        // ✅ Animate progress bars
        const skills = [
          { id: "#bar-photoshop", width: "90%" },
          { id: "#bar-illustrator", width: "85%" },
          { id: "#bar-figma", width: "80%" },
          { id: "#bar-uiux", width: "95%" },
        ];

        skills.forEach((skill) => {
          gsap.to(skill.id, {
            width: skill.width,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: skill.id,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    } else if (selector === "#testimonials") {
      // ✅ Only initialize Swiper after the DOM is injected
      new Swiper("#testimonials .swiper", {
        loop: true,
        speed: 600,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: "#testimonials .swiper-pagination",
          clickable: true,
        },
      });
    }

    // You can add more specific conditions here for other sections like #portfolio or #blogs
  } catch (error) {
    console.error(error);
  }
}

// ✅ Load all components
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("#hero", "/components/hero.html");
  loadComponent("#about", "/components/about.html");
  loadComponent("#portfolio", "/components/portfolio.html");
  loadComponent("#awards", "/components/awards.html");
  loadComponent("#blogs", "/components/blogs.html");
  loadComponent("#testimonials", "/components/testimonials.html");
  loadComponent("#contact", "/components/contact.html");
  loadComponent("footer", "/components/footer.html");
});
