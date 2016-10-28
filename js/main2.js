var map,bounds,vm,largeInfoWindow,defaultIcon,highIcon,clickIcon,marker,finish,yelp_request;
var loc1 = {
    'lat': '',
    'lng':''
};
var empty =false;
var hover = false;
var click = false;
var loca;
var markers = [];
var model1 = [];
var ViewModel = function(){
    var menu =$('#menu');
    var sidebar =$('.sidebar')
    menu.click(function(){
        sidebar.toggleClass('open');
       // console.log("clicked");
    });
    var self = this;
    this.query = ko.observable('');
    this.mylocation = ko.observable('Enter a location');
    this.restaurants = ko.observableArray([]);
    this.currentrestaurant = ko.observable();
    this.changelocation = function(value){
        console.log("changing");
        self.restaurants.removeAll();
        var i =0;
        console.log(markers.length);
        //emptying the markers array and model array on change of location to avoid previous markers
        while(i < markers.length && empty == false){
            console.log("emptying");
            markers[i].setMap(null);
            markers[i]= {};
            model1[i]= {};
            //empty= true
            //markers.pop();
            //model1.pop();
            i++;
        };
        empty = true;
        // i can still see my previous contents here despite of emptying it but even though length is 20 only 10 markers remain in my array
        console.log(markers[9]);
        console.log(model1[9]);
        if(value!= '') {
            yelp(value);
            yelp_request = setTimeout(function(){
                for(var i=0; i < model1.length; i++) {
                    self.restaurants.push(model1[i]);
                }
                bounds = new google.maps.LatLngBounds();

                add_markers_to_map(model1);
            },3000);
        }
        else {
            console.log("enter a valid location")
        }
    }
    this.showinfo = function(current){
        self.currentrestaurant = current;
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
}

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

    largeInfoWindow = new google.maps.InfoWindow();
    defaultIcon = makeMarkerIcon('a82848');
    highlightedIcon = makeMarkerIcon('ed4b74');
    clickedIcon = makeMarkerIcon('f79336');

};

populateInfoWindow = function(marker, infowindow){
    if( infowindow.marker != marker){
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
    empty= false;

    console.log("adding markers to map");
    for( var i = 0; i< category.length ; i++) {
        console.log("adding markers");
        marker = new google.maps.Marker({
            position: category[i].location,
            map: map,
            title: category[i].name,
            animation: google.maps.Animation.DROP,
            id: category[i].id,
            info: category[i].info,
            img: category[i].img
        });
        markers[i]=marker;
        //console.log(markers[i]);
        bounds.extend(marker.position);
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        marker.addListener('click',function(){
            this.setIcon(clickedIcon);
            click = true;
           // console.log("clicking on marker");
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
        //bounds = null;
    };
};


