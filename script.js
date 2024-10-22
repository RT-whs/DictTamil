// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4XLAUaI4jH95Og6MhK9p7U01wV_1uv0Q",
    authDomain: "tamildictinarydb.firebaseapp.com",
    projectId: "tamildictinarydb",
    storageBucket: "tamildictinarydb.appspot.com",
    messagingSenderId: "526541421782",
    appId: "1:526541421782:web:f30e51e754c3ebe6781d77"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Pøidání nebo aktualizace slova
document.getElementById('wordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const word = document.getElementById('word').value;
    const english = document.getElementById('english').value;
    const czech = document.getElementById('czech').value;
    const part_of_speech = document.getElementById('part_of_speech').value;
    const pronunciation = document.getElementById('pronunciation').value;
    const example_sentence = document.getElementById('example_sentence').value;

    const wordRef = db.collection('dictionary').doc(word);
    const doc = await wordRef.get();

    if (doc.exists) {
        // Záznam existuje, zeptejte se uživatele, zda chce aktualizovat
        const update = confirm(`The word "${word}" already exists. Do you want to update it?`);
        if (update) {
            await wordRef.update({
                english,
                czech,
                part_of_speech,
                pronunciation,
                example_sentence
            });
            alert('Word updated successfully!');
        } else {
            alert('No changes made.');
        }
    } else {
        // Pøidejte nové slovo
        await wordRef.set({
            english,
            czech,
            part_of_speech,
            pronunciation,
            example_sentence
        });
        alert('Word added successfully!');
    }

    // Reset formuláøe
    document.getElementById('wordForm').reset();
});

// Vyhledávání slov
async function searchWord() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Vymažte pøedchozí výsledky

    const snapshot = await db.collection('dictionary').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        if (doc.id.toLowerCase().startsWith(searchTerm)) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.textContent = `${doc.id} (English: ${data.english}, Czech: ${data.czech})`;
            resultItem.onclick = () => fillForm(doc.id, data);
            resultsDiv.appendChild(resultItem);
        }
    });
}

// Vyplnìní formuláøe pøi kliknutí na výsledek
function fillForm(word, data) {
    document.getElementById('word').value = word;
    document.getElementById('english').value = data.english;
    document.getElementById('czech').value = data.czech;
    document.getElementById('part_of_speech').value = data.part_of_speech;
    document.getElementById('pronunciation').value = data.pronunciation;
    document.getElementById('example_sentence').value = data.example_sentence;
    document.getElementById('results').innerHTML = ''; // Vymažte výsledky
}
