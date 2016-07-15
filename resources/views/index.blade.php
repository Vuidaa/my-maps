<!DOCTYPE html>
<html>
<head>
    <title>Mano vietos</title>
    <!-- Meta -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8"> 
    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="css/lightbox.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
</head>
<body>
    <!-- Container -->
    <div class="container">

        <!-- Marker modal -->
        <template id="markerModal">
            <div class="modal-mask" v-show="modal.show" transition="modal">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-body">
                          <slot name="body">
                            <form class="form-default" role="form" action="marker" method="POST" enctype="multipart/form-data">
                                <h1>Pažymėti vietovę</h1>

                                <label for="title">Pavadinimas</label>
                                <input class="pure-input-1" id="title" type="text" name='title' v-model="modal.title" maxlength="90">

                                <label for="desc">Aprašymas</label>
                                <textarea class="pure-input-1" id="desc" name="desc" v-model="modal.desc" maxlength="20000"></textarea>

                                <label for="photos">Nuotraukos</label>
                                <div class='img-list'> 
                                  <div class='img-container'>
                                    <img src="images/camera.png" class="img-preview file1" onclick="openFileSystem('file1')">
                                <input accept="image/*" capture="camera" id='file1' class="files" type="file" name="files[]" onchange="setImage(this)" hidden />
                                  </div>
                                  <div class='img-container'>
                                    <img src="images/camera.png" class="img-preview file2" onclick="openFileSystem('file2')">
                                <input accept="image/*" capture="camera" id='file2' class="files" type="file" name="files[]" onchange="setImage(this)" hidden />
                                  </div>
                                  <div class='img-container'>
                                    <img src="images/camera.png" class="img-preview file3" onclick="openFileSystem('file3')">
                                <input accept="image/*" capture="camera" id='file3' class="files" type="file" name="files[]" onchange="setImage(this)" hidden />
                                  </div>
                                </div>

                                <input type="hidden" name="kv"  value="@{{modal.kv}}">
                                <input type="hidden" name="lat" value="@{{modal.lat}}">
                                <input type="hidden" name="lng" value="@{{modal.lng}}">
                                <hr>
                                <input type="submit" value="Sukurti" class='button-default button-primary'>
                                <button type="button" class='button-default button-secondary flt-right' v-on:click="closeModal()">Atšaukti</button>
                            </form>
                            
                          </slot>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <marker-modal  :show.sync="markerModal.show"  :modal.sync="markerModal"></marker-modal>
        <!-- End of Marker modal -->

        <!-- Options modal -->
        <template id="optionsModal">
            <div class="modal-mask" v-show="options.show" transition="modal">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-body">
                          <slot name="body">
                            <div class="menu-wrapper">
                                <h1>Menu</h1>
                                <img src="images/herbas.jpg">
                                <span>Naujas žymėjimas</span>
                                    <button class="button-default button-primary" v-on:click="createMarkerFromCurrentPlace()">Dabartinė mano vieta</button>
                                <span>Rodyti mane žemėlapyje</span>
                                    <button v-show="this.options.follow == false" class="button-default button-primary" v-on:click="startFollow()">Įjungti</button>
                                    <button v-show="this.options.follow == true" class="button-default button-secondary" v-on:click="stopFollow()">Išjungti</button>
                                <span>Nustatymai</span>
                                    <label><input v-model="options.showBorders" v-on:click="switchBorders()" type="checkbox"/> Rodyti ribas</label>
                                    <label><input v-model="options.showKva"     v-on:click="switchKva()"   type="checkbox" checked="checked"/> Rodyti kvartalus</label>
                                <hr>
                                <button class='button-default button-secondary'  v-on:click="options.show = false">Atšaukti</button>
                            </div>
                          </slot>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <options-modal :show.sync="optionsModal.show" :options.sync="optionsModal"></options-modal>
        <button class="map-button menu-button"   v-on:click="optionsModal.show = true">Menu</button>
        <button class="map-button follow-button" v-show="this.follow.marker.map != null" v-on:click="stopFollow()">Baigti sekimą</button>
        <!-- End of Options modal -->
        <div id="map"></div>
    </div>
    <!-- End of Container -->

    <!-- Vue.js stuff -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.26/vue.min.js"></script>
    <script src="js/vue/vue-resource.js"></script>
    <script src="js/vue/vue-components.js"></script>
    <!-- Vue.js -->
    <script
              src="https://code.jquery.com/jquery-3.0.0.min.js"
              integrity="sha256-JmvOoLtYsmqlsWxa7mDSLMwa6dZ9rrIdtrrVYRnDRH0="
              crossorigin="anonymous"></script>
    <script src="https://maps.googleapis.com/maps/api/js"></script>
    <script src="js/markerwithlabel.js"></script>
    <script src="js/lightbox.js"></script>
    <script src="js/app.js"></script>
    <script type="text/javascript">
       function openFileSystem(id){
        var fileInput = $("#"+id);
        fileInput.click();
       }
       function setImage(self){
        var reader = new FileReader();

        reader.onload = function (e) {
          $("."+self.id).attr('src',e.target.result);
        }
        reader.readAsDataURL(self.files[0]);
       }
    </script>
</body>
</html>

