function vis (argument) {
	
L.mapbox.accessToken = 'pk.eyJ1IjoidGVqZXNoOTUiLCJhIjoiNTdlZWI0NGEwMzU1NmRmNzYzNzZmY2ZhMmY0YTFhMDAifQ.KTwxWh-vcPO6tv3IKHJvBQ';
// Replace 'mapbox.streets' with your map id.
var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([21.0000 , 86.0000], 5);


var tip = d3.tip()
  .attr("class", "d3-tip")
  .html(function(d){ 
  		// console.log(d);
  		return " HOTEL Id :"+ d.hid
  				+"<br><br>ATM : "+parseInt(d.atm*1000)+"m"
  				+"<br>Bar : "+ parseInt(d.bar*1000)+"m"
  				+"<br>Bus Station : "+ parseInt(d.bus_station*1000)+"m"
  				+"<br>Restaurents : "+ parseInt(d.food*1000)+"m"
  				+"<br>hospital : "+ parseInt(d.hospital*1000)+"m"
  				+"<br>Landmarks : "+ parseInt(d.landmarks*1000)+"m"
  				+"<br>Movie Theatres : "+ parseInt(d.movie_theatre*1000)+"m"
  				+"<br>offices : "+ parseInt(d.offices*1000)+"m"
  				+"<br>spa/gyms : "+ parseInt(d.spa_gym*1000)+"m </br>"})

//Initialize svg layer 
map._initPathRoot()

var svg = d3.select("#map").select("svg"),
g = svg.append("g")

d3.selectAll(".chart-wrapper")
	.style("fill-opacity",0)
	.transition()
	.duration(4000)
	.style("fill-opacity",1)
// Pick up SVG from map object
d3.csv("data/csv_sample.csv", function(csv){

	csv.forEach(function(d){
		d.tier = +d.tier;

	})

	csv.forEach(function(d){
		d.LatLng = new L.LatLng(d.lat, d.lng);
	})

	total_hotels = csv.length;

	var ndx = crossfilter(csv);

	var tierTypeDimension = ndx.dimension(function(d){ return d.tier;});
	// var amenityTypeChart = ndx.dimension( function(d){ return d.bar;});
var tierTypeGroup = tierTypeDimension.group();

//For filtering based on tier
tierTypeFilterDimension = ndx.dimension(function(d){ return d.tier;})

var foodDistanceDimension = ndx.dimension(function(d){ 
		if(d.food*1000 > 500)
			return "Restaurents(<500m)";
		else
			return "Restaurents(>500m)";
})

var foodGroup = foodDistanceDimension.group();

var amenityPieChart = dc.pieChart("#amenityTypeChart");
amenityPieChart
	.width(150)
	.height(150)
	.radius(45)
	.dimension(foodDistanceDimension)
	.group(foodGroup)
	.innerRadius(20)
	.colors(d3.scale.ordinal().domain(["Restaurents(<500m)","Restaurents(>500m)"])
							    .range(["#37FF00", "#29BD47"]))
	.renderTitle(true)
	.renderLabel(false)
	.title(function(d,i){ return "No. of hotels having "+d.key+ "are " + d.value;;})
	.legend(dc.legend().x(20).y(0).itemHeight(13).gap(5) )
	.on('filtered',function(d,i){
		console.log(d,i);
		hotelPoints();
		dc.redrawAll();
	})
var	 atmDistanceDimension = ndx.dimension(function(d){ 
		if(d.atm*1000 > 500)
			return "ATM(<500m)";
		else
			return "ATM(>500m)";
})
var atmGroup = atmDistanceDimension.group();

var atmamenityPieChart = dc.pieChart("#ATMChart");
atmamenityPieChart
	.width(150)
	.height(150)
	.radius(45)
	.dimension(atmDistanceDimension)
	.group(atmGroup)
	.innerRadius(20)
	.colors(d3.scale.ordinal().domain(["ATM(<500m)","ATM(>500m)"])
                                .range(["#37FF00", "#29BD47"]))
	.renderTitle(true)
	.renderLabel(false)
	.title(function(d,i){ return "No. of hotels having "+d.key+ "are " + d.value;})
	.legend(dc.legend().x(20).y(0).itemHeight(13).gap(5))
	.on('filtered',function(d,i){
		// console.log(d,i);
		hotelPoints();
		dc.redrawAll();
	})

var	 TheatresDimension = ndx.dimension(function(d){ 
		if(d.movie_theatre*1000 > 500)
			return "Movies Theatre(<500m)";
		else
			return "Movie Theatre(>500m)";
})
var movieGroup = TheatresDimension.group();

var moviePieChart = dc.pieChart("#MovieChart");
moviePieChart
	.width(150)
	.height(150)
	.radius(45)
	.dimension(TheatresDimension)
	.group(movieGroup)
	.innerRadius(20)
	.colors(d3.scale.ordinal().domain(["Movie Theatre(<500m)","Movie Theatre(>500m)"])
                                .range(["#37FF00", "#29BD47"]))
	.renderTitle(true)
	.renderLabel(false)
	.title(function(d,i){console.log(d); return "No. of theatres having "+d.key+ "are " + d.value;})
	.legend(dc.legend().x(20).y(0).itemHeight(13).gap(5))
	.on('filtered',function(d,i){
		console.log(d,i);
		hotelPoints();
		dc.redrawAll();
	})


function hotelPoints(){

		var feature = g.selectAll("circle")
						.data(tierTypeFilterDimension.top(Infinity))
				feature.style("fill", function(d,i){
								switch(d.tier){
									case 1:
										return "#7323DC";
										break;
									case 2:
										return "#FF7B10";
										break;
									case 3:
										return "#E5006C";
										break;
									default:
									return "red";
								}
						})

						// .transition()
						// .duration(2000)
						.attr("r",3)
						// .attr("transform", 
						// 	function(d){
						// 		return "translate(" + 
						// 			map.latLngToLayerPoint(d.LatLng).x + "," + 
						// 			map.latLngToLayerPoint(d.LatLng).y + ")";
						// })

				feature.enter()
						.append("circle")


				feature.style("fill", function(d,i){
								switch(d.tier){
									case 1:
										return "#7323DC";
										break;
									case 2:
										return "#FF7B10";
										break;
									case 3:
										return "#E5006C";
										break;
									default:
									return "red";
								}
						})
						.attr("r",3)
						.on("mouseover", function(d){return tip.show(d);})
						.on("mouseout", tip.hide)
						.on("click", function(d){return tip.show(d);})
						.call(tip)
				feature.exit().remove();
		
		map.on("viewreset", update);
		update();

		function update() {
			feature.attr("transform", 
				function(d){
					// console.log(map.latLngToLayerPoint(d.LatLng).x, map.latLngToLayerPoint(d.LatLng).y);
					return "translate(" + 
						map.latLngToLayerPoint(d.LatLng).x + "," + 
						map.latLngToLayerPoint(d.LatLng).y + ")";
				})
		}
    }

	tierTypeChart = dc.rowChart("#tierTypeRowChart");
	tierTypeChart
		.width(200)
		.height(200)
		.dimension(tierTypeFilterDimension)
		.group(tierTypeGroup)
        .colors(d3.scale.ordinal().domain(["tier1","tier2", "tier3"])
								.range(["#7323DC","#FF7B10", "#E5006C"]))
        .title(function(d) {
         return "tier "+d.key+" has "+d.value+" hotels"; })
        .elasticX(false)
        .margins({top: 0, right: 10, bottom: 35, left: 20})
        .gap(20)
        .labelOffsetY(-3)
        .labelOffsetX(1)
        .on('postRender', function(chart) {
				   tierTypeChart.svg().append('text').attr('class', 'y-label').attr('text-anchor', 'middle')
				      .attr('x', -100).attr('y', 40).attr('dy', '-25').attr('transform', 'rotate(-90)')
				      .text('tiers (hover on bars)');
				})
        .on("filtered", function(d,i){
        	if(tierTypeChart.hasFilter(i)){}
        	else{
        		tierTypeFilterDimension.filterAll();
        	}
        	hotelPoints();
        	dc.redrawAll();
        })

    tierTypeChart.xAxis().ticks(4);
    dc.renderAll();
})
	
}
