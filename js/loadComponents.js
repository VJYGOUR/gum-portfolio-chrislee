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
    } else if (selector === "#testimonials") {
      animateSplitText("#testimonials .test-anim");

      document.fonts.ready.then(() => {
        const quotes = gsap.utils.toArray("#testimonials .testimonial-quote");
        let currentIndex = 0;

        // Ensure only one visible at init
        quotes.forEach((q, i) => {
          gsap.set(q, {
            opacity: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 30,
            zIndex: i === 0 ? 1 : 0,
          });
          q.classList.toggle("active", i === 0);
        });

        // Function to rotate testimonials
        let rotationTimer; // Declare a variable to hold the delayedCall instance

        const rotateTestimonials = () => {
          const current = quotes[currentIndex];
          const nextIndex = (currentIndex + 1) % quotes.length;
          const next = quotes[nextIndex];

          gsap.to(current, {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: "power2.out",
            onStart: () => current.classList.remove("active"),
            onComplete: () => {
              gsap.set(current, { zIndex: 0 }); // Lower z-index of the outgoing quote

              gsap.set(next, { y: 30, zIndex: 1 }); // Set initial position for incoming quote
              gsap.to(next, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                onStart: () => next.classList.add("active"),
                onComplete: () => {
                  currentIndex = nextIndex;
                  // Only continue the rotation if the section is still in view
                  if (ScrollTrigger.isInViewport("#testimonials")) {
                    rotationTimer = gsap.delayedCall(4, rotateTestimonials);
                  }
                },
              });
            },
          });
        };

        // Only start rotating when section enters view
        ScrollTrigger.create({
          trigger: "#testimonials",
          start: "top 70%",
          once: true, // This ensures the timer is only initiated once on first entry
          onEnter: () => {
            rotationTimer = gsap.delayedCall(4, rotateTestimonials); // Start the first rotation
          },
          onLeaveBack: () => {
            // Optional: Stop rotation if scrolling back up and out of view
            if (rotationTimer) {
              rotationTimer.kill(); // Kill the delayedCall if it exists
            }
          },
        });
      });
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
