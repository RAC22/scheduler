const employeeHtmlRow = document.getElementById('roww')
const employeeTable = document.getElementById('employeetbody')
let counter = 1
function addEmployee () {
    let clone = employeeHtmlRow.cloneNode(true)
    clone.classList.remove('hidden')
    clone.id = 'employee'+counter
    counter++
    employeeTable.appendChild(clone)
}
function deleteEmployee(element){
    element.remove()
}
function saveData (){
    window.localStorage.clear()
    let employeeArray = []
    let employees = employeeTable.children
    for (let i in employees){
        if(i > 0){
            let name = employees[i].getElementsByTagName('input')[0].value
            let selects = employees[i].getElementsByTagName('select')
            let employee = {
                name : name,
                q1day : selects[0].value,
                q1swing : selects[1].value,
                q1grave : selects[2].value,
                q2day : selects[3].value,
                q2swing : selects[4].value,
                q2grave : selects[5].value,
                q3day : selects[6].value,
                q3swing : selects[7].value,
                q3grave : selects[8].value,
                q4day : selects[9].value,
                q4swing : selects[10].value,
                q4grave : selects[11].value
            } 
            employeeArray.push(employee)
        }
    }
    localStorage.setItem('employees', JSON.stringify(employeeArray))
    checkLocal();
}
let checkLocal = () => {
    let employees = JSON.parse(window.localStorage.getItem('employees'))
    console.log(employees)
    if(employees.length > 0) {
        console.log('found em')
    }
}
checkLocal();

