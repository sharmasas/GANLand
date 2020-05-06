
/** PAGE SETUP **/
let session6 = [];
// filepath for images
//let PATH = "https://cdn.glitch.com/f1c758c2-fd4c-4433-8a70-acaec9f76206%2F";
let PATH = "/Users/sanjanasharma/Desktop/collaborative-creation-app/level6/";
// hide results button
document.getElementById("result-btn").style.display = "none";

// create arrays (images and shuffled images)
let image_array = [];
let shuffled_array = [];
let shuffled_values = [];
let comparison_array = [];
let performance_data = [];

// images for level6: 1 is PHOTO, 0 is GAN
image_array = [
	{image: "fl_005.png", value: 1},
	{image: "fl_006.png", value: 1},
	{image: "fl_007.png", value: 1},
	//{image: "fl_008.png", value: 1},
	//{image: "fl_009.png", value: 1},
	{image: "nv15_004.png", value: 0},
	{image: "nv15_005.png", value: 0},
	{image: "nv15_006.png", value: 0},
	//{image: "nv15_007.png", value: 0},
	//{image: "nv15_008.png", value: 0}
];

// create shuffled version of array, define size of array		
let size = image_array.length;
//let size = 3; 
shuffled_array = shuffle(image_array);


/** Shuffle Function **/
/** Reference: https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php **/
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

// create actual values array to compare with user input
for (let i = 0; i < size; i++) {
	shuffled_values[i] = shuffled_array[i].value;
}



/** CARDS CODE **/
/** reference: https://codepen.io/colin/pen/bdxoZL **/

// stacked cards variable (card container)
let $stackedCards = $('.stacked-cards');

// for loop to pre-populate initial set of cards (size of array)
for (let j = 0; j < size; j++) {
  img = shuffled_array[j].image;

  var startdiv = '<div class="card">';
  var enddiv = '</div>';
  var imgStr = '<img src="' + PATH + img + '" alt = "">';
  
  let $newCard = $(startdiv + imgStr + enddiv);
  $stackedCards.append($newCard);

  setTimeout(() => {
    requestAnimationFrame(() => {
      $newCard.addClass('card--added');
    });
  }, 10);
}

// function to remove cards, make remove button show after all cards are gone, and to hide the real/fake buttons
$('.js-remove-card').on('click', () => {
	
	let $activeCard = $stackedCards.children().slice(-1);
	$activeCard.removeClass('card--added'); 

  	setTimeout(() => {
		requestAnimationFrame(() => {
			$activeCard.remove();
		});
	}, 400); // Match CSS transition time

  	var elems = document.querySelectorAll(".card--added");
  	if (elems.length == 0) {

  		// sanity check to see whether counters are working
		// console.log('real value: ' + shuffled_values.reverse());
		
		// hide action buttons, show "view results" button
		document.getElementById("real-btn").style.display = "none";
		document.getElementById("gan-btn").style.display = "none";
		document.getElementById("result-btn").style.display = "flex"; 		
  	}
});

// functions to keep track of user input when clicking on buttons:
// "real image" button
document.getElementById("real-btn").addEventListener("click", guessedReal);
function guessedReal() {
	comparison_array.push(1);
	// sanity check to make sure values are correctly saved to array
  	//console.log('user input: ' + comparison_array);
}
// "generated image" button
document.getElementById("gan-btn").addEventListener("click", guessedGAN);
function guessedGAN() {
	comparison_array.push(0);
	// sanity check to make sure values are correctly saved to array
	// console.log('user input: ' + comparison_array);	
}


/** TURN ON MODAL AND SHOW PERFORMANCE WHEN BUTTON CLICKED **/
// Original: https://codepen.io/maziarzamani/pen/oxBKxX

$('#result-btn').click(function(e) {
  $('.modal').addClass('activated');
  e.preventDefault();

  shuffled_array = shuffled_array.reverse();

  for (let k = 0; k < size; k++) {
    
    // add comparison array
    shuffled_array[k].userval = comparison_array[k];

    // add 
    if (shuffled_array[k].userval == shuffled_array[k].value) {
    	shuffled_array[k].performance = 'CORRECT';
    }
    else {
    	shuffled_array[k].performance = 'INCORRECT';
    }
  }

  // Serve modal title with round number given by sessionStorage
  let round_num = sessionStorage.length + 1;
  document.getElementById("round-title").innerHTML = "Round " + round_num + " Performance";

  // GENERATE CHART CONTENT + VISUALS
  //chartData();
  chartIt();

  // edit page content depending on how well people have done (current threshhold is acc = 100%)
  if (performance_data[4] == 100) {
  	document.getElementById("feedback").innerHTML = 
  	"<b>Well done!</b> You’ve managed to correctly distinguish between the photos and generated images in the entire sample. The generator will retrain based on your feedback in order to produce better images. In the chart below, your <b>sensitivity</b> indicates the percentage of photos you identified correctly, your <b>specificity</b> indicates the percentage of GANs you identified correctly, and your <b>accuracy</b> indicates what percentage of the guesses you made were correct overall. Things will get harder in future rounds, but you've got this!";
  }
  else {
  	document.getElementById("feedback").innerHTML = 
  	"<b>You made it through!</b> You’ve attempted to sort photos and generated images, but have gotten a few things wrong in the process. See the summary chart and spot-check with individual images below if you wish to see what you got right and wrong. Remember that your <b>sensitivity</b> indicates the percentage of photos you identified correctly, your <b>specificity</b> indicates the percentage of GANs you identified correctly, and your <b>accuracy</b> indicates what percentage of the guesses you made were correct overall.";
  }

  // GENERATE FILTERABLE IMAGE ARRAY
  loadImages();
  filterSelection("all");

});

/// ** LOGIC TO DECIDE WHAT LEVEL USER SHOULD BE TAKEN NEXT (LEVEL3) **/
$('#level-set').click(function() {
  if (performance_data[4] == 100) {
  	window.location='level7.html';
  }
  else {
  	window.location='level6.html';
  }
});


/** CHART CODE **/
/** Resources: Chart.js tutorial / CodingTrain **/

// calculates performance and stores to array
function chartData() {
	//generate array for performance data
	let TPcounter = 0;
	let TNcounter = 0;
	let FPcounter = 0;
	let FNcounter = 0;

	for (let l = 0; l < size; l++) {
		// print values (sanity check)
		// console.log("true = " + shuffled_array[l].value);
		// console.log("user = " + shuffled_array[l].userval);

		// count up confusion matrix
		if (shuffled_array[l].value == '1' && shuffled_array[l].userval == '1') {
			TPcounter++;
		} else if (shuffled_array[l].value == '0' && shuffled_array[l].userval == '0') {
			TNcounter++;
		} else if (shuffled_array[l].value == '0' && shuffled_array[l].userval == '1') {
			FPcounter++;
		} else {
			FNcounter++;
		}
	}

  // array that contains sensitivity, specificity, and accuracy
  performance_data[0] = sessionStorage.length + 1; // round #
  performance_data[1] = 6; // level #
  performance_data[2] = 100 * (TPcounter / (TPcounter + FNcounter)); // sensitivity
  performance_data[3] = 100 * (TNcounter / (TNcounter + FPcounter)); // specificity 
  performance_data[4] = 100 * ((TPcounter + TNcounter) / (TPcounter + TNcounter + FPcounter + FNcounter)); // accuracy
  
  // save analytics data and level number to session for storage
  session6 = performance_data;
  // sanity check: print session data
  console.log("session6: " + session6);

  // unique name generator 
  let id = "round" + JSON.stringify(performance_data[0]);
  console.log(id);
  
  // send session1 data to session storage
  sessionStorage.setItem(id, JSON.stringify(session6));
}

// plots user performance to chart
async function chartIt() {
	await chartData();

	var ctx = document.getElementById('myChart').getContext('2d');
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

	// The data for our dataset
	data: {
	    labels: ['% Sensitivity', '% Specificity', '% Accuracy'],
	    datasets: [{
	        //label: 'Percentage',
	        backgroundColor: [gradient3, gradient2, gradient1],
	        borderColor: 'white',
	        data: [performance_data[2], performance_data[3], performance_data[4]]
	    }],
	},

	  // Configuration options go here (make sure that all data can be seen)
	  options: {	
	  	scales: {
     		yAxes: [{ticks: {min: 0, max: 100}}],
	    },
	    legend: {
	    	display: false
	    },
	    layout: {
            padding: {
                top: 20
            }
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
	  }

	});
}

/** TILED IMAGES **/

//Resources: https://www.w3schools.com/howto/howto_js_filter_elements.asp
//Resources: https://www.w3schools.com/jsref/prop_style_borderimage.asp
//Resources: https://www.w3schools.com/howto/howto_css_image_overlay_title.asp FIXME

// loads images onto page from data object, adding appropriate tags/classes
function loadImages() {
	
	let $imageStack = $('.img-stack');

	// for loop to pre-populate initial set of cards (size of array)
	for (let j = 0; j < size; j++) {
	  
	    img = shuffled_array[j].image;

	    let startdiv = '<div class="filterDiv">';
	    let enddiv = '</div>';
	    //let overlay = '<div class="overlay"><p>SAMPLE TEXT</p></div>';
	    let imgStr = '<img src="' + PATH + img + '" alt = "">';
	  
	    let $newImg = $(startdiv + imgStr /**+ overlay**/ + enddiv);
	    $imageStack.append($newImg);

		if (shuffled_array[j].performance == 'CORRECT') {
	      	$newImg.addClass('classCorrect');
	    } else {
	      	$newImg.addClass('classIncorrect');
	    }

		if (shuffled_array[j].value == '1' && shuffled_array[j].userval == '1') {
			$newImg.addClass('tp');
		} else if (shuffled_array[j].value == '0' && shuffled_array[j].userval == '0') {
			$newImg.addClass('tn');
		} else if (shuffled_array[j].value == '0' && shuffled_array[j].userval == '1') {
			$newImg.addClass('fp');
		} else {
			$newImg.addClass('fn');
		}

	}
}


// TILED IMAGE FILTER
// SOURCE: https://www.w3schools.com/howto/howto_js_filter_elements.asp

function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}



