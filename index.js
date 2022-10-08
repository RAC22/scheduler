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
                q1 : {
                    q1day : selects[0].value,
                    q1swing : selects[1].value,
                    q1grave : selects[2].value,
                },
                q2 : {
                    q2day : selects[3].value,
                    q2swing : selects[4].value,
                    q2grave : selects[5].value,
                },
                q3 : {
                    q3day : selects[6].value,
                    q3swing : selects[7].value,
                    q3grave : selects[8].value,
                },
                q4 : {
                    q4day : selects[9].value,
                    q4swing : selects[10].value,
                    q4grave : selects[11].value,
                },
                row : employees[i].outerHTML.toString()
            } 
            employeeArray.push(employee)
        }
    }
    localStorage.setItem('employees', JSON.stringify(employeeArray))
}
let checkLocal = () => {
    let employees = JSON.parse(window.localStorage.getItem('employees'))
    console.log(employees)
    if(employees.length > 0) {
        for (let i in employees){
            let row = document.createElement('tr')
            row.innerHTML = employees[i].row
            row.getElementsByTagName('input')[0].value = employees[i].name
            let selects = row.getElementsByTagName('select')
            selects[0].value = employees[i].q1.q1day
            selects[1].value = employees[i].q1.q1swing
            selects[2].value = employees[i].q1.q1grave
            selects[3].value = employees[i].q2.q2day
            selects[4].value = employees[i].q2.q2swing
            selects[5].value = employees[i].q2.q2grave
            selects[6].value = employees[i].q3.q3day
            selects[7].value = employees[i].q3.q3swing
            selects[8].value = employees[i].q3.q3grave
            selects[9].value = employees[i].q4.q4day
            selects[10].value = employees[i].q4.q4swing
            selects[11].value = employees[i].q4.q4grave
            employeeTable.appendChild(row)
        }
    }
}
checkLocal();

function buildOutput () {
    
}

