// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4XLAUaI4jH95Og6MhK9p7U01wV_1uv0Q",
    authDomain: "tamildictinarydb.firebaseapp.com",
    projectId: "tamildictinarydb",
    storageBucket: "tamildictinarydb.appspot.com",
    messagingSenderId: "526541421782",
    appId: "1:526541421782:web:f30e51e754c3ebe6781d77"
  };

// Inicializace Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Pøidání/aktualizace slova
document.getElementById('wordForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zabránit obnovení stránky

    const word = document.getElementById('word').value;
    const english = document.getElementById('english').value;
    const czech = document.getElementById('czech').value;
    const part_of_speech = document.getElementById('part_of_speech').value;
    const pronunciation = document.getElementById('pronunciation').value;
    const example_sentence = document.getElementById('example_sentence').value;

    console.log("Starting word submission...");
    console.log(`Word: ${word}, English: ${english}, Czech: ${czech}`);

    // Zkontrolujte, zda formuláø není prázdný
    if (!word || !english || !czech || !part_of_speech || !pronunciation || !example_sentence) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Vyhledání slova v databázi
        const existingDoc = await db.collection('dictionary').doc(word).get();

        if (existingDoc.exists) {
            console.log("Word already exists in Firestore.");
            const confirmUpdate = confirm('Word already exists. Do you want to update it?');
            if (!confirmUpdate) return;
        }

        // Uložení nebo aktualizace slova
        await db.collection('dictionary').doc(word).set({
            english: english,
            czech: czech,
            part_of_speech: part_of_speech,
            pronunciation: pronunciation,
            example_sentence: example_sentence
        });

        console.log("Word saved successfully!");
        alert('Word saved successfully!');

        // Vymazání formuláøe
        document.getElementById('wordForm').reset();

    } catch (error) {
        console.error("Error saving word: ", error);
        alert("Failed to save word. Check console for details.");
    }
});

// Vyhledávání slov
async function searchWord() {
    const searchInput = document.getElementById('search').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Vymazání starých výsledkù

    if (searchInput.length < 1) return; // Pokud není nic zadáno, neprovádìjte vyhledávání

    console.log(`Searching for words starting with: ${searchInput}`);

    try {
        const snapshot = await db.collection('dictionary').get();

        snapshot.forEach(doc => {
            const data = doc.data();
            const word = doc.id;

            // Kontrola, zda hledané slovo zaèíná na zadané znaky
            if (word.startsWith(searchInput)) {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `<strong>${word}</strong>: English - ${data.english}, Czech - ${data.czech}`;
                resultsDiv.appendChild(resultItem);
            }
        });

    } catch (error) {
        console.error("Error fetching words: ", error);
    }
}