const employeeHtmlRow = document.getElementById('roww')
const employeeTable = document.getElementById('employeetbody')
const output = document.getElementById('assignments')
const minNum = document.getElementById('numInput')
let counter = 1
let numPer = 2
minNum.value = numPer
minNum.addEventListener('change', (event) => {
    numPer = event.target.value
});
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
            if(!name){
                window.alert('Please make sure Employees have names.')
                return
            }
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
    let names = []
    for (let i in employeeArray){
        names.push(employeeArray[i].name)
    }
    for(let i in names){
        let num = names.filter(function(name){
            return name === names[i]
        }).length
        if (num > 1){
            window.alert('Please make names unique')
            return
        }
    }
    localStorage.setItem('employees', JSON.stringify(employeeArray))
    localStorage.setItem('minNum', numPer)
    calculateSchedule();
}
let checkLocal = () => {
    let min = window.localStorage.getItem('minNum')
    numPer = min
    minNum.value = numPer
    let employees = JSON.parse(window.localStorage.getItem('employees'))
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

function calculateSchedule () {
    let schedule = {
        q1 : {
            day : [],
            swing : [],
            grave : []
        },
        q2 : {
            day : [],
            swing : [],
            grave : []
        },
        q3 : {
            day : [],
            swing : [],
            grave : []
        },
        q4 : {
            day : [],
            swing : [],
            grave : []
        }
    }
    let employees = JSON.parse(window.localStorage.getItem('employees'))
    function shuffle (array) {
        let currentIndex = array.length, randomIndex
        while (currentIndex != 0){
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            [array[currentIndex], array[randomIndex]] = [array[randomIndex] , array[currentIndex]]
        }
        return array
    }
    function findPrio (q , shift , employeeList) {
        if(employeeList.length > 0){
            for(let i in employeeList){
                if(employeeList[i][q]?.[`${q}${shift}`] == 1){
                    delete employeeList[i][q]
                    return employeeList[i].name
                }
            }
            for(let i in employeeList){
                if(employeeList[i][q]?.[`${q}${shift}`] == 2){
                    delete employeeList[i][q]
                    return employeeList[i].name
                }
            }
            for(let i in employeeList){
                if(employeeList[i][q]?.[`${q}${shift}`] == 3){
                    delete employeeList[i][q]
                    return employeeList[i].name
                }
            }
        }
    }
    if(employees.length > 0) {
        let shuffled = shuffle(employees)
        // fill shifts for first prios
        for (let i in shuffled){
            for(let q in schedule){
                for(let shift in schedule[q]){
                    if(shuffled[i][q]?.[`${q}${shift}`] == 1 && schedule[q][shift].length < numPer){
                        schedule[q][shift].push(shuffled[i].name)
                        delete shuffled[i][q]
                    }
                }
            }
        }
        // fill shifts to minium numbers
        for(let q in schedule){
            for(let shift in schedule[q]){
                while(schedule[q][shift].length < numPer){
                    schedule[q][shift].push(findPrio(q , shift, shuffled))
                }
            }
        }
        // fill shifts evenly with leftovers
        for (let i in shuffled){
            for(let q in schedule){
                if(shuffled[i]?.[q]){
                    for(let shift in schedule[q]){
                        schedule[q][shift].push(findPrio(q, shift, shuffled))
                        delete shuffled[i][q]
                        continue
                    }
                }
            }
        }
        //remove any undefined values from schedule arrays.
        for(let q in schedule){
            for(let s in schedule[q]){
                for(let n in schedule[q][s]){
                    if(schedule[q][s][n] == undefined){
                        schedule[q][s].splice(n, 1)
                    }
                }
            }
        }
    }
    for(let i in employees){
        employees[i].shifts = []
    }
    for(let i in employees){
        for(let q in schedule){
            for(let s in schedule[q]){
                let name = employees[i].name
                if(schedule[q][s].includes(name)){
                    employees[i].shifts.push(s)
                }
            }
        }
    }
    buildOutput(employees);
}
calculateSchedule();
function buildOutput (emps) {
    output.innerHTML = ''
    for(let i in emps){
        let row = document.createElement('tr')
        output.appendChild(row)
        let tdname = document.createElement('td')
        let nameNode = document.createTextNode(emps[i].name)
        tdname.append(nameNode)
        row.appendChild(tdname)
        for(let j in emps[i].shifts){
            let td = document.createElement('td')
            let shiftNode = document.createTextNode(emps[i].shifts[j])
            td.append(shiftNode)
            row.appendChild(td)
        }
    }
    let totalsRow = document.createElement('tr')
    output.appendChild(totalsRow)
    let totalEmps = output.children.length - 1
    let totEmpstd = document.createElement('td')
    let totEmpNode = document.createTextNode(`${totalEmps} Employee Count`)
    totEmpstd.append(totEmpNode)
    totalsRow.appendChild(totEmpstd)
    for (let i = 1; i < 5; i++){
        let numDays = 0
        let numSwing = 0
        let numGrave = 0
        for (let j in output.children){
            if (output.children[j].children?.[i]){
                switch(output.children[j].children[i].innerHTML){
                    case 'day':
                        numDays++
                        break;
                    case 'swing':
                        numSwing++
                        break;
                    case 'grave':
                        numGrave++
                        break;
                    default:
                        console.log('crap')
                }
            }
        }
        let td = document.createElement('td')
        let tdTot = document.createTextNode(`${numDays}D ${numSwing}S ${numGrave}G`)
        td.append(tdTot)
        totalsRow.appendChild(td)
        if(numDays < numPer || numSwing < numPer || numGrave < numPer){
            alert(`Not enough employees to fill shifts at minimum number of ${numPer}`)
            break
        }
    }
}
