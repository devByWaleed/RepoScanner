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
// let selectedItems = document.querySelectorAll(".item");



// Hide by default
otherBranch.style.display = 'none';
outputSection.style.display = 'none';

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

let searchArray = [];
let selectedItem = "";

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

    let userName = repoElements[repoElements.length - 2]
    let repoName = repoElements[repoElements.length - 1]
    let branchName = getSelectedValue();

    inputSection.style.display = 'none';

    outputSection.style.display = 'flex';

    detailCont.innerHTML += `
        <p style="color: #172554;">${userName}</p>
        <p style="color: #172554;">${repoName}</p>
    `


    // Editing container on loading state
    output.innerHTML = `<p>⏳ Fetching files...</p>`; // loading state

    // Fetching data
    try {
        const res = await fetch(`https://api.github.com/repos/${userName}/${repoName}/git/trees/${branchName}?recursive=1`);
        const data = await res.json();

        if (!data.tree) {
            output.innerHTML = `<p>⚠️ Could not fetch files. Check repo URL or branch name.</p>`;
            return;
        }

        searchArray = data["tree"];

        output.innerHTML = ""
        for (let i = 0; i < searchArray.length; i++) {

            let path = searchArray[i].path;

            output.innerHTML += `
                <p style="color: #37085eff;">${path} <button onclick="selectedItem = ${path};"
                >Copy</button></p>
            `
        }
    }
    catch (error) {
        output.innerHTML = `<p>❌ Error while fetching data</p>`;
    }

    return searchArray;

}

// Calling main function
fetchBtn.addEventListener("click", fetchData);



// Search Bar Logic
searchBar.addEventListener("input", function () {
    output.innerHTML = "";

    for (let i = 0; i < searchArray.length; i++) {

        let path = searchArray[i].path;

        if (path.toLowerCase().includes(searchBar.value.toLowerCase())) {

            output.innerHTML += `
                <p style="color: #37085eff;">${path} <button style="padding:5px">Copy</button></p>
                `
        }
    }
});


// Logic for full path




/*
if (path.includes("lc-1")) {

    correctPath = path.replaceAll(" ", "%20");
    console.log(`Original Path: ${path}`);
    console.log(`Handling Space: ${correctPath}`);

    let generatedURL = `https://github.com/${userName}/${repoName}/blob/${branchName}/${correctPath}`;
    console.log(`Full URL: ${generatedURL}`);
}
*/