const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameElem = document.getElementById("website-name");
const websiteUrlElem = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add("show-modal");
    websiteNameElem.focus();
}

// Modal Event Listenere
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => modal.classList.remove("show-modal"));
window.addEventListener("click", (e) => (e.target === modal ? modal.classList.remove("show-modal") : false));

// Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert("Please submit values for both fields.");
        return false;
    }
    if(urlValue.match(regex)) {
        alert("match");
    } 
    if(!urlValue.match(regex)) {
        alert("Please provide a valid web address!");
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = "";
    // Build Items
    bookmarks.forEach((bookmark) => {
       const { name, url } = bookmark;
       // Item
       const item = document.createElement("div");
       item.classList.add("item");
       // Close Icon
       const closeIcon = document.createElement("i");
       closeIcon.classList.add("fas", "fa-times");
       closeIcon.setAttribute("title", "Delete Bookmark");
       closeIcon.setAttribute("onclick", `deleteBookmark("${url}")`);
       // Favicon / Link Container
       const linkInfo = document.createElement("div");
       linkInfo.classList.add("name");
       // Favicon
       const favicon = document.createElement("img");
       favicon.setAttribute("src", `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
       favicon.setAttribute("alt", "Favicon");
       // Link
       const link = document.createElement("a");
       link.setAttribute("href", `${url}`);
       link.setAttribute("target", "_blank");
       link.textContent = name;
       // Append to bookmarks container
       linkInfo.append(favicon, link);
       item.append(closeIcon, linkInfo);
       bookmarksContainer.appendChild(item);
    });
}

// Fetch our Bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if(localStorage.getItem("bookmarks")) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
        // Create a bookmarks array in localStorage
        bookmarks = [
            {
                name: "Google",
                url: "https://www.google.com/"
            },
        ];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, idx) => {
        if(bookmark.url === url) {
            bookmarks.splice(idx, 1);
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameElem.value;
    let urlValue = websiteUrlElem.value;
    if(!urlValue.includes("https://") && !urlValue.includes("http://")) {
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    // Create and object with our valid values from our form
    const bookmark = {
        name: nameValue,
        url: urlValue
    };
    // Save the object inside an array to use them later to populate our UI  
    bookmarks.push(bookmark);
    // Save our array data into localStorage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    // Reset our form after submiting the values
    bookmarkForm.reset();
    websiteNameElem.focus();
}

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On load
fetchBookmarks();