const toggleTheme = document.querySelector('.heading img')

toggleTheme.addEventListener('click',(e)=>{
    const btnTheme = e.target.getAttribute('src').includes('sun')
    if(btnTheme){
        e.target.setAttribute('src',"./images/icon-moon.svg")
        document.body.classList.add('light-theme')
    }
    else{
        e.target.setAttribute('src',"./images/icon-sun.svg")
        document.body.classList.remove('light-theme')
    }
})

const input = document.querySelector('input')
const addBtn = document.querySelector('.btn')
const ul = document.querySelector('ul')

const filterBtns = document.querySelectorAll('.filter button')
const clearCompleted = document.querySelector('.clear button')
const detailsText = document.querySelector('.details .txt')

let tasks = localStorage.getItem('tasks')
if(tasks) tasks = JSON.parse(tasks)
else tasks = []
function app(){
    
    read()
    input.addEventListener('focus',(e)=>{
        e.target.setAttribute('placeholder','Currently typing')
    })
    
    input.addEventListener('blur',(e)=>{
        e.target.setAttribute('placeholder','Create a new todo')
    })
    
    input.addEventListener('keypress',(e)=>{
        if(e.key == 'Enter') add()
    })
    
    clearCompleted.addEventListener('click',()=>{
        ul.querySelectorAll('li .item-body').forEach(el=>{
            if(el.classList.contains('complete')){
                el.parentElement.remove()
                const number = +detailsText.textContent.trim()[0] - 1
                detailsText.textContent = `${number} items left`
                const task = tasks.filter(({task})=>task== el.textContent.trim())[0]
                tasks.splice(tasks.indexOf(task),1)
                localStorage.setItem('tasks',JSON.stringify(tasks))
            }
        })
    })

    addBtn.addEventListener('click',()=>{
        add()
    })

    ul.addEventListener('click',(e)=>{
        if(e.target.classList.contains('remove-item')){
            remove(e.target.parentElement)
        }
    })

    ul.addEventListener('click',(e)=>{
        const el = e.target.closest('span')
        if(el &&  el.classList.contains('check-item')){
            update(el)
            filter()
        }
    })

    filter()
}

function read(){
    const number = tasks.length
    detailsText.textContent = `${number} items left`
    tasks.forEach(({task,status},index)=>{
        createHtml(task)
        if(status == 'complete'){
            const el = ul.querySelectorAll('li .item-body span')[index]
            setComplete(el)
        }
    })
}
function add(){
    if(input.value.trim() === '') return
    createHtml(input.value)
    const number = +detailsText.textContent.trim()[0] + 1
    detailsText.textContent = `${number} items left`
    tasks.push({task : input.value, status: 'no complete'})
    localStorage.setItem('tasks',JSON.stringify(tasks))
    input.value = ''
}

function remove(node){
    node.remove()
    const number = +detailsText.textContent.trim()[0] - 1
    detailsText.textContent = `${number} items left`
    const task = tasks.filter(({task})=>task== node.textContent.trim())[0]
    tasks.splice(tasks.indexOf(task),1)
    localStorage.setItem('tasks',JSON.stringify(tasks))
}

function update(node){
    setComplete(node)
    const task = tasks.filter(({task})=>task== node.parentElement.textContent.trim())[0]
    if(node.parentElement.classList.contains('complete')) task.status = 'complete'
    else task.status = 'no complete'

    localStorage.setItem('tasks',JSON.stringify(tasks))
}

function setComplete(node){
    node.querySelector('img').classList.toggle('toggle-img')
    node.classList.toggle('toggle')
    node.parentElement.classList.toggle('complete')
}

function createHtml(txt){
    let html = `
    <li>
        <div class='item-body'>
            <span class="check check-item">
                <img src="./images/icon-check.svg" alt="">
            </span>
            ${txt}
        </div>
        <img src="./images/icon-cross.svg" alt="" class='remove-item'>
    </li>
    `
    ul.insertAdjacentHTML('beforeend',html)
}
//filtering
function filter(){
    filterBtns.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            removeClassfromBtn()
            e.target.classList.add('filter-selected')
            const filterType = e.target.textContent.toLowerCase()
            filterSelect(filterType)
        })
        if(btn.classList.contains('filter-selected')){
            const filterType = btn.textContent.toLowerCase()
            filterSelect(filterType)
        }
        
    })

}

function removeClassfromBtn(){
    filterBtns.forEach(btn=>{
        btn.classList.remove('filter-selected')
    })
}

function filterSelect(filterType){
    if(filterType === 'all'){
        ul.querySelectorAll('li .item-body').forEach(el=>{
            el.parentElement.style.display  = 'flex'
        })
    }
    else if(filterType === 'completed'){
        ul.querySelectorAll('li .item-body').forEach(el=>{
            el.parentElement.style.display = 'flex'
            if(!el.classList.contains('complete')) el.parentElement.style.display = 'none'
        })
    }
    else{
        ul.querySelectorAll('li .item-body').forEach(el=>{
            el.parentElement.style.display = 'flex'
            if(el.classList.contains('complete')) el.parentElement.style.display = 'none'
        })
    }
}

// start app
app()