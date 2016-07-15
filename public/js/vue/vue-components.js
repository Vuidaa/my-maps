Vue.component('marker-modal', {
 	template:'#markerModal',
	props:{
	 modal:Object
	},
	methods:{
		closeModal:function(){
			this.modal = {
					show:false,
					kv:0,
					lat:null,
					lng:null 
			};

			$('.img-preview').each(function(i, obj) {
   				$(obj).attr('src','images/camera.png');
			});
			$('.files').each(function(i, obj) {
   				$(obj).val('');
			});
		}
	}
});

Vue.component('options-modal', {
 	template:'#optionsModal',
	props:{
	 options:Object
	},
	methods:{
		switchBorders:function(){
			this.$dispatch('switch-borders', this.options.showBorders);
		},
		switchKva:function(){
			this.$dispatch('switch-kva', this.options.showKva);
		},
		createMarkerFromCurrentPlace:function(){
			this.$dispatch('createMarkerFromCurrentPlace');
		},
		startFollow:function(){
			this.$dispatch('startFollow');
		},
		stopFollow:function(){
			this.$dispatch('stopFollow');
		}
	}
});

