// frontend/src/utils/exportToCsv.js

export const exportToCsv = (filename, rows) => {
    if (!rows || rows.length === 0) {
        console.error("No data to export.");
        return;
    }

    // 1. Get the column headers from the keys of the first object
    const headers = Object.keys(rows[0]);

    // 2. Create the CSV rows array, starting with the header row
    const csvRows = [];
    csvRows.push(headers.join(','));

    // 3. Convert each JSON object (row) into a CSV string
    for (const row of rows) {
        // Map the keys (headers) to their corresponding values in the current row
        const values = headers.map(header => {
            const value = row[header];
            // Enclose string values in quotes to handle commas within data
            const formattedValue = (typeof value === 'string' && value.includes(',')) ? `"${value}"` : value;
            return formattedValue;
        });
        csvRows.push(values.join(','));
    }

    // 4. Join all rows with a newline character
    const csvString = csvRows.join('\n');

    // 5. Create a Blob and trigger the download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create download link element
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};