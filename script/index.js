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
    console.log(word);
    // 3. create a Element
    const card = document.createElement("div");
    card.innerHTML = `
    <div
        class="bg-white rounded-xl shadow-sm text-center py-16 px-8 space-y-4"
      >
        <h2 class="text-3xl font-bold">${
          word.word ? word.word : "শব্দ পাওয়া যায় নি"
        }</h2>
        <p class="font-medium">Meaning /Pronounciation</p>
        <div class="font-bangla text-3xl font-medium">"${
          word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
        } / ${
      word.pronunciation ? word.pronunciation : "pronounciation পাওয়া যায়নি"
    }"</div>
        <div class="flex justify-between items-center">
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;

    // 4. append into container
    wordContainer.appendChild(card);
  });
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
