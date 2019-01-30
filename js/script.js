angular.module('TableFilterApp', [])
.controller('TableFilterController', function($scope) {
  $scope.users = [
    // {
    //   name : 'Airi Satou',
    //   city : 'Tokyo',
    //   salary: 162700,
    //   title : 'Accountant'
    // },
    // {
    //   name : 'Angelica Ramos',
    //   city : 'London',
    //   salary: 1200000,
    //   title : 'Cheif Executive Officer (CEO)'
    // },
    // {
    //   name : 'Ashton Cox',
    //   city: 'San Francisco',
    //   salary: 86000,
    //   title : 'Junior Technical Author'
    // },
    // {
    //   name : 'Bradley Greer',
    //   city : 'London',
    //   salary: 132000,
    //   title : 'Software Engineer'
    // },
    // {
    //   name : 'Brenden Wagner',
    //   city : 'San Fransisco',
    //   salary: 206850,
    //   title : 'Software Engineer'
    // },
    // {
    //   name : 'Brielle Williamson',
    //   city : 'New York',
    //   salary: 372000,
    //   title : 'Integration Specialist'
    // },
    // {
    //   name : 'Bruno Nash',
    //   city : 'London',
    //   salary: 163500,
    //   title : 'Software Engineer'
    // },
    // {
    //   name : 'Caesar Vance',
    //   city : 'New York',
    //   salary: 106450,
    //   title : 'Pre-Sales Support'
    // },
    // {
    //   name : 'Cara Stevens',
    //   city : 'New York',
    //   salary: 145600,
    //   title : 'Sales Assistant'
    // },
    // {
    //   name : 'Cedric Kelly',
    //   city : 'Edinburgh',
    //   salary: 433060,
    //   title : 'Senior Javascript Developer'
    // },
    // {
    //   name : 'Matt Goldsworthy',
    //   city : 'Helena',
    //   salary: 1500000,
    //   title : 'President',
    //   "name":{
    //     fromDate:"12-02-2019",
    //   }
    // },

    {
       
        station:"ukStation1",
        getType:"ukGetType1",
        petType:"mulletryPets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk77689",
        passengerNumber:"pa123456",
        begtegNumber:"bg123456",
        fromDate:"15-01-2019",
        cargiAirLinseBillNumber:"bil123456",
        userId:"uk13658912"
    },
    {
        userId:"uk13658913",
        station:"ukStation2",
        getType:"ukGetType2",
        petType:"petType",
        FromTime:"06:31",
        toTime:"08:51",
        toDate:"15-02-2019",
        flightNumber:"uk77679",
        passengerNumber:"pa123457",
        begtegNumber:"bg123256",
        fromDate:"16-01-2019",
        cargiAirLinseBillNumber:"bil113456"
    },
    {
        userId:"uk13658914",
        station:"ukStation3",
        getType:"ukGetType3",
        petType:"mulletryPets",
        FromTime:"06:40",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk11689",
        passengerNumber:"pa176456",
        begtegNumber:"bg123956",
        fromDate:"17-01-2019",
        cargiAirLinseBillNumber:"bil128456"
    },
    {
        userId:"uk13558912",
        station:"ukStation4",
        getType:"ukGetType4",
        petType:"mulletryPets",
        FromTime:"07:30",
        toTime:"09:50",
        toDate:"15-02-2019",
        flightNumber:"uk77589",
        passengerNumber:"pa123786",
        begtegNumber:"bg123423",
        fromDate:"18-01-2019",
        cargiAirLinseBillNumber:"bil123456"
    },
    {
        userId:"uk13658786",
        station:"ukStation5",
        getType:"ukGetType5",
        petType:"mulletryPets",
        FromTime:"05:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk11119",
        passengerNumber:"pa786456",
        fromDate:"19-01-2019",
        begtegNumber:"bg723556",
        cargiAirLinseBillNumber:"bil199456"
    },
    {
        userId:"uk13697433",
        station:"ukStation1",
        getType:"ukGetType1",
        petType:"mulletryPets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk77689",
        passengerNumber:"pa123484",
        begtegNumber:"bg123479",
        fromDate:"20-01-2019",
        cargiAirLinseBillNumber:"bil123484"
    },
    {
        userId:"uk15558912",
        station:"ukStation1",
        getType:"ukGetType1",
        petType:"mulletryPets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk77779",
        passengerNumber:"pa184456",
        begtegNumber:"bg485256",
        fromDate:"09-01-2019",
        cargiAirLinseBillNumber:"bil1999456"
    },
    {
        userId:"uk19905212",
        station:"ukStation1",
        getType:"ukGetType1",
        petType:"mulletryPets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk77799",
        passengerNumber:"pa100056",
        begtegNumber:"bg123400",
        fromDate:"08-01-2019",
        cargiAirLinseBillNumber:"bil123401"
    },
    {
        userId:"uk101228912",
        station:"ukStation4",
        getType:"ukGetType12",
        petType:"Pets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk18119",
        passengerNumber:"pa124556",
        begtegNumber:"bg121056",
        fromDate:"07-01-2019",
        cargiAirLinseBillNumber:"bil123056"
    },
    {
        userId:"uk13608912",
        station:"ukStation1",
        getType:"ukGetType1",
        petType:"mulletryPets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk77089",
        passengerNumber:"pa120456",
        begtegNumber:"bg103456",
        fromDate:"06-01-2019",
        cargiAirLinseBillNumber:"bil123056"
    },
    {
        userId:"uk13658912",
        station:"ukStation1",
        getType:"ukGetType1",
        petType:"mulletryPets",
        FromTime:"06:30",
        toTime:"08:50",
        toDate:"15-02-2019",
        flightNumber:"uk77689",
        passengerNumber:"pa123456",
        begtegNumber:"bg123456",
        fromDate:"05-01-2019",
        cargiAirLinseBillNumber:"bil123456"
    }
  ];
//   $scope.init = function () {
//       renderChart($scope.users);
//   };    
}
);

// function renderChart(data){
// var ctx = document.getElementById("salaryChart");
// var name = [];
// var salary = [];
// for (var i = 0; i < data.length; i++) {
//         salary.push(data[i].salary);
//         name.push(data[i].name);
//     }
// var myChart = new Chart(ctx, {
// type: 'bar',
// data: {
//     labels: name,
//     datasets: [{
//         label: 'Salary',
//         data:salary,
//         backgroundColor: [
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(54, 162, 235, 0.2)',
//             'rgba(255, 206, 86, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(153, 102, 255, 0.2)',
//             'rgba(255, 159, 64, 0.2)',
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(54, 162, 235, 0.2)',
//             'rgba(255, 206, 86, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(153, 102, 255, 0.2)'
//         ],
//         borderColor: [
//             'rgba(255,99,132,1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)',
//             'rgba(255, 159, 64, 1)',
//             'rgba(255,99,132,1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)'
//         ],
//         borderWidth: 1
//     }]
// },
// options: {
//     scales: {
//         yAxes: [{
//             ticks: {
//                 beginAtZero:true
//             }
//         }]
//     }
// }
// });
// };
// 26f359fc-e3f6-4727-8af1-72a1a4a0819d