import { historicalPeriods } from "../data/historical-data.js";

function searchTerms() {

    const searchButton = document.querySelector(".search-btn");
    const searchTerms = document.querySelector(".search-terms");
    const resultArea = document.querySelector(".result-container");
  
    searchTerms.addEventListener("input", (e) => {
        e.preventDefault();

        let query = searchTerms.value;
       
        historicalPeriods.forEach(register => {
            
            if(register.description.includes(query.toLowerCase())) {
                console.log(`${register.id} contains the "${query}" terms`);  
                resultArea.appendChild(insertResult(register.name));
            } else {
                console.log("not found")
            }
        });
    })

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        let query = searchTerms.value;
       
        historicalPeriods.forEach(register => {
            
            if(register.description.includes(query)) {
                console.log(`${register.id} contains the "${query}" terms`);  
                resultArea.appendChild(insertResult(register.name));
            } else {
                console.log("not found")
            }
        });

        searchTerms.value = "";    
    });
}

function insertResult(result) {
    const container = document.createElement("div");
    container.innerHTML = `
        <p>${result}</p>
    `

    return container;
}

export { searchTerms }
