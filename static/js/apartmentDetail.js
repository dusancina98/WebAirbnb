Vue.component("apartment-details", {
	props: ['id'],
	data: function () {
	    return {
	        apartment:null,
	        picture:''
	    }
	},
	template: ` 
<div>
<table >
<tr>
		<td id="slike">
			<div class="rowS">
					<div v-for="p in apartment.pictures" class="columnS">
							<img :src="p" alt="Slika apartmana" style="width:100%" v-on:click="myFunction(p)"/>
					</div>
			</div>
			
			<div class="containerG" ref="container">
				<a target="_blank" :href="picture">
						<img ref="expandedImg" :src="picture" style="width:100%"/>
			  	</a>
			</div>
		</td>
		<td id="info">
			<table id="apartmanInfo">
				<tr>
					<td>Tip: </td>
					<td class="infotext">{{(apartment.type == 'apartment') ? "Apartman" : "Soba"}}</td>
				</tr>
				<tr>
					<td>Broj soba: </td>
					<td class="infotext">{{apartment.numberOfRoom}}</td>
				</tr>
				<tr>
					<td>Maksimalan broj gostiju: </td>
					<td class="infotext">{{apartment.numberOfGuest}}</td>
				</tr>
				<tr>
					<td>Adresa: </td>
					<td class="infotext">{{apartment.location.adress.street + ' ' + apartment.location.adress.streetNumber + ', ' + apartment.location.adress.postNumber + ' ' + apartment.location.adress.city}}</td>
				</tr>
				<tr>
					<td>Cena za jednu noc: </td>
					<td class="infotext">{{apartment.priceForNight + ' dinara'}}</td>
				</tr>
			</table>
		</td>	
</tr>
</table>
<h3>Sadrzaji apartmana:</h3>
<table>
		<tr v-for="a in apartment.amenities">
			<td>{{a.name}}</td>
		</tr>
</table>
	
</div>		  
`,
	mounted () {
		axios
		.get('/apartment/' + this.id)
		.then(response => {this.apartment = response.data; this.picture = this.apartment.pictures[0];});
	},
	methods : {
		myFunction : function(imgs) {
				this.picture = imgs;
				this.$refs.expandedImg.style.display = "block";
		},
		clickSpan : function(){
			this.$refs.container.style.display='none';
		}
	}
});