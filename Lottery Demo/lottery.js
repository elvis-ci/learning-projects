const game = document.forms['betform'];
const play = document.querySelector('button[type=submit')
const reset = document.querySelector('button[type=reset')

const accountBalance = document.querySelector('.balance');
const balanceContainer = document.querySelector('.account-balance-div')

const stakeDiv = document.querySelector('.stake-div')
const stakebtnsDiv = document.querySelector('.buttons')
const stakebtns= document.querySelectorAll('.stake-increment');
const stakeAmount = document.querySelector('.stake-amount');

stakeAmount.addEventListener('click', e=>{

  if(stakeDiv.contains(e.target)){
    stakeDiv.style.height = 'fit-content'
    stakebtnsDiv.style.display='flex';   
  }

  if(stakeAmount.hasAttribute('readonly')){
    stakebtnsDiv.style.display='none';   
  }

})

stakebtns.forEach(btns =>{
  btns.addEventListener('click', f=>{
    f.preventDefault()
    let currentStakeAmount = Number(stakeAmount.value) || 0; 
    if(btns.value > 0){
      stakeAmount.value = currentStakeAmount + Number(btns.value);
    } else{
      stakeAmount.value = 0
    }
  })
});

let selection = document.querySelectorAll('.selections');
let outcomes = document.querySelectorAll('.outcomes');
let insufficientTxt = document.querySelector('.insufficient-funds');

function random(){ 
  return Math.ceil(Math.random() * 4)
}

game.addEventListener('submit', e => {
  e.preventDefault();
  stakeDiv.style.height = '20px';
  stakebtnsDiv.style.display='none';   

  if(stakeAmount.value <= Number(accountBalance.textContent)){
    stakeAmount.setAttribute('readonly', true);
  
    let generatedNumbers= [random(), random(), random(), random()];
    console.log(generatedNumbers)
  
    // Generated Numbers
    let G1 = generatedNumbers[0]
    let G2 = generatedNumbers[1]
    let G3 = generatedNumbers[2]
    let G4 = generatedNumbers[3]
  
    // Selections
    let S1 = selection[0].value
    let S2 = selection[1].value
    let S3 = selection[2].value
    let S4 = selection[3].value
  
    let currentBalance = Number(accountBalance.textContent.trim());  

    for(let i = 0; i<selection.length && i<outcomes.length; i++){
      setTimeout(() =>{
        outcomes[i].innerText = generatedNumbers[i];
        if(selection[i].value == generatedNumbers[i]){
          selection[i].style.border = '2px solid greenyellow'
        }else{
          selection[i].style.border = '2px solid Red'
        }  
      }, ((i*1200) + 1000));

      selection[i].setAttribute('readonly', true)
      selection[i].blur();
    }
  
    setTimeout(()=>{
      if(S1 == G1 && S2 == G2 && S3 == G3 && S4 == G4){

        accountBalance.textContent = (currentBalance - stakeAmount.value) + (stakeAmount.value * 50)
  
      }else if((S1 == G1 && S2 == G2  && S3 == G3) || (S1 == G1 && S2 == G2  && S4 == G4)|| (S1 == G1 && S3 == G3  && S4 == G4) || (S2 == G2 && S3 == G3  && S4 == G4) ){
       
        accountBalance.textContent = (currentBalance - stakeAmount.value) + (stakeAmount.value * 10)
  
      }else if((S1 == G1 && S2 == G2) || (S1 == G1 && S3 == G3) || (S1 == G1 && S4 == G4) || (S2 == G2 && S3 == G3) || (S2 == G2 && S4 == G4) || (S3 == G3 && S4== G4)){
       
        accountBalance.textContent = currentBalance
  
      }else{
        accountBalance.textContent = currentBalance - stakeAmount.value
      }
  
    }, 5200)

  }else{

    function beep(){
      if(stakeAmount.style.border== '' || stakeAmount.style.border== '0.5px solid black'){
        stakeAmount.style.border= '2px solid red';
      } else{
        stakeAmount.style.border= '0.5px solid black';
      }
    }

    let beepInterval = setInterval( beep , 300)    

    setTimeout(stopInterval, 5000)

    function stopInterval (){
      clearInterval(beepInterval);
    }

    stakeAmount.style.border= '2px solid red';
    insufficientTxt.style.display='block';
  }

  play.style.display= 'none';
  reset.style.display='block';
});

reset.addEventListener('click', e =>{
  e.preventDefault();
  game.reset();
  stakeAmount.removeAttribute('readonly');
  stakeAmount.value = 0;
  insufficientTxt.style.display='none';

  for(let i = 0; i<selection.length && i<outcomes.length; i++){
    selection[i].style.border = '1px solid black'
    selection[i].removeAttribute('readonly');
    outcomes[i].innerText= '?'
  }
  stakeAmount.style.border=''

  play.style.display= 'block';
  reset.style.display='none';

})