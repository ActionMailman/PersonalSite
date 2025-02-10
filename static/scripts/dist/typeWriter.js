"use strict";
const favorite_movies = ['Movies I Like', 'Hackers (1995)', 'In the Mood for Love (2000)', 'Do the Right Thing (1989)', 'House (1977)', 'Kadaisi Vivasayi (2021)', 'Hot Rod (2007)', 'After Hours (1985)', 'Electric Dragon 80.000 V (2001)', 'Evil Dead 2 (1987)'];
const fun_facts = ['Facts About Me', 'My favorite museum in NYC is The MET Cloisters', 'My bones break embarrassingly easily', 'I listen to King Krule', 'I try (and often fail) to exercise regularly', 'I have a dog named Copper'];
const reading_list = ['Useful Readings', 'Weapons of Math Destruction (2016)', 'On the Mode of Existence of Technical Objects (1957)', 'Science in Action (1987)', 'The Question Concerning Technology in China (2016)', 'Technics and Time (1994)', "Do Artifacts Have Politics? (1980)"];
let i = 0;
const random_array = getRandomInfo();
const text = document.getElementsByClassName("demo");
console.log(text);
function typeWriter() {
    const speed = 20;
    if (i < 50) {
        text[0].innerHTML += random_array[0].charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
    else if (i < 100) {
        text[1].innerHTML += random_array[1].charAt(i - 50);
        i++;
        setTimeout(typeWriter, speed);
    }
    else if (i < 150) {
        text[2].innerHTML += random_array[2].charAt(i - 100);
        i++;
        setTimeout(typeWriter, speed);
    }
    else if (i < 200) {
        text[3].innerHTML += random_array[3].charAt(i - 150);
        i++;
        setTimeout(typeWriter, speed);
    }
}
function getRandomInfo() {
    const random_array = [favorite_movies, fun_facts, reading_list][Math.floor(Math.random() * 3)];
    for (let i = 0; i < random_array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        if (i != 0 && j != 0) {
            const temp = random_array[i];
            random_array[i] = random_array[j];
            random_array[j] = temp;
        }
    }
    return random_array;
}
