//Fetched all the elements that JS may need
const inputSlider = document.querySelector("[data-lengthSlider]"); //fetching slider element using custom attribute through document.querySelector() method

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';  //String of symbols





//By default values 
let password = "";                 
let passwordLength = 10;           
let checkCount = 0;                
                                   
setIndicator("#ccc"); 

handleSlider(); 



//handleSlider() function is used to reflect the password length in UI 
function handleSlider(){

    inputSlider.value = passwordLength;   
    lengthDisplay.innerText = passwordLength; 

    const min = inputSlider.min;  
    const max = inputSlider.max;   
    
    //Formula to calculate background size of slider to be filled with color
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100 / (max - min)) + "% 100%";

}



//This function is used to set color and shadow for strength indicator 
function setIndicator(color){   
    indicator.style.backgroundColor = color; 
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`; 


}



//This function is used to generate random integers between range min to max 
function getRndInteger(min, max){

   return Math.floor(Math.random() * (max - min)) + min;    

}




//This is a function to generate a random number(integer) between range 0 t0 9
function generateRandomNumber(){

return getRndInteger(0, 9); 

}





//This is a function to generate a random letter from a-z(lowercase letters) 
function generateLowerCase(){

    return String.fromCharCode(getRndInteger(97, 123));

}





//This is a function to generate a random letter from A-Z(uppercase letters) 
function generateUppercase(){

 return String.fromCharCode(getRndInteger(65, 91));
}






//This is a function to generate a symbol

function generateSymbol(){
    
    return symbols.charAt( getRndInteger(0, symbols.length));


}











//function to calculate strength of password according to the rules defined
function calcStrength(){  

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

  
    //Rules defined for strong, medium and weak password
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) { 
      setIndicator("#0f0"); 
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0"); 
    } else {
      setIndicator("#f00");
    }

}










//This is a funciton is to copy password vlaue in clipboard
async function copyContent(){

  try{
  
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
                                                                                
  }


catch(e){                      

  copyMsg.innerText = "Failed"; 

}


copyMsg.classList.add("active");
                                

setTimeout( () => {  

  copyMsg.classList.remove("active");

}, 2000)                 

}





//Applying event listener on slider
inputSlider.addEventListener('input', (e) => {                      

  passwordLength = e.target.value;                                   

  handleSlider(); 

})





//Applying event listener on copy button
copyBtn.addEventListener('click', () => {

 if(passwordDisplay.value)     

 copyContent();

})








//This is a function used to shuffle the characters in password

function shufflePassword(array){

  
  // Fisher Yates Method to shuffle an array
  for (let i = array.length - 1; i > 0; i--) { 

      
        const j = Math.floor(Math.random() * (i + 1));
        
       
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}






//This is a funciton to calculate the count of checked checkboxes
function handleCheckBoxChange(){

  checkCount = 0;

  allCheckBox.forEach((checkbox) => {

    if(checkbox.checked){ 

      checkCount++;
    }
  })

  //Corner case condition i.e when length of password is less than the count of checked checkboxes

  if(passwordLength < checkCount){

    passwordLength = checkCount;

    handleSlider();
                  
  
  }

}




//Applying event listener on checkboxes
allCheckBox.forEach((checkbox) => {
  
  checkbox.addEventListener('change', handleCheckBoxChange);  
  
})





//Generate Password button contains the whole logic to generate password

generateBtn.addEventListener('click', () => {

  //if none of the checkboxes are checked 
  if(checkCount == 0)
  return; //(no password will be generated)

  
  //Corner case condition i.e when length of password is less than the count of checked checkboxes
  if( passwordLength < checkCount){

    passwordLength = checkCount;
    handleSlider();

  }

  
  //Lets start the journey to generate new password
  console.log("Starting to generate password");
  

  password = ""; //password equals to empty string 


  let funcArr = [];//empty array
  
  
  if(uppercaseCheck.checked)
    funcArr.push(generateUppercase);

  if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

  if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);
  
  if(symbolsCheck.checked) 
    funcArr.push(generateSymbol);




//Compulsory addition of characters in password for checked checkboxes

for(let i=0; i<funcArr.length; i++){

 
  password += funcArr[i]();


}

console.log("Compulsory addition of characters in password is done");



//Remaining addition of characters in password

for(let i=0; i < passwordLength - funcArr.length; i++){


  let randNum = getRndInteger(0, funcArr.length);
  password += funcArr[randNum]();
}

console.log("Remaining addition of characters in password is done");




//Shuffle the generated password 

password = shufflePassword(Array.from(password));//Here, Array.from(password) converts the password(string) in the form of array
                                                

console.log("Shuffling of characters in password is done");                                                


//Displaying password in UI
passwordDisplay.value = password;
console.log("Password in showing in UI");


//Now, calculating the strength of password
calcStrength();

});