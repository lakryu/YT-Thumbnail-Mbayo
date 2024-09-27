// Bilder aus Ordner images
const imageFilePath = "images/";
const numImages = 42;

function getRandomIndex(numImages) {
  return Math.floor(Math.random() * numImages);
}

function getRandomImageURL() {
  const randomImage = getRandomIndex(numImages);
  const url = chrome.runtime.getURL(`${imageFilePath}${randomImage}.png`);
  console.log("Generated URL:", url);
  return url;
}

// Funktion, um Thumbnails zu ersetzen
function replaceThumbnails() {
  const thumbnailQuery =
    "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])";

  const thumbnails = document.querySelectorAll(thumbnailQuery);

  thumbnails.forEach((image) => {
    // Überprüfen, ob das Zielbild vorhanden ist
    const url = getRandomImageURL();
    if (image) {
      // Erstelle das überlagernde Bild
      const overlay = document.createElement("img");
      console.log("randomImage", url, image);

      // Set the src attribute only after the image is fully loaded
      overlay.onload = () => {
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.zIndex = "0"; // Sicherstellen, dass es über allen anderen Overlays liegt
        overlay.style.opacity = 1; // Setze die Transparenz für das Overlay

        // Sicherstellen, dass das überlagernde Bild innerhalb des Eltern-Containers korrekt positioniert wird
        const parent = image.parentElement;
        if (parent) {
          console.log("Appending overlay to parent", parent);
          image.style.position = "relative"; // Setze den Container auf 'relative', um das Bild korrekt zu platzieren
          parent.appendChild(overlay);
        } else {
          console.error("Parent element not found for image", image);
        }
      };
      overlay.onerror = () => {
        console.error("Failed to load image:", url);
      };
      overlay.src = url;
    } else if (image.nodeName === "DIV") {
      // Wenn das Thumbnail ein DIV ist, als Hintergrundbild anwenden
      image.style.backgroundImage = `url("${getRandomImageURL()}"), ${image.style.backgroundImage}`;
      image.style.backgroundSize = "cover"; // Sicherstellen, dass das Hintergrundbild richtig skaliert wird
      image.style.backgroundPosition = "center"; // Hintergrundbild zentrieren
    }
  });
}

// Lade die Funktion, wenn die Seite geladen wird
window.addEventListener("load", replaceThumbnails);
