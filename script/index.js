function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn mr-2">${el}</span>`);
  return htmlElements.join("");
};

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") // promise fo response
    .then((res) => res.json()) // promise of json data
    .then((json) => displayLessons(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url) // promise of response
    .then((res) => res.json())
    .then((data) => {
      removeActive(); // remove all active class
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active"); // add active class
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

// id: 2;
// level: 6;
// meaning: "দয়ালু";
// partsOfSpeech: "adjective";
// points: 4;
// pronunciation: "বেনেভোলেন্ট";
// sentence: "The benevolent man donated food to the poor.";
// synonyms: (3)[("kind", "generous", "compassionate")];
// word: "Benevolent";

const displayWordDetails = (word) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
            <div>
              <h2 class="text-2xl font-bold">${
                word.word
              }(<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })
              </h2>
            </div>
            <div class="">
              <h2 class="font-bold">Meaning</h2>
              <p>${word.meaning}</p>
            </div>
            <div class="">
              <h2 class="font-bold">Example</h2>
              <p>${word.sentence}</p>
            </div>
            <div class="">
              <h2 class="font-bold mb-2">Synonym</h2>
              <div class="">${createElements(word.synonyms)}</div>
            </div>
          <button class="btn btn-primary">Complete Learning</button>
  `;
  document.getElementById("word-modal").showModal();
};

const displayLevelWord = (words) => {
  // 1. get the container & copy
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-3 font-bangla">
            <img class="mx-auto " src="./assets/alert-error.png"/>
            <p class="text-[#79716B] text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-3xl font-medium text-[#292524]">নেক্সট Lesson এ যান</h2>
        </div>

    `;
    manageSpinner(false);
    return;
  }

  // {
  //     "id": 86,
  //     "level": 1,
  //     "word": "Milk",
  //     "meaning": "দুধ",
  //     "pronunciation": "মিল্ক"
  // }

  // 2. get into every lessons
  words.forEach((word) => {
    // 3. create a Element
    const card = document.createElement("div");
    card.innerHTML = `
    <div
        class="bg-white h-full xl:h-fit rounded-xl shadow-sm text-center py-16 px-5 space-y-4"
      >
        <h2 class="text-3xl font-bold">${
          word.word ? word.word : "শব্দ পাওয়া যায় নি"
        }</h2>
        <p class="font-medium">Meaning /Pronounciation</p>
        <div class="font-bangla text-2xl font-medium">"${
          word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
        } / ${
      word.pronunciation ? word.pronunciation : "pronounciation পাওয়া যায়নি"
    }"</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick="pronounceWord('${
            word.word
          }')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;

    // 4. append into container
    wordContainer.appendChild(card);
  });
  manageSpinner(false);
};

const displayLessons = (lessons) => {
  // 1. get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  // 2. get into every lessons
  for (let lesson of lessons) {
    console.log(lesson);
    //     3. create Element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
                <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"
                  ><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
                </button>
    `;

    //     4. append into container
    levelContainer.appendChild(btnDiv);
  }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
