// switch this to arena.js or something in the future so that I can add onto the dataset more easily
const favorite_movies: string[] = ['Movies I Like', 'Hackers (1995)', 'In the Mood for Love (2000)', 'Do the Right Thing (1989)', 'House (1977)', 'Kadaisi Vivasayi (2021)', 'Hot Rod (2007)', 'After Hours (1985)', 'Electric Dragon 80.000 V (2001)', 'Evil Dead 2 (1987)'];
const fun_facts: string[] = ['Facts About Me', 'My favorite museum in NYC is The MET Cloisters', 'My bones break embarrassingly easily', 'I listen to King Krule', 'I try (and often fail) to exercise regularly', 'I have a dog named Copper'];
const reading_list: string[] = ['Useful Readings', 'Weapons of Math Destruction (2016)', 'On the Mode of Existence of Technical Objects (1957)', 'Science in Action (1987)', 'The Question Concerning Technology in China (2016)', 'Technics and Time (1994)'];


// index variable for the typewriter and the finished list of items in a randomized array
let i: number = 0;
const random_array: string[] = getRandomInfo();

// the elements to be filled out
const text: HTMLCollection = document.getElementsByClassName("demo");

function typeWriter() {

  const speed: number = 20; /* The speed/duration of the effect in milliseconds */

  for (let index: number = 0; index < random_array.length; index++) {
    const element: string = random_array[index];
    if (i < element.length) {
      text[index].innerHTML += random_array[index].charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
    else {
      i = 0;
    }
    
  }
}


function getRandomInfo() {
    const random_array: string[] = [favorite_movies, fun_facts, reading_list][Math.floor(Math.random() * 3)];
    for (let i: number = 0; i < random_array.length; i++) {
    // Generate random number
          const j: number = Math.floor(Math.random() * (i + 1));
    if (i != 0 && j != 0) {
        const temp = random_array[i];
        random_array[i] = random_array[j];
        random_array[j] = temp;
        }
        
      }

    return random_array;
  }
