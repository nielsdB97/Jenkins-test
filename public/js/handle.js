var handleChecks = function(){

	var html = '';
	datavis.data.checksList.sort();
	datavis.data.checksList.unshift('ALL CHECKS')
	for(var i = 0;i<datavis.data.checksList.length;i++){
		// console.log(datavis.data.checksList[i])
		if(datavis.data.checksList[i] != ''){
			html += '<option value="'+datavis.data.checksList[i]+'">'+datavis.data.checksList[i]+'</option>';
		}
	}
	// console.log(html)
	$('#selectChecks').html(html);
	$('#selectChecks').selectpicker('refresh');
}

var handleLangSelect = function(){
	var html = '';
	datavis.data.countries.list.sort();
	datavis.data.countries.list.unshift('ALL COUNTRIES');
	for(var i = 0;i<datavis.data.countries.list.length;i++){
		if(datavis.data.countries.list[i] != ''){
			var ISOCountryCode = datavis.data.countries.list[i];
			var fullCountryName = getCountryName(ISOCountryCode);

			html += '<option value="'+ISOCountryCode+'">'+fullCountryName+'</option>';
		}
	}

	$('#selectCountries').html(html);
	$('#selectCountries').selectpicker('refresh');
}

$(document).ready(function(){

	///////////////////////////////////////////////////////
	// ADD COUNTRIES
	///////////////////////////////////////////////////////

	var refreshCountrieSelect = function(){
		$('.addCountries').html();
		var html = '';
		for(var i = 0;i<datavis.loadOptions.langs.length;i++){
			html += '<li class="list-group-item">'+datavis.loadOptions.langs[i]+' <span class="badge delCountry removeButton" data-type="'+datavis.loadOptions.langs[i]+'">&times;</span></li>'
		}
		$('.addCountries').html(html);
	}

	$('#selectCountries').on('change',function(){
		var found = (datavis.loadOptions.langs.indexOf($(this).val()) > -1);
		if(!found){
			datavis.loadOptions.langs.push($(this).val());
		}

		if($(this).val() == 'ALL COUNTRIES'){
			datavis.loadOptions.langs = [];
			$(this).val('ALL COUNTRIES');
		}

		refreshCountrieSelect();

		refresh();
	})

	$( ".addCountries" ).on( "click", ".delCountry", function(){
		$(this).parent().remove();
		for(var i = 0;i<datavis.loadOptions.langs.length;i++){
			if(datavis.loadOptions.langs[i] == $(this).attr('data-type')){
				datavis.loadOptions.langs.splice(i,1)
			}
		}
		refresh();
	} );

	///////////////////////////////////////////////////////
	// ADD CHECKS
	///////////////////////////////////////////////////////

	var refreshChecksSelect = function(){
		$('.addChecks').html();
		var html = '';
		for(var i = 0;i<datavis.loadOptions.checks.length;i++){
			html += '<li class="list-group-item">'+datavis.loadOptions.checks[i]+' <span class="badge removeButton delCheck" data-type="'+datavis.loadOptions.checks[i]+'">&times;</span></li>'
		}
		$('.addChecks').html(html);
	}

	$('#selectChecks').on('change',function(){

		console.log(datavis.loadOptions.checks)
		var found = (datavis.loadOptions.checks.indexOf($(this).val()) > -1);
		if(!found){
			datavis.loadOptions.checks.push($(this).val());
		}

		if($(this).val() == 'ALL CHECKS'){
			datavis.loadOptions.checks = [];
			$(this).val('ALL CHECKS');
		}

		refreshChecksSelect();
		refresh();
	});

	$( ".addChecks" ).on( "click", ".delCheck", function(){
		$(this).parent().remove();
		for(var i = 0;i<datavis.loadOptions.checks.length;i++){
			if(datavis.loadOptions.checks[i] == $(this).attr('data-type')){
				datavis.loadOptions.checks.splice(i,1)
			}
		}
		refresh();
	} );

	///////////////////////////////////////////////////////
	// SAVE STATE
	///////////////////////////////////////////////////////

	$('.saveState').click(function(){

		var saveObj = {};

		saveObj.name = prompt('Save State name?');
		saveObj.id = getCounter();
		saveObj.time = moment().unix();
		saveObj.langs = datavis.loadOptions.langs;
		saveObj.checks = datavis.loadOptions.checks;

		addCounter();

		var saveStates = getLocal();

		saveStates.push(saveObj);

		setLocal(saveStates)

		refreshSaveList();

	});

	$( ".saveStateList" ).on( "click", ".loadState", function(){

		var thisID = $(this).parent().attr('data-type');

		var saveStates = getLocal();

		for(var i = 0;i<saveStates.length;i++){
			console.log(saveStates[i].id)
			console.log(thisID)
			if(Number(saveStates[i].id) == Number(thisID)){
				console.log(saveStates[i]);

				// var newObj = jQuery.extend({},true,saveStates[i]);

				// console.log(newObj);

				datavis.loadOptions = JSON.parse(JSON.stringify(saveStates[i]));

				// console.log(datavis.loadOptions);

				refresh();
				refreshChecksSelect();
				refreshCountrieSelect();
				break;
			}
		}


	});

});

var refreshSaveList = function(){

	var saveStates = getLocal();
	var html = '';
	for(var i = 0;i<saveStates.length;i++){
		html += '<li class="list-group-item" data-type="'+saveStates[i].id+'"><strong>'+saveStates[i].id+'</strong> - '+saveStates[i].name+'<span class="badge cursor">&times;</span><span class="badge cursor loadState"><i class="fa fa-arrow-left"></i></span></li>';
	}
	$('.saveStateList').html();
	$('.saveStateList').html(html);

}