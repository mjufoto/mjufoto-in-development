// landing page script - incl. auto scroll animation & random photo selection
gsap.registerPlugin(Observer);
gsap.registerPlugin(SplitText);

let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    splitHeadings = headings.map(heading => new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text", reduceWhiteSpace: false })),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating,
    autoScrollDelay = 2000, // 3 seconds
    sectionTimers = []; // Array to hold timers for each section

const imageSets = {
    "section-one": [
        {
            webpSmall: "image-finals/section-one-images/untitled-4761/mjufoto-artwork-untitled-4761-year-2021-small.webp",
            webpLarge: "image-finals/section-one-images/untitled-4761/mjufoto-artwork-untitled-4761-year-2021-large.webp",
            jpgFallback: "image-finals/section-one-images/untitled-4761/mjufoto-artwork-untitled-4761-year-2021.jpg",
            alt: "Dusk urban cityscape, rendered abstractly through long exposure and intentional camera movement. Four silhouetted buildings appear as vertical brushstrokes against a backlit sky transitioning from deep aqua to sunset orange. Vertical light trails indicate windows. Soft, film-like grain."
        },
        {
            webpSmall: "image-finals/section-one-images/untitled-1659/mjufoto-artwork-untitled-1659-year-2021-small.webp",
            webpLarge: "image-finals/section-one-images/untitled-1659/mjufoto-artwork-untitled-1659-year-2021-large.webp",
            jpgFallback: "image-finals/section-one-images/untitled-1659/mjufoto-artwork-untitled-1659-year-2021.jpg",
            alt: "Forest canopy rendered abstractly through long exposure and intentional camera movement creating a brushstroke effect. Shadowed branch network visible beneath vibrant green leaves, specs of golden and cyan sky touch the treetops. Evokes sense of movement and reflection."
        },
        {
            webpSmall: "image-finals/section-one-images/winter-plate/mjufoto-artwork-winter-plate-year-2021-small.webp",
            webpLarge: "image-finals/section-one-images/winter-plate/mjufoto-artwork-winter-plate-year-2021-large.webp",
            jpgFallback: "image-finals/section-one-images/winter-plate/mjufoto-artwork-winter-plate-year-2021.jpg",
            alt: "Abstract photograph created using long exposure and intentional camera movement, evoking the look of a vintage wet plate. A dark horizon line bisects the image, featuring a silhouetted tree. The camera movement results in vertical brushstrokes, with a predominantly monochromatic palette of bronze, gold, and black. Minimalist composition."
        }
    ],
    "section-two": [
        {
            webpSmall: "image-finals/section-two-images/cloud-city/mjufoto-artwork-cloud-city-year-2020-small.webp",
            webpLarge: "image-finals/section-two-images/cloud-city/mjufoto-artwork-cloud-city-year-2020-large.webp",
            jpgFallback: "image-finals/section-two-images/cloud-city/mjufoto-artwork-cloud-city-year-2020.jpg",
            alt: "Abstractly rendered image of a city-scape, achieved through long exposure and intentional camera movement. This creates a brushstroke impression with a palette of peach, cyan, and green-blue tones. Silhouetted buildings stand against a sunset sky with a soft grain texture."
        },
        {
            webpSmall: "image-finals/section-two-images/crossroad/mjufoto-artwork-crossroad-year-2024-small.webp",
            webpLarge: "image-finals/section-two-images/crossroad/mjufoto-artwork-crossroad-year-2024-large.webp",
            jpgFallback: "image-finals/section-two-images/crossroad/mjufoto-artwork-crossroad-year-2024.jpg",
            alt: "Pastoral scene of a dusk-lit prairie. A single telephone pole stands prominently, supporting a single wire that extends into the distance. Tall grasses line a gravel road in the foreground, with farmed fields beyond. A waxing gibbous moon hangs in the sky. Soft grain texture throughout."
        },
        {
            webpSmall: "image-finals/section-two-images/horizon/mjufoto-artwork-horizon-year-2021-small.webp",
            webpLarge: "image-finals/section-two-images/horizon/mjufoto-artwork-horizon-year-2021-large.webp",
            jpgFallback: "image-finals/section-two-images/horizon/mjufoto-artwork-horizon-year-2021.jpg",
            alt: "Atmospheric winter dusk scene with a silhouetted, tree-lined ridge against a dark sky. Warm pastel clouds provide a soft contrast to the deep blue and cyan sky. A predominant but soft grain texture is present throughout the image."
        }
    ],
    "section-three": [
        {
            webpSmall: "image-finals/section-three-images/inversion/mjufoto-artwork-inversion-year-2024-small.webp",
            webpLarge: "image-finals/section-three-images/inversion/mjufoto-artwork-inversion-year-2024-large.webp",
            jpgFallback: "image-finals/section-three-images/inversion/mjufoto-artwork-inversion-year-2024.jpg",
            alt: "Black and white photograph of a forest where the trees are silhouetted and outlined in blacks, greys, and whites through tonal response manipulation. Tall grasses fill the foreground."
        },
        {
            webpSmall: "image-finals/section-three-images/tranquil/mjufoto-artwork-tranquil-year-2022-small.webp",
            webpLarge: "image-finals/section-three-images/tranquil/mjufoto-artwork-tranquil-year-2022-large.webp",
            jpgFallback: "image-finals/section-three-images/tranquil/mjufoto-artwork-tranquil-year-2022.jpg",
            alt: "Abstract image with a foreground suggesting water, a silhouetted horizon, and a late-afternoon sky brushed with tones of peach, teal, and pastel. Deep black saturates the horizon. The image has a prominent but soft grain texture."
        },
        {
            webpSmall: "image-finals/section-three-images/turmoil/mjufoto-artwork-turmoil-year-2022-small.webp",
            webpLarge: "image-finals/section-three-images/turmoil/mjufoto-artwork-turmoil-year-2022-large.webp",
            jpgFallback: "image-finals/section-three-images/turmoil/mjufoto-artwork-turmoil-year-2022.jpg",
            alt: "Abstractly rendered image evoking the impression of turbulent ocean waters with a colour palette of deep blues, dense blacks, and soft peach highlights."
        }
    ]
};

const displayedArtworks = {};

Object.keys(imageSets).forEach(key => {
    displayedArtworks[key] = [];
});


gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function clearSectionTimer(index) {
    if (sectionTimers[index]) {
        clearTimeout(sectionTimers[index]);
        sectionTimers[index] = null;
    }
}

function setSectionTimer(index) {
    clearSectionTimer(index);
    sectionTimers[index] = setTimeout(() => {
        if (!animating && currentIndex === index) {
            gotoSection(currentIndex + 1, 1);
        }
    }, autoScrollDelay);
}

function setRandomBackgroundImage(section) {
    //console.log("setRandomBackgroundImage called for:", section);
    const sectionClass = section.classList[0];
    //console.log("sectionClass:", sectionClass);
    const bgDiv = section.querySelector(".bg");
    //console.log("bgDiv:", bgDiv);
    const pictureElement = bgDiv ? bgDiv.querySelector(".full-screen-image") : null;
    //console.log("pictureElement:", pictureElement);
    const sourceElements = pictureElement ? pictureElement.querySelectorAll("source") : null;
    //console.log("sourceElements:", sourceElements);
    const imgElement = pictureElement ? pictureElement.querySelector("img") : null;
    //console.log("imgElement:", imgElement);
    const artworkArray = imageSets[sectionClass];
    //console.log("artworkArray:", artworkArray);
    const displayed = displayedArtworks[sectionClass];
    //console.log("displayed:", displayed);

    if (pictureElement && artworkArray) {
        let randomIndex;
        let selectedArtwork;
        let attempts = 0;
        const maxAttempts = artworkArray.length * 2;
        let isDisplayed = false;

        // Check if all images have been displayed for this section
        if (displayed.length === artworkArray.length) {
            //console.log(`Resetting displayedArtworks BEFORE selection for ${sectionClass}`);
            displayedArtworks[sectionClass] = []; // Reset for a new cycle
        }

        // If displayed is empty (just reset or initial load), pick the first random one
        if (displayed.length === 0) {
            randomIndex = Math.floor(Math.random() * artworkArray.length);
            selectedArtwork = artworkArray[randomIndex];
        } else {
            do {
                randomIndex = Math.floor(Math.random() * artworkArray.length);
                selectedArtwork = artworkArray[randomIndex];
                attempts++;
                isDisplayed = false;

                isDisplayed = displayed.some(displayedArtwork =>
                    displayedArtwork.webpLarge === selectedArtwork.webpLarge
                );

            } while (isDisplayed && attempts < maxAttempts);
        }

        if (selectedArtwork) { // Ensure we have a selected artwork
            //console.log(`Selected artwork for ${sectionClass}:`, selectedArtwork.alt);
            if (sourceElements && sourceElements.length >= 2 && imgElement) {
                sourceElements[0].media = "(max-width: 767px)";
                sourceElements[0].srcset = selectedArtwork.webpSmall;
                sourceElements[0].type = "image/webp";

                sourceElements[1].media = "(min-width: 768px)";
                sourceElements[1].srcset = selectedArtwork.webpLarge;
                sourceElements[1].type = "image/webp";

                imgElement.src = selectedArtwork.jpgFallback;
                imgElement.alt = selectedArtwork.alt;
            } else if (imgElement && selectedArtwork.jpgFallback) {
                imgElement.src = selectedArtwork.jpgFallback;
                imgElement.alt = selectedArtwork.alt;
            }
            displayedArtworks[sectionClass].push(selectedArtwork);
            //console.log(`After push for ${sectionClass}:`, displayedArtworks[sectionClass]);
        } else {
            const fallbackIndex = Math.floor(Math.random() * artworkArray.length);
            const fallbackArtwork = artworkArray[fallbackIndex];
            if (imgElement) {
                imgElement.src = fallbackArtwork.jpgFallback;
                imgElement.alt = fallbackArtwork.alt;
            }
            displayedArtworks[sectionClass] = [fallbackArtwork];
            //console.warn(`Could not find a unique artwork for ${sectionClass} after ${maxAttempts} attempts (or on reset). Forced fallback.`);
        }
    }
}

function gotoSection(index, direction) {
    index = wrap(index); // make sure it's valid
    animating = true;

    // Clear timer for the previous section
    if (currentIndex >= 0) {
        clearSectionTimer(currentIndex);
    }

    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: { duration: 1.25, ease: "power1.inOut" },
            onComplete: () => {
                animating = false;
                setSectionTimer(index); // Start timer for the new section
            }
        });

    if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
            .set(sections[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    setRandomBackgroundImage(sections[index]);
    tl.fromTo([outerWrappers[index], innerWrappers[index]], {
            yPercent: i => i ? -100 * dFactor : 100 * dFactor
        }, {
            yPercent: 0
        }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(splitHeadings[index].chars, {
            autoAlpha: 0,
            yPercent: 150 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
                each: 0.02,
                from: "random"
            }
        }, 0.2);

    currentIndex = index;
}

const observer = Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => {
        if (!animating) {
            clearSectionTimer(currentIndex); // Clear timer on user interaction
            gotoSection(currentIndex - 1, -1);
        }
    },
    onUp: () => {
        if (!animating) {
            clearSectionTimer(currentIndex); // Clear timer on user interaction
            gotoSection(currentIndex + 1, 1);
        }
    },
    tolerance: 10,
    preventDefault: true
});

setRandomBackgroundImage(sections[0]);
gotoSection(0, 1); // Initialize with the first section and start its timer




// BUILDING THE IMAGE SETS
