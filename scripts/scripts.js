//Funktion för meddelande om när man klickat på data om vad som hänt.
function DisplayMessage(message, mouseX, mouseY){ //deklarerar tre variabler direkt i skapandet av funktionen.

    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.classList.add('notification');

    //Sätter positionen för meddelandet på musens position, med en liten föskjutning.
    notification.style.left = (mouseX + 10) + 'px';
    notification.style.top = (mouseY + 10) + 'px';

    //Lägger till nytt element i taggen <body>
    document.body.appendChild(notification);

    //Funktion för hur länge meddelandet ska synas innan det försvinner.
    setTimeout(() => {
    document.body.removeChild(notification);
    console.log('Notification removed');
    }, 1500);
}


//variabler till funktionen som räknar antal sparad data. 
var dataCountSpan = document.getElementById('dataCount');
var dataCountText = document.getElementById('dataCountText');

function saveData(event) {
    //Hämtar värden inne i html dokumentet från specifika id-element.
    const programTitel = document.getElementById("programTitel").value; 
    const programDescription = document.getElementById("programDescription").value;
    const ageLimit = document.getElementById("ageLimit").value;

    // Lagra muspekarens position för funktionen "DisplayMessage".
    const mouseX = event.clientX || 0;
    const mouseY = event.clientY || 0;

    // Kontrollera om något av fälten är tomt, skicka meddelande om så är fallet.
    if (!programTitel || !programDescription || !ageLimit) {
        DisplayMessage("Alla fällt är ej ifyllda!", mouseX, mouseY);
        return; // Avbryt funktionen om något fält är tomt
    }
    //Skapat ett object där siffrorna i det här fallet och dess värde kommer efteråt.
    let tvShowAdded = {
        0 : programTitel,
        1 : programDescription,
        2 : ageLimit,
    };

    let existingData = localStorage.getItem('tvShows'); //hämtar data som är sparad lokalt.
    // Här utvärderas "existingData" om den innehåller någon data, 
    // om så är fallet omvandlas JSON-strängen till ett objekt eller array, 
    // Om det inte finns någon data skapas en tom array.
    existingData = existingData ? JSON.parse(existingData) : []; 
    // Här utökas existingData med en ny TV-show
    // och sparar den uppdaterade datan till den lokala lagringen.
    existingData.push(tvShowAdded);
    localStorage.setItem('tvShows', JSON.stringify(existingData));

    //Nollställer formulärs fälten i html dokumentet.
    document.getElementById('programTitel').value = '';
    document.getElementById('programDescription').value = '';
    document.getElementById('ageLimit').value = '';

    // Hämta antalet data från local storage och uppdatera räknaren
    var storedData = JSON.parse(localStorage.getItem('tvShows')) || [];
    dataCountSpan.textContent = storedData.length;

    // Uppdatera texten med antalet objekt
    dataCountText.textContent = 'Antal sparade objekt: ' + storedData.length;

    // Visar meddelande om att det sparats ett program.
    DisplayMessage("Tv-program sparat", mouseX, mouseY);
}
// Skapar ett event som lyssnar efter att användaren klickar med musen och kallar på funktion.
document.getElementById('saveButton').addEventListener('click', saveData);
const searchResults = document.getElementById('search-results').firstElementChild;

function showData(event) {
    // Lagra muspekarens position för notikations-meddelandet.
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const savedData = localStorage.getItem('tvShows');
    const searchResults = document.getElementById('search-results');

    if (savedData) {
        try { //Try/catch som kollars det ifall JSON filen finns eller är giltig. Annars får vi ett felmeddelande.
            const parsedData = JSON.parse(savedData);
            searchResults.innerHTML = ''; // Tömmer tidigare resultat

            if (parsedData.length > 0) {
                //Lägg till Titel, beskrivning och åldersgräns som rubrik.
                const titleRow = searchResults.appendChild(document.createElement('tr'));
                const titles = ['Program-titel:','Beskrivning','Åldersgräns'];
                for (let title of titles) {
                    const titleCell = titleRow.appendChild(document.createElement('th'));
                    titleCell.innerHTML = title;
                }

                //Skriv ut den sparade datan. Skapar table-row med
                for (let index = 0; index < parsedData.length; index++) {
                    let row = searchResults.appendChild(document.createElement('tr'));

                    for (let key = 0; key < 3; key++) {
                        let data = row.appendChild(document.createElement('td'));
                        data.innerHTML = parsedData[index][key];
                    }
                }
            } else { //Skriver ut meddelande om det inte finns någon sparad data.
                searchResults.innerHTML = '<tr><td colspan="3">Ingen lagrad data hittad</td></tr>';
                DisplayMessage("Ingen lagrad data hittad!", mouseX, mouseY);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Ogiltig JSON-data i local storage');
        }
    } else { //Skriver ut meddelande om det inte finns någon sparad data.
        searchResults.innerHTML = '<tr><td colspan="3">Ingen lagrad data hittad</td></tr>';
        DisplayMessage("Ingen lagrad data hittad!", mouseX, mouseY);
    }
}
// Skapar ett event som lyssnar efter att användaren klickar med musen och kallar på funktion.
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
// Skapar ett event som lyssnar efter att användaren klickar med musen och kallar på funktion.
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

    if (parsedData.length > 0) {
        //Lägg till Titel, beskrivning och åldersgräns som rubrik.
        const titleRow = searchResults.appendChild(document.createElement('tr'));
        const titles = ['Program-titel:','Beskrivning','Åldersgräns'];
        for (let title of titles) {
            const titleCell = titleRow.appendChild(document.createElement('th'));
            titleCell.innerHTML = title;
        }
    }
    for (let index = 0; index < parsedData.length; index++) {
        if (parsedData[index][0] === searchInput) {  // Använd parsedData[index][0] för titeln
            const insertRow = document.createElement('tr');  // Skapa en ny rad
            for (let key = 0; key < 3; key++) {
                const cell = document.createElement('td');  // Skapa en ny cell
                cell.innerHTML = parsedData[index][key];  // Fyll cellen med data från local storage
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

// Objekt som innehåller översättningar
const translations = {
    'easyRead': {
        'sv': 'Lätt läst',
        'en': 'Easy-to-read',
    },
    'inEnglish':{
        'sv': 'In English',
        'en': 'På Svenska',
    },
   'listen':{
        'sv': 'Lyssna',
        'en': 'Listen',
    },   
};

// Funktion för att ändra språk
function changeLanguage(event) {
    event.preventDefault()
    const lang = event.target.getAttribute('data-lang');
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            element.innerText = translations[key][lang];
        }
    });
     // Byt språkkoden
     const newLang = lang === 'en' ? 'sv' : 'en';
     event.target.setAttribute('data-lang', newLang);
}

// Lägg till data-lang-attribut för att hålla språkkoden
document.getElementById('inEnglish').setAttribute('data-lang', 'en');
document.getElementById('inEnglish').addEventListener('click', changeLanguage);