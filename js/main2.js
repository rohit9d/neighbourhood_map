var map,bounds,vm,largeInfoWindow,defaultIcon,highIcon,clickIcon,marker,yelp_parameters,encodedSignature,settings,finish;
var loc1 = {
    'lat': '',
    'lng':''
};
var hover = false;
var click = false;

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
        setTimeout(function(){
            for(var i=0; i < model1.length; i++) {
                self.restaurants.push(model1[i]);
            }
            add_markers_to_map(model1);
        },3000);
    }
    this.showinfo = function(current){
        self.currentrestaurant = current;
        console.log("clicked on "+ current.name);
        populateInfoWindow(markers[self.currentrestaurant.id],largeInfoWindow);
    };
    this.search = function(value){
        self.restaurants.removeAll();
        for (var i in model1){
            markers[i].setMap(null);
            if(model1[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.restaurants.push(model1[i]);
                markers[i].setMap(map);
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
mapdiv = $("#map");
//global funcitons
function  initMap(){
    //var m = new model();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 2
        });
    bounds = new google.maps.LatLngBounds();

    largeInfoWindow = new google.maps.InfoWindow();
    defaultIcon = makeMarkerIcon('a82848');
    highlightedIcon = makeMarkerIcon('ed4b74');
    clickedIcon = makeMarkerIcon('f79336');
    bounds = new google.maps.LatLngBounds();

};

populateInfoWindow = function(marker, infowindow){
    if( infowindow.marker != marker){
    console.log(marker.position);

        infowindow.marker = marker;
        infowindow.setContent('<div class="InfoWindow">' +  '<h2 class="name">' + marker.title + '</h2>' + '<span class ="info" >'+ marker.info + '</span>'+ '<img src="'+marker.img+'"' + '</div>');
        infowindow.open(map, marker);

    }
    infowindow.addListener('closeclick',function(){
        marker.setIcon();
        infowindow.close();
        click = false;
    });

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

    //console.log(category[0].location);
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
            this.setIcon(clickedIcon);
            click = true;
            console.log("clicking on marker");
            populateInfoWindow(this, largeInfoWindow);
        });
        marker.addListener('mouseover',function(){
            if(click == false) {
                this.setIcon(highlightedIcon);
                hover = true;
            }

        });
        marker.addListener('mouseout',function(){
            if(click !=true){
                this.setIcon();
                hover = false;
            }
        });
        map.fitBounds(bounds);
    };
        //console.log(markers);

};


