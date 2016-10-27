/*var model = function(){
    this.categories = {
        'restaurants' :[{
            'name' : 'dominoes',
            'location' : {
                lat: -30.20,
                lng: 150.644
            },
            'id': 1,
            'img': '<img class = "rest_image" src="images/dom.jpg">',
            'info' : 'One of the deliciou spizzas are served here!!'
        }, {
            'name' : 'Tea-time',
            'location' : {
                lat: -31.20,
                lng: 150.644
            },
            'id': 2,
            'img': '<img class = "rest_image"  src="images/teatime.jpg">',
            'info' : 'Tired?? Stop here for a perfect tea.'
        }, {
            'name' : 'Oven-hot',
            'location' : {
                lat: -32.20,
                lng: 150.644
            },
            'id': 3,
            'img': '<img class = "rest_image"  src="images/ovenhot.jpg">',
            'info' : 'Hungry!! Stop here for delicious mouth watering snacks'

        }, {
            'name' : 'Eifel juices',
            'location' : {
                lat: -33.20,
                lng: 150.644
            },
            'id': 4,
            'img': '<img class = "rest_image"  src="images/eiffel.jpg">',
            'info' : 'Thirsty?? grab yourself some of their delicious juices'

        }, {
            'name' : 'Mac Donald',
            'location' : {
                lat: -34.20,
                lng: 146.644
            },
            'id': 5,
            'img': '<img class = "rest_image"  src="images/macd.jpg">',
            'info' : 'Grab yourself a big Mac Burger filled with some extra cheese '

        }, {
            'name' : 'Pizza Hut',
            'location' : {
                lat: -34.20,
                lng: 147.644
            },
            'id': 6,
            'img': '<img class = "rest_image"  src="images/pizzahut.jpg">',
            'info' : 'Stop here if you dont want to eat shitty pizza somewhere else '

        }]
    }

};

*/

//var vm = new ViewModel();
//vm.query.subscribe(vm.search);
//ko.applyBindings(vm);
var map,bounds,vm,largeInfoWindow,defaultIcon,highIcon,clickIcon,marker,yelp_parameters,encodedSignature,settings,finish;
var loc1 = {
    'lat': '',
    'lng':''
};
var loca;
var markers = [];
var model1 = [];
//var m = new model();
//vm = new ViewModel(m);
var ViewModel = function(){
    var menu =$('#menu');
    var sidebar =$('.sidebar')
    menu.click(function(){
        sidebar.toggleClass('open');
        console.log("clicked");
        //e.stopPropogation();
    });
    //this.finish = ko.observable();
    //this.finish= ko.observable('false');
    var self = this;
    this.query = ko.observable('');
    this.mylocation = ko.observable('Enter a location');
    this.restaurants = ko.observableArray('');
    this.currentrestaurant = ko.observable();
    this.changelocation = function(value){
        yelp(value);

        //console.log(finish);
        setTimeout(function(){
            for(var i=0; i < 10; i++) {
                self.restaurants.push(model1[i]);
            }
        },3000);

    }
    this.showinfo = function(current){
        self.currentrestaurant = current;
        markers[current.id-1].setIcon(clickedIcon);
        populateInfoWindow(markers[current.id-1],largeInfoWindow);
    };
    this.search = function(value){
        self.restaurants.removeAll();
        for (var i in self.arr1){
            markers[i].setMap(null);

            if(self.arr1[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.restaurants.push(self.arr1[i]);
                markers[i].setMap(map);
                //populateInfoWindow()
            }
        }

    }
    //yelp();
}

//var m =new model();
var vm = new ViewModel();
vm.query.subscribe(vm.search);
vm.mylocation.subscribe(vm.changelocation);
ko.applyBindings(vm);

//global funcitons
function  initMap(){
    //var m = new model();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 2
        });
    //bounds = new google.maps.LatLngBounds();
    largeInfoWindow = new google.maps.InfoWindow();
    defaultIcon = makeMarkerIcon('a82848');
    highlightedIcon = makeMarkerIcon('ed4b74');
    clickedIcon = makeMarkerIcon('f79336');
    //for (var category in m.categories) {
        //add_markers_to_map(m.categories.restaurants, m.categories);
    //}
    //console.log(bounds);
    //map.fitBounds(bounds);
};

populateInfoWindow = function(marker, infowindow){
    //console.log(marker.position);
    if( infowindow.marker != marker){
        infowindow.marker = marker;
        infowindow.setContent('<div class="InfoWindow">' +  '<h2 class="name">' + marker.title + '</h2>' + '<span class ="info" >'+ marker.info + '</span>'+ marker.img + '</div>');
        infowindow.open(map, marker);
    }
}
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(23, 36),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(23,36));
  return markerImage;
}
add_markers_to_map = function(category){
    for( var i = 0; i< category.length ; i++) {
        marker = new google.maps.Marker({
            position: category[i].location,
            map: map,
            title: category[i].name,
            animation: google.maps.Animation.DROP,
            id: category[i].id,
            info: category[i].info,
            img: category[i].img
            //label: type,
        });
        markers.push(marker);
        bounds.extend(marker.position);
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        marker.addListener('click',function(){
        //infowindow.open(map, marker);
            this.setIcon(clickedIcon);
            // this.setIcon(clickedIcon);
            populateInfoWindow(this, largeInfoWindow);
        });
        marker.addListener('mouseover',function(){
            //console.log("hovering");
            this.setIcon(highlightedIcon);
            setTimeout(function(){

            })
        })
    }
};


