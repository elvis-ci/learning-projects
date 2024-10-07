const quiz=document.forms['quiz'];
const correctAnswers = ['C', 'A'];
const scoreboard = document.querySelector('h2')

quiz.addEventListener('submit', e =>{
  e.preventDefault()
  const questions = [quiz.q1, quiz.q2]
  let score = 0;
  questions.forEach((question, index) => {
    let answer = question.value
    if(answer === correctAnswers[index]){
      score+=10;
    }
  });

  scoreboard.innerHTML = `Your score is ${score}`

  // function display(){
  //   scoreboard.innerHTML = `Your score is ${score}`
  // };

  // setTimeout(display, 2000);

  const retry =document.createElement('button');
  retry.type= 'button'
  retry.innerText = 'Retry';
  retry.id = 'retry-btn';

  if(score === 0 && !document.getElementById('retry-btn' )){
    quiz.appendChild(retry);
    
    retry.addEventListener('click', () => {
      location.reload();
    });
  }
  
});


// const user = {
//   names: 'Adepegba',
//   blogs: ['where are you', 'freedom is not free'],
//   logblogs: function(){
//     console.log(user.blogs)
//   },
//   logname: function(){
//     console.log(user.names)
//   }
// }

// user.logblogs();
// user.logname();

// let age = 49.5;

// console.log(Math.round(age))
// console.log(Math.ceil(age))
// console.log(Math.floor(age))
// console.log(Math.trunc(age))

// const numbers = [0,1,2,3,4,5]
// let random =  Math.random()
// let randomNumber;
// let group=[]

// let index = 0
// for(i=0; i<=5; i++){
//   numbers.forEach(function(number){
//     randomNumber=Math.round(random*number)  
//   })
  
//   console.log(randomNumber)
//   group[i]= Math.round(random*randomNumber)

// }

// console.log(group)

const numbers = [0, 1, 2, 3, 4, 5];
let randomNumbers = [];

for (let i=0; i < numbers.length; i++) {
  let random = Math.random();  // Generate a new random number each time
  let randomNumber = Math.floor(random * numbers.length);  // Generate a random index from 0 to the length of the numbers array

  randomNumbers[i] = numbers[randomNumber];  // Assign a random number from the numbers array to the group array}
}
randomNumbers.forEach(number =>{
  console.log(number)
})