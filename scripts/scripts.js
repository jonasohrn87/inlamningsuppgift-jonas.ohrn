var dataCountSpan = document.getElementById('dataCount');
var dataCountText = document.getElementById('dataCountText');

function DisplayMessage(message, mouseX, mouseY){

    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.classList.add('notification');

    notification.style.left = (mouseX + 10) + 'px';
    notification.style.top = (mouseY + 10) + 'px';

    document.body.appendChild(notification);

    setTimeout(() => {
    document.body.removeChild(notification);
    console.log('Notification removed');
    }, 1500);
}

function saveData(event) {

    const programTitel = document.getElementById("programTitel").value;
    const programDescription = document.getElementById("programDescription").value;
    const ageLimit = document.getElementById("ageLimit").value;

    // Lagra muspekarens position för notikations-meddelandet.
    const mouseX = event.clientX || 0;
    const mouseY = event.clientY || 0;

    // Kontrollera om något av fälten är tomt
    if (!programTitel || !programDescription || !ageLimit) {
        DisplayMessage("Alla fällt är ej ifyllda!", mouseX, mouseY);
        return; // Avbryt funktionen om något fält är tomt
    }

    let tvShowAdded = {
        0 : programTitel,
        1 : programDescription,
        2 : ageLimit,
    };

    let existingData = localStorage.getItem('tvShows');
    existingData = existingData ? JSON.parse(existingData) : [];

    existingData.push(tvShowAdded);
    localStorage.setItem('tvShows', JSON.stringify(existingData));

    document.getElementById('programTitel').value = '';
    document.getElementById('programDescription').value = '';
    document.getElementById('ageLimit').value = '';

    // Hämta antalet data från local storage och uppdatera räknaren
    var storedData = JSON.parse(localStorage.getItem('tvShows')) || [];
    dataCountSpan.textContent = storedData.length;

    // Uppdatera texten med antalet objekt
    dataCountText.textContent = 'Antal sparade objekt: ' + storedData.length;


    DisplayMessage("Tv-program sparat", mouseX, mouseY);
}

document.getElementById('saveButton').addEventListener('click', saveData);
const searchResults = document.getElementById('search-results').firstElementChild;

function showData(event) {
    // Lagra muspekarens position för notikations-meddelandet.
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const savedData = localStorage.getItem('tvShows');
    const searchResults = document.getElementById('search-results');

    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            searchResults.innerHTML = ''; // Tömmer tidigare resultat

            if (parsedData.length > 0) {
                // Add titles first
                const titleRow = searchResults.appendChild(document.createElement('tr'));
                const titles = ['Program-titel:','Beskrivning','Åldersgräns'];
                for (let title of titles) {
                    const titleCell = titleRow.appendChild(document.createElement('th'));
                    titleCell.innerHTML = title;
                }

                // Then add data
                for (let index = 0; index < parsedData.length; index++) {
                    let row = searchResults.appendChild(document.createElement('tr'));

                    // Lägg till klassen 'dynamic-row' till de dynamiskt skapade raderna
                    row.classList.add('dynamic-row');

                    for (let y = 0; y < 3; y++) {
                        let data = row.appendChild(document.createElement('td'));
                        data.innerHTML = parsedData[index][y];
                    }
                }
            } else {
                searchResults.innerHTML = '<tr><td colspan="3">Ingen lagrad data hittad</td></tr>';
                DisplayMessage("Ingen lagrad data hittad!", mouseX, mouseY);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Ogiltig JSON-data i local storage');
        }
    } else {
        searchResults.innerHTML = '<tr><td colspan="3">Ingen lagrad data hittad</td></tr>';
        DisplayMessage("Ingen lagrad data hittad!", mouseX, mouseY);
    }
}

document.getElementById('showButton').addEventListener('click', showData);


//funktion för att rensa lokal lagring
function clearStorage(event) {
    // Lagra muspekarens position för notikations-meddelandet.
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    localStorage.removeItem('tvShows');
    DisplayMessage("Rensat lokalt sparade filer!", mouseX, mouseY);

    // Uppdaterar räknaren efter att local storage har rensats
    var storedData = JSON.parse(localStorage.getItem('tvShows')) || [];
    dataCountSpan.textContent = storedData.length;
    dataCountText.textContent = 'Antal sparade objekt: ' + storedData.length;
}

document.getElementById('deleteButton').addEventListener('click', clearStorage);

// Kod som körs när sidan har laddats
    window.onload = function() {
    // Hämta antalet data från local storage
    var storedData = JSON.parse(localStorage.getItem('tvShows')) || [];

    // Uppdatera räknaren med det aktuella antalet data
    dataCountSpan.textContent = storedData.length;

    // Uppdatera texten med antalet objekt
    dataCountText.textContent = 'Antal sparade objekt: ' + storedData.length;
};

function searchData() {
    let searchInput = document.getElementById('search-input').value;
    const savedData = localStorage.getItem('tvShows');
    const parsedData = JSON.parse(savedData);
    const searchResults = document.getElementById('search-results');

    searchResults.innerHTML = '';

    for (let index = 0; index < parsedData.length; index++) {
        if (parsedData[index][0] === searchInput) {  // Använd parsedData[index][0] för titeln
            const insertRow = document.createElement('tr');  // Skapa en ny rad
            for (let y = 0; y < 3; y++) {
                const cell = document.createElement('td');  // Skapa en ny cell
                cell.innerHTML = parsedData[index][y];  // Fyll cellen med data från local storage
                insertRow.appendChild(cell);  // Lägg till cellen i raden
            }
            searchResults.appendChild(insertRow);  // Lägg till den nya raden i tabellen
        }
    }

    if (searchResults.children.length === 0) {
        // Om ingen matchning hittades, lägg till ett meddelande i tabellen
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = 3;  // Sätt colSpan för att täcka alla tre kolumnerna
        noResultsCell.innerHTML = 'Inga matchande resultat hittades.';
        noResultsRow.appendChild(noResultsCell);
        searchResults.appendChild(noResultsRow);
    }
}
