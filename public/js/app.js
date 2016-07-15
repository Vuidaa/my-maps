(function() {

	var app = new Vue({
			el:'body',
			data:{
				markerModal:{
					title:'',
					desc:'',
					show:false,
					kv:0,
					lat:null,
					lng:null 
				},
				optionsModal:{
					show:false,
					follow:false,
					showBorders:false,
					showKva:true,
					visibleKva:true
				},
				follow:{
					marker:{},
					nav:{}
				},
				map:{},
				borders:[],
				kva:[]
			},
			created:function(){
				this.initMap();
				this.initKva();
				this.initMarkers();
			},
			methods:{
				initMap:function(){
					var map = new google.maps.Map(document.getElementById("map"),{center:{lat:55.277069,lng:22.288301},disableDoubleClickZoom: true,zoom:14,minZoom:13,mapTypeId:google.maps.MapTypeId.HYBRID,disableDefaultUI: true});
					var self = this;

					map.addListener('dblclick',function(e){
						self.markerModal.kv = 0;
						self.markerModal.show = true;
						self.markerModal.lat = e.latLng.lat();
						self.markerModal.lng = e.latLng.lng();
					});

					this.map = map;													 
				},
				initBorders:function(){
					this.$http({url: 'data/borders.json', method: 'GET'}).then(function (response) {
				    	this.borders = new google.maps.Polyline({path:response.data,map:this.map,strokeColor:"#FFFF00",strokeOpacity:1.0,strokeWeight:2});
				    });
				},
				initKva:function(){
					this.$http({url: 'data/kva.json', method: 'GET'}).then(function(response){
						var data = response.data;
          				var count = response.data.length;
          				var i = 0;
          				for (i; i < count; i++) {
          					var kva = data[i];
  							var polygonCenter = this.findPolygonCenter(kva.polygon);
          					var polygon = new google.maps.Polygon({paths:kva.polygon,map:this.map,strokeColor:'#FF0000',strokeWeight:1,fillColor:'#860615',fillOpacity:false});			
          					polygon.set('marker',new MarkerWithLabel({id:kva.marker.id,position:polygonCenter,icon:'images/marker.png',map:this.map,clickable:false,labelAnchor:new google.maps.Point(7, 10),labelContent :kva.marker.id,labelClass: "kv-labels"}));
          					this.addPolygonListeners(polygon);
        					this.kva.push(polygon);
				    	};
					});
				},
				initMarkers:function(){
					var self = this;
					this.$http({url:'marker',method:'GET'}).then(function (response) {
						var length = response.data.length;
						var i = 0; 
				    	for(i; i < length; i++){
				    		var record = response.data[i];

				    		if(record.seen != 0 ){
				    			record.icon = 'images/flag.png';
				    		}
				    		var marker = new google.maps.Marker({
							    position:{lat:parseFloat(record.lat),lng:parseFloat(record.lng)},
							    map: this.map,
							    id: record.id,
							    icon: record.icon,
							    title: record.title,
							    kv: record.kv,
							    date: record.created_at,
							    desc: record.desc,
							    photos: record.photos,
							    seen:record.seen
						  	});
				    		this.addMarkerListeners(marker);
				    	}
				    });
				},
				addMarkerListeners:function(marker){
					var self = this;

					marker.addListener('click',function(){
						var title = marker.title == '' ? 'Be pavadinimo' : marker.title;
						var kv = marker.kv == 0 ? 'Nėra' : marker.kv;
						var desc = marker.desc == '' ? 'Nėra':marker.desc;
						var imgList = '<div class="img-list">';

						self.$http({url: 'marker/'+marker.id, method: 'GET'}).then(function (response){
							marker.setOptions({icon:"images/flag.png"});
						});

						if(marker.photos.length != 0){
							for(var i = 0; i < marker.photos.length; i++ ){
								imgList = imgList + '<div class="img-container">'+
								'<a href='+marker.photos[i].path+' data-lightbox="image">'+
								'<img src='+marker.photos[i].path+'/>'+
								'</a>'+
								'</div>';

								if(marker.photos.length - 1 == i){
									imgList = imgList + '</div>';
								}
							}
						}else{
							imgList = '<p>Nėra</p>';
						}
						var contentString = '<div class="info-window-content">'+
												'<h1>'+title+'</h1>'+
												'<span>Kvartalas:</span>'+
												'<p>'+kv+'</p>'+
												'<span>Aprašymas:</span>'+
												'<p>'+desc+'</p>'+
												'<span>Nuotraukos:</span>'+
												imgList+
												'<span>Pridėta:</span>'+
												'<p>'+marker.date+'</p>'+
												'<form method="link" action=marker/delete/'+marker.id+'>'+
												'<input type="submit" class="button-default button-secondary" value="Ištrinti">'+
												'</form>'+
											'</div>';
						var infowindow = new google.maps.InfoWindow({
					    	content: contentString,
					    	maxWidth: 320
					  	});
					  infowindow.open(this.map,marker);
  					});
				},
				addPolygonListeners:function(polygon){
					polygon.addListener('mouseover',function(){
  						this.setOptions({strokeColor:"#FFFFFF",zIndex:1000});
  					});
	  				polygon.addListener('mouseout',function(){
	  					this.setOptions({strokeColor:"#FF0000",zIndex:1});
	  				});
					polygon.addListener('click',function(){
          				var map = polygon.getMap();
          				if(map.get('zoom') < 17){
          					map.setOptions({zoom:16});
          					map.panTo(polygon.marker.get('position'));
          				}
					});
					var self = this;
					polygon.addListener('dblclick',function(e){
						self.markerModal.kv = this.marker.labelContent;
						self.markerModal.show = true;
						self.markerModal.lat = e.latLng.lat();
						self.markerModal.lng = e.latLng.lng();
					});
				},
				findPolygonCenter:function(data){
					var bounds = new google.maps.LatLngBounds();

					for (i = 0; i < data.length; i++) {
					  bounds.extend(new google.maps.LatLng(data[i].lat, data[i].lng));
					}
					var center = bounds.getCenter();
					return center;
				},
				stopFollow:function(){
					navigator.geolocation.clearWatch(this.follow.nav);
					this.optionsModal.show = false;
					this.optionsModal.follow = false;
					this.follow.marker.setMap(null);
					this.follow.marker = {};
				}
			},
			events:{
				'switch-borders':function(state){
					if(this.borders.length == 0){
						this.initBorders();
					}else{
						this.borders.setMap(null);
						this.borders = [];
					}
				},
				'switch-kva':function(state){
					if(this.optionsModal.visibleKva == true){
						for(var i = 0; i < this.kva.length; i++){
							this.kva[i].setOptions({strokeOpacity:0});
							this.optionsModal.visibleKva = false;
						}
					}
					else{
						for(var i = 0; i < this.kva.length; i++){
							this.kva[i].setOptions({strokeOpacity:1});
							this.optionsModal.visibleKva = true;
						}
					}
				},
				'createMarkerFromCurrentPlace':function(){
					var self = this;

					this.optionsModal.show = false;
					navigator.geolocation.getCurrentPosition( function success(position){
						var latitude = position.coords.latitude;
	    				var longitude = position.coords.longitude;

	    				self.markerModal = {
								show:true,
								lat:latitude,
								lng:longitude 
						}
					},function(){ alert('Service unavailable.');},{enableHighAccuracy:true,maximumAge:30000,timeout:27000});
				},
				startFollow:function(position){
				var self = this;

				this.optionsModal.follow = true;
				this.follow.nav = navigator.geolocation.watchPosition(function success(position){
					var latitude = position.coords.latitude;
    				var longitude = position.coords.longitude;

    				self.optionsModal.show = false;

    				if(self.follow.marker.map == null){
    					self.map.panTo({lat:latitude,lng:longitude});
    					self.map.setOptions({zoom:16});
						self.follow.marker = new google.maps.Marker({
						    position:{lat:latitude,lng:longitude},
						    map: self.map,
						    icon: 'images/current.png',
						});
    				}else{

    					self.follow.marker.setMap(null);
						self.follow.marker = new google.maps.Marker({
						    position:{lat:latitude,lng:longitude},
						    map: self.map,
						    icon: 'images/current.png',
						});
						self.map.panTo({lat:latitude,lng:longitude});
    				}
				},function(){ alert('Service unavailable.');},{enableHighAccuracy:true,maximumAge:30000,timeout:27000});

				},
				stopFollow:function(){
					this.stopFollow();
				}
			}
	});
})()