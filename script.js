// Inicializace pr�zdn�ho slovn�ku nebo nacten� z LocalStorage
let dictionary = JSON.parse(localStorage.getItem('tamilDictionary')) || {};

// Funkce pro prid�n� slov�cka do slovn�ku
document.getElementById('wordForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const tamilWord = document.getElementById('tamilWord').value;
  const englishTranslation = document.getElementById('englishTranslation').value;
  const partOfSpeech = document.getElementById('partOfSpeech').value;
  const pronunciation = document.getElementById('pronunciation').value;
  const exampleSentence = document.getElementById('exampleSentence').value;

  // Ulo�en� slov�cka do objektu slovn�ku
  dictionary[tamilWord] = {
    "english": englishTranslation,
    "part_of_speech": partOfSpeech,
    "pronunciation": pronunciation,
    "example_sentence": exampleSentence
  };

  // Ulo�en� slovn�ku do LocalStorage
  localStorage.setItem('tamilDictionary', JSON.stringify(dictionary));

  alert(`Word '${tamilWord}' added to the dictionary!`);

  // Vymaz�n� formul�re
  document.getElementById('wordForm').reset();
});

// Funkce pro vyhled�v�n� ve slovn�ku
function searchDictionary() {
  const searchWord = document.getElementById('searchWord').value;

  if (dictionary[searchWord]) {
    const wordData = dictionary[searchWord];
    document.getElementById('searchResult').innerHTML = `
      <h4>Results for '${searchWord}':</h4>
      <p><strong>English Translation:</strong> ${wordData.english}</p>
      <p><strong>Part of Speech:</strong> ${wordData.part_of_speech}</p>
      <p><strong>Pronunciation:</strong> ${wordData.pronunciation}</p>
      <p><strong>Example Sentence:</strong> ${wordData.example_sentence}</p>
    `;
  } else {
    document.getElementById('searchResult').innerHTML = `<p>No results found for '${searchWord}'.</p>`;
  }
}
