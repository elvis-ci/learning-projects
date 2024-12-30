const game = document.forms['betform'];
const play = document.querySelector('button[type=submit')
const reset = document.querySelector('button[type=reset')
const accountBalance = document.querySelector('.balance');
const stakeDiv = document.querySelector('.stake-div')
const stakebtnsDiv = document.querySelector('.buttons')
const stakebtns= document.querySelectorAll('.stake-increment');
const stakeAmount = document.querySelector('.stake-amount');
const selection = document.querySelectorAll('.selections');
const outcomes = document.querySelectorAll('.outcomes');
const balanceAlert = document.querySelector('.insufficient-funds');
const stakeAlert = document.querySelector('.insufficient-stake');
const stakeContainer = document.querySelector('.Amount-alert-container')

// Display the buttons for increasing stake amount
stakeAmount.addEventListener('click', e=>{
  stakeContainer.style.border= '0.5px solid black';

  // remove stake increment buttons when stake input field is readonly(after submitting)
  stakeAmount.hasAttribute('readonly')? stakebtnsDiv.style.display='none'
  :(stakeDiv.style.height = 'fit-content', stakebtnsDiv.style.display='flex');
  
  // remove insufficient-stake and insufficient-funds alerts when stake amount is clicked
  stakeAlert.style.display== 'block'? stakeAlert.style.display= 'none'
  :balanceAlert.style.display== 'block'? balanceAlert.style.display= 'none'
  :''
});

// stake increment buttons behaviour
stakebtns.forEach(btns =>{
  btns.addEventListener('click', f=>{
    f.preventDefault()
    let currentStakeAmount = Number(stakeAmount.value) || 0; 
    stakeAmount.value = btns.value? currentStakeAmount + Number(btns.value):0
  })
});

// stake input field beep red when invalid stake amount or insufficient balance
function beep(){
  if(stakeContainer.style.border== '' || stakeContainer.style.border== '0.5px solid black'){
    stakeContainer.style.border= '2px solid red';
  } else{
    stakeContainer.style.border= '0.5px solid black';
  }
};

//beep behaviour: every 3milisecs and clear beep after 5secs
function warning(alertTxt, funct){
  const beepInterval = setInterval(funct , 300)    
  setTimeout(()=>{
    clearInterval(beepInterval);
  }, 5000)
  stakeContainer.style.border= '2px solid red';
  alertTxt.style.display='block';  
};

// form field behaviour
game.addEventListener('submit', e => {
  e.preventDefault();
  stakeDiv.style.height = '20px';
  stakebtnsDiv.style.display='none';   

  // if stake amount has value greater than 10
  if(stakeAmount.value && stakeAmount.value >= 10){
    // if stake amount is less than or equal to available balance
    if(stakeAmount.value <= Number(accountBalance.textContent)){
      stakeAmount.setAttribute('readonly', true);
    
      // Array of generated numbers for lottery outcomes
      const generatedNumbers= [];
      let currentBalance = Number(accountBalance.textContent.trim());  
  
      for(let i = 0; i<selection.length && i<outcomes.length; i++){
        generatedNumbers[i] = Math.ceil(Math.random() * 4);
        setTimeout(() =>{
          outcomes[i].innerText = generatedNumbers[i];
          if(selection[i].value == generatedNumbers[i]){
            selection[i].style.border = '2px solid greenyellow'
          }else{
            selection[i].style.border = '2px solid Red'
          }  
        }, ((i*1200) + 1000));
        
        // disable selection field after generating outcomes
        selection[i].setAttribute('readonly', true)
        selection[i].blur();
      }
      
      // Generated Numbers
      const G1 = generatedNumbers[0];
      const G2 = generatedNumbers[1];
      const G3 = generatedNumbers[2];
      const G4 = generatedNumbers[3];
    
      // Selections
      const S1 = selection[0].value;
      const S2 = selection[1].value;
      const S3 = selection[2].value;
      const S4 = selection[3].value;
      
      // Reward Logic:(4/4 = stake * 50, 3/4 = stake * 10, 2/4 = cashback, 1/4 = loss)
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
      }, 5200);
      play.style.display= 'none';
      reset.style.display='block';
    }else{
      // callback beep function and display balance alert
      warning(balanceAlert, beep)
    }
  }else{
    // callback beep function and display stake alert
    warning(stakeAlert, beep)
  }
});

// Reset game
reset.addEventListener('click', e =>{
  e.preventDefault();
  game.reset();
  stakeAmount.removeAttribute('readonly');
  stakeAmount.value = 0;
  balanceAlert.style.display='none';
  stakeAlert.style.display='none';

  for(let i = 0; i<selection.length && i<outcomes.length; i++){
    selection[i].style.border = '1px solid black'
    selection[i].removeAttribute('readonly');
    outcomes[i].innerText= '?'
  }
  stakeContainer.style.border=''
  play.style.display= 'block';
  reset.style.display='none';
});