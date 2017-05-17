	$().ready(function() {
	    // Retreive URL Hash data
		var logicCircuitVersion = "2.1"
		$('#LCVersion').html(logicCircuitVersion);
	    var rootUrl = "https://cryptamatic.com"
	    var decryptUrlBits = "#d/"
		var decryptUrlBitsMail = "%23d/"
	    var hashTag = window.location.hash
	    var splitHashTag = hashTag.split('/')
	    var mode = splitHashTag[0]
	    var payload = splitHashTag[1]
	    var clipboard = new Clipboard('.clipboard-btn');
		var decryptedJSON = ""
		var JSONversion = "1"
		var decryptedBase64File =""
		var fileSizeLimitBytes = "10000000"
	    //alert(hashTag);
	    //alert(mode);
	    //define functions

	    function EncryptTheStuff() {
	        
			//Assemble JSON file
			var JSONtemplate = '{"version": "","message": "","fileAttached": "","fileName": "","fileSize": "","fileDate": "","fileType": "","base64File": ""}';
			var assembledJSON = JSON.parse(JSONtemplate);
			assembledJSON.version = JSONversion
			assembledJSON.message = $('#text').val()
			//if fileName exists, set file Attached to true
			if (fileName){assembledJSON.fileAttached = "true"}
			assembledJSON.fileName = fileName
			assembledJSON.fileSize = fileSize
			assembledJSON.fileDate = fileDate
			assembledJSON.fileType = fileType
			assembledJSON.base64File = Base64File
			
			
			triplesec.encrypt({

	            //data: new triplesec.Buffer($('#text').val()),
	            data: new triplesec.Buffer(JSON.stringify(assembledJSON)),
				key: new triplesec.Buffer($('#key').val()),
	            progress_hook: function(obj) {

	            }

	        }, function(err, buff) {

	            if (!err) {
	                var ciphertext = buff.toString('hex');
	                //Create the nice shareable URL if there is no file attached.
					if (!fileName){
						var assembleShareLink = rootUrl.concat(decryptUrlBits);
						var shareLink = assembleShareLink.concat(ciphertext);
						$('#text').val(shareLink);
					}else {
						$('#text').val(ciphertext);
					}
					var outputPassword = $('#key').val();
	                //$('#loading').html('ALL DONE!');
	                $('#loading').html('<i class="fa fa-check fa-3x fa-fw" aria-hidden="true"></i><p>Done! </p>');
					$('#encryption-output-div').show();
	                $('#output-password').html(outputPassword);
					$('#output-title').show();
	                var NatoOptions = {
	                    'decode': $('#key').val(),
	                    'includeCase': true
	                };
	                var phoneticString = $.NatoCallout(NatoOptions);
	                $('#phonetic-key').html(phoneticString)
					var emailAssembleShareLink = rootUrl.concat(decryptUrlBitsMail);
	                var emailShareLink = emailAssembleShareLink.concat(ciphertext);
					var beforeEmailContent = "mailto:?subject=A%20secret%20has%20been%20shared%20with%20you%20via%20cryptamatic.com&body="
					var afterEmailContent = "%0A%0AWhat%20is%20this%20link%3F%0AThe%20URL%20above%20actually%20contains%20the%20encrypted%20data%20-%20no%20data%20is%20stored%20on%20cryptamatic%27s%20servers.%20When%20you%20click%20on%20it%2C%20it%20will%20load%20our%20site%20and%20automaticaly%20auto-fill%20the%20encrypted%20message%20into%20the%20browser%20window.%0A%0AFind%20out%20more%3A%0Ahttps%3A%2F%2Fcryptamatic.com"
					var partAssembledMailLink = beforeEmailContent.concat(emailShareLink);
					var fullAssembledMailLink = partAssembledMailLink.concat(afterEmailContent);
					$('#mailto-button').attr('href',fullAssembledMailLink);

	            } else {
	                alert('hmm that didnt work!');
	                $('#encrypt-button').show();
	                $('#loading').hide();
	            }

	        });
	    }
		//NEW BIT ATTACH FILE
		var fileSize = ""
		var fileName = ""
		var fileDate = ""
		var fileType = ""
		var Base64File = ""
		//select file function
		var handleFileSelect = function(evt) {
		var files = evt.target.files;
		var file = files[0];
		var fileTooLarge = "false"
		
		
		//output file metadata
		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			//output to list on screen
			if(f.size <= fileSizeLimitBytes){
			output.push('<i class="fa fa-paperclip fa-2x fa-fw" aria-hidden="true"></i><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate,
            '');
			//assign to variables for later use
			fileSize = f.size
			fileName = escape(f.name)
			fileDate = f.lastModifiedDate
			fileType = f.type
			}else {
			alert('Only files below ' + fileSizeLimitBytes + 'bytes are allowed.');
			fileTooLarge = "true"
			}
		}
		document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
 
		if (fileTooLarge == "false"){
		// Convert file to base64
			if (files && file) {
				var reader = new FileReader();

				reader.onload = function(readerEvt) {
				$('#loading').show();
				var binaryString = readerEvt.target.result;
				Base64File = btoa(binaryString);
				$('#loading').hide();
				//document.getElementById("base64textarea").value = Base64File
				
			};

        reader.readAsBinaryString(file);
			}
		}
		};

		if (window.File && window.FileReader && window.FileList && window.Blob) {
			document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
		} else {
			alert('The File APIs are not fully supported in this browser.');
		}
		//download button
	    $('#download-button').on('click', function() {
			var binary = atob(decryptedBase64File)
			var array = new Uint8Array(binary.length)
			for( var i = 0; i < binary.length; i++ ) { array[i] = binary.charCodeAt(i) }			
			download(new Blob([array]), fileName, fileType);
	    });
		
		
  //END NEW BIT ATTACH FILE
	    function setRandomPasswordandEncrypt(passwordOptionBool) {
	        if (!$("#AutogenPasswordOptionsBool").prop('checked')) { //if bool is false dont autogen password stuff
	            EncryptTheStuff();
	        } else if (!$("#PasswordOptionsBool").prop('checked')) { //if bool is false dont use random.org seed
	            var my_chance = new Chance();
	            $('#key').val(my_chance.string({
	                length: 15,
	                pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	            }));
	            EncryptTheStuff();
	        } else {
	            var mySeed;
	            $.get("https://www.random.org/integers/", {
	                num: "1",
	                col: "1",
	                min: "1",
	                max: "1000000000",
	                base: "10",
	                format: "plain",
	                rnd: "new"
	            }, function(randNum) {
	                mySeed = randNum;
	                //debugger;
	                // Instantiate Chance with this truly random number as the seed
	                var my_seeded_chance = new Chance(mySeed);
	                $('#key').val(my_seeded_chance.string({
	                    length: 15,
	                    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	                }));
	                EncryptTheStuff();
	            });
	        }
	    }
	    $('#text').focus();
	    //$('#text').html('Type your secret here');
	    $('#encrypt-button').on('click', function() {

	        //	        if ( $(this).parsley().isValid() ) {
	        //fill in the key section with a random key created by the Chance library (and Random.org)
	        setRandomPasswordandEncrypt();

	        //function call back (to make sure that the get succeeds before trying to encrypt
			//basic click tracking 
			$('#track_click').attr('src','https://s3-us-west-2.amazonaws.com/cryptamatic-clicktrack/enc-click.gif');
			
	        $('#encrypt-button, #loading').hide();
	        $('#text').height('160px');
	        $('#loading').show();
			$('#attachfile-button-div').hide();
			$('#OptionsModalLink').hide();
			$('#filePicker').hide();

	        // Start encryption

	        //	        }
	    });
	    //DECRYPTING THE STUFF
	    $('#decrypt-button').on('click', function() {
	        $('#decrypt-button, #loading').hide();
	        $('#text').height('160px');
	        $('#loading').show();
			//basic click tracking 
			$('#track_click').attr('src','https://s3-us-west-2.amazonaws.com/cryptamatic-clicktrack/dec-click.gif');
			triplesec.decrypt({

	            data: new triplesec.Buffer($('#text').val(), "hex"),
	            key: new triplesec.Buffer($('#key').val()),
	            progress_hook: function(obj) { /* ... */ }

	        }, function(err, buff) {

	            if (!err) {
	                //UNUSED NOW $('#text').val(buff.toString());
					//Put decrypted JSON into variable
					try {decryptedJSON = JSON.parse((buff.toString()));}
					catch (err){}
					//Check for JSON version - if doesnt exists, set variable to legacy (which will match an if statement)
					var decryptionVersion = ""
					decryptionVersion = decryptedJSON.version 					
					if (!decryptionVersion){decryptionVersion = "legacy"}
					//legacy decryption code
					if (decryptionVersion == "legacy"){
						$('#text').val(buff.toString());
						$('#loading').html('<i class="fa fa-check fa-3x fa-fw" aria-hidden="true"></i><p>Done! </p>');
						$('#clipboarddecrypted').show();
						$('#password-row').hide();
					}
					//run version 1 decryption code
					if (decryptionVersion == "1") {
						$('#text').val(decryptedJSON.message);
						//If file was attached do this
						if (decryptedJSON.fileAttached == "true"){
						decryptedBase64File = decryptedJSON.base64File
						$('#download-button').show();
						fileName = decryptedJSON.fileName
						fileType = decryptedJSON.fileType
						fileSize = decryptedJSON.fileSize
						fileDate = decryptedJSON.fileDate
						$('#list').html('<i class="fa fa-paperclip fa-2x fa-fw" aria-hidden="true"></i><strong>' + fileName +' </strong> ' + fileType + ' -  ' + fileSize + ' bytes, last modified: ' + fileDate + '');
						$('#list').show();
						}
						$('#loading').html('<i class="fa fa-check fa-3x fa-fw" aria-hidden="true"></i><p>Done! </p>');
						$('#clipboarddecrypted').show();
						$('#password-row').hide();
					
					}

					
					
	            } else {
	                alert('Your message could not be decrypted. Check your password.');
	                $('#decrypt-button').show();
	                $('#loading').hide();
	            }

	        });
	    });
	    //Show Encrypt Button if someone click the decrypt link (TBA)

	    $('#encrypt-view').on('click', function() {
	        $('#decrypt-button-div').hide();
	        $('#encrypt-button-div').show();
	        $('#encrypt-view').hide();
	        $('#decrypt-view').show();
	        $('#OptionsModalLink').show();
			$('#filePicker').show();
			$('#list').show();
	        var a = document.getElementById("key");
	        a.value = a.defaultValue;
	    });

	    //Show Decrypt Button if someone click the decrypt link (TBA)

	    $('#decrypt-view').on('click', function() {
	        $('#decrypt-button-div').show();
	        $('#encrypt-button-div').hide()
	        $('#encrypt-view').show();
	        $('#decrypt-view').hide();
	        $('#OptionsModalLink').hide();
	        $('#key').show();
			$('#filePicker').hide();
			$('#attachfile-button-div').hide();
			$('#list').hide();
	        var a = document.getElementById("key");
	        a.value = a.defaultValue;
	    });
	    //Show Decrypt Button if #d exist
	    if (mode.includes('#d')) {
	        $('#text').html(payload);
	        $('#decrypt-button-div').show();
	        $('#encrypt-button-div').hide();
	        $('#encrypt-view').show();
	        $('#key').show();
	        $('#OptionsModalLink').hide();
			$('#attachfile-button-div').hide();
			$('#filePicker').hide();
			$('#list').hide();
	    } else {
	        $('#decrypt-button-div').hide();
	        $('#encrypt-button-div').show();
			$('#attachfile-button-div').show();
	        $('#decrypt-view').show();
			$('#filePicker').show();
			$('#list').show();

	    }

	    //Show password field if option checked
	    $('#AutogenPasswordOptionsBool').change(function() {
	        if (!$("#AutogenPasswordOptionsBool").prop('checked')) { //if bool is false dont autogen password stuff
	            $('#key').show();
	        } else {
	            $('#key').hide();
	        }
	    });
	});