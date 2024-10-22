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

// P�id�n�/aktualizace slova
document.getElementById('wordForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Zabr�nit obnoven� str�nky

    const word = document.getElementById('word').value;
    const english = document.getElementById('english').value;
    const czech = document.getElementById('czech').value;
    const part_of_speech = document.getElementById('part_of_speech').value;
    const pronunciation = document.getElementById('pronunciation').value;
    const example_sentence = document.getElementById('example_sentence').value;

    // Vyhled�n� slova v datab�zi
    const existingDoc = await db.collection('dictionary').doc(word).get();

    if (existingDoc.exists) {
        // Pokud slovo existuje, po��dejte u�ivatele o potvrzen� aktualizace
        const confirmUpdate = confirm('Word already exists. Do you want to update it?');
        if (!confirmUpdate) return;
    }

    // Ulo�en� nebo aktualizace slova
    await db.collection('dictionary').doc(word).set({
        english: english,
        czech: czech,
        part_of_speech: part_of_speech,
        pronunciation: pronunciation,
        example_sentence: example_sentence
    });

    alert('Word saved successfully!');

    // Vymaz�n� formul��e
    document.getElementById('wordForm').reset();
});

// Vyhled�v�n� slov
async function searchWord() {
    const searchInput = document.getElementById('search').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Vymaz�n� star�ch v�sledk�

    if (searchInput.length < 1) return; // Pokud nen� nic zad�no, neprov�d�jte vyhled�v�n�

    const snapshot = await db.collection('dictionary').get();

    snapshot.forEach(doc => {
        const data = doc.data();
        const word = doc.id;

        // Kontrola, zda hledan� slovo za��n� na zadan� znaky
        if (word.startsWith(searchInput)) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `<strong>${word}</strong>: English - ${data.english}, Czech - ${data.czech}`;
            resultsDiv.appendChild(resultItem);
        }
    });
}