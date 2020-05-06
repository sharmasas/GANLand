
/** PAGE SETUP **/
let values = [];
let rounds = [];
let sens = [];
let spec = [];
let acc = [];
let level = [];

// gets and parses arrays from local storage to "values", then unzips values to a series of 1D arrays to plug into chart
function getItems() {
    
    // pulls elements from local storage into values
    let keys = Object.keys(sessionStorage);
    let i = keys.length;
    for ( i = 0; i < keys.length; i++ ) {
        values.push( JSON.parse(sessionStorage.getItem(keys[i])));
    }

    // sorts values from earliest round to last round (FIXME WHY IS THIS NEEDED?)
	values.sort( (a, b) => {return a[0] - b[0]});

	// pulls out 1D array of each relevant trait for chart
	for ( var j = 0; j < values.length; j++ ) {
        rounds[j] = values[j][0];
        rounds[j] = "Round " + rounds[j];
        level[j] = values[j][1];
        sens[j] = values[j][2];
        spec[j] = values[j][3];
        acc[j] = values[j][4];
    }

    console.log("performance: " + values);
    console.log("round names: " + rounds);
}

/** CHART CODE **/
/** Resources: Chart.js tutorial / CodingTrain **/

// plots user performance to chart
async function chartIt() {
	await getItems();

	var ctx = document.getElementById('myChart1').getContext('2d');
	Chart.defaults.global.defaultFontFamily = "IBM Plex Sans";

	var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
	gradient1.addColorStop(0, '#ff8a00');
	gradient1.addColorStop(1, '#da1b60');

	var gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
	gradient2.addColorStop(0, '#da1b60');
	gradient2.addColorStop(1, '#8a00ff');

	var gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
	gradient3.addColorStop(0, '#00FFC4');
	gradient3.addColorStop(1, '#00DCFF');

	var chart = new Chart(ctx, {

		// The type of chart we want to create
		type: 'bar',

			  // Configuration options go here (make sure that all data can be seen)
	  	options: {	
	  		scales: {
     			yAxes: [{ticks: {min: 0, max: 100}}]
	    	},
	    	tooltips: {
			    callbacks: {	
			        label: function(tooltipItem, data) {
			            var label = data.datasets[tooltipItem.datasetIndex].label || '';

			            if (label) {
			                label += ': ';
			            }
			            label += tooltipItem.yLabel.toFixed(2);
			            return label;
			        }
			    }						
			},
	    	maintainAspectRatio: false
	  	},
		
		// The data for our dataset FIXME
		data: {
		    labels: rounds,
		    datasets: [{
		        label: 'Sensitivity',
		        backgroundColor: gradient3,
		        borderColor: 'white',
		        data: sens //FIXME
		    } , {
	          label: 'Specificity',
		        backgroundColor: gradient2,
		        borderColor: 'white',
		        data: spec //FIXME
	      } , {
	      	  label: 'Accuracy',
		        backgroundColor: gradient1,
		        borderColor: 'white',
		        data: acc //FIXME
	      }],
		}

	});
}


async function chartIt2() {
	//await getItems();

	var ctx = document.getElementById('myChart2').getContext('2d');
	Chart.defaults.global.defaultFontFamily = "IBM Plex Sans";

	var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
	gradient1.addColorStop(0, '#ff8a00');
	gradient1.addColorStop(1, '#da1b60');

	var chart = new Chart(ctx, {
	// The type of chart we want to create
	type: 'line',

	// The data for our dataset FIXME
	data: {
	    labels: rounds,
	    datasets: [{
	        label: 'Level',
	        backgroundColor: '#111',
	        borderColor: gradient1,
	        data: level, //FIXME
	        cubicInterpolationMode: 'monotone'
	    }],
	},

	  // Configuration options go here (make sure that all data can be seen)
	  options: {	
	  	scales: {
     		yAxes: [{ticks: {min: 1}}],
	    },
	    layout: {
            padding: {
                right: 20
            }
        },
	    maintainAspectRatio: false
	  }

	});
}

// GENERATE CHART CONTENT + VISUALS
//getItems();
chartIt();
chartIt2();

// clear storage when returning home
$('.clear').on('click', function(){
  sessionStorage.clear();
});

