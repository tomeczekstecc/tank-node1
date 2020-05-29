const resultEl = document.getElementById('result')

async function getData(){
const data = await (await fetch('tank1.txt')).json()
console.log(data)
resultEl.innerText = data}



setTimeout(function(){
    getData();
    }, 1000);