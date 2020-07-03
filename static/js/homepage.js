Vue.component("home-page", {
	data: function () {
	    return {
	        apartments: null,
	        width:'50%',
	        location:'',
	        dateFrom:'',
	        dateTo:'',
	        numberOfGuest:'',
	        minRoom:'',
	        maxRoom:'',
	        minPrice:'',
	        maxPrice:'',
	        searchedApartments: null,
	        showSearched:false,
	        sortValue:''
	    }
},
template: ` 
<div>
	<table class="searchtable">
		<tr>
			<td><input class="searchInput" placeholder="Lokacija" type="text"  v-model="location" name="location"/></td>
			<td><input class="searchInput" placeholder="Datum od" type="date"/></td>
			<td><input class="searchInput" placeholder="Datum do" type="date"/></td>
			<td><input class="searchInput" placeholder="Broj gostiju" min=0 type="number"/></td>
		</tr>
		<tr>
			<td><input class="searchInput" placeholder="Minimalno soba" min=0 type="number"/></td>
			<td><input class="searchInput" placeholder="Maksimalno soba" min=0 type="number"/></td>
			<td><input class="searchInput" placeholder="Minimalna cena" min=0 type="number"/></td>
			<td><input class="searchInput" placeholder="Maksimalna cena" min=0 type="number"/></td
		</tr>
		<tr>
			<td></td>
			<td></td>
			<td>
				<select class="select" @change="onChange($event)" name="sort" v-model="sortValue">
				   <option></option>
				   <option value="rastuca">Cena rastuca</option>
				   <option value="opadajuca">Cena opadajuca</option>
				</select></td>
			<td><button class="button" v-on:click="search">Pretrazi</button></td>		
		</tr>
</table>
	<div v-bind:style="{ width: computedWidth }" style="background-color: lightBlue; display: block;
  margin-bottom: 25px;
  margin-left: auto;
  margin-right: auto;" v-for="(apartment, index) in apartments">
          <table v-bind:hidden="showSearched">
          		<tr>
          			<td colspan="2">
          				<img src="slika1.jpg" alt="Detalji" height="250" width= 745>
          			</td>
          		</tr>
          		
          		
          		<tr>
          			<td><label v-if="apartment.type === 'room'">Soba</label>
          			<label v-else>Ceo apartman</label></td>
          			<td>
          			<label style="margin-left:50px;">{{apartment.location.adress.city}} - {{apartment.location.adress.street}} {{apartment.location.adress.streetNumber}}</label></td>
          		</tr>
          		<tr>
          			<td><label>Broj gostiju: </label>
          			<label style="margin-left:50px;">{{apartment.numberOfGuest}}</label></td>
          		</tr>
          		<tr>
          			<td><label>Cena:</label>
          			<label style="margin-left:50px;">{{apartment.priceForNight}} din po nocenju</label></td>
          		</tr>
          
          </table>
	</div>
	
	<div v-bind:hidden="!showSearched" v-bind:style="{ width: computedWidth }" style="background-color: lightBlue; display: block;
  margin-bottom: 25px;
  margin-left: auto;
  margin-right: auto;" v-for="(apartment, index) in searchedApartments">
          <table>
          		<tr>
          			<td colspan="2">
          				<img src="slika1.jpg" alt="Detalji" height="250" width= 745>
          			</td>
          		</tr>
          		
          		<tr>
          			<td><label v-if="apartment.type === 'room'">Soba</label>
          			<label v-else>Ceo apartman</label></td>
          			<td>
          			<label style="margin-left:50px;">{{apartment.location.adress.city}} - {{apartment.location.adress.street}} {{apartment.location.adress.streetNumber}}</label></td>
          		</tr>
          		<tr>
          			<td><label>Broj gostiju: </label>
          			<label style="margin-left:50px;">{{apartment.numberOfGuest}}</label></td>
          		</tr>
          		<tr>
          			<td><label>Cena:</label>
          			<label style="margin-left:50px;">{{apartment.priceForNight}} din po nocenju</label></td>
          		</tr>
          
          </table>
	</div>
</div>		  
`, 
	mounted () {
	    axios
	      .get('/apartments')
	      .then(response => (this.apartments = response.data))
	},
	computed: {
	    computedWidth: function () {
	      return this.width;
	    }
	  },
	  methods : {
			search : function(){
				alert(this.location);
				if(this.location != '' || this.dateFrom != '' || this.dateTo != '' || this.numberOfGuest != '' || this.minRoom != '' || this.maxRoom != '' || this.minPrice != '' || this.maxPrice != ''|| this.sortValue != ''){
					axios
					.get('/apartments/search/parameters', {
					    params: {
					        location: this.location,
					        dateFrom : this.dateFrom,
					        dateTo : this.dateTo,
					        numberOfGuest : this.numberOfGuest,
					        minRoom: this.minRoom,
					        maxRoom : this.maxRoom,
					        minPrice : this.minPrice,
					        maxPrice : this.maxPrice,
					        sortValue: this.sortValue
					      }
					    })
					.then(response => {
						this.searchedApartments = response.data;
						this.showSearched = true;
					});
				}else{
					this.showSearched = false;
				}
			},
			onChange(event) {
				if(this.location != '' || this.dateFrom != '' || this.dateTo != '' || this.numberOfGuest != '' || this.minRoom != '' || this.maxRoom != '' || this.minPrice != '' || this.maxPrice != '' || this.sortValue != ''){
					axios
					.get('/apartments/search/parameters', {
					    params: {
					        location: this.location,
					        dateFrom : this.dateFrom,
					        dateTo : this.dateTo,
					        numberOfGuest : this.numberOfGuest,
					        minRoom: this.minRoom,
					        maxRoom : this.maxRoom,
					        minPrice : this.minPrice,
					        maxPrice : this.maxPrice,
					        sortValue: this.sortValue
					      }
					    })
					.then(response => {
						this.searchedApartments = response.data;
						this.showSearched = true;
					});
				}else{
					this.showSearched = false;
				}
	        }
	 
			
		}
});