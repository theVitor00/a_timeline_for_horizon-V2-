import { timelineEvents } from "..//data/timeline-data.js";
import { navigateToIndex } from "./timeline-core.js";


function searchTerms() {
  const searchButton = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-terms");
  const resultArea = document.querySelector(".result-container");
  const closeDialog = document.querySelector(".btn-close");

    function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  searchInput.addEventListener("input", (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    resultArea.innerHTML = ""; 

    if (query === "") return; 

    const regex = new RegExp(escapeRegex(query), "i");

    timelineEvents.forEach((register) => {
      if (regex.test(register.description)) {
        resultArea.appendChild(insertResult(register.title));
        getIndexOfEntry(timelineEvents, register);
      }
    });
  });

  closeDialog.addEventListener("click", () => { searchInput.value = ""; });
}


function insertResult(result) {
    const foundEntries = document.createElement("div");
    foundEntries.classList.add("list-group", "py-1");

    const entry = document.createElement("a");
    entry.setAttribute("role", "button");

    if(foundEntries.hasChildNodes()) {
        entry.classList.add("list-group-item", "list-group-item-action", "active", "bg-info-subtle", "flex-column");
        entry.setAttribute("aria-current", "true");
    } else {
        entry.classList.add("list-group-item", "list-group-item-action");
    }
    entry.innerText = `${result}`;

    foundEntries.appendChild(entry);

    return foundEntries;
}

function getIndexOfEntry(entries, register) {
    alert(entries.indexOf(register))
}

export { searchTerms }
