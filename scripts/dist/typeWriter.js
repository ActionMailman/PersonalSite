"use strict";
const favorite_movies = ['Movies I Like', 'Hackers (1995)', 'In the Mood for Love (2000)', 'Do the Right Thing (1989)', 'House (1977)', 'Kadaisi Vivasayi (2021)', 'Hot Rod (2007)', 'After Hours (1985)', 'Electric Dragon 80.000 V (2001)', 'Evil Dead 2 (1987)'];
const fun_facts = ['Facts About Me', 'I like fighting games', 'My bones break embarrassingly easily', 'I was a Weezer fan (derogatory) in high school', 'I\'ve gotten better about going to the gym recently', 'I have a dog named Copper'];
const reading_list = ['Useful Readings', 'Weapons of Math Destruction (2016)', 'The Critical Engineering Manifesto (2011)', 'The Soul of Man Under Socialism (1891)', 'Glitch Feminism: A Manifesto (2020)', 'Manufacturing Consent (1988)'];
let i = 0;
let random_array = getRandomInfo();
let text = document.getElementsByClassName("demo");
function typeWriter() {
    let speed = 20;
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
    let random_array = [favorite_movies, fun_facts, reading_list][Math.floor(Math.random() * 3)];
    for (let i = 0; i < random_array.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        if (i != 0 && j != 0) {
            let temp = random_array[i];
            random_array[i] = random_array[j];
            random_array[j] = temp;
        }
    }
    return random_array;
}
