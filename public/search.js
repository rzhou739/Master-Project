// publics/search.js
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const author = document.getElementById('author').value.trim();
    const title = document.getElementById('title').value.trim();
    const year = document.getElementById('year').value.trim();
    const keywords = document.getElementById('keywords').value.trim();

    if (!author && !title && !year && !keywords) {
        alert('Please enter search criteria');
        return;
    }

    const response = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, title, year, keywords }),
    });

    const results = await response.json();
    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <h3>${result.title}</h3>
            <p>Author: ${result.author}</p>
            <p>Year: ${result.year}</p>
            <p>Keywords: ${result.keywords}</p>
        `;
        resultsDiv.appendChild(resultDiv);
    });
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p style="font-size: 40px; color: red; text-align: center; margin: 20px;">No results found.</p>';
        return;
    }

    // Create the table
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '80%';
    table.style.border = '1px solid black';

  // Create the table header
    const headerRow = document.createElement('tr');
    const headers = [
    { text: 'File_Title',class: 'title' },
    { text: 'Author', class: 'author' },
    { text: 'Year', class: 'year' },
    { text: 'Keywords', class: 'keywords' },
    
    { text: 'Download', class: 'download' },
    ];
    headers.forEach(headerData => {
    const header = document.createElement('th');
    header.textContent = headerData.text;
    header.className = headerData.class; // Add the class name
    header.style.border = '1px solid black';
    header.style.padding = '8px';
    headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Create table rows for each result
    results.forEach(result => {
        const fileName = result.file_path.split('/').pop();
        const row = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.textContent = result.file_title;
        row.appendChild(titleCell);

        const authorCell = document.createElement('td');
        authorCell.textContent = result.author;
        row.appendChild(authorCell);

        const yearCell = document.createElement('td');
        yearCell.textContent = result.year;
        row.appendChild(yearCell);

        const keywordsCell = document.createElement('td');
        keywordsCell.textContent = result.keywords;
        row.appendChild(keywordsCell);

        const downloadCell = document.createElement('td');
        const downloadLink = document.createElement('a');
        downloadLink.href = `/download/${encodeURIComponent(fileName)}`;
        downloadLink.download = fileName;
        downloadLink.textContent = 'Download Report';
        downloadCell.appendChild(downloadLink);
        row.appendChild(downloadCell);

        // Style the table cells
        Array.from(row.children).forEach(cell => {
            cell.style.border = '1px solid black';
            cell.style.padding = '8px';
        });

        table.appendChild(row);
    });

    resultsDiv.appendChild(table);
}

// document.getElementById('search-form').addEventListener('submit', async (event) => {
//     event.preventDefault();
  
//     const author = document.getElementById('author').value.trim();
//     const title = document.getElementById('title').value.trim();
//     const yearFrom = document.getElementById('year-from').value.trim();
//     const yearTo = document.getElementById('year-to').value.trim();
//     const keywords = document.getElementById('keywords').value.trim();
  
//     if (!author && !title && !yearFrom && !yearTo && !keywords) {
//       alert('Please enter search criteria');
//       return;
//     }
  
//     const response = await fetch('/search', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ author, title, yearFrom, yearTo, keywords }),
//     });
  
//     if (!response.ok) {
//       alert('An error occurred during the search. Please try again later.');
//       return;
//     }
  
//     const results = await response.json();
//     displayResults(results);
//   });
//   function displayResults(results) {
//     const resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';
  
//     if (results.length === 0) {
//       resultsDiv.innerHTML = '<p>No results found.</p>';
//       return;
//     }
  
//     // Create the table
//     const table = document.createElement('table');
//     table.style.borderCollapse = 'collapse';
//     table.style.width = '80%';
//     table.style.border = '1px solid black';
//     table.style.backgroundColor = '#f2f2f2'; // Set the background color to a deep color
  
//     // Create the table header
//     const tableHeader = document.createElement('thead');
//     const headerRow = document.createElement('tr');
//     const headers = [
//       'File Title',
//       'Author',
//       'Year',
//       'Keywords',
//       'Download'
//     ];
//     headers.forEach(headerText => {
//       const headerCell = document.createElement('th');
//       headerCell.textContent = headerText;
//       headerCell.style.border = '1px solid black';
//       headerCell.style.padding = '8px';
//       headerRow.appendChild(headerCell);
//     });
//     tableHeader.appendChild(headerRow);
//     table.appendChild(tableHeader);
  
//     // Create the table body
//     const tableBody = document.createElement('tbody');
  
//     // Create table rows for each result
//     results.forEach(result => {
//       const fileName = result.file_path.split('/').pop();
  
//       const row = document.createElement('tr');
  
//       const titleCell = createTableCell(result.file_title);
//       row.appendChild(titleCell);
  
//       const authorCell = createTableCell(result.author);
//       row.appendChild(authorCell);
  
//       const yearCell = createTableCell(result.year);
//       row.appendChild(yearCell);
  
//       const keywordsCell = createTableCell(result.keywords);
//       row.appendChild(keywordsCell);
  
//       const downloadCell = createDownloadTableCell(fileName);
//       row.appendChild(downloadCell);
  
//       tableBody.appendChild(row);
//     });
  
//     table.appendChild(tableBody);
//     resultsDiv.appendChild(table);
//   }
  
  
// //   function displayResults(results) {
// //     const resultsDiv = document.getElementById('results');
// //     resultsDiv.innerHTML = '';
  
// //     if (results.length === 0) {
// //       resultsDiv.innerHTML = '<p>No results found.</p>';
// //       return;
// //     }
  
// //     // Create the table and table body
// //     const table = document.createElement('table');
// //     table.style.borderCollapse = 'collapse';
// //     table.style.width = '80%';
// //     table.style.border = '1px solid black';
  
// //     const tableBody = document.createElement('tbody');
  
// //     // Create table rows for each result
// //     results.forEach(result => {
// //       const fileName = result.file_path.split('/').pop();
  
// //       const row = document.createElement('tr');
  
// //       const titleCell = createTableCell(result.file_title);
// //       row.appendChild(titleCell);
  
// //       const authorCell = createTableCell(result.author);
// //       row.appendChild(authorCell);
  
// //       const yearCell = createTableCell(result.year);
// //       row.appendChild(yearCell);
  
// //       const keywordsCell = createTableCell(result.keywords);
// //       row.appendChild(keywordsCell);
  
// //       const downloadCell = createDownloadTableCell(fileName);
// //       row.appendChild(downloadCell);
  
// //       tableBody.appendChild(row);
// //     });
  
// //     table.appendChild(tableBody);
// //     resultsDiv.appendChild(table);
// //   }
  
//   function createTableCell(text) {
//     const cell = document.createElement('td');
//     cell.textContent = text;
//     cell.style.border = '1px solid black';
//     cell.style.padding = '8px';
//     return cell;
//   }
  
//   function createDownloadTableCell(fileName) {
//     const cell = document.createElement('td');
//     const downloadLink = document.createElement('a');
//     downloadLink.href = `/download/${encodeURIComponent(fileName)}`;
//     downloadLink.download = fileName;
//     downloadLink.textContent = 'Download Report';
//     cell.appendChild(downloadLink);
//     cell.style.border = '1px solid black';
//     cell.style.padding = '8px';
//     return cell;
//   }
  