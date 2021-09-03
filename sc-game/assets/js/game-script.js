document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") {
    moveLeft();
  }
  if (event.key === "ArrowRight") {
    moveRight();
  }
});
var character = document.getElementById("character");

function moveLeft() {
  let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
  left -= 100;
  if (left >= 0) {
    character.style.left = left + "px";
  }
}

function moveRight() {
  let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
  left += 100;
  if (left < 300) {
    character.style.left = left + "px";
  }
}
var block = document.getElementById("block");
var infected = document.getElementById("infected");
var counter = 0;
var level = 1;
var nextLevel = 0;
var bonusRound = false;

block.addEventListener('animationiteration', () => {
  if (level == 2) {
    //change image
    document.getElementById("block-image").src = "assets/infected.png";
    //change speed
    block.setAttribute("style", "animation: slide 1.5s infinite linear");
  }

  var random = Math.floor(Math.random() * 3);

  if (level >= 3 && level % 5 != 0) {
    bonusRound = false

    block.setAttribute("style", "animation: slide 1s infinite linear");
    if (random == 1) {
      document.getElementById("block-image").src = "assets/infected.png";
    } else if (random == 2) {
      document.getElementById("block-image").src = "assets/covid.png";
    } else {
      document.getElementById("block-image").src = "assets/covid.png";
    }
  } else if (level % 5 == 0) {
    document.getElementById("level-text").textContent = "Bonus Round"
    ocument.getElementById("message-text").style.visibility = "hidden"
    block.setAttribute("style", "animation: slide 0.8s infinite linear");
    document.getElementById("block-image").src = "assets/vaccine.png";
    bonusRound = true

  }

  var previous_rand = random;
  while (random == previous_rand) {
    random = Math.floor(Math.random() * 3);
  }


  left = random * 100;
  block.style.left = left + "px";
  counter++;
  nextLevel++;
  document.getElementById("score-text").textContent = counter

  //change level
  if (nextLevel >= 5) {
    level = level + 1
    nextLevel = 0
    document.getElementById("level-text").textContent = level
  }
});

function getScore() {
  fetch('http://127.0.0.1:8000/display-highest-score')
    .then(response => response.json())
    .then(function (json) {
      var savedName = sessionStorage.getItem("name");
      var savedAge = sessionStorage.getItem("age");
      var savedScore = sessionStorage.getItem("score");
      var scoreRow = document.createElement("tr");
      scoreRow.className += "table-active";
      scoreRow.innerHTML = "<td class='text-center'>" + savedName.toString() +
        "</td><td class='text-center'>" + savedAge.toString() + "</td><td class='text-center'>" +
        document.getElementById('score-text').innerText + "</td>";
      console.log(counter.toString())
      document.getElementById("scoreTable").appendChild(scoreRow);
      for (var i = 0; i < json.length; i++) {
        console.log(json[i]['name']);
        var scoreRow = document.createElement("tr");
        scoreRow.innerHTML = "<td class='text-center'>" + json[i]['name'] +
          "</td><td class='text-center'>" + json[i]['age'].toString() + "</td><td class='text-center'>" +
          json[i]['score'].toString() + "</td>";
        document.getElementById("scoreTable").appendChild(scoreRow);
      }
      createScoreRecord(savedName, savedAge, counter);
    })
}

function createScoreRecord(savedName, savedAge) {
  var formdata = new FormData();
  formdata.append("name", savedName);
  formdata.append("age", savedAge);
  formdata.append("score", counter);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:8000/create-score", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

setInterval(function () {
  var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
  var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
  var blockTop = parseInt(window.getComputedStyle(block).getPropertyValue("top"));


  if (characterLeft == blockLeft && blockTop < 500 && blockTop > 300 && bonusRound == false) {
    //alert("Game over. Score: " + counter);
    getScore();
    scoreCounter = counter;
    var rand = Math.ceil(Math.random() * 3);
    var previous_random = rand
    while (rand == previous_random) {
      rand = Math.ceil(Math.random() * 3);
    }
    var modal = "#myModal" + rand;
    document.getElementById("btn-tips").setAttribute("data-target", modal)
    document.getElementById("btn-tips").click(); // Click on the checkbox

    setTimeout(function () {
      document.getElementById("btn-leader").click()
    }, 3000);

    setTimeout(function () {
      window.location.reload();
    }, 5000);
    block.style.animation = "none";


  } else if (characterLeft == blockLeft && blockTop < 500 && blockTop > 300 && bonusRound == true) {
    counter++;
  }

}, 100);




document.getElementById("right").addEventListener("touchstart", moveRight);
document.getElementById("left").addEventListener("touchstart", moveLeft);