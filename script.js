// Grapping Elements

// Input Section Elements
let inputSection = document.getElementById("input-card");
let githubURL = document.getElementById("github-url");
let branchSelect = document.getElementById("select-branch");
let otherBranch = document.getElementById("custom-branch");
let fetchBtn = document.getElementById("fetchBtn");

// Output Section Elements
let outputSection = document.getElementById("output-card");
let searchBar = document.getElementById("search");
let detailCont = document.getElementById("details");
let output = document.getElementById("result");
let urlSection = document.querySelector("#overlay");
// let closeBtn = document.getElementById("close-icon");
let copyBtn = document.getElementById("copy-btn");



// Hide by default
otherBranch.style.display = 'none';
outputSection.style.display = 'none';
urlSection.style.display = 'none';



// Logic for custom input field display
branchSelect.addEventListener('change', function () {
    if (this.value === 'other') {
        otherBranch.style.display = 'inline-block';
        otherBranch.focus();
    } else {
        otherBranch.style.display = 'none';
        otherBranch.value = ''; // Clear input if 'other' is not selected
    }
});


// Function to get branch name
function getSelectedValue() {
    if (branchSelect.value === 'other') {
        return otherBranch.value;
    } else {
        return branchSelect.value;
    }
}



// Global Variables To Use Anywhere In Code
let searchArray = [];
let userName = "";
let repoName = "";
let branchName = "";



// Function to fetch data from API
const fetchData = async () => {

    const repoLink = githubURL.value.trim();

    // No longer required after making form
    if (!repoLink) {
        alert("Please enter a GitHub repo URL!");
        return;
    }

    // Extract userName, repoName & branchName
    let repoElements = repoLink.split("/");
    console.log(repoElements);

    let user = repoElements[repoElements.length - 2]
    let repo = repoElements[repoElements.length - 1]
    let branch = getSelectedValue();

    userName = user;
    repoName = repo;
    branchName = branch;

    inputSection.style.display = 'none';

    outputSection.style.display = 'flex';

    detailCont.innerHTML += `
        <p style="color: #172554;">${userName}</p>
        <p style="color: #172554;">${repoName}</p>
    `


    // Editing container on loading state
    output.innerHTML = `<p style="color: white;>⏳ Fetching files...</p>`; // loading state

    // Fetching data
    try {
        const res = await fetch(`https://api.github.com/repos/${userName}/${repoName}/git/trees/${branchName}?recursive=1`);
        const data = await res.json();

        if (!data.tree) {
            output.innerHTML = `<p style="color: white;>⚠️ Could not fetch files. Check repo URL or branch name.</p>`;
            return;
        }

        searchArray = data["tree"];

        output.innerHTML = ""
        for (let i = 0; i < searchArray.length; i++) {

            let path = searchArray[i].path;

            output.innerHTML += `
                <p style="color: white;">
                    <button 
                    style="background: none; border: none; cursor: pointer; font-size: 20px;"
                    onclick="getURL('${path}')">🔗</button> 
                    ${path}
                </p>
            `
        }
    }
    catch (error) {
        output.innerHTML = `<p>❌ Error while fetching data</p>`;
    }
}
// Calling Main Function
fetchBtn.addEventListener("click", fetchData);



// Debouncing + Fragment For Efficient DOM Behaviour
let debounceTimer;
searchBar.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 300);
});

function runSearch() {
    const query = searchBar.value.toLowerCase();
    output.innerHTML = "";

    const fragment = document.createDocumentFragment(); // efficient DOM building

    for (let i = 0; i < searchArray.length; i++) {
        let path = searchArray[i].path;

        if (path.toLowerCase().includes(query)) {
            let p = document.createElement("p");
            p.style.color = "white";
            p.innerHTML = `
                <button 
                  style="background:none;border:none;cursor:pointer;font-size:20px;"
                  onclick="getURL('${path}')">🔗</button> 
                ${path}
            `;
            fragment.appendChild(p);
        }
    }

    output.appendChild(fragment);
}



// Function For Full Path
const getURL = (path) => {

    urlSection.style.display = 'flex';

    correctPath = path.replaceAll(" ", "%20");
    console.log(`Original Path: ${path}`);
    console.log(`Handling Space: ${correctPath}`);

    let generatedURL = `https://github.com/${userName}/${repoName}/blob/${branchName}/${correctPath}`;
    console.log(`Full URL: ${generatedURL}`);

    urlSection.innerHTML += `
        <div class="url">           
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
            xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Close" style="position: fixed; right: 10px; top: 10px; cursor: pointer;">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>

            <h2>Full Path</h2>
            <div class="path-detail">
                <p class="url-animate">
                https://github.com/${userName}/${repoName}/blob/${branchName}/${correctPath}
                </p>
                <button>
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" 
                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Copy">
                        <rect x="3.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/>
                        <rect x="5.5" y="1.5" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/>
                    </svg>
                </button>
            </div>
        </div>
    `

    // return generatedURL;
    // onclick="copy()"
};



/*
// Function For Copy Text Functionality
const copy = () => {

    let URL = getURL();
    // Check If The Clipboard Api Is Available
    if (navigator.clipboard) {

        // Copy The Text Inside The Text Field
        navigator.clipboard.writeText(URL)
            .then(() => {
                // Alert The Copied Text
                alert("Text Copied!!");
            })
            .catch((error) => {
                console.error("Error copying text: ", error);
                alert("Failed to copy text. Please try again.");
            });
    }

    else {
        // Fallback for older browsers
        // Select the text field
        URL.select();
        URL.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand("copy");
            alert("Text Copied!!");
        } catch (error) {
            console.error("Error copying text: ", error);
            alert("Failed to copy text. Please try again.");
        }
    }
};
*/