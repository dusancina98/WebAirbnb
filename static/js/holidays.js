Vue.component("holidays", {
	data: function () {
		    return {
		        holidays: null,
		        mode: "BROWSE",
		        holidayName: '',
		        holidayNameError: '',
		        date:'',
		        selectedHoliday: {},
		        width:'60%'
		    }
	},
	template: ` 
<div id="sadrzaj">
<h2>Praznici</h2>
<table class="glavna">
<tr>
	<td>
		<table class="users" v-bind:style="{ width: computedWidth }">
			<tr>
				<th>Datum</th>
				<th>Naziv praznika</th>
			</tr>
			<tr v-for="item in holidays" v-on:click="selectHoliday(item)"  v-bind:class="{selected : selectedHoliday.id===item.id}">
					<td>{{item.date | dateFormat('DD.MM.YYYY')}}</td>
					<td>{{item.name }}</td>
			</tr>
		</table>
	</td>
	<td>
			<table  v-bind:hidden="mode=='BROWSE'">
				<tr>
					<td class="amenitytd">Naziv sadrzaja:</td>
				</tr>
				<tr>
					<td><input class="input" placeholder="Unesite naziv sadrzaja" type="text"  v-model="selectHoliday.name" v-bind:disabled="mode=='BROWSE'" name="holidayName"/></td>
				</tr>
				<tr>
					<td align="center"><input type="submit" id="submit" v-on:click="updateHoliday(selectedHoliday)" value="Sacuvaj"/>	<button v-on:click="cancelEditing" id="buttonOdustanak" v-bind:disabled="mode=='BROWSE'">Odustanak</button> <br /></td>
				</tr>
			</table>
	</td>
</tr>

</table>
<table>
<tr>
		<td><button v-on:click="editHoliday" v-bind:disabled="selectedHoliday==null" class="buttonGray">Izmeni</button><br />
		<td><button v-on:click="deleteHoliday(selectedHoliday)" v-bind:disabled="selectedHoliday==null" class="buttonChange">Izbrisi</button><br />
</td>
</tr>
</table>

<form v-on:submit.prevent="checkFormValid" method="post">
	<table>
		<tr>
			<td class="amenitytd">Naziv praznika:</td>
			<td class="amenitytd"><input class="input" placeholder="Unesite naziv praznika" type="text" v-model="holidayName" name="holidayName"/></td>
			<td class="amenitytd"><p style="color: red" >{{holidayNameError}}</p></td>	
		</tr>
		<tr>
			<td class="amenitytd">Datum praznika:</td>
			<td class="amenitytd"><vuejs-datepicker v-model="date"></vuejs-datepicker></td>
		</tr>
		<tr>
			<td colspan="3" align="center"><input type="submit" id="submit" value="Dodaj"/></td>
		</tr>
	</table>
</form>
</div>
`,components : { 
	vuejsDatepicker
}
	, 
	mounted () {
        axios
          .get('/holidays')
          .then(response => (this.holidays = response.data))
    },
    computed: {
        computedWidth: function () {
          return this.width;
        }
      },
      methods : {
			checkFormValid : function() {
				this.holidayNameError = '';
				
				if(this.holidayName == "")
					this.holidayNameError = 'Naziv sadrzaja je obavezno polje!';
				else{
					
					let holiday = {name: this.holidayName, date:this.date.getTime(), id : 0};
	        		  axios
			          .post('http://localhost:8080/holidays/add', JSON.stringify(holiday))
			          .then(response => {
			        	  toast('Sadrzaj ' + this.holidayName + ' uspesno dodat!');
			        	  
			        	  if(!this.holidays)
			        		  this.holidays = [response.data];
			        	  else{
			        		  this.holidays.push(response.data);
			        	  }
			          });
				}
			},
			updateHoliday: function(holiday){
				
			},
			editHoliday : function() {
	    		
	    	},
	    	selectHoliday : function(holiday) {
	    		
	    	},
	    	cancelEditing : function() {
	    		
	    	},
	    	
	    	deleteHoliday : function(holiday){
	    		
	    	}
	},
	filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	}
	
});
